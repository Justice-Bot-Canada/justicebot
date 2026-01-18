import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileText, Download, Copy, BookOpen, RefreshCw } from 'lucide-react';
import { useSmartDocument, DocumentType, ToneType, CaseContext } from '@/hooks/useSmartDocument';
import { toast } from '@/hooks/use-toast';
import { DocumentGenerationPaywall } from '@/components/paywalls';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NextStepsActionPanel } from '@/components/NextStepsActionPanel';
import { analytics } from '@/utils/analytics';

interface SavedResearch {
  id: string;
  content: string;
  created_at: string;
}

export function SmartDocumentGenerator() {
  const { hasAccess, isFreeUser } = usePremiumAccess();
  const { user } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);
  const { loading, document: generatedDoc, generateDocument, clearDocument } = useSmartDocument();
  const isGenerating = useRef(false); // Prevent double submissions
  
  const [documentType, setDocumentType] = useState<DocumentType>('demand_letter');
  const [tone, setTone] = useState<ToneType>('formal');
  const [cases, setCases] = useState<{ id: string; title: string }[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [savedResearch, setSavedResearch] = useState<SavedResearch[]>([]);
  const [loadingResearch, setLoadingResearch] = useState(false);
  const [caseContext, setCaseContext] = useState<CaseContext>({
    caseType: '',
    province: 'ON',
    parties: {
      applicant: '',
      respondent: '',
    },
    facts: '',
    issues: '',
    evidence: [],
    desiredOutcome: '',
  });

  // Load user's cases
  useEffect(() => {
    if (!user) return;
    
    const loadCases = async () => {
      try {
        const { data, error } = await supabase
          .from('cases')
          .select('id, title')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (error) throw error;
        setCases(data || []);
      } catch (error) {
        console.error('Error loading cases:', error);
      }
    };
    
    loadCases();
  }, [user]);

  // Load saved research when case is selected
  useEffect(() => {
    if (!selectedCaseId || !user) {
      setSavedResearch([]);
      return;
    }
    
    const loadResearch = async () => {
      setLoadingResearch(true);
      try {
        const { data, error } = await supabase
          .from('case_notes')
          .select('id, content, created_at')
          .eq('case_id', selectedCaseId)
          .eq('note_type', 'legal_research')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setSavedResearch(data || []);
      } catch (error) {
        console.error('Error loading research:', error);
      } finally {
        setLoadingResearch(false);
      }
    };
    
    loadResearch();
  }, [selectedCaseId, user]);

  const applyResearchToContext = (research: SavedResearch) => {
    // Extract relevant info and add to evidence/issues
    const currentEvidence = caseContext.evidence || [];
    const researchSummary = research.content.split('\n').slice(0, 5).join('\n'); // First 5 lines
    
    setCaseContext({
      ...caseContext,
      evidence: [...currentEvidence, researchSummary],
      issues: caseContext.issues 
        ? `${caseContext.issues}\n\nSupporting case law:\n${researchSummary}`
        : `Supporting case law:\n${researchSummary}`,
    });
    
    toast({
      title: "Research Applied",
      description: "Case law has been added to your document context",
    });
  };

  const handleGenerateClick = async () => {
    // Prevent double submissions
    if (isGenerating.current || loading) {
      toast({
        title: "Please Wait",
        description: "Document generation is already in progress",
      });
      return;
    }

    if (!caseContext.facts || !caseContext.issues) {
      toast({
        title: "Missing Information",
        description: "Please provide case facts and key issues.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has access, if not show paywall
    if (!hasAccess && !isFreeUser) {
      setShowPaywall(true);
      return;
    }

    isGenerating.current = true;
    try {
      const result = await generateDocument({ documentType, tone, caseContext });
      // Fire GA4 generate_document event ONLY on successful generation
      if (result) {
        analytics.generateDocumentGA4(documentType, selectedCaseId);
      }
    } finally {
      isGenerating.current = false;
    }
  };

  const handlePaywallConfirm = async () => {
    setShowPaywall(false);
    isGenerating.current = true;
    try {
      await generateDocument({ documentType, tone, caseContext });
    } finally {
      isGenerating.current = false;
    }
  };

  const handleCopy = () => {
    if (generatedDoc) {
      navigator.clipboard.writeText(generatedDoc);
      toast({
        title: "Copied",
        description: "Document copied to clipboard",
      });
    }
  };

  const handleDownload = () => {
    if (generatedDoc) {
      const blob = new Blob([generatedDoc], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `${documentType}_${Date.now()}.txt`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Downloaded",
        description: "Document saved successfully",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Smart Document Drafter</h1>
        <p className="text-muted-foreground">AI-powered legal document generation with customizable tone</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Document Configuration</CardTitle>
            <CardDescription>Select document type, tone, and provide case details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Case Selection for Research */}
            {user && cases.length > 0 && (
              <div className="space-y-2">
                <Label>Link to Case (for saved research)</Label>
                <Select value={selectedCaseId} onValueChange={setSelectedCaseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a case..." />
                  </SelectTrigger>
                  <SelectContent>
                    {cases.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Saved Research */}
            {selectedCaseId && savedResearch.length > 0 && (
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <p className="font-medium mb-2">Saved Legal Research ({savedResearch.length})</p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {savedResearch.map((r) => (
                      <div key={r.id} className="flex items-center justify-between text-xs bg-white dark:bg-background p-2 rounded">
                        <span className="truncate flex-1 mr-2">
                          {r.content.split('\n')[0].slice(0, 50)}...
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => applyResearchToContext(r)}
                          className="h-6 text-xs"
                        >
                          Use
                        </Button>
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {loadingResearch && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading saved research...
              </div>
            )}

            {/* Document Type */}
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={documentType} onValueChange={(value) => setDocumentType(value as DocumentType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demand_letter">Demand Letter</SelectItem>
                  <SelectItem value="affidavit">Affidavit</SelectItem>
                  <SelectItem value="witness_statement">Witness Statement</SelectItem>
                  <SelectItem value="settlement_offer">Settlement Offer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tone */}
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(value) => setTone(value as ToneType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal - Professional & Neutral</SelectItem>
                  <SelectItem value="assertive">Assertive - Confident & Direct</SelectItem>
                  <SelectItem value="conciliatory">Conciliatory - Collaborative & Solution-Focused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Province */}
            <div className="space-y-2">
              <Label>Province</Label>
              <Select 
                value={caseContext.province} 
                onValueChange={(value) => setCaseContext({ ...caseContext, province: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ON">Ontario</SelectItem>
                  <SelectItem value="BC">British Columbia</SelectItem>
                  <SelectItem value="AB">Alberta</SelectItem>
                  <SelectItem value="QC">Quebec</SelectItem>
                  <SelectItem value="MB">Manitoba</SelectItem>
                  <SelectItem value="SK">Saskatchewan</SelectItem>
                  <SelectItem value="NS">Nova Scotia</SelectItem>
                  <SelectItem value="NB">New Brunswick</SelectItem>
                  <SelectItem value="PE">Prince Edward Island</SelectItem>
                  <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Case Type */}
            <div className="space-y-2">
              <Label>Case Type</Label>
              <Input
                placeholder="e.g., Landlord-Tenant, Small Claims, Human Rights"
                value={caseContext.caseType}
                onChange={(e) => setCaseContext({ ...caseContext, caseType: e.target.value })}
              />
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Applicant/Plaintiff</Label>
                <Input
                  placeholder="Your name"
                  value={caseContext.parties?.applicant}
                  onChange={(e) => setCaseContext({ 
                    ...caseContext, 
                    parties: { ...caseContext.parties, applicant: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Respondent/Defendant</Label>
                <Input
                  placeholder="Other party name"
                  value={caseContext.parties?.respondent}
                  onChange={(e) => setCaseContext({ 
                    ...caseContext, 
                    parties: { ...caseContext.parties, respondent: e.target.value }
                  })}
                />
              </div>
            </div>

            {/* Facts */}
            <div className="space-y-2">
              <Label>Case Facts *</Label>
              <Textarea
                placeholder="Describe what happened, when, and relevant background..."
                rows={4}
                value={caseContext.facts}
                onChange={(e) => setCaseContext({ ...caseContext, facts: e.target.value })}
              />
            </div>

            {/* Issues */}
            <div className="space-y-2">
              <Label>Key Issues *</Label>
              <Textarea
                placeholder="What are the main legal issues or disputes?"
                rows={3}
                value={caseContext.issues}
                onChange={(e) => setCaseContext({ ...caseContext, issues: e.target.value })}
              />
            </div>

            {/* Desired Outcome */}
            <div className="space-y-2">
              <Label>Desired Outcome</Label>
              <Textarea
                placeholder="What resolution are you seeking?"
                rows={2}
                value={caseContext.desiredOutcome}
                onChange={(e) => setCaseContext({ ...caseContext, desiredOutcome: e.target.value })}
              />
            </div>

            <Button 
              onClick={handleGenerateClick} 
              disabled={loading || isGenerating.current}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating... Please wait
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Document
                </>
              )}
            </Button>

            {loading && (
              <p className="text-xs text-center text-muted-foreground">
                This may take 15-30 seconds. Do not refresh the page.
              </p>
            )}

            <DocumentGenerationPaywall
              open={showPaywall}
              onOpenChange={setShowPaywall}
              onConfirm={handlePaywallConfirm}
              documentType={documentType.replace('_', ' ')}
            />
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Document</CardTitle>
            <CardDescription>AI-generated document ready for review and customization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedDoc ? (
              <>
                <div className="flex gap-2 mb-4">
                  <Button onClick={handleCopy} variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button onClick={handleDownload} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button onClick={clearDocument} variant="outline" size="sm">
                    Clear
                  </Button>
                </div>
                <div className="p-4 bg-muted rounded-lg max-h-[600px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-mono text-sm">{generatedDoc}</pre>
                </div>

                {/* What Happens Next - Action Panel */}
                <NextStepsActionPanel 
                  caseId={selectedCaseId} 
                  variant="compact" 
                  className="mt-4" 
                />
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Your generated document will appear here</p>
                <p className="text-sm mt-2">Fill in the case details and click Generate Document</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
