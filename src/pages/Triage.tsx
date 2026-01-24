import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast-stub";
import { FlowHeader } from "@/components/FlowHeader";
import { FlowProgressIndicator } from "@/components/FlowProgressIndicator";
import { RelatedPages } from "@/components/RelatedPages";
import CanonicalURL from "@/components/CanonicalURL";
import EnhancedSEO from "@/components/EnhancedSEO";
import SmartTriageForm from "@/components/SmartTriageForm";
import { CaseAssessmentScreen } from "@/components/CaseAssessmentScreen";
import { useDecisionEngine } from "@/hooks/useDecisionEngine";
import { TriageDiscountModal } from "@/components/TriageDiscountModal";
import { TriageDocumentUpload, PendingDocument } from "@/components/TriageDocumentUpload";
import { BookOfDocumentsWizard } from "@/components/BookOfDocumentsWizard";
import SaveCaseSignupModal from "@/components/SaveCaseSignupModal";
import { ProgramBanner, useShouldHidePricing } from "@/components/ProgramBanner";
import { CourtReadyPaywall } from "@/components/CourtReadyPaywall";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, BookOpen, FileCheck, ArrowRight, ArrowLeft, Save, Shield, Sparkles, CheckCircle, Info } from "lucide-react";
import { analytics, trackEvent } from "@/utils/analytics";
import { useProgramCaseFields } from "@/hooks/useProgramCaseFields";
import { useProgram } from "@/contexts/ProgramContext";
import type { DecisionResult, FormRecommendation as DecisionFormRec } from "@/types/decisionEngine";
import type { EvidenceItem } from "@/types/decisionEngine";

interface FormRecommendation {
  formCode: string;
  formTitle: string;
  confidence: number;
  reason: string;
  tribunalType: string;
  priority: 'primary' | 'secondary' | 'optional';
}

interface TriageResult {
  venue: string;
  venueTitle: string;
  confidence: number;
  reasoning: string;
  urgentDeadlines: string[];
  recommendedForms: FormRecommendation[];
  nextSteps: string[];
  followUpQuestions?: string[];
  flags: string[];
  alternativeVenues?: { venue: string; reason: string }[];
}

type TriageProps = {
  /** When provided (e.g. from /case/:caseId), it takes precedence over ?caseId=. */
  initialCaseId?: string;
};

const Triage = ({ initialCaseId }: TriageProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const programCaseFields = useProgramCaseFields();
  const { program, isProgramMode } = useProgram();
  const { hasAccess, isProgramUser, loading: accessLoading } = usePremiumAccess();
  const shouldHidePricing = useShouldHidePricing();
  const [step, setStep] = useState(0);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [userDescription, setUserDescription] = useState("");
  const [province, setProvince] = useState("Ontario");
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [pendingDocuments, setPendingDocuments] = useState<PendingDocument[]>([]);
  const [isSavingDocuments, setIsSavingDocuments] = useState(false);
  const [createdCaseId, setCreatedCaseId] = useState<string | null>(null);
  const [showBookWizard, setShowBookWizard] = useState(false);
  const [uploadedEvidenceCount, setUploadedEvidenceCount] = useState(0);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState<{
    result: TriageResult;
    description: string;
    prov: string;
    evidenceCount?: number;
  } | null>(null);
  
  // Decision Engine state - stores the full DecisionResult
  const [decisionResult, setDecisionResult] = useState<DecisionResult | null>(null);
  // Access error state: shows friendly message instead of 404
  const [caseAccessError, setCaseAccessError] = useState<string | null>(null);
  const { runDecisionEngine, loading: decisionLoading, error: decisionError } = useDecisionEngine({
    onSuccess: (result) => {
      console.log('[Triage] Decision engine success:', result.merit.score, result.merit.band);
      setDecisionResult(result);
    },
    onError: (err) => {
      console.error('[Triage] Decision engine error:', err);
      toast.error('We could not generate your assessment. Please retry.');
    }
  });
  
  // Check if user should see paywall (after triage, before evidence)
  const userHasAccess = hasAccess || isProgramUser || shouldHidePricing;

  const mapFileToEvidenceType = (fileType: string | null, fileName: string | null): EvidenceItem['type'] => {
    const mime = (fileType || '').toLowerCase();
    const name = (fileName || '').toLowerCase();
    if (mime.startsWith('image/') || name.match(/\.(png|jpg|jpeg|webp|gif)$/)) return 'photo';
    if (mime.startsWith('video/') || name.match(/\.(mp4|mov|webm)$/)) return 'video';
    if (mime.includes('pdf') || name.endsWith('.pdf')) return 'other';
    // Heuristic by name
    if (name.includes('email')) return 'email';
    if (name.includes('text') || name.includes('sms') || name.includes('message')) return 'text';
    if (name.includes('notice') || name.includes('n4') || name.includes('n12')) return 'notice';
    if (name.includes('receipt') || name.includes('invoice')) return 'receipt';
    if (name.includes('medical') || name.includes('doctor')) return 'medical';
    if (name.includes('inspection')) return 'inspection';
    return 'other';
  };

  const inferTagsFromName = (fileName: string | null): string[] => {
    const n = (fileName || '').toLowerCase();
    const tags: string[] = [];
    if (n.includes('repair') || n.includes('maintenance')) tags.push('repairs');
    if (n.includes('pest') || n.includes('cockroach') || n.includes('bedbug') || n.includes('mice')) tags.push('pests');
    if (n.includes('mold') || n.includes('mould')) tags.push('mold');
    if (n.includes('notice') || n.includes('n4') || n.includes('n12')) tags.push('notice');
    if (n.includes('threat') || n.includes('harass')) tags.push('harassment');
    if (n.includes('evict')) tags.push('eviction');
    return tags;
  };

  const uploadPendingDocumentsToCase = async (caseId: string, venueTitle: string) => {
    if (!user) return;
    if (pendingDocuments.length === 0) return;

    for (const doc of pendingDocuments) {
      if (doc.status === 'uploaded') continue;
      try {
        setPendingDocuments(prev =>
          prev.map(d => d.id === doc.id ? { ...d, status: 'uploading' as const, progress: 20 } : d)
        );

        const filePath = `${user.id}/${caseId}/${Date.now()}_${doc.file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('evidence')
          .upload(filePath, doc.file);

        if (uploadError) throw uploadError;

        setPendingDocuments(prev =>
          prev.map(d => d.id === doc.id ? { ...d, progress: 60 } : d)
        );

        const { data: evidenceRow, error: evidenceError } = await supabase
          .from('evidence')
          .insert({
            case_id: caseId,
            file_name: doc.file.name,
            file_path: filePath,
            file_type: doc.file.type,
            description: `Uploaded during triage - ${venueTitle}`,
            upload_date: new Date().toISOString(),
            tags: inferTagsFromName(doc.file.name),
          })
          .select('id')
          .single();

        if (evidenceError) throw evidenceError;

        setPendingDocuments(prev =>
          prev.map(d => d.id === doc.id ? { ...d, status: 'uploaded' as const, progress: 100 } : d)
        );

        // Queue AI analysis (async)
        const reader = new FileReader();
        reader.onload = async (e) => {
          const content = e.target?.result as string;
          if (content && content.length > 0) {
            supabase.functions.invoke('analyze-document', {
              body: {
                fileContent: content.substring(0, 50000),
                fileName: doc.file.name,
                caseId,
                evidenceId: evidenceRow?.id,
              }
            }).catch(err => console.warn('Document analysis queued:', err));
          }
        };
        reader.readAsText(doc.file);
      } catch (docError) {
        console.error('Error uploading document:', doc.file.name, docError);
        setPendingDocuments(prev =>
          prev.map(d => d.id === doc.id ? { ...d, status: 'error' as const, error: 'Upload failed' } : d)
        );
      }
    }
  };

  /**
   * Strict UUID validation - enforces version (1-5) and variant (8/9/a/b).
   * Runs synchronously with ZERO network calls.
   */
  const isValidUUID = (str: string): boolean => {
    if (!str || typeof str !== 'string') return false;
    // Version 1-5 at position 15, variant 8/9/a/b at position 20
    const strictUUIDRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return strictUUIDRegex.test(str);
  };

  // Load case from DB - only called with validated UUID
  const loadPersistedDecision = async (caseId: string): Promise<DecisionResult | null> => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('decision_result_json, triage, province, description, venue')
        .eq('id', caseId)
        .single();

      if (error) {
        // Handle RLS/auth errors gracefully
        if (error.code === 'PGRST116' || error.message?.includes('not found')) {
          setCaseAccessError("This case doesn't exist or you don't have permission to view it.");
        } else if (error.code === '42501' || error.message?.includes('permission')) {
          setCaseAccessError("You don't have permission to access this case. Please sign in.");
        } else {
          setCaseAccessError("We couldn't load your case. Please try again or start a new assessment.");
        }
        console.warn('[Triage] Case access error:', error);
        return null;
      }

      if (data?.triage) {
        setTriageResult(data.triage as any);
      }
      if (data?.province) setProvince(data.province);
      if (typeof data?.description === 'string') setUserDescription(data.description);

      const persisted = (data?.decision_result_json || null) as unknown as DecisionResult | null;
      if (persisted) {
        setDecisionResult(persisted);
        setStep(1);
      }
      return persisted;
    } catch (err) {
      console.error('[Triage] Unexpected error loading case:', err);
      setCaseAccessError("Something went wrong. Please start a new assessment.");
      return null;
    }
  };

  // SYNCHRONOUS validation on mount - sets error state BEFORE any async work
  useEffect(() => {
    const LAST_CASE_KEY = 'jb_last_case_id';
    // Prefer a path param (/case/:caseId) when present, otherwise fall back to query param.
    let caseId = (typeof initialCaseId === 'string' && initialCaseId.length > 0)
      ? initialCaseId
      : searchParams.get('caseId');
    
    // Fallback: if no caseId in URL but one saved in localStorage (only for logged-in users)
    if (!caseId && user) {
      const savedCaseId = localStorage.getItem(LAST_CASE_KEY);
      if (savedCaseId && isValidUUID(savedCaseId)) {
        caseId = savedCaseId;
        setSearchParams({ caseId }, { replace: true });
      } else if (savedCaseId) {
        // localStorage has invalid UUID - clear it
        localStorage.removeItem(LAST_CASE_KEY);
      }
    }
    
    // No caseId = fresh start, nothing to load
    if (!caseId) {
      setCaseAccessError(null);
      return;
    }
    
    // SYNCHRONOUS UUID check - sets error immediately, no network call
    if (!isValidUUID(caseId)) {
      setCaseAccessError("Invalid case ID format. Please start a new assessment.");
      console.warn('[Triage] Invalid UUID format (blocked):', caseId);
      // Do NOT call loadPersistedDecision - zero network requests
      return;
    }
    
    // Valid UUID - proceed with DB fetch
    setCaseAccessError(null);
    setCreatedCaseId(caseId);
    loadPersistedDecision(caseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, initialCaseId]);
  
  // Persist lastCaseId to localStorage only after successful persistence
  useEffect(() => {
    const LAST_CASE_KEY = 'jb_last_case_id';
    // Only store if we have a valid caseId AND a decision result (proves DB persistence)
    if (createdCaseId && user && decisionResult && isValidUUID(createdCaseId)) {
      localStorage.setItem(LAST_CASE_KEY, createdCaseId);
    }
  }, [createdCaseId, user, decisionResult]);

  const handleTriageComplete = async (result: TriageResult, description: string, prov: string, evidenceCount?: number) => {
    setTriageResult(result);
    setUserDescription(description);
    setProvince(prov);
    setUploadedEvidenceCount(evidenceCount || 0);

    // Non-negotiable: case must exist before decision-engine so we can persist.
    if (!user) {
      setPendingSubmission({ result, description, prov, evidenceCount });
      setShowAuthDialog(true);
      return;
    }

    setDecisionResult(null);
    
    // IMMEDIATELY call decision engine after smart-triage
    console.log('[Triage] Calling decision engine with:', {
      story_length: description.length,
      province: prov,
      venue_hint: result.venue,
    });
    
    // 1) Create case row first
    const { data: caseRow, error: caseErr } = await supabase
      .from('cases')
      .insert({
        user_id: user.id,
        title: `${result.venueTitle} Case`,
        description,
        venue: result.venue,
        province: prov,
        status: 'analyzing',
        triage: {
          venue: result.venue,
          venueTitle: result.venueTitle,
          confidence: result.confidence,
          reasoning: result.reasoning,
          recommendedForms: result.recommendedForms,
          flags: result.flags,
        } as any,
        ...programCaseFields,
      })
      .select('id')
      .single();

    if (caseErr) {
      console.error('[Triage] Failed to create case before decision engine:', caseErr);
      toast.error('Could not create your case. Please retry.');
      return;
    }

    const caseId = caseRow.id as string;
    setCreatedCaseId(caseId);
    setSearchParams({ caseId }, { replace: true });

    // 2) Ensure any pending uploads become real evidence rows before scoring
    await uploadPendingDocumentsToCase(caseId, result.venueTitle);

    // 3) Pull real evidence metadata from DB and send to decision-engine
    const { data: evidenceRows } = await supabase
      .from('evidence')
      .select('id, file_type, file_name, tags, upload_date')
      .eq('case_id', caseId);

    const evidence: EvidenceItem[] = (evidenceRows || []).map((e: any) => ({
      file_id: e.id,
      type: mapFileToEvidenceType(e.file_type, e.file_name),
      tags: Array.isArray(e.tags) && e.tags.length ? e.tags : inferTagsFromName(e.file_name),
      date: typeof e.upload_date === 'string' ? e.upload_date.slice(0, 10) : undefined,
      file_name: e.file_name,
    }));

    // 4) Call decision engine with REAL case_id
    await runDecisionEngine({
      storyText: description,
      province: prov,
      venueHint: result.venue,
      issueTags: result.flags || [],
      evidence,
      userAnswers: {
        health_impact: result.flags?.includes('health') || false,
        disability_related: result.flags?.includes('disability') || false,
      },
    }, caseId);

    // 5) Render from saved result (single truth)
    await loadPersistedDecision(caseId);
    
    // Move to step 1 (Assessment screen) AFTER decision engine returns
    setStep(1);
    
    // Track triage completion events
    analytics.triageComplete(result.venue);
    analytics.triageCompletedEvent(result.venue, prov);
    
    // Track case snapshot shown (Step 2 of funnel)
    const meritScore = decisionResult?.merit?.score || result.confidence;
    analytics.caseSnapshotShown(result.venue, meritScore);
    
    // Pipeline event with rich payload
    analytics.triageCompleted({
      recommendedJourney: result.venue,
      meritScore: Math.round(meritScore),
      groundsDetected: result.flags || [],
      dualPathway: (result.alternativeVenues?.length || 0) > 0,
      userLoggedIn: !!user,
    });
    trackEvent('triage_complete', { 
      venue: result.venue, 
      confidence: result.confidence,
      merit_score: decisionResult?.merit?.score,
      province: prov,
      evidenceCount: evidenceCount || 0
    });
    
    // Track program-specific intake completion
    if (isProgramMode && program) {
      analytics.programIntakeCompleted(program.id, result.venue);
    }
    
    // Show discount modal after triage (only once per session) - but not if they have evidence ready
    const hasEvidenceReady = result.flags?.includes('evidence-ready') || result.flags?.includes('book-of-documents-recommended');
    const hasSeenOffer = sessionStorage.getItem('triage_discount_shown');
    if (!hasSeenOffer && !hasEvidenceReady) {
      setTimeout(() => {
        setShowDiscountModal(true);
        sessionStorage.setItem('triage_discount_shown', 'true');
      }, 1500);
    }
  };
  
  // Check if user should be prompted to build Book of Documents
  const shouldShowBookOfDocuments = triageResult && (
    triageResult.flags?.includes('evidence-ready') ||
    triageResult.flags?.includes('book-of-documents-recommended') ||
    uploadedEvidenceCount >= 3 ||
    pendingDocuments.length >= 3
  );

  const handleProceed = async (goToBookOfDocs = false, preselectFormCode?: string) => {
    if (!user) {
      toast.error("Please sign in to continue");
      navigate("/");
      return;
    }

    if (!triageResult) return;

    // Case should already exist (created before decision engine). If not, block.
    if (!createdCaseId) {
      toast.error('Missing case ID. Please retry the assessment.');
      setStep(0);
      return;
    }

    setIsSavingDocuments(true);

    try {
      await uploadPendingDocumentsToCase(createdCaseId, triageResult.venueTitle);

      toast.success("Continuing with your case...");

      if (goToBookOfDocs) {
        setShowBookWizard(true);
      } else {
        const recommendedForm = typeof preselectFormCode === 'string' && preselectFormCode.trim().length > 0
          ? `&recommendedForm=${encodeURIComponent(preselectFormCode.trim())}`
          : '';

        // CASE-SCOPED ROUTING: Navigate to /case/:caseId/pathways (path-based, not query params)
        navigate(`/case/${createdCaseId}/pathways`, {
          state: {
            caseId: createdCaseId,
            userInput: userDescription,
            province,
            triageResult,
          }
        });
      }
    } catch (error) {
      console.error("Error creating case:", error);
      toast.error("Failed to create case");
    } finally {
      setIsSavingDocuments(false);
    }
  };

  const handleBuildBookOfDocuments = () => {
    handleProceed(true);
  };

  const handleSelectForm = (form: FormRecommendation) => {
    if (!user) {
      toast.error("Please sign in to access forms");
      navigate("/");
      return;
    }

    handleProceed(false, form.formCode);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Smart Legal Triage Tool",
    "description": "AI-powered legal triage to determine the best legal pathway and forms for your situation in Ontario",
    "url": "https://www.justice-bot.com/triage",
    "applicationCategory": "LegalService",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CAD"
    }
  };

  const relatedPages = [
    {
      title: "Small Claims Court Guide",
      description: "Learn how to file claims under $35,000",
      path: "/small-claims",
      icon: "calculator" as const,
      category: "Court"
    },
    {
      title: "LTB Filing Help",
      description: "Landlord Tenant Board application assistance",
      path: "/ltb-help",
      icon: "file" as const,
      category: "Tribunal"
    },
    {
      title: "Human Rights Claims",
      description: "File discrimination complaints with HRTO",
      path: "/hrto-help",
      icon: "help" as const,
      category: "Tribunal"
    },
    {
      title: "Family Law Guide",
      description: "Divorce, custody, and support matters",
      path: "/family-law-guide",
      icon: "book" as const,
      category: "Court"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CanonicalURL />
      <EnhancedSEO
        title="Free AI Legal Triage Tool - Find Your Legal Pathway | Justice-Bot"
        description="Use our smart AI-powered legal triage to instantly determine if you need Small Claims Court, LTB, HRTO, Family Court, or other tribunals. Get personalized form recommendations and next steps."
        keywords="legal triage, legal pathway finder, Canada legal help, legal assessment tool, smart legal triage, AI legal help, form recommendation"
        structuredData={structuredData}
      />
      <FlowHeader currentStep="triage" />
      <ProgramBanner />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-6">
            <FlowProgressIndicator currentStep="triage" />
          </div>

          {/* Step header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">AI Legal Triage</h1>
            <p className="text-muted-foreground">
              Answer a few questions and we'll identify the right legal pathway and forms for your situation.
            </p>
            {step === 0 && (
              <Alert className="mt-4 bg-primary/5 border-primary/20">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Takes about 2 minutes. You can update answers anytime.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Case access error state - shown at top level, not inside step conditions */}
          {caseAccessError && (
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-destructive" />
                  Can't access this case
                </CardTitle>
                <CardDescription>{caseAccessError}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  {!user && (
                    <Button onClick={() => setShowAuthDialog(true)}>
                      Sign in to continue
                    </Button>
                  )}
                  <Button
                    variant={user ? "default" : "outline"}
                    onClick={() => {
                      setCaseAccessError(null);
                      setSearchParams({}, { replace: true });
                      localStorage.removeItem('jb_last_case_id');
                      setStep(0);
                    }}
                  >
                    Start new assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 0 && !caseAccessError && (
            <SmartTriageForm onTriageComplete={handleTriageComplete} />
          )}

          {step === 1 && triageResult && (
            <>
              {/* Save Case CTA for anonymous users - reframed for conversion */}
              {!user && (
                <Card className="mb-6 border-primary bg-gradient-to-r from-primary/10 via-primary/5 to-background overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="flex-shrink-0 p-3 rounded-full bg-primary/20">
                        <Save className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">Save your case and documents</h3>
                          <Badge variant="secondary" className="text-xs">Free</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Create a free account to save your answers, evidence, and access your documents later.
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Save triage results
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Generate documents
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Upload evidence
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Return anytime
                          </span>
                        </div>
                      </div>
                      <Button 
                        size="lg" 
                        onClick={() => setShowAuthDialog(true)}
                        className="whitespace-nowrap"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save my case
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Decision Engine loading state */}
              {decisionLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Analyzing your case...</p>
                </div>
              )}

              {/* NEW: CaseAssessmentScreen when decision engine result is available */}
              {decisionResult && !decisionLoading && (
                <CaseAssessmentScreen
                  result={decisionResult}
                  caseId={createdCaseId || undefined}
                  isPremium={userHasAccess}
                  onGenerateForm={(form) => {
                    if (!user) {
                      setShowAuthDialog(true);
                      return;
                    }
                    // Navigate to form generation
                    handleProceed(false, form.form_code);
                  }}
                  onUploadEvidence={() => {
                    if (!user) {
                      setShowAuthDialog(true);
                      return;
                    }
                    setStep(2); // Go to evidence upload step
                  }}
                />
              )}

              {/* No fallback to old results UI. If decision engine fails, show retry state. */}
              {!decisionResult && !decisionLoading && (
                <Card>
                  <CardHeader>
                    <CardTitle>We couldn’t generate your assessment</CardTitle>
                    <CardDescription>
                      Your case was saved. Please retry to generate your Merit Score and recommended pathway.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {decisionError && (
                      <Alert>
                        <AlertDescription>
                          {decisionError.message}
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={async () => {
                          if (!triageResult || !createdCaseId) return;
                          try {
                            setDecisionResult(null);
                            await uploadPendingDocumentsToCase(createdCaseId, triageResult.venueTitle);
                            const { data: evidenceRows } = await supabase
                              .from('evidence')
                              .select('id, file_type, file_name, tags, upload_date')
                              .eq('case_id', createdCaseId);

                            const evidence: EvidenceItem[] = (evidenceRows || []).map((e: any) => ({
                              file_id: e.id,
                              type: mapFileToEvidenceType(e.file_type, e.file_name),
                              tags: Array.isArray(e.tags) && e.tags.length ? e.tags : inferTagsFromName(e.file_name),
                              date: typeof e.upload_date === 'string' ? e.upload_date.slice(0, 10) : undefined,
                              file_name: e.file_name,
                            }));

                            await runDecisionEngine({
                              storyText: userDescription,
                              province,
                              venueHint: triageResult.venue,
                              issueTags: triageResult.flags || [],
                              evidence,
                            }, createdCaseId);

                            await loadPersistedDecision(createdCaseId);
                          } catch (e) {
                            console.error('[Triage] Retry failed:', e);
                            toast.error('Retry failed. Please try again.');
                          }
                        }}
                        disabled={!createdCaseId || !triageResult}
                      >
                        Retry assessment
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setStep(2)}
                        disabled={!userHasAccess}
                      >
                        Upload evidence
                      </Button>
                    </div>
                    <Button variant="ghost" onClick={() => setStep(0)}>
                      Back
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Paywall - shown after triage for non-paying users */}
              {showPaywall && !userHasAccess && user && (
                <div className="mt-8">
                  <CourtReadyPaywall
                    triageData={{
                      venue: triageResult.venue,
                      venueTitle: triageResult.venueTitle,
                      province: province,
                      description: userDescription,
                    }}
                    caseId={createdCaseId}
                    onCaseCreated={(newCaseId) => setCreatedCaseId(newCaseId)}
                    onAccessGranted={() => {
                      setShowPaywall(false);
                      setStep(2);
                    }}
                  />
                </div>
              )}

              {/* Document Upload Section - only for logged in users with access */}
              {user && userHasAccess && !showPaywall && (
                <div className="mt-6">
                  <TriageDocumentUpload
                    documents={pendingDocuments}
                    onDocumentsChange={setPendingDocuments}
                    disabled={isSavingDocuments}
                  />
                </div>
              )}

              {/* Prompt to sign up to upload documents */}
              {!user && (
                <Card className="mt-6 border-dashed">
                  <CardContent className="p-6 text-center">
                    <Shield className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <h4 className="font-medium mb-1">Ready to Upload Evidence?</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create a free account to securely upload and store your documents
                    </p>
                    <Button variant="outline" onClick={() => setShowAuthDialog(true)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save & Upload
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              <div className="mt-8">
                <RelatedPages 
                  pages={relatedPages}
                  title="Explore More Resources"
                  description="Get additional help with your legal journey"
                />
              </div>
            </>
          )}

          {/* Step 2: After pathway selection - Book of Documents or Forms */}
          {step === 2 && triageResult && (
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <Button 
                  variant="ghost" 
                  onClick={() => setStep(1)}
                  className="w-fit mb-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Results
                </Button>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <BookOpen className="h-5 w-5" />
                  {shouldShowBookOfDocuments 
                    ? "Build Your Book of Documents" 
                    : "Proceed with Your Case"}
                </CardTitle>
                <CardDescription>
                  {shouldShowBookOfDocuments 
                    ? `You've uploaded ${uploadedEvidenceCount + pendingDocuments.length} document(s). Organize your evidence into a professional Book of Documents for your ${triageResult.venueTitle} hearing.`
                    : `Create your case and proceed to fill out the required forms for ${triageResult.venueTitle}.`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  {shouldShowBookOfDocuments && (
                    <Button 
                      onClick={handleBuildBookOfDocuments} 
                      className="flex-1"
                      disabled={isSavingDocuments}
                    >
                      {isSavingDocuments ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Case...
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Build Book of Documents
                        </>
                      )}
                    </Button>
                  )}
                  <Button 
                    variant={shouldShowBookOfDocuments ? "outline" : "default"}
                    onClick={() => handleProceed(false)}
                    disabled={isSavingDocuments}
                    className="flex-1"
                  >
                    {isSavingDocuments ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Case...
                      </>
                    ) : (
                      <>
                        <FileCheck className="h-4 w-4 mr-2" />
                        {shouldShowBookOfDocuments ? "Skip to Forms" : "Continue to Forms"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
                {shouldShowBookOfDocuments && (
                  <p className="text-xs text-muted-foreground">
                    The Book of Documents wizard will help you organize, label, and compile your evidence 
                    into a tribunal-ready format with proper exhibit labels and indexing.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <TriageDiscountModal 
        isOpen={showDiscountModal} 
        onClose={() => setShowDiscountModal(false)} 
      />
      
      {/* Save Case Signup Modal - post-triage conversion gate */}
      <SaveCaseSignupModal 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
        onSuccess={() => {
          setShowAuthDialog(false);
          // After successful signup, re-run the pending triage submission end-to-end
          if (pendingSubmission) {
            const { result, description, prov, evidenceCount } = pendingSubmission;
            setPendingSubmission(null);
            handleTriageComplete(result, description, prov, evidenceCount);
          }
        }}
        venue={triageResult?.venue}
        venueTitle={triageResult?.venueTitle}
      />
      
      {/* Book of Documents Wizard */}
      {createdCaseId && (
        <BookOfDocumentsWizard
          caseId={createdCaseId}
          caseTitle={triageResult?.venueTitle}
          open={showBookWizard}
          onOpenChange={setShowBookWizard}
        />
      )}
    </div>
  );
};

export default Triage;
