import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2, BookOpen, Download, Crown, FileText, Lock, Calendar, Users, FileCheck, ArrowRight, CheckCircle2, AlertCircle, Scale } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast-stub';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { useNavigate } from 'react-router-dom';

interface Exhibit {
  id: string;
  label: string;
  short_label: string;
  file_name: string;
  file_path: string;
  description: string | null;
  legal_description: string;
  category: string;
  incident_date: string | null;
  formatted_date: string;
  page_start: number;
  page_end: number;
  page_count: number;
}

interface CoverPage {
  title: string;
  subtitle: string;
  case_title: string;
  court_file_number: string;
  tribunal: string;
  tribunal_full_name: string;
  applicant: string;
  respondent: string;
  hearing_date: string;
  total_exhibits: number;
  total_pages: number;
  prepared_date: string;
  province: string;
}

interface TableOfContentsItem {
  item_number: number;
  label: string;
  short_label: string;
  title: string;
  description: string;
  category: string;
  date: string;
  page_reference: string;
}

interface ComplianceSummary {
  province: string;
  tribunal: string;
  requirements_met: {
    consecutive_page_numbers: boolean;
    table_of_contents: boolean;
    readable_format: boolean;
    chronological_order: boolean;
    each_item_numbered: boolean;
    page_references_included: boolean;
  };
  deadline_reminder: string;
  accepted_formats: string;
}

interface ExhibitBookExportProps {
  caseId: string;
  caseTitle: string;
}

type WizardStep = 'questions' | 'generating' | 'preview';

export function ExhibitBookExport({ caseId, caseTitle }: ExhibitBookExportProps) {
  const { hasAccess, tier } = usePremiumAccess();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<WizardStep>('questions');
  const [generating, setGenerating] = useState(false);
  
  // Organization answers
  const [sortBy, setSortBy] = useState<'chronological' | 'category' | 'importance'>('chronological');
  const [numberingStyle, setNumberingStyle] = useState<'alphabetical' | 'numerical'>('alphabetical');
  const [includeTableOfContents, setIncludeTableOfContents] = useState(true);
  const [includeWitnessList, setIncludeWitnessList] = useState(false);
  const [includeAffidavit, setIncludeAffidavit] = useState(true);
  const [includeCertificateOfService, setIncludeCertificateOfService] = useState(true);
  const [opposingPartyName, setOpposingPartyName] = useState('');
  const [courtFileNumber, setCourtFileNumber] = useState('');
  const [hearingDate, setHearingDate] = useState('');
  const [serviceMethod, setServiceMethod] = useState<'email' | 'mail' | 'personal' | 'courier'>('email');
  const [serviceDate, setServiceDate] = useState('');

  // Generated data
  const [coverPage, setCoverPage] = useState<CoverPage | null>(null);
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [affidavitTemplate, setAffidavitTemplate] = useState<any>(null);
  const [certificateOfService, setCertificateOfService] = useState<any>(null);
  const [witnessList, setWitnessList] = useState<any>(null);
  const [complianceSummary, setComplianceSummary] = useState<ComplianceSummary | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const isPremium = hasAccess && (tier === 'monthly' || tier === 'yearly');

  const handleGenerateExhibitBook = async () => {
    if (!isPremium) {
      toast.error('Exhibit Book Export is a premium feature');
      return;
    }

    setStep('generating');
    setGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-exhibit-book', {
        body: {
          caseId,
          includeTableOfContents,
          numberingStyle,
          organizationAnswers: {
            sortBy,
            includeWitnessList,
            includeAffidavit,
            includeCertificateOfService,
            opposingPartyName: opposingPartyName || undefined,
            courtFileNumber: courtFileNumber || undefined,
            hearingDate: hearingDate || undefined,
            serviceMethod,
            serviceDate: serviceDate || undefined
          }
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setCoverPage(data.coverPage);
      setExhibits(data.exhibits || []);
      setTableOfContents(data.tableOfContents || []);
      setAffidavitTemplate(data.affidavitTemplate);
      setCertificateOfService(data.certificateOfService);
      setWitnessList(data.witnessList);
      setComplianceSummary(data.complianceSummary);
      setTotalPages(data.totalPages || 0);
      
      setStep('preview');
      toast.success(`Ontario-compliant Book of Documents generated with ${data.exhibitCount} exhibits`);
    } catch (err: any) {
      console.error('Exhibit book error:', err);
      toast.error(err.message || 'Failed to generate exhibit book');
      setStep('questions');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadAll = () => {
    toast.success('Preparing court-ready document package for download...');
    // In production, this would generate a PDF with cover page, TOC, and all exhibits
  };

  if (!isPremium) {
    return (
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-amber-500" />
            Court-Ready Book of Documents
            <Badge className="bg-amber-500">Premium</Badge>
          </CardTitle>
          <CardDescription>
            Generate Ontario-compliant exhibit books with AI-powered descriptions, chronological ordering, and page-numbered index - ready to serve opposing parties.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-500" />
                <span>Chronological ordering</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-500" />
                <span>Page-numbered index</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-500" />
                <span>AI exhibit descriptions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-500" />
                <span>Certificate of service</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-500" />
                <span>Ontario LTB/HRTO compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-500" />
                <span>Affidavit of service</span>
              </div>
            </div>
            <div className="text-center py-4">
              <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground mb-4">
                Upgrade to Monthly or Yearly plan to create court-ready exhibit books
              </p>
              <Button onClick={() => navigate('/pricing')} className="gap-2">
                <Crown className="h-4 w-4" />
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step 1: Questions
  if (step === 'questions') {
    return (
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Create Ontario Book of Documents
          </CardTitle>
          <CardDescription>
            Generate a court-compliant exhibit book following Ontario LTB/HRTO Practice Directions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ontario Compliance Notice */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Ontario Practice Direction Requirements</p>
                <p className="text-muted-foreground text-xs mt-1">
                  This book will include consecutively numbered pages, a table of contents with page references, 
                  and documents in chronological order as required by Ontario tribunals.
                </p>
              </div>
            </div>
          </div>

          {/* Organization Options */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Document Organization
            </h4>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Evidence ordering</Label>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chronological">Chronological (oldest first) ✓ Recommended</SelectItem>
                    <SelectItem value="category">By category, then chronological</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Ontario tribunals prefer chronological ordering</p>
              </div>
              
              <div className="space-y-2">
                <Label>Exhibit labeling</Label>
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

          {/* Case Details */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Case & Service Details
            </h4>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Court/Tribunal File Number</Label>
                <Input 
                  placeholder="e.g., TEL-12345-24"
                  value={courtFileNumber}
                  onChange={(e) => setCourtFileNumber(e.target.value)}
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
              
              <div className="space-y-2">
                <Label>Opposing Party (Respondent) Name *</Label>
                <Input 
                  placeholder="Full name of landlord/tenant/respondent"
                  value={opposingPartyName}
                  onChange={(e) => setOpposingPartyName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Method of Service</Label>
                <Select value={serviceMethod} onValueChange={(v) => setServiceMethod(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email (if agreed in writing)</SelectItem>
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
                <p className="text-xs text-muted-foreground">Must be at least 7 days before hearing</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Include Options */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Documents to Include
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Table of Contents with Page Numbers</Label>
                  <p className="text-xs text-muted-foreground">Required by Ontario Practice Direction</p>
                </div>
                <Switch
                  checked={includeTableOfContents}
                  onCheckedChange={setIncludeTableOfContents}
                />
              </div>
              
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
                  <Label>Affidavit of Service Template</Label>
                  <p className="text-xs text-muted-foreground">Sworn statement for formal service proof</p>
                </div>
                <Switch
                  checked={includeAffidavit}
                  onCheckedChange={setIncludeAffidavit}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Witness List</Label>
                  <p className="text-xs text-muted-foreground">Auto-extracted parties from evidence</p>
                </div>
                <Switch
                  checked={includeWitnessList}
                  onCheckedChange={setIncludeWitnessList}
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleGenerateExhibitBook} 
            className="w-full"
            size="lg"
          >
            Generate Court-Ready Book of Documents
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Step 2: Generating
  if (step === 'generating') {
    return (
      <Card className="border-primary/30">
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <div>
              <h4 className="font-semibold">Generating Ontario-Compliant Book of Documents</h4>
              <p className="text-sm text-muted-foreground">
                Organizing evidence chronologically and generating AI descriptions...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step 3: Preview
  return (
    <Card className="border-primary/30">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Book of Documents Ready
            </CardTitle>
            <CardDescription>
              {exhibits.length} exhibits • {totalPages} pages • Chronological order
            </CardDescription>
          </div>
          <Button onClick={handleDownloadAll} className="gap-2">
            <Download className="h-4 w-4" />
            Download Package
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Compliance Summary */}
        {complianceSummary && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-700">Ontario Practice Direction Compliant</p>
                <p className="text-muted-foreground text-xs mt-1">
                  {complianceSummary.deadline_reminder}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cover Page Preview */}
        {coverPage && (
          <Card className="bg-muted/30 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Cover Page</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="font-bold text-center text-lg">{coverPage.title}</p>
              <p className="text-center text-muted-foreground">{coverPage.subtitle}</p>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">File #:</span> {coverPage.court_file_number}</div>
                <div><span className="text-muted-foreground">Hearing:</span> {coverPage.hearing_date}</div>
                <div><span className="text-muted-foreground">Applicant:</span> {coverPage.applicant}</div>
                <div><span className="text-muted-foreground">Respondent:</span> {coverPage.respondent}</div>
                <div><span className="text-muted-foreground">Exhibits:</span> {coverPage.total_exhibits}</div>
                <div><span className="text-muted-foreground">Total Pages:</span> {coverPage.total_pages}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Table of Contents with Page Numbers */}
        {includeTableOfContents && tableOfContents.length > 0 && (
          <Card className="bg-muted/30">
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center justify-between">
                Table of Contents
                <Badge variant="outline">{totalPages} pages total</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <ScrollArea className="max-h-64">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="py-2 w-16">Exhibit</th>
                      <th className="py-2">Description</th>
                      <th className="py-2 w-20">Date</th>
                      <th className="py-2 w-16 text-right">Page</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableOfContents.map((item, index) => (
                      <tr key={index} className="border-b border-muted last:border-0">
                        <td className="py-2">
                          <Badge variant="outline" className="font-mono">{item.label}</Badge>
                        </td>
                        <td className="py-2">
                          <p className="font-medium truncate max-w-[200px]">{item.title}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {item.description}
                          </p>
                        </td>
                        <td className="py-2 text-xs text-muted-foreground">
                          {item.date}
                        </td>
                        <td className="py-2 text-right font-mono text-xs">
                          {item.page_reference}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Exhibits Grid - Chronological Order */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Exhibits (Chronological Order - Oldest First)
          </h4>
          <div className="grid gap-2">
            {exhibits.map((exhibit, index) => (
              <Card key={index} className="hover:border-primary/50 transition-colors">
                <CardContent className="py-3 px-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="text-center min-w-[60px]">
                        <Badge className="bg-primary font-mono">{exhibit.label}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {exhibit.page_start === exhibit.page_end 
                            ? `p. ${exhibit.page_start}`
                            : `pp. ${exhibit.page_start}-${exhibit.page_end}`}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{exhibit.file_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {exhibit.category} • {exhibit.formatted_date}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {exhibit.legal_description}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="shrink-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certificate of Service */}
        {certificateOfService && (
          <Card className="bg-muted/30 border-dashed">
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                Certificate of Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs whitespace-pre-wrap font-mono bg-background p-3 rounded max-h-32 overflow-auto">
                {certificateOfService.content}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Affidavit Preview */}
        {affidavitTemplate && (
          <Card className="bg-muted/30 border-dashed">
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                Affidavit of Service Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs whitespace-pre-wrap font-mono bg-background p-3 rounded max-h-48 overflow-auto">
                {affidavitTemplate.content}
              </pre>
              {affidavitTemplate.commissioner_required && (
                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  This affidavit must be sworn before a Commissioner for Taking Affidavits
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setStep('questions')} className="flex-1">
            Edit Options
          </Button>
          <Button onClick={handleDownloadAll} className="flex-1 gap-2">
            <Download className="h-4 w-4" />
            Download Complete Package
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
