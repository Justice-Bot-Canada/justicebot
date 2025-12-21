import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, ArrowRight, ArrowLeft, FileText, Calendar, Users, 
  CheckCircle2, AlertCircle, Loader2, Edit3, Download, Eye,
  Scale, Save, Trash2, GripVertical, Info, Sparkles
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast-stub';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { useNavigate } from 'react-router-dom';

interface Evidence {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  description?: string;
  tags?: string[];
  upload_date: string;
  ocr_text?: string;
  metadata?: {
    doc_type?: string;
    category?: string;
    dates?: any;
    extracted_summary?: string;
  };
}

interface ExhibitItem {
  id: string;
  evidence_id: string;
  label: string;
  file_name: string;
  description: string;
  relevance: string;
  incident_date: string;
  category: string;
  include: boolean;
  order: number;
}

interface GeneratedBook {
  coverPage: any;
  tableOfContents: any[];
  exhibits: any[];
  affidavitTemplate?: any;
  certificateOfService?: any;
  totalPages: number;
  complianceSummary?: any;
}

type WizardStep = 'case-details' | 'evidence-review' | 'options' | 'generating' | 'preview' | 'edit';

interface BookOfDocumentsWizardProps {
  caseId: string;
  caseTitle?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookOfDocumentsWizard({ caseId, caseTitle, open, onOpenChange }: BookOfDocumentsWizardProps) {
  const { hasAccess, tier } = usePremiumAccess();
  const navigate = useNavigate();
  const isPremium = hasAccess && (tier === 'monthly' || tier === 'yearly');

  // Wizard state
  const [step, setStep] = useState<WizardStep>('case-details');
  const [loading, setLoading] = useState(false);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [exhibitItems, setExhibitItems] = useState<ExhibitItem[]>([]);
  const [generatedBook, setGeneratedBook] = useState<GeneratedBook | null>(null);

  // Case details
  const [caseDescription, setCaseDescription] = useState('');
  const [caseType, setCaseType] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [respondentName, setRespondentName] = useState('');
  const [courtFileNumber, setCourtFileNumber] = useState('');
  const [hearingDate, setHearingDate] = useState('');

  // Options
  const [sortBy, setSortBy] = useState<'chronological' | 'category'>('chronological');
  const [numberingStyle, setNumberingStyle] = useState<'alphabetical' | 'numerical'>('alphabetical');
  const [includeAffidavit, setIncludeAffidavit] = useState(true);
  const [includeCertificateOfService, setIncludeCertificateOfService] = useState(true);
  const [serviceMethod, setServiceMethod] = useState<'email' | 'mail' | 'personal' | 'courier'>('email');
  const [serviceDate, setServiceDate] = useState('');

  // Load evidence when dialog opens
  useEffect(() => {
    if (open && caseId) {
      loadEvidence();
      loadCaseData();
    }
  }, [open, caseId]);

  const loadCaseData = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .single();

      if (!error && data) {
        setCaseDescription(data.description || '');
        setCaseType(data.venue || '');
      }
    } catch (e) {
      console.error('Error loading case:', e);
    }
  };

  const loadEvidence = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('evidence')
        .select(`
          *,
          evidence_metadata (
            doc_type,
            category,
            dates,
            extracted_text
          )
        `)
        .eq('case_id', caseId)
        .order('upload_date', { ascending: true });

      if (error) throw error;

      const transformedEvidence = data?.map((item: any) => ({
        ...item,
        metadata: item.evidence_metadata?.[0] ? {
          doc_type: item.evidence_metadata[0].doc_type,
          category: item.evidence_metadata[0].category,
          dates: item.evidence_metadata[0].dates,
          extracted_summary: item.evidence_metadata[0].extracted_text?.substring(0, 200)
        } : undefined
      })) || [];

      setEvidence(transformedEvidence);

      // Initialize exhibit items from evidence
      const items: ExhibitItem[] = transformedEvidence.map((e, idx) => ({
        id: crypto.randomUUID(),
        evidence_id: e.id,
        label: numberingStyle === 'alphabetical' 
          ? String.fromCharCode(65 + idx)
          : String(idx + 1),
        file_name: e.file_name,
        description: e.description || e.metadata?.extracted_summary || '',
        relevance: '',
        incident_date: e.metadata?.dates?.incident || e.metadata?.dates?.captured || '',
        category: e.metadata?.category || 'Document',
        include: true,
        order: idx
      }));

      setExhibitItems(items);
    } catch (error) {
      console.error('Error loading evidence:', error);
      toast.error('Failed to load evidence');
    } finally {
      setLoading(false);
    }
  };

  const updateExhibitItem = (id: string, updates: Partial<ExhibitItem>) => {
    setExhibitItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const generateBook = async () => {
    if (!isPremium) {
      toast.error('Book of Documents is a premium feature');
      navigate('/pricing');
      return;
    }

    setStep('generating');

    try {
      // Filter included items and prepare for generation
      const includedItems = exhibitItems.filter(item => item.include);

      if (includedItems.length === 0) {
        toast.error('Please select at least one piece of evidence');
        setStep('evidence-review');
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-exhibit-book', {
        body: {
          caseId,
          includeTableOfContents: true,
          numberingStyle,
          caseDescription,
          exhibitOverrides: includedItems.map(item => ({
            evidence_id: item.evidence_id,
            description: item.description,
            relevance: item.relevance,
            incident_date: item.incident_date,
            order: item.order
          })),
          organizationAnswers: {
            sortBy,
            includeWitnessList: false,
            includeAffidavit,
            includeCertificateOfService,
            opposingPartyName: respondentName,
            courtFileNumber,
            hearingDate,
            serviceMethod,
            serviceDate
          }
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setGeneratedBook({
        coverPage: data.coverPage,
        tableOfContents: data.tableOfContents || [],
        exhibits: data.exhibits || [],
        affidavitTemplate: data.affidavitTemplate,
        certificateOfService: data.certificateOfService,
        totalPages: data.totalPages || 0,
        complianceSummary: data.complianceSummary
      });

      setStep('preview');
      toast.success(`Book of Documents generated with ${includedItems.length} exhibits`);
    } catch (err: any) {
      console.error('Generation error:', err);
      toast.error(err.message || 'Failed to generate Book of Documents');
      setStep('options');
    }
  };

  const handleDownload = () => {
    toast.success('Preparing download... (PDF generation in progress)');
    // Future: Trigger actual PDF generation
  };

  const goToStep = (newStep: WizardStep) => {
    setStep(newStep);
  };

  const getStepNumber = () => {
    const steps: WizardStep[] = ['case-details', 'evidence-review', 'options', 'generating', 'preview'];
    return steps.indexOf(step) + 1;
  };

  if (!isPremium) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-amber-500" />
              Book of Documents
              <Badge className="bg-amber-500">Premium</Badge>
            </DialogTitle>
            <DialogDescription>
              Generate court-ready exhibit books with AI-powered descriptions
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <Scale className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-6">
              Upgrade to create Ontario-compliant Books of Documents with automatic organization, 
              AI descriptions, and court-ready formatting.
            </p>
            <Button onClick={() => { onOpenChange(false); navigate('/pricing'); }}>
              Upgrade to Premium
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Create Book of Documents
          </DialogTitle>
          {step !== 'generating' && step !== 'preview' && step !== 'edit' && (
            <div className="flex items-center gap-2 mt-2">
              <Progress value={(getStepNumber() / 3) * 100} className="flex-1 h-2" />
              <span className="text-sm text-muted-foreground">Step {getStepNumber()} of 3</span>
            </div>
          )}
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          {/* Step 1: Case Details */}
          {step === 'case-details' && (
            <div className="space-y-6 py-4">
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  Provide details about your case. This helps the AI generate accurate, legally-appropriate 
                  descriptions for your evidence.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Case Description *</Label>
                  <Textarea
                    placeholder="Describe your case in detail. What happened? What issues are you presenting to the tribunal? What outcome are you seeking?"
                    value={caseDescription}
                    onChange={(e) => setCaseDescription(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Be specific - this helps AI understand the context for each piece of evidence.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Case Type / Venue</Label>
                    <Select value={caseType} onValueChange={setCaseType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select venue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LTB">Landlord and Tenant Board (LTB)</SelectItem>
                        <SelectItem value="HRTO">Human Rights Tribunal of Ontario</SelectItem>
                        <SelectItem value="Small Claims">Small Claims Court</SelectItem>
                        <SelectItem value="Superior">Superior Court</SelectItem>
                        <SelectItem value="Family">Family Court</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Court File Number</Label>
                    <Input
                      placeholder="e.g., TEL-12345-24"
                      value={courtFileNumber}
                      onChange={(e) => setCourtFileNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Your Name (Applicant)</Label>
                    <Input
                      placeholder="Full legal name"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Opposing Party (Respondent)</Label>
                    <Input
                      placeholder="Full name of landlord/tenant/respondent"
                      value={respondentName}
                      onChange={(e) => setRespondentName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Hearing Date</Label>
                    <Input
                      type="date"
                      value={hearingDate}
                      onChange={(e) => setHearingDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => goToStep('evidence-review')} disabled={!caseDescription.trim()}>
                  Review Evidence
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Evidence Review */}
          {step === 'evidence-review' && (
            <div className="space-y-6 py-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Review each piece of evidence. Add dates, describe its relevance to your case, 
                  and uncheck any you don't want to include.
                </AlertDescription>
              </Alert>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : exhibitItems.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No evidence uploaded yet.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => { onOpenChange(false); }}
                  >
                    Upload Evidence First
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {exhibitItems.map((item, index) => (
                    <Card key={item.id} className={`${!item.include ? 'opacity-50' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={item.include}
                                onChange={(e) => updateExhibitItem(item.id, { include: e.target.checked })}
                                className="h-4 w-4 rounded border-border"
                              />
                            </div>
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">Exhibit {item.label}</Badge>
                                <span className="font-medium text-sm truncate max-w-[200px]">
                                  {item.file_name}
                                </span>
                              </div>
                              <Badge className="text-xs">{item.category}</Badge>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs">Date of Document/Incident *</Label>
                                <Input
                                  type="date"
                                  value={item.incident_date}
                                  onChange={(e) => updateExhibitItem(item.id, { incident_date: e.target.value })}
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Category</Label>
                                <Select 
                                  value={item.category} 
                                  onValueChange={(v) => updateExhibitItem(item.id, { category: v })}
                                >
                                  <SelectTrigger className="h-8 text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Correspondence">Correspondence</SelectItem>
                                    <SelectItem value="Contract">Contract/Agreement</SelectItem>
                                    <SelectItem value="Evidence">Photo/Video Evidence</SelectItem>
                                    <SelectItem value="Financial">Financial Document</SelectItem>
                                    <SelectItem value="Medical">Medical Record</SelectItem>
                                    <SelectItem value="Official">Official Document</SelectItem>
                                    <SelectItem value="Document">Other Document</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs">Description</Label>
                              <Textarea
                                placeholder="What is this document?"
                                value={item.description}
                                onChange={(e) => updateExhibitItem(item.id, { description: e.target.value })}
                                rows={2}
                                className="text-sm resize-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs">Relevance to Case *</Label>
                              <Textarea
                                placeholder="Why is this evidence important? What does it prove or demonstrate?"
                                value={item.relevance}
                                onChange={(e) => updateExhibitItem(item.id, { relevance: e.target.value })}
                                rows={2}
                                className="text-sm resize-none"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => goToStep('case-details')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={() => goToStep('options')} 
                  disabled={exhibitItems.filter(i => i.include).length === 0}
                >
                  Configure Options
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Options */}
          {step === 'options' && (
            <div className="space-y-6 py-4">
              <Alert className="bg-primary/10 border-primary/20">
                <Scale className="h-4 w-4 text-primary" />
                <AlertDescription>
                  <strong>Ontario Practice Direction Requirements:</strong> Your book will include 
                  consecutively numbered pages, a table of contents with page references, and 
                  documents in chronological order.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h4 className="font-medium">Document Organization</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Evidence Ordering</Label>
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chronological">Chronological (oldest first) ✓</SelectItem>
                        <SelectItem value="category">By category, then chronological</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Exhibit Labeling</Label>
                    <Select value={numberingStyle} onValueChange={(v) => setNumberingStyle(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alphabetical">Alphabetical (A, B, C...)</SelectItem>
                        <SelectItem value="numerical">Numerical (1, 2, 3...)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Service Documents</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Certificate of Service</Label>
                      <p className="text-xs text-muted-foreground">Proof you served the opposing party</p>
                    </div>
                    <Switch
                      checked={includeCertificateOfService}
                      onCheckedChange={setIncludeCertificateOfService}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Affidavit of Service</Label>
                      <p className="text-xs text-muted-foreground">Sworn statement for formal proof</p>
                    </div>
                    <Switch
                      checked={includeAffidavit}
                      onCheckedChange={setIncludeAffidavit}
                    />
                  </div>

                  {(includeCertificateOfService || includeAffidavit) && (
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label>Method of Service</Label>
                        <Select value={serviceMethod} onValueChange={(v) => setServiceMethod(v as any)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="mail">Regular Mail</SelectItem>
                            <SelectItem value="personal">Personal Service</SelectItem>
                            <SelectItem value="courier">Courier</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Date of Service</Label>
                        <Input
                          type="date"
                          value={serviceDate}
                          onChange={(e) => setServiceDate(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Summary</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {exhibitItems.filter(i => i.include).length} exhibits selected</li>
                  <li>• {sortBy === 'chronological' ? 'Chronological' : 'Category-based'} ordering</li>
                  <li>• {numberingStyle === 'alphabetical' ? 'Alphabetical' : 'Numerical'} labeling</li>
                  <li>• Cover page + Table of Contents + Exhibits</li>
                  {includeCertificateOfService && <li>• Certificate of Service included</li>}
                  {includeAffidavit && <li>• Affidavit of Service template included</li>}
                </ul>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => goToStep('evidence-review')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={generateBook}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Book of Documents
                </Button>
              </div>
            </div>
          )}

          {/* Generating */}
          {step === 'generating' && (
            <div className="py-16 text-center space-y-6">
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
              <div>
                <h4 className="font-semibold text-lg">Generating Your Book of Documents</h4>
                <p className="text-muted-foreground mt-2">
                  AI is analyzing your evidence and creating professional descriptions...
                </p>
              </div>
              <div className="max-w-xs mx-auto space-y-2">
                <Progress value={66} className="h-2" />
                <p className="text-xs text-muted-foreground">This may take up to 30 seconds</p>
              </div>
            </div>
          )}

          {/* Preview */}
          {step === 'preview' && generatedBook && (
            <div className="space-y-6 py-4">
              <Alert className="bg-green-500/10 border-green-500/30">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  Your Book of Documents is ready! Review the content below and make any edits needed.
                </AlertDescription>
              </Alert>

              <Tabs defaultValue="cover" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="cover">Cover</TabsTrigger>
                  <TabsTrigger value="toc">Contents</TabsTrigger>
                  <TabsTrigger value="exhibits">Exhibits</TabsTrigger>
                  <TabsTrigger value="service">Service</TabsTrigger>
                </TabsList>

                <TabsContent value="cover" className="mt-4">
                  <Card>
                    <CardHeader className="text-center border-b">
                      <CardTitle className="text-2xl">{generatedBook.coverPage?.title || 'BOOK OF DOCUMENTS'}</CardTitle>
                      <p className="text-muted-foreground">{generatedBook.coverPage?.tribunal_full_name}</p>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Court File No.</p>
                        <p className="font-medium">{generatedBook.coverPage?.court_file_number || '[To be assigned]'}</p>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Applicant</p>
                          <p className="font-medium">{generatedBook.coverPage?.applicant}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Respondent</p>
                          <p className="font-medium">{generatedBook.coverPage?.respondent}</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span>{generatedBook.coverPage?.total_exhibits} Exhibits</span>
                        <span>{generatedBook.totalPages} Pages</span>
                        <span>Prepared: {generatedBook.coverPage?.prepared_date}</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="toc" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Table of Contents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {generatedBook.tableOfContents.map((item, idx) => (
                          <div key={idx} className="flex justify-between py-2 border-b border-dashed last:border-0">
                            <div className="flex-1">
                              <span className="font-medium">{item.label}</span>
                              <span className="mx-2">—</span>
                              <span className="text-muted-foreground">{item.title}</span>
                            </div>
                            <span className="text-muted-foreground">{item.page_reference}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="exhibits" className="mt-4">
                  <div className="space-y-3">
                    {generatedBook.exhibits.map((exhibit, idx) => (
                      <Card key={idx}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge>{exhibit.label}</Badge>
                                <span className="font-medium">{exhibit.file_name}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{exhibit.legal_description}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {exhibit.formatted_date} • Pages {exhibit.page_start}-{exhibit.page_end}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setStep('edit')}>
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="service" className="mt-4">
                  <div className="space-y-4">
                    {generatedBook.certificateOfService && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Certificate of Service</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-sm whitespace-pre-wrap font-sans">
                            {generatedBook.certificateOfService.content}
                          </pre>
                        </CardContent>
                      </Card>
                    )}

                    {generatedBook.affidavitTemplate && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Affidavit of Service</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-sm whitespace-pre-wrap font-sans">
                            {generatedBook.affidavitTemplate.content}
                          </pre>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => goToStep('options')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Modify Options
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep('edit')}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Details
                  </Button>
                  <Button onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {step === 'edit' && generatedBook && (
            <div className="space-y-6 py-4">
              <Alert>
                <Edit3 className="h-4 w-4" />
                <AlertDescription>
                  Edit exhibit descriptions and details below. Changes are saved automatically.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {generatedBook.exhibits.map((exhibit, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge>{exhibit.label}</Badge>
                        <span className="font-medium">{exhibit.file_name}</span>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Legal Description</Label>
                        <Textarea
                          value={exhibit.legal_description}
                          onChange={(e) => {
                            const newExhibits = [...generatedBook.exhibits];
                            newExhibits[idx] = { ...exhibit, legal_description: e.target.value };
                            setGeneratedBook({ ...generatedBook, exhibits: newExhibits });
                          }}
                          rows={3}
                          className="text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Category</Label>
                          <Input
                            value={exhibit.category}
                            onChange={(e) => {
                              const newExhibits = [...generatedBook.exhibits];
                              newExhibits[idx] = { ...exhibit, category: e.target.value };
                              setGeneratedBook({ ...generatedBook, exhibits: newExhibits });
                            }}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Date</Label>
                          <Input
                            value={exhibit.formatted_date}
                            onChange={(e) => {
                              const newExhibits = [...generatedBook.exhibits];
                              newExhibits[idx] = { ...exhibit, formatted_date: e.target.value };
                              setGeneratedBook({ ...generatedBook, exhibits: newExhibits });
                            }}
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('preview')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Preview
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
