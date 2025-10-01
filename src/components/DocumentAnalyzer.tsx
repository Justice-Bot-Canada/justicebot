import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AnalysisResult {
  success: boolean;
  analysis: string;
  fileName: string;
  caseId?: string;
}

export function DocumentAnalyzer({ caseId }: { caseId?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [description, setDescription] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      setAnalysis(null);
    }
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleAnalyze = async () => {
    if (!file || !user) {
      toast({
        title: "Error",
        description: "Please select a file and sign in",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Read file content
      let fileContent = '';
      try {
        fileContent = await readFileContent(file);
      } catch (error) {
        toast({
          title: "Error reading file",
          description: "This file type may not be supported. Try a text-based document.",
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return;
      }

      // Call edge function to analyze
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: {
          fileContent,
          fileName: file.name,
          caseId,
        },
      });

      if (error) throw error;

      if (data.error) {
        if (data.error.includes("Rate limit")) {
          toast({
            title: "Rate Limit",
            description: "Too many requests. Please wait a moment and try again.",
            variant: "destructive",
          });
        } else {
          throw new Error(data.error);
        }
        setIsAnalyzing(false);
        return;
      }

      setAnalysis(data);

      // If we have a case ID, save as evidence
      if (caseId) {
        // Upload file to storage
        const filePath = `${user.id}/${caseId}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('evidence')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
        } else {
          // Save to evidence table
          const { error: dbError } = await supabase
            .from('evidence')
            .insert({
              case_id: caseId,
              file_name: file.name,
              file_path: filePath,
              file_type: file.type,
              description: description || data.analysis.substring(0, 500),
              ocr_text: data.analysis,
            });

          if (dbError) {
            console.error('Database error:', dbError);
          } else {
            toast({
              title: "Success",
              description: "Document analyzed and saved to your case",
            });
          }
        }
      } else {
        toast({
          title: "Analysis Complete",
          description: "Document has been analyzed",
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze document",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Upload Document for Analysis
            </h3>
            <p className="text-sm text-muted-foreground">
              Upload legal documents, evidence, letters, or any text-based files for AI-powered analysis
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Select Document</Label>
            <div className="flex gap-2">
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="flex-1"
              />
              <Button
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing}
                className="min-w-[120px]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
            {file && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {caseId && (
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add any additional context about this document..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </div>
      </Card>

      {analysis && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Analysis Results
              </h3>
              <span className="text-sm text-muted-foreground">{analysis.fileName}</span>
            </div>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg text-sm">
                {analysis.analysis}
              </pre>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <h4 className="text-sm font-semibold mb-2">💡 Tips for Best Results</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Text-based documents work best (TXT, PDF with text, Word docs)</li>
          <li>Ensure documents are clear and readable</li>
          <li>Include complete documents rather than excerpts when possible</li>
          <li>Images with text will be processed but may take longer</li>
        </ul>
      </Card>
    </div>
  );
}
