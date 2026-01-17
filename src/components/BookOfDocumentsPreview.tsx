import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, FileText, Image, Download, Lock, Loader2, 
  CheckCircle, Upload, Scale, ExternalLink 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { PaymentUnlockModal } from '@/components/paywalls/PaymentUnlockModal';
import { useNavigate } from 'react-router-dom';

interface BookOfDocumentsPreviewProps {
  caseId: string;
  caseTitle?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenFullWizard?: () => void;
}

interface EvidenceItem {
  id: string;
  file_name: string;
  file_type: string;
  description?: string;
  upload_date: string;
}

interface DocumentItem {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

/**
 * Book of Documents Preview - Quick view of case materials
 * 
 * RULES:
 * - Viewing the list = FREE (never paywall curiosity)
 * - Downloading/exporting = PAYWALLED (only paywall action)
 */
export function BookOfDocumentsPreview({ 
  caseId, 
  caseTitle, 
  open, 
  onOpenChange,
  onOpenFullWizard 
}: BookOfDocumentsPreviewProps) {
  const navigate = useNavigate();
  const { hasAccess } = usePremiumAccess();
  const [loading, setLoading] = useState(true);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    if (open && caseId) {
      loadCaseMaterials();
    }
  }, [open, caseId]);

  const loadCaseMaterials = async () => {
    setLoading(true);
    try {
      // Load evidence
      const { data: evidenceData } = await supabase
        .from('evidence')
        .select('id, file_name, file_type, description, upload_date')
        .eq('case_id', caseId)
        .order('upload_date', { ascending: true });

      // Load documents
      const { data: docsData } = await supabase
        .from('documents')
        .select('id, title, status, created_at')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      setEvidence(evidenceData || []);
      setDocuments(docsData || []);
    } catch (error) {
      console.error('Error loading case materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!hasAccess) {
      setShowPaywall(true);
      return;
    }
    // If they have access, open the full wizard for download
    onOpenChange(false);
    onOpenFullWizard?.();
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-4 w-4 text-blue-500" />;
    }
    return <FileText className="h-4 w-4 text-muted-foreground" />;
  };

  const totalItems = evidence.length + documents.length;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Book of Documents
            </DialogTitle>
            <DialogDescription>
              {caseTitle || 'Your case materials'} — {totalItems} item{totalItems !== 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : totalItems === 0 ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">No materials yet</p>
                <p className="text-sm text-muted-foreground">
                  Upload evidence to build your Book of Documents
                </p>
              </div>
              <Button onClick={() => { onOpenChange(false); navigate(`/evidence?case=${caseId}`); }}>
                Upload Evidence
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="max-h-[40vh]">
                <div className="space-y-4 pr-4">
                  {/* Evidence Section */}
                  {evidence.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        Evidence ({evidence.length})
                      </h4>
                      <div className="space-y-2">
                        {evidence.map((item, index) => (
                          <div 
                            key={item.id} 
                            className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                          >
                            <Badge variant="outline" className="text-xs shrink-0">
                              {String.fromCharCode(65 + index)}
                            </Badge>
                            {getFileIcon(item.file_type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.file_name}</p>
                              {item.description && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents Section */}
                  {documents.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                        <Scale className="h-4 w-4" />
                        Generated Documents ({documents.length})
                      </h4>
                      <div className="space-y-2">
                        {documents.map((doc) => (
                          <div 
                            key={doc.id} 
                            className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                          >
                            <FileText className="h-4 w-4 text-primary" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{doc.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {doc.status === 'complete' ? 'Ready' : doc.status}
                              </p>
                            </div>
                            {doc.status === 'complete' ? (
                              <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                            ) : (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t">
                <Button 
                  onClick={handleDownload}
                  className="w-full gap-2"
                >
                  {hasAccess ? (
                    <>
                      <Download className="h-4 w-4" />
                      Download Book of Documents
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Download Book of Documents
                    </>
                  )}
                </Button>
                
                {onOpenFullWizard && (
                  <Button 
                    variant="outline" 
                    onClick={() => { onOpenChange(false); onOpenFullWizard(); }}
                    className="w-full gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Customize & Edit
                  </Button>
                )}
                
                <p className="text-xs text-center text-muted-foreground">
                  Viewing is free. Download requires access.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Paywall modal for download action */}
      <PaymentUnlockModal
        open={showPaywall}
        onOpenChange={setShowPaywall}
        actionName="document download"
        caseId={caseId}
        onSaveProgress={() => setShowPaywall(false)}
      />
    </>
  );
}

export default BookOfDocumentsPreview;
