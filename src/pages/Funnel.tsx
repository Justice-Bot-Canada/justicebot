import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Home, Users, Heart, Scale, FileText, Check, AlertTriangle, MapPin, Shield, Clock, FileCheck } from "lucide-react";
import { trackEvent, analytics } from "@/utils/analytics";
import EnhancedSEO from "@/components/EnhancedSEO";
import SignupWallModal from "@/components/SignupWallModal";
import UpgradeCard from "@/components/UpgradeCard";
import EmailChecklistCapture from "@/components/EmailChecklistCapture";
import UrgencyBlock from "@/components/UrgencyBlock";
import FounderTrustBlock from "@/components/FounderTrustBlock";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
// All Canadian provinces/territories
const PROVINCES = [
  { code: 'ON', name: 'Ontario' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'AB', name: 'Alberta' },
  { code: 'QC', name: 'Quebec' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'YT', name: 'Yukon' }
];

// Legal areas
const LEGAL_AREAS = [
  { id: 'housing', label: 'Housing / Eviction', icon: Home },
  { id: 'family', label: 'Family / Custody', icon: Users },
  { id: 'employment', label: 'Employment', icon: FileText },
  { id: 'human-rights', label: 'Discrimination / Human Rights', icon: Scale },
  { id: 'other', label: 'Other civil issue', icon: FileText }
];

// Triage questions per legal area (yes/no only)
const TRIAGE_QUESTIONS: Record<string, { question: string }[]> = {
  'housing': [
    { question: 'Are you facing eviction?' },
    { question: 'Have you received a notice from your landlord?' },
    { question: 'Is this urgent (less than 5 days)?' }
  ],
  'family': [
    { question: 'Is there an existing court order?' },
    { question: 'Are children involved?' },
    { question: 'Is this urgent or safety-related?' }
  ],
  'employment': [
    { question: 'Have you been terminated?' },
    { question: 'Did this happen in the last 2 years?' },
    { question: 'Is this urgent?' }
  ],
  'human-rights': [
    { question: 'Has the discrimination already happened?' },
    { question: 'Did this happen in the last year?' },
    { question: 'Do you have evidence?' }
  ],
  'other': [
    { question: 'Is there a deadline you need to meet?' },
    { question: 'Is this about money owed to you?' },
    { question: 'Is this urgent?' }
  ]
};

// Tribunal mapping
const getTribunalInfo = (legalArea: string, province: string) => {
  const tribunals: Record<string, Record<string, { name: string; forms: string[]; timeframe: string; fee: string }>> = {
    'ON': {
      'housing': { name: 'Landlord and Tenant Board (LTB)', forms: ['T2', 'T6'], timeframe: '2-4 weeks for hearing', fee: '$53' },
      'human-rights': { name: 'Human Rights Tribunal of Ontario (HRTO)', forms: ['Form 1'], timeframe: '12-18 months', fee: 'Free' },
      'family': { name: 'Ontario Court of Justice - Family Court', forms: ['Form 8', 'Form 13'], timeframe: 'Varies', fee: '$157+' },
      'employment': { name: 'Ontario Labour Relations Board', forms: ['Application Form'], timeframe: '6-12 months', fee: 'Free' },
      'other': { name: 'Small Claims Court', forms: ["Plaintiff's Claim"], timeframe: '3-6 months', fee: '$102+' }
    },
    'BC': {
      'housing': { name: 'Residential Tenancy Branch (RTB)', forms: ['Application for Dispute Resolution'], timeframe: '2-6 weeks', fee: '$100' },
      'human-rights': { name: 'BC Human Rights Tribunal', forms: ['Complaint Form'], timeframe: '12-24 months', fee: 'Free' },
      'family': { name: 'BC Provincial Court - Family Division', forms: ['Application About a Family Law Matter'], timeframe: 'Varies', fee: '$80+' },
      'employment': { name: 'Employment Standards Branch', forms: ['Complaint Form'], timeframe: '3-6 months', fee: 'Free' },
      'other': { name: 'Civil Resolution Tribunal (CRT)', forms: ['CRT Application'], timeframe: '2-4 months', fee: '$75+' }
    },
    'AB': {
      'housing': { name: 'Residential Tenancy Dispute Resolution Service (RTDRS)', forms: ['Application'], timeframe: '2-4 weeks', fee: '$75' },
      'human-rights': { name: 'Alberta Human Rights Commission', forms: ['Complaint Form'], timeframe: '6-18 months', fee: 'Free' },
      'family': { name: "Court of King's Bench - Family Division", forms: ['Statement of Claim'], timeframe: 'Varies', fee: '$200+' },
      'employment': { name: 'Employment Standards', forms: ['Complaint Form'], timeframe: '3-6 months', fee: 'Free' },
      'other': { name: 'Provincial Court - Civil Division', forms: ['Civil Claim'], timeframe: '3-6 months', fee: '$100+' }
    }
  };

  // Default for provinces without specific mapping
  const defaultTribunal: Record<string, { name: string; forms: string[]; timeframe: string; fee: string }> = {
    'housing': { name: 'Provincial Tenancy Board', forms: ['Application Form'], timeframe: '2-6 weeks', fee: 'Varies' },
    'human-rights': { name: 'Provincial Human Rights Commission', forms: ['Complaint Form'], timeframe: '6-18 months', fee: 'Free' },
    'family': { name: 'Provincial Family Court', forms: ['Application Form'], timeframe: 'Varies', fee: 'Varies' },
    'employment': { name: 'Employment Standards', forms: ['Complaint Form'], timeframe: '3-6 months', fee: 'Free' },
    'other': { name: 'Provincial Small Claims Court', forms: ['Claim Form'], timeframe: '3-6 months', fee: 'Varies' }
  };

  return tribunals[province]?.[legalArea] || defaultTribunal[legalArea];
};

export default function Funnel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [province, setProvince] = useState<string | null>(null);
  const [legalArea, setLegalArea] = useState<string | null>(null);
  const [triageAnswers, setTriageAnswers] = useState<Record<number, boolean>>({});
  const [showSignupWall, setShowSignupWall] = useState(false);
  const [showExitCapture, setShowExitCapture] = useState(false);
  
  const totalSteps = 6; // Reduced steps
  const progress = (step / totalSteps) * 100;

  // Track if triage_start and triage_complete have been fired to prevent duplicates
  const triageStartFired = useRef(false);
  const triageCompleteFired = useRef(false);

  // Track funnel start on mount (GA4 funnel_start event)
  useEffect(() => {
    trackEvent('funnel_view', { step: 1 });
    // Fire GA4 funnel_start event
    analytics.funnelStart(window.location.pathname);
  }, []);

  // Persist selections
  useEffect(() => {
    const saved = sessionStorage.getItem('funnel_data');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.province) setProvince(data.province);
      if (data.legalArea) setLegalArea(data.legalArea);
      if (data.triageAnswers) setTriageAnswers(data.triageAnswers);
    }
  }, []);

  // Exit intent detection (desktop)
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && step >= 3 && !user) {
        setShowExitCapture(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [step, user]);

  useEffect(() => {
    sessionStorage.setItem('funnel_data', JSON.stringify({ province, legalArea, triageAnswers }));
  }, [province, legalArea, triageAnswers]);

  // Generate blurred preview content
  const getBlurredPreview = () => {
    const tribunal = legalArea && province ? getTribunalInfo(legalArea, province) : null;
    return {
      form: tribunal?.forms[0] || "T2 Application",
      venue: tribunal?.name || "Landlord and Tenant Board",
      nextSteps: [
        "Complete and submit your application",
        "Gather supporting evidence",
        "Wait for hearing date"
      ],
      evidenceChecklist: [
        "Lease agreement",
        "Photos or written complaints",
        "Communication records"
      ]
    };
  };

  const handleSignupSuccess = () => {
    setShowSignupWall(false);
    setStep(5); // Show results
    trackEvent('form_recommended', { province, legalArea, triageAnswers });
  };

  const handleProvinceSelect = (code: string) => {
    setProvince(code);
    trackEvent('jurisdiction_selected', { province: code });
  };

  const handleLegalAreaSelect = (id: string) => {
    setLegalArea(id);
    trackEvent('legal_area_selected', { legalArea: id, province });
  };

  const handleTriageAnswer = (questionIndex: number, answer: boolean) => {
    setTriageAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    trackEvent('triage_step_complete', { questionIndex, answer, legalArea, province });
  };

  const handleNext = () => {
    if (step === 1 && province) {
      setStep(2);
    } else if (step === 2 && legalArea) {
      setStep(3);
      trackEvent('funnel_confidence_view', { province, legalArea });
    } else if (step === 3) {
      setStep(4);
      // Fire GA4 triage_start when entering the triage questions step
      if (!triageStartFired.current) {
        triageStartFired.current = true;
        analytics.funnelTriageStart(province || 'ON');
      }
    } else if (step === 4) {
      // Check if all triage questions answered
      const questions = TRIAGE_QUESTIONS[legalArea!] || [];
      const allAnswered = questions.every((_, i) => triageAnswers[i] !== undefined);
      if (allAnswered) {
        // Fire GA4 triage_complete - CRITICAL for funnel tracking
        if (!triageCompleteFired.current) {
          triageCompleteFired.current = true;
          const yesCount = Object.values(triageAnswers).filter(Boolean).length;
          const meritRange = yesCount === 3 ? 'high' : yesCount >= 2 ? 'medium' : 'low';
          analytics.funnelTriageComplete({
            province: province || 'ON',
            caseType: legalArea || 'unknown',
            meritRange,
          });
        }
        
        // Gate results behind signup if not logged in
        if (!user) {
          setShowSignupWall(true);
          trackEvent('signup_wall_view', { province, legalArea });
        } else {
          setStep(5);
          trackEvent('form_recommended', { province, legalArea, triageAnswers });
        }
      }
    } else if (step === 5) {
      setStep(6);
      trackEvent('paywall_view', { province, legalArea });
      // Fire GA4 paywall_view event
      analytics.paywallView('case_assessment');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePayment = async (type: 'one-time' | 'monthly') => {
    trackEvent('payment_initiated', { type, province, legalArea });
    // Fire GA4 begin_checkout event
    const value = type === 'one-time' ? 29 : 19;
    const itemName = type === 'one-time' ? 'Case Assessment (One-Time)' : 'Case Assessment (Monthly)';
    analytics.funnelBeginCheckout({ value, itemName });
    // Navigate to payment or trigger Stripe
    navigate('/pricing');
  };

  const provinceName = PROVINCES.find(p => p.code === province)?.name;
  const legalAreaLabel = LEGAL_AREAS.find(a => a.id === legalArea)?.label;
  const tribunal = legalArea && province ? getTribunalInfo(legalArea, province) : null;
  const triageQuestions = legalArea ? TRIAGE_QUESTIONS[legalArea] : [];

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Start Your Legal Case | Justice-Bot"
        description="Answer a few quick questions to get personalized legal guidance. Find the right tribunal, forms, and next steps for your situation."
        canonicalUrl="https://justice-bot.com/funnel"
      />

      {/* Minimal header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="font-bold text-lg text-primary hover:opacity-80">
            Justice-Bot
          </button>
          <span className="text-sm text-muted-foreground">
            Step {step} of {totalSteps}
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="container mx-auto px-4 py-4">
        <Progress value={progress} className="h-2" />
      </div>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        
        {/* STEP 1 — Province Selection */}
        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold">Where is your legal issue?</h1>
              <p className="text-muted-foreground text-lg">Legal rules depend on your province or territory.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROVINCES.map((prov) => (
                <Card 
                  key={prov.code}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary hover:shadow-md",
                    province === prov.code && "border-primary bg-primary/5 ring-2 ring-primary shadow-md"
                  )}
                  onClick={() => handleProvinceSelect(prov.code)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{prov.name}</span>
                    </div>
                    {province === prov.code && (
                      <Check className="h-5 w-5 text-primary shrink-0" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleNext}
                disabled={!province}
                className="w-full py-6 text-lg"
                size="lg"
              >
                Continue
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2 — Legal Area Selection */}
        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold">What's this about?</h1>
              <p className="text-muted-foreground text-lg">Choose the category that best matches your issue.</p>
            </div>

            <div className="space-y-3">
              {LEGAL_AREAS.map((area) => {
                const Icon = area.icon;
                return (
                  <Card 
                    key={area.id}
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary hover:shadow-md",
                      legalArea === area.id && "border-primary bg-primary/5 ring-2 ring-primary shadow-md"
                    )}
                    onClick={() => handleLegalAreaSelect(area.id)}
                  >
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-full shrink-0",
                        legalArea === area.id ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{area.label}</h3>
                      </div>
                      {legalArea === area.id && (
                        <Check className="h-5 w-5 text-primary shrink-0" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1 py-6">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!legalArea}
                className="flex-1 py-6"
              >
                Continue
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3 — Confidence Lock */}
        {step === 3 && province && legalArea && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                You're in the right place for {provinceName} {legalAreaLabel?.toLowerCase()} issues.
              </h1>
            </div>

            <Card className="p-6 border-primary/30 bg-primary/5">
              <h3 className="font-semibold text-lg mb-4">We'll help you:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <FileCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Identify the correct {tribunal?.name} forms</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Organize your evidence properly</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Understand deadlines and what happens next</span>
                </li>
              </ul>
            </Card>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1 py-6">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleNext}
                className="flex-1 py-6 text-lg"
                variant="cta"
              >
                Continue
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4 — Light Triage (Yes/No buttons only) */}
        {step === 4 && legalArea && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold">A few quick questions</h1>
              <p className="text-muted-foreground">This helps us personalize your guidance.</p>
            </div>

            <div className="space-y-6">
              {triageQuestions.map((q, i) => (
                <Card key={i} className="p-6">
                  <p className="font-medium text-lg mb-4">{q.question}</p>
                  <div className="flex gap-3">
                    <Button
                      variant={triageAnswers[i] === true ? "default" : "outline"}
                      className="flex-1 py-4"
                      onClick={() => handleTriageAnswer(i, true)}
                    >
                      {triageAnswers[i] === true && <Check className="h-4 w-4 mr-2" />}
                      Yes
                    </Button>
                    <Button
                      variant={triageAnswers[i] === false ? "default" : "outline"}
                      className="flex-1 py-4"
                      onClick={() => handleTriageAnswer(i, false)}
                    >
                      {triageAnswers[i] === false && <Check className="h-4 w-4 mr-2" />}
                      No
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1 py-6">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleNext}
                disabled={triageQuestions.some((_, i) => triageAnswers[i] === undefined)}
                className="flex-1 py-6"
              >
                Show my legal path
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>

            {/* Exit capture for desktop */}
            {showExitCapture && !user && (
              <div className="mt-6">
                <EmailChecklistCapture legalArea={legalArea || undefined} province={province || undefined} />
              </div>
            )}
          </div>
        )}

        {/* Signup Wall Modal */}
        <SignupWallModal
          open={showSignupWall}
          onOpenChange={setShowSignupWall}
          preview={getBlurredPreview()}
          onSuccess={handleSignupSuccess}
        />

        {/* STEP 5 — Recommendation */}
        {step === 5 && tribunal && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold">Based on what you told us</h1>
            </div>

            <Card className="p-6 border-primary bg-primary/5">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">We recommend</p>
                  <p className="text-2xl font-bold text-primary">{tribunal.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Timeframe</p>
                    <p className="font-medium">{tribunal.timeframe}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Filing Fee</p>
                    <p className="font-medium">{tribunal.fee}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Forms you'll need</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tribunal.forms.map((form) => (
                      <span key={form} className="px-3 py-1 bg-background rounded-full text-sm border font-medium">
                        {form}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Upgrade Card - $5.99 CTA */}
            <UpgradeCard venue={legalArea || undefined} />

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1 py-6">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <Button 
                onClick={() => navigate('/legal-path-report')}
                className="flex-1 py-6 text-lg"
                variant="cta"
              >
                Get my report — $5.99
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>

            {/* Urgency + Trust */}
            <UrgencyBlock venue={legalArea || undefined} variant="prominent" />
            
            {/* Founder trust */}
            <FounderTrustBlock />
          </div>
        )}

        {/* STEP 6 — Paywall */}
        {step === 6 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold">Choose your plan</h1>
              <p className="text-muted-foreground">One-time access or ongoing support — you decide.</p>
            </div>

            <div className="space-y-4">
              <Card 
                className="p-6 cursor-pointer hover:border-primary transition-all"
                onClick={() => handlePayment('one-time')}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-xl">One-Time Access</h3>
                    <p className="text-muted-foreground mt-1">Perfect for a single case</p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        All forms for this case
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Filing instructions
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        30-day access
                      </li>
                    </ul>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">$29</p>
                    <p className="text-sm text-muted-foreground">one time</p>
                  </div>
                </div>
              </Card>

              <Card 
                className="p-6 cursor-pointer hover:border-primary transition-all border-primary/50 bg-primary/5"
                onClick={() => handlePayment('monthly')}
              >
                <div className="absolute -top-3 left-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
                <div className="flex items-start justify-between mt-2">
                  <div>
                    <h3 className="font-semibold text-xl">Monthly Access</h3>
                    <p className="text-muted-foreground mt-1">Best for ongoing cases</p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Unlimited forms & cases
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        AI legal chat support
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Deadline reminders
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Cancel anytime
                      </li>
                    </ul>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">$19</p>
                    <p className="text-sm text-muted-foreground">/month</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>🔒 Secure payment • 30-day money-back guarantee</p>
            </div>

            <Button variant="outline" onClick={handleBack} className="w-full py-6">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
          </div>
        )}

      </main>
    </div>
  );
}