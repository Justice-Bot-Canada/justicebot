import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from "@/lib/toast-stub";
import { analytics } from "@/utils/analytics";
import { EvidenceAnalysisPanel } from './EvidenceAnalysisPanel';
import {
  Upload,
  FileText,
  Image,
  Mail,
  File,
  Trash2,
  Search,
  Filter,
  Download,
  Eye,
  Tag,
  Link2,
  BookOpen,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface Evidence {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  description?: string;
  tags?: string[];
  upload_date: string;
  case_id: string;
  metadata?: {
    doc_type?: string;
    category?: string;
    parties?: Record<string, unknown>;
    dates?: Record<string, unknown>;
    extracted_summary?: string;
    evidence_value?: string;
    confidence?: number;
  };
  links?: Array<{
    form_id: string;
    section_key: string;
    note?: string;
  }>;
}

interface EvidenceHubProps {
  caseId: string;
  caseDescription?: string;
  caseType?: string;
  onEvidenceSelect?: (evidence: Evidence[]) => void;
  selectionMode?: boolean;
  onBuildBook?: () => void;
}

export function EvidenceHub({ caseId, caseDescription, caseType, onEvidenceSelect, selectionMode = false, onBuildBook }: EvidenceHubProps) {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [processing, setProcessing] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchEvidence();
  }, [caseId]);

  const fetchEvidence = async () => {
    try {
      const { data, error } = await supabase
        .from('evidence')
        .select(`
          *,
          evidence_metadata (
            doc_type,
            category,
            parties,
            dates,
            extracted_text,
            confidence_score
          ),
          evidence_links (
            form_id,
            section_key,
            note
          )
        `)
        .eq('case_id', caseId)
        .order('upload_date', { ascending: false });

      if (error) throw error;

      // Transform the data to include metadata properly
      interface EvidenceMetadataItem {
        doc_type?: string;
        category?: string;
        parties?: Record<string, unknown>;
        dates?: Record<string, unknown>;
        extracted_text?: string;
        confidence_score?: number;
      }
      
      interface RawEvidenceItem {
        id: string;
        file_name: string;
        file_path: string;
        file_type: string;
        description?: string;
        tags?: string[];
        upload_date: string;
        case_id: string;
        evidence_metadata?: EvidenceMetadataItem | EvidenceMetadataItem[];
        evidence_links?: Array<{
          form_id: string;
          section_key: string;
          note?: string;
        }>;
      }
      
      const transformedData = (data as unknown as RawEvidenceItem[] | null)?.map((item) => {
        const metadataItem = Array.isArray(item.evidence_metadata) 
          ? item.evidence_metadata[0] 
          : item.evidence_metadata;
        
        return {
          id: item.id,
          file_name: item.file_name,
          file_path: item.file_path,
          file_type: item.file_type,
          description: item.description,
          tags: item.tags,
          upload_date: item.upload_date,
          case_id: item.case_id,
          metadata: metadataItem ? {
            doc_type: metadataItem.doc_type,
            category: metadataItem.category,
            parties: metadataItem.parties,
            dates: metadataItem.dates,
            extracted_summary: metadataItem.extracted_text,
            confidence: metadataItem.confidence_score
          } : undefined,
          links: item.evidence_links || []
        };
      }) || [];

      setEvidence(transformedData);
    } catch (error) {
      console.error('Error fetching evidence:', error);
      toast.error('Failed to load evidence');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    setUploading(true);

    // Get current user ID for storage path
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to upload evidence');
      setUploading(false);
      return;
    }

    for (const file of acceptedFiles) {
      try {
        const fileId = crypto.randomUUID();
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        // Upload to Supabase Storage - path must start with user ID for RLS
        const filePath = `${user.id}/${caseId}/${fileId}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('evidence')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;
        setUploadProgress(prev => ({ ...prev, [fileId]: 50 }));

        // Get public URL from storage
        const { data: { publicUrl } } = supabase.storage
          .from('evidence')
          .getPublicUrl(filePath);

        // Create evidence record
        const { data: evidenceData, error: evidenceError } = await supabase
          .from('evidence')
          .insert({
            case_id: caseId,
            file_name: file.name,
            file_path: filePath,
            file_type: file.type,
            description: '',
            upload_date: new Date().toISOString()
          })
          .select()
          .single();

        if (evidenceError) throw evidenceError;
        setUploadProgress(prev => ({ ...prev, [fileId]: 75 }));

        // Analyze document with AI - use storage path for binary files
        try {
          const isTextFile = file.type.startsWith('text/') || file.type.includes('json');
          
          let analysisBody: { fileName: string; caseId: string; filePath?: string; fileContent?: string; fileType?: string };
          
          if (isTextFile) {
            // Read text content directly
            const textContent = await file.text();
            analysisBody = {
              fileContent: textContent.substring(0, 50000),
              fileName: file.name,
              caseId
            };
          } else {
            // For binary files (PDF, images), pass the storage path
            analysisBody = {
              filePath,
              fileName: file.name,
              fileType: file.type,
              caseId
            };
          }

          const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-document', {
            body: analysisBody
          });

          if (analysisError) {
            console.error('Analysis error:', analysisError);
            toast.warning(`${file.name} uploaded but analysis failed`);
          } else if (analysisData?.metadata) {
            // Save metadata
            await supabase.from('evidence_metadata').insert({
              evidence_id: evidenceData.id,
              metadata_key: 'analysis', // Required field name
              metadata_value: JSON.stringify(analysisData.metadata),
              doc_type: analysisData.metadata.doc_type,
              category: analysisData.metadata.category,
              parties: analysisData.metadata.parties,
              dates: analysisData.metadata.dates,
              extracted_text: analysisData.metadata.extracted_summary,
              confidence_score: analysisData.metadata.confidence,
              flags: {
                evidence_value: analysisData.metadata.evidence_value,
                legal_issues: analysisData.metadata.legal_issues
              }
            });
            toast.success(`${file.name} uploaded and analyzed`);
            // Track evidence uploaded
            analytics.evidenceUploaded(evidence.length + 1, caseId);
          } else {
            toast.success(`${file.name} uploaded`);
            // Track evidence uploaded
            analytics.evidenceUploaded(evidence.length + 1, caseId);
          }

          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
          fetchEvidence();
        } catch (analysisErr) {
          console.error('Analysis error:', analysisErr);
          toast.warning(`${file.name} uploaded but analysis failed`);
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
          fetchEvidence();
        }

      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/*': ['.txt'],
      'message/rfc822': ['.eml']
    },
    maxSize: 20 * 1024 * 1024 // 20MB
  });

  const reprocessOCR = async (evidenceId: string, filePath: string, fileType: string) => {
    setProcessing(prev => new Set(prev).add(evidenceId));
    
    try {
      const { data, error } = await supabase.functions.invoke('extract-ocr', {
        body: {
          filePath,
          fileType,
        }
      });

      if (error) throw error;
      
      if (!data?.success) {
        throw new Error(data?.error || 'OCR extraction failed');
      }

      const ocrText = data.text || '';
      
      // Update evidence with new OCR text
      const { error: updateError } = await supabase
        .from('evidence')
        .update({ 
          ocr_text: ocrText,
          updated_at: new Date().toISOString()
        })
        .eq('id', evidenceId);

      if (updateError) throw updateError;
      
      toast.success(`Re-extracted ${ocrText.length} characters of text`);
      fetchEvidence();
    } catch (error: unknown) {
      console.error('OCR reprocess error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to re-process OCR');
    } finally {
      setProcessing(prev => {
        const next = new Set(prev);
        next.delete(evidenceId);
        return next;
      });
    }
  };

  const deleteEvidence = async (id: string) => {
    try {
      const { error } = await supabase
        .from('evidence')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Evidence deleted');
      fetchEvidence();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete evidence');
    }
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedEvidence);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedEvidence(newSelection);

    if (onEvidenceSelect) {
      const selected = evidence.filter(e => newSelection.has(e.id));
      onEvidenceSelect(selected);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (fileType === 'application/pdf') return <FileText className="h-4 w-4" />;
    if (fileType.includes('email')) return <Mail className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      'PestControl': 'bg-red-500/10 text-red-700 dark:text-red-400',
      'Rent': 'bg-green-500/10 text-green-700 dark:text-green-400',
      'Accommodation': 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
      'Safety': 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
      'Discrimination': 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
      'Maintenance': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
    };
    return colors[category || ''] || 'bg-muted text-muted-foreground';
  };

  const filteredEvidence = evidence.filter(e => {
    const matchesSearch = e.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         e.metadata?.extracted_summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || e.metadata?.category === filterCategory;
    const matchesType = filterType === 'all' || e.metadata?.doc_type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const categories = [...new Set(evidence.map(e => e.metadata?.category).filter(Boolean))];
  const docTypes = [...new Set(evidence.map(e => e.metadata?.doc_type).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Evidence Analysis Panel */}
      <EvidenceAnalysisPanel 
        caseId={caseId}
        caseDescription={caseDescription}
        caseType={caseType}
        evidenceCount={evidence.length}
        onBuildBook={onBuildBook}
      />

      {/* Upload Zone */}
      <Card>
        <CardContent className="pt-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Upload Evidence</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to select'}
            </p>
            <p className="text-xs text-muted-foreground">
              Supported: PDF, Images, Word Docs, Text Files, Emails (Max 20MB)
            </p>
          </div>

          {Object.keys(uploadProgress).length > 0 && (
            <div className="mt-4 space-y-2">
              {Object.entries(uploadProgress).map(([id, progress]) => (
                <div key={id}>
                  <Progress value={progress} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search evidence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="all">All Types</option>
          {docTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Evidence List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvidence.map((item) => (
          <Card
            key={item.id}
            className={`cursor-pointer transition-all ${
              selectedEvidence.has(item.id) ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => selectionMode && toggleSelection(item.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getFileIcon(item.file_type)}
                  <span className="font-medium text-sm truncate max-w-[180px]">
                    {item.file_name}
                  </span>
                </div>
                {selectionMode && (
                  <div className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
                    selectedEvidence.has(item.id) ? 'bg-primary border-primary' : 'border-muted'
                  }`}>
                    {selectedEvidence.has(item.id) && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                  </div>
                )}
              </div>

              {item.metadata?.category && (
                <Badge className={`${getCategoryColor(item.metadata.category)} mb-2`}>
                  {item.metadata.category}
                </Badge>
              )}

              {item.metadata?.extracted_summary && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {item.metadata.extracted_summary}
                </p>
              )}

              {item.links && item.links.length > 0 && (
                <div className="flex items-center gap-1 mb-2">
                  <Link2 className="h-3 w-3 text-primary" />
                  <span className="text-xs text-primary">{item.links.length} form link(s)</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-xs text-muted-foreground">
                  {new Date(item.upload_date).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      const { data: { publicUrl } } = supabase.storage
                        .from('evidence')
                        .getPublicUrl(item.file_path);
                      window.open(publicUrl, '_blank');
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {(item.file_type === 'application/pdf' || item.file_type.startsWith('image/')) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        reprocessOCR(item.id, item.file_path, item.file_type);
                      }}
                      disabled={processing.has(item.id)}
                      title="Re-process OCR with AI"
                    >
                      {processing.has(item.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RotateCcw className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteEvidence(item.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvidence.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No evidence found</p>
        </div>
      )}
    </div>
  );
}
