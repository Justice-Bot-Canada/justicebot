import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  FileText, 
  Image, 
  Eye, 
  Download, 
  Trash2, 
  Edit3, 
  Move, 
  Search,
  Tag,
  List,
  FileCheck,
  Scan,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Zap,
  Book
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { PremiumStatus } from "@/components/PremiumStatus";

interface Evidence {
  id: string;
  case_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  description: string;
  upload_date: string;
  tags?: string[];
  page_count?: number;
  ocr_text?: string;
  order_index?: number;
  redacted_regions?: any[];
}

interface EvidenceBuilderProps {
  caseId: string;
  onUpdate?: () => void;
}

const EvidenceBuilder: React.FC<EvidenceBuilderProps> = ({ caseId, onUpdate }) => {
  const { user } = useAuth();
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("upload");

  const availableTags = [
    "Contract", "Receipt", "Communication", "Photo", "Legal Document", 
    "Notice", "Invoice", "Statement", "Certificate", "Report", "Other"
  ];

  useEffect(() => {
    fetchEvidence();
  }, [caseId]);

  const fetchEvidence = async () => {
    try {
      const { data, error } = await supabase
        .from('evidence')
        .select('*')
        .eq('case_id', caseId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      
      // Parse tags and other JSON fields
      const processedEvidence = (data || []).map(item => ({
        ...item,
        tags: Array.isArray((item as any).tags) ? (item as any).tags : [],
        order_index: (item as any).order_index || 0,
        ocr_text: (item as any).ocr_text || null,
        page_count: (item as any).page_count || 1,
        redacted_regions: (item as any).redacted_regions || []
      }));
      
      setEvidence(processedEvidence);
    } catch (error) {
      console.error('Error fetching evidence:', error);
      toast.error('Failed to fetch evidence');
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user || !caseId) return;

    setUploading(true);
    const uploadedIds: string[] = [];

    try {
      for (const file of acceptedFiles) {
        const fileName = `${user.id}/${caseId}/${Date.now()}_${file.name}`;
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('evidence')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Create database record
        const { data: dbData, error: dbError } = await supabase
          .from('evidence')
          .insert({
            case_id: caseId,
            file_name: file.name,
            file_path: fileName,
            file_type: file.type,
            description: `Uploaded ${file.name}`,
            order_index: evidence.length + uploadedIds.length
          } as any)
          .select()
          .single();

        if (dbError) throw dbError;
        uploadedIds.push(dbData.id);

        // Start OCR processing for supported files
        if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
          processOCR(dbData.id);
        }
      }

      fetchEvidence();
      toast.success(`${acceptedFiles.length} file(s) uploaded successfully`);
      onUpdate?.();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
    }
  }, [user, caseId, evidence.length, onUpdate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 20 * 1024 * 1024 // 20MB
  });

  const processOCR = async (evidenceId: string) => {
    setProcessing(prev => [...prev, evidenceId]);
    
    try {
      const item = evidence.find(e => e.id === evidenceId);
      if (!item) throw new Error('Evidence not found');

      // Call OCR extraction edge function
      const { data, error: ocrError } = await supabase.functions.invoke('extract-ocr', {
        body: {
          filePath: item.file_path,
          fileType: item.file_type,
        }
      });

      if (ocrError) throw ocrError;
      
      if (!data?.success) {
        throw new Error(data?.error || 'OCR extraction failed');
      }

      const ocrText = data.text || '';
      const pageCount = Math.ceil(ocrText.length / 3000); // Estimate pages
      
      // Update evidence with OCR text
      const { error: updateError } = await supabase
        .from('evidence')
        .update({ 
          ocr_text: ocrText,
          page_count: Math.max(1, pageCount)
        } as any)
        .eq('id', evidenceId);

      if (updateError) throw updateError;
      
      fetchEvidence();
      toast.success(`OCR extracted ${ocrText.length} characters of text`);
    } catch (error: any) {
      console.error('OCR error:', error);
      toast.error(error.message || 'OCR processing failed');
    } finally {
      setProcessing(prev => prev.filter(id => id !== evidenceId));
    }
  };

  const updateEvidenceTags = async (evidenceId: string, tags: string[]) => {
    try {
      const { error } = await supabase
        .from('evidence')
        .update({ tags } as any)
        .eq('id', evidenceId);

      if (error) throw error;
      
      fetchEvidence();
      toast.success('Tags updated');
    } catch (error) {
      console.error('Tag update error:', error);
      toast.error('Failed to update tags');
    }
  };

  const updateEvidenceOrder = async (evidenceId: string, newIndex: number) => {
    try {
      const { error } = await supabase
        .from('evidence')
        .update({ order_index: newIndex } as any)
        .eq('id', evidenceId);

      if (error) throw error;
      
      fetchEvidence();
    } catch (error) {
      console.error('Reorder error:', error);
      toast.error('Failed to reorder evidence');
    }
  };

  const deleteEvidence = async (evidenceId: string) => {
    if (!confirm('Are you sure you want to delete this evidence?')) return;

    try {
      const item = evidence.find(e => e.id === evidenceId);
      if (!item) return;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('evidence')
        .remove([item.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('evidence')
        .delete()
        .eq('id', evidenceId);

      if (dbError) throw dbError;

      fetchEvidence();
      toast.success('Evidence deleted');
      onUpdate?.();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete evidence');
    }
  };

  const generateBookOfDocuments = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select evidence items to include');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-book-of-documents', {
        body: {
          caseId,
          evidenceIds: selectedItems,
          includeOcr: true,
          includePageStamps: true
        }
      });

      if (error) throw error;

      if (data?.pdfUrl) {
        window.open(data.pdfUrl, '_blank');
        toast.success('Book of Documents generated successfully');
      }
    } catch (error) {
      console.error('Book generation error:', error);
      toast.error('Failed to generate Book of Documents');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvidence = evidence.filter(item => {
    const matchesSearch = !searchTerm || 
      item.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.ocr_text && item.ocr_text.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => item.tags?.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Evidence Builder
          </CardTitle>
          <CardDescription>
            Upload, organize, and compile your legal evidence into a professional Book of Documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="organize">Organize</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
              <TabsTrigger value="generate">Generate</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div {...getRootProps()} className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
              `}>
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {isDragActive ? 'Drop files here' : 'Upload Evidence'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Drag & drop files or click to browse. Supports PDF, images, and Word documents.
                </p>
                <Button variant="outline" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Choose Files'}
                </Button>
              </div>

              {evidence.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Recent Uploads ({evidence.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {evidence.slice(-4).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          {item.file_type.startsWith('image/') ? 
                            <Image className="h-8 w-8 text-blue-500" /> : 
                            <FileText className="h-8 w-8 text-red-500" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.file_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.upload_date).toLocaleDateString()}
                          </p>
                        </div>
                        {processing.includes(item.id) && (
                          <Badge variant="outline" className="animate-pulse">
                            <Scan className="h-3 w-3 mr-1" />
                            OCR
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="organize" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Evidence</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by filename, description, or OCR text..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <Label>Filter by Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {availableTags.map(tag => (
                      <Button
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTags(prev => 
                          prev.includes(tag) 
                            ? prev.filter(t => t !== tag)
                            : [...prev, tag]
                        )}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {filteredEvidence.map((item, index) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(prev => [...prev, item.id]);
                            } else {
                              setSelectedItems(prev => prev.filter(id => id !== item.id));
                            }
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {item.file_type.startsWith('image/') ? 
                              <Image className="h-5 w-5 text-blue-500" /> : 
                              <FileText className="h-5 w-5 text-red-500" />
                            }
                            <h4 className="font-medium">{item.file_name}</h4>
                            {item.page_count && (
                              <Badge variant="outline">{item.page_count} pages</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          
                          <div className="flex flex-wrap gap-1 mb-2">
                            {item.tags?.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => {
                                const newTag = prompt('Add tag:');
                                if (newTag) {
                                  updateEvidenceTags(item.id, [...(item.tags || []), newTag]);
                                }
                              }}
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              Add Tag
                            </Button>
                          </div>

                          {item.ocr_text && (
                            <details className="text-sm">
                              <summary className="cursor-pointer text-muted-foreground">
                                OCR Text Preview
                              </summary>
                              <p className="mt-1 p-2 bg-muted/50 rounded text-xs">
                                {item.ocr_text.substring(0, 200)}...
                              </p>
                            </details>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateEvidenceOrder(item.id, Math.max(0, index - 1))}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateEvidenceOrder(item.id, index + 1)}
                            disabled={index === filteredEvidence.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                        {(item.file_type === 'application/pdf' || item.file_type.startsWith('image/')) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => processOCR(item.id)}
                            disabled={processing.includes(item.id)}
                            className="gap-1"
                            title="Re-process OCR with AI"
                          >
                            {processing.includes(item.id) ? (
                              <RotateCcw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Scan className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteEvidence(item.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredEvidence.length === 0 && evidence.length > 0 && (
                <div className="text-center py-8">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No evidence matches your search criteria</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="review" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Evidence Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Items:</span>
                        <Badge>{evidence.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Selected for Book:</span>
                        <Badge variant="outline">{selectedItems.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>With OCR Text:</span>
                        <Badge variant="secondary">
                          {evidence.filter(e => e.ocr_text).length}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Pages:</span>
                        <Badge>
                          {evidence.reduce((sum, e) => sum + (e.page_count || 1), 0)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Document Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Array.from(new Set(evidence.map(e => e.file_type))).map(type => {
                        const count = evidence.filter(e => e.file_type === type).length;
                        return (
                          <div key={type} className="flex justify-between items-center">
                            <span className="text-sm">{type}</span>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Table of Contents Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {evidence
                      .filter(e => selectedItems.includes(e.id))
                      .map((item, index) => (
                        <div key={item.id} className="flex items-center gap-3 p-2 border-l-2 border-primary/20">
                          <span className="font-mono text-sm">{index + 1}.</span>
                          <div className="flex-1">
                            <p className="font-medium">{item.file_name}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            Page {index + 1}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="generate" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Book of Documents</CardTitle>
                  <CardDescription>
                    Create a professional, court-ready compilation of your evidence
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Included Features:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          Auto-generated Table of Contents
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          Sequential page numbering
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          Document stamps and headers
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          OCR text overlay (searchable)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          Professional formatting
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">Selection Summary:</h4>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm"><strong>Documents:</strong> {selectedItems.length}</p>
                        <p className="text-sm"><strong>Estimated Pages:</strong> {
                          evidence.filter(e => selectedItems.includes(e.id))
                            .reduce((sum, e) => sum + (e.page_count || 1), 0)
                        }</p>
                        <p className="text-sm"><strong>With OCR:</strong> {
                          evidence.filter(e => selectedItems.includes(e.id) && e.ocr_text).length
                        }</p>
                      </div>
                    </div>
                  </div>

                  {selectedItems.length === 0 && (
                    <div className="p-4 border border-warning/20 bg-warning/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <p className="text-sm">Please select evidence items to include in the Book of Documents</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button 
                      onClick={generateBookOfDocuments}
                      disabled={loading || selectedItems.length === 0}
                      className="flex-1"
                    >
                      {loading ? (
                        <>
                          <Zap className="h-4 w-4 mr-2 animate-pulse" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Generate Book of Documents
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedItems(evidence.map(e => e.id));
                        toast.success('All evidence selected');
                      }}
                    >
                      Select All
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <PremiumStatus />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvidenceBuilder;