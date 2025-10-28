import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, CheckCircle, AlertCircle, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";

interface AnalysisResult {
  success: boolean;
  analysis: string;
  fileName: string;
  caseId?: string;
}

interface FileUploadStatus {
  file: File;
  status: 'pending' | 'analyzing' | 'complete' | 'error';
  progress: number;
  analysis?: string;
  error?: string;
}

export function DocumentAnalyzer({ caseId }: { caseId?: string }) {
  const [files, setFiles] = useState<FileUploadStatus[]>([]);
  const [description, setDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: FileUploadStatus[] = acceptedFiles.map(file => ({
      file,
      status: 'pending',
      progress: 0
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isProcessing,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    }
  });

  const removeFile = (index: number) => {
    if (isProcessing) {
      toast.error("Cannot remove files while processing");
      return;
    }
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const analyzeFile = async (fileStatus: FileUploadStatus, index: number): Promise<void> => {
    try {
      // Update status to analyzing
      setFiles(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], status: 'analyzing', progress: 30 };
        return updated;
      });

      const content = await readFileContent(fileStatus.file);
      
      setFiles(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], progress: 50 };
        return updated;
      });

      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: {
          fileContent: content,
          fileName: fileStatus.file.name,
          fileType: fileStatus.file.type,
          caseId,
          description
        }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setFiles(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], progress: 80 };
        return updated;
      });

      // Save to evidence if caseId provided
      if (caseId && data?.analysis) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const filePath = `${user.id}/${caseId}/${Date.now()}_${fileStatus.file.name}`;
          
          const { error: uploadError } = await supabase.storage
            .from('evidence')
            .upload(filePath, fileStatus.file);

          if (uploadError) throw uploadError;

          const { error: dbError } = await supabase
            .from('evidence')
            .insert({
              case_id: caseId,
              user_id: user.id,
              file_name: fileStatus.file.name,
              file_path: filePath,
              file_type: fileStatus.file.type,
              description: description || data.analysis.substring(0, 500),
              ocr_text: data.analysis
            });

          if (dbError) throw dbError;
        }
      }

      // Mark as complete
      setFiles(prev => {
        const updated = [...prev];
        updated[index] = { 
          ...updated[index], 
          status: 'complete', 
          progress: 100,
          analysis: data?.analysis || 'Analysis complete'
        };
        return updated;
      });

    } catch (error: any) {
      console.error('Analysis error:', error);
      setFiles(prev => {
        const updated = [...prev];
        updated[index] = { 
          ...updated[index], 
          status: 'error', 
          progress: 0,
          error: error.message || 'Analysis failed'
        };
        return updated;
      });
    }
  };

  const handleAnalyzeAll = async () => {
    if (files.length === 0) {
      toast.error("Please add files to analyze");
      return;
    }

    setIsProcessing(true);

    // Process all files concurrently with a limit
    const batchSize = 3; // Process 3 at a time to avoid overwhelming the API
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      await Promise.all(
        batch.map((fileStatus, batchIndex) => {
          const actualIndex = i + batchIndex;
          if (fileStatus.status === 'pending') {
            return analyzeFile(fileStatus, actualIndex);
          }
          return Promise.resolve();
        })
      );
    }

    setIsProcessing(false);
    
    const successCount = files.filter(f => f.status === 'complete').length;
    const errorCount = files.filter(f => f.status === 'error').length;
    
    if (errorCount === 0) {
      toast.success(`Successfully analyzed ${successCount} document${successCount > 1 ? 's' : ''}`);
    } else {
      toast.warning(`Analyzed ${successCount} documents, ${errorCount} failed`);
    }
  };

  const getStatusIcon = (status: FileUploadStatus['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'analyzing':
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: FileUploadStatus['status']) => {
    switch (status) {
      case 'complete':
        return <Badge variant="default" className="bg-green-600">Complete</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'analyzing':
        return <Badge variant="secondary">Analyzing...</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const allComplete = files.length > 0 && files.every(f => f.status === 'complete' || f.status === 'error');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          AI Document Analyzer
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload multiple documents for AI-powered analysis. Supports PDF, Word, images, and text files.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm font-medium mb-1">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here, or click to browse'}
          </p>
          <p className="text-xs text-muted-foreground">
            Supports PDF, Word, images, text files (max 10MB each)
          </p>
        </div>

        {/* Optional Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Context (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Add any context about these documents..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isProcessing}
            rows={2}
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <Label>Documents ({files.length})</Label>
              {!isProcessing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFiles([])}
                >
                  Clear All
                </Button>
              )}
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {files.map((fileStatus, index) => (
                <Card key={index} className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getStatusIcon(fileStatus.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {fileStatus.file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(fileStatus.file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(fileStatus.status)}
                        {!isProcessing && fileStatus.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {fileStatus.status === 'analyzing' && (
                      <Progress value={fileStatus.progress} className="h-1" />
                    )}

                    {/* Error Message */}
                    {fileStatus.status === 'error' && fileStatus.error && (
                      <Alert variant="destructive" className="py-2">
                        <AlertDescription className="text-xs">
                          {fileStatus.error}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Analysis Result */}
                    {fileStatus.status === 'complete' && fileStatus.analysis && (
                      <Alert className="py-2 bg-green-50 dark:bg-green-900/20 border-green-200">
                        <AlertDescription className="text-xs whitespace-pre-wrap">
                          {fileStatus.analysis.substring(0, 200)}
                          {fileStatus.analysis.length > 200 && '...'}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleAnalyzeAll}
          disabled={files.length === 0 || isProcessing || allComplete}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing Documents...
            </>
          ) : allComplete ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              All Documents Analyzed
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Analyze {files.length} Document{files.length > 1 ? 's' : ''}
            </>
          )}
        </Button>

        {/* Helpful Tips */}
        <Alert>
          <AlertDescription className="text-xs">
            <strong>Tips for better analysis:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Upload clear, readable documents</li>
              <li>Process multiple related documents together</li>
              <li>Add context to help AI understand the situation</li>
              <li>Review analysis results before proceeding</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
