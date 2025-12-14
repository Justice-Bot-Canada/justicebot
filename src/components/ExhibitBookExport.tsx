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
import { Loader2, BookOpen, Download, Crown, FileText, Lock, Calendar, Users, FileCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast-stub';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { useNavigate } from 'react-router-dom';

interface Exhibit {
  id: string;
  label: string;
  file_name: string;
  file_path: string;
  description: string | null;
  legal_description: string;
  category: string;
  incident_date: string | null;
  page_start: number;
  page_end: number;
  page_count: number;
}

interface CoverPage {
  title: string;
  case_title: string;
  court_file_number: string;
  tribunal: string;
  applicant: string;
  respondent: string;
  hearing_date: string;
  total_exhibits: number;
  total_pages: number;
  prepared_date: string;
}

interface TableOfContentsItem {
  label: string;
  title: string;
  description: string;
  category: string;
  date: string | null;
  page_start: number;
  page_end: number;
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
  const [opposingPartyName, setOpposingPartyName] = useState('');
  const [courtFileNumber, setCourtFileNumber] = useState('');
  const [hearingDate, setHearingDate] = useState('');

  // Generated data
  const [coverPage, setCoverPage] = useState<CoverPage | null>(null);
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [affidavitTemplate, setAffidavitTemplate] = useState<any>(null);
  const [witnessList, setWitnessList] = useState<any>(null);
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
            opposingPartyName: opposingPartyName || undefined,
            courtFileNumber: courtFileNumber || undefined,
            hearingDate: hearingDate || undefined
          }
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setCoverPage(data.coverPage);
      setExhibits(data.exhibits || []);
      setTableOfContents(data.tableOfContents || []);
      setAffidavitTemplate(data.affidavitTemplate);
      setWitnessList(data.witnessList);
      setTotalPages(data.totalPages || 0);
      
      setStep('preview');
      toast.success(`Court-ready exhibit book generated with ${data.exhibitCount} exhibits`);
    } catch (err: any) {
      console.error('Exhibit book error:', err);
      toast.error(err.message || 'Failed to generate exhibit book');
      setStep('questions');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadAll = () => {
    toast.success('Downloading exhibit book package...');
    // In production, this would generate a PDF with cover page, TOC, and all exhibits
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isPremium) {
    return (
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Court-Ready Exhibit Book
            <Badge className="bg-amber-500">Premium</Badge>
          </CardTitle>
          <CardDescription>
            Generate professionally organized exhibit books with AI-powered descriptions, chronological ordering, and page-numbered index - ready to serve opposing parties.
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
            <BookOpen className="h-5 w-5 text-primary" />
            Create Court-Ready Exhibit Book
          </CardTitle>
          <CardDescription>
            Answer a few questions to generate a professionally organized exhibit book
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Organization Options */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Organization
            </h4>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>How should exhibits be ordered?</Label>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chronological">Chronological (oldest first)</SelectItem>
                    <SelectItem value="category">By category/type</SelectItem>
                    <SelectItem value="importance">By importance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Exhibit labeling style</Label>
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
              Case Details (for cover page)
            </h4>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Court File Number (if assigned)</Label>
                <Input 
                  placeholder="e.g., CV-24-00012345"
                  value={courtFileNumber}
                  onChange={(e) => setCourtFileNumber(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Hearing Date (if scheduled)</Label>
                <Input 
                  type="date"
                  value={hearingDate}
                  onChange={(e) => setHearingDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <Label>Opposing Party Name</Label>
                <Input 
                  placeholder="Name of respondent/defendant"
                  value={opposingPartyName}
                  onChange={(e) => setOpposingPartyName(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Include Options */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Include in Package
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Table of Contents with Page Numbers</Label>
                  <p className="text-xs text-muted-foreground">Index referencing each exhibit by page</p>
                </div>
                <Switch
                  checked={includeTableOfContents}
                  onCheckedChange={setIncludeTableOfContents}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Affidavit of Service Template</Label>
                  <p className="text-xs text-muted-foreground">Proof of service document for opposing party</p>
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
            Generate Court-Ready Exhibit Book
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
              <h4 className="font-semibold">Generating Court-Ready Exhibit Book</h4>
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Exhibit Book Ready
            </CardTitle>
            <CardDescription>
              {exhibits.length} exhibits • {totalPages} pages • Sorted {sortBy}
            </CardDescription>
          </div>
          <Button onClick={handleDownloadAll} className="gap-2">
            <Download className="h-4 w-4" />
            Download Package
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cover Page Preview */}
        {coverPage && (
          <Card className="bg-muted/30 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Cover Page</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-bold text-center text-lg">{coverPage.title}</p>
              <p className="text-center text-muted-foreground">{coverPage.tribunal}</p>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">File #:</span> {coverPage.court_file_number}</div>
                <div><span className="text-muted-foreground">Hearing:</span> {coverPage.hearing_date}</div>
                <div><span className="text-muted-foreground">Applicant:</span> {coverPage.applicant}</div>
                <div><span className="text-muted-foreground">Respondent:</span> {coverPage.respondent}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Table of Contents */}
        {includeTableOfContents && tableOfContents.length > 0 && (
          <Card className="bg-muted/30">
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center justify-between">
                Table of Contents
                <Badge variant="outline">{totalPages} pages</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <ScrollArea className="max-h-64">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="py-2 w-20">Exhibit</th>
                      <th className="py-2">Description</th>
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
                          <div>
                            <p className="font-medium truncate max-w-[250px]">{item.title}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                              {item.description}
                            </p>
                          </div>
                        </td>
                        <td className="py-2 text-right font-mono text-muted-foreground">
                          {item.page_start === item.page_end 
                            ? item.page_start 
                            : `${item.page_start}-${item.page_end}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Exhibits Grid */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Exhibits (Chronological Order)</h4>
          <div className="grid gap-2">
            {exhibits.map((exhibit, index) => (
              <Card key={index} className="hover:border-primary/50 transition-colors">
                <CardContent className="py-3 px-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="text-center">
                        <Badge className="bg-primary font-mono">{exhibit.label}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          p.{exhibit.page_start}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{exhibit.file_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {exhibit.category} • {formatDate(exhibit.incident_date)}
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
