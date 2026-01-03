import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Home, Users, Heart, Scale, FileText, Check, AlertTriangle, MapPin } from "lucide-react";
import { trackEvent } from "@/utils/analytics";
import EnhancedSEO from "@/components/EnhancedSEO";
import { cn } from "@/lib/utils";

// Issue types — exactly 5, with icons
const ISSUE_TYPES = [
  { 
    id: 'housing', 
    label: 'Housing / Eviction / Repairs', 
    icon: Home
  },
  { 
    id: 'family', 
    label: 'Family / Custody / Access', 
    icon: Users
  },
  { 
    id: 'child-protection', 
    label: 'Child Protection (CAS)', 
    icon: Heart
  },
  { 
    id: 'human-rights', 
    label: 'Human Rights / Discrimination', 
    icon: Scale
  },
  { 
    id: 'other', 
    label: 'Other Legal Issue', 
    icon: FileText
  }
];

// All Canadian provinces/territories - sorted alphabetically
const PROVINCES = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'YT', name: 'Yukon' }
];

// One smart question per issue type
const CONTEXT_QUESTIONS: Record<string, { question: string; options: { value: string; label: string }[] }> = {
  'housing': {
    question: 'Have you received a notice, order, or form from your landlord or tribunal?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]
  },
  'family': {
    question: 'Is there already a court case or order in place?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]
  },
  'child-protection': {
    question: 'Has a child been apprehended or is there an active investigation?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]
  },
  'human-rights': {
    question: 'Has the discrimination already happened?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]
  },
  'other': {
    question: 'Is there a deadline you need to meet?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]
  }
};

// Tribunal mapping based on province and issue
const getTribunalInfo = (issueType: string, province: string) => {
  const tribunals: Record<string, Record<string, { name: string; forms: string[] }>> = {
    'ON': {
      'housing': { name: 'Landlord and Tenant Board (Ontario)', forms: ['T2', 'T6'] },
      'human-rights': { name: 'Human Rights Tribunal of Ontario (HRTO)', forms: ['Form 1 Application'] },
      'family': { name: 'Ontario Court of Justice - Family Court', forms: ['Form 8', 'Form 13'] },
      'child-protection': { name: 'Ontario Court of Justice - Child Protection', forms: ['Answer to Application'] },
      'other': { name: 'Small Claims Court', forms: ['Plaintiff\'s Claim'] }
    },
    'BC': {
      'housing': { name: 'Residential Tenancy Branch (RTB)', forms: ['Application for Dispute Resolution'] },
      'human-rights': { name: 'BC Human Rights Tribunal', forms: ['Complaint Form'] },
      'family': { name: 'BC Provincial Court - Family Division', forms: ['Application About a Family Law Matter'] },
      'child-protection': { name: 'BC Provincial Court - Child Protection', forms: ['Response to Application'] },
      'other': { name: 'Civil Resolution Tribunal (CRT)', forms: ['CRT Application'] }
    },
    'AB': {
      'housing': { name: 'Residential Tenancy Dispute Resolution Service (RTDRS)', forms: ['Application for Dispute Resolution'] },
      'human-rights': { name: 'Alberta Human Rights Commission', forms: ['Human Rights Complaint Form'] },
      'family': { name: 'Court of King\'s Bench - Family Division', forms: ['Statement of Claim'] },
      'child-protection': { name: 'Alberta Court - Child Protection', forms: ['Response to Application'] },
      'other': { name: 'Provincial Court - Civil Division', forms: ['Civil Claim'] }
    },
    'QC': {
      'housing': { name: 'Tribunal administratif du logement (TAL)', forms: ['Demande de résolution'] },
      'human-rights': { name: 'Commission des droits de la personne', forms: ['Formulaire de plainte'] },
      'family': { name: 'Cour supérieure - Chambre de la famille', forms: ['Demande introductive'] },
      'child-protection': { name: 'Chambre de la jeunesse', forms: ['Réponse'] },
      'other': { name: 'Cour des petites créances', forms: ['Demande'] }
    }
  };

  // Default for provinces without specific mapping
  const defaultTribunal: Record<string, { name: string; forms: string[] }> = {
    'housing': { name: 'Provincial Tenancy Board', forms: ['Application Form'] },
    'human-rights': { name: 'Provincial Human Rights Commission', forms: ['Complaint Form'] },
    'family': { name: 'Provincial Family Court', forms: ['Application Form'] },
    'child-protection': { name: 'Provincial Child Protection Court', forms: ['Response Form'] },
    'other': { name: 'Provincial Small Claims Court', forms: ['Claim Form'] }
  };

  return tribunals[province]?.[issueType] || defaultTribunal[issueType];
};

export default function Intake() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [issueType, setIssueType] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [contextAnswer, setContextAnswer] = useState<string | null>(null);
  
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  // Persist selections to sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('intake_data');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.issueType) setIssueType(data.issueType);
      if (data.province) setProvince(data.province);
      if (data.contextAnswer) setContextAnswer(data.contextAnswer);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('intake_data', JSON.stringify({ issueType, province, contextAnswer }));
  }, [issueType, province, contextAnswer]);

  const handleNext = () => {
    trackEvent('intake_step_complete', { step, issueType, province });
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return issueType !== null;
      case 2: return province !== null;
      case 3: return contextAnswer !== null;
      default: return true;
    }
  };

  const handleSeeOptions = () => {
    trackEvent('intake_complete', { issueType, province, contextAnswer });
    navigate('/intake/summary');
  };

  const selectedIssue = ISSUE_TYPES.find(i => i.id === issueType);
  const selectedProvince = PROVINCES.find(p => p.code === province);
  const tribunal = issueType && province ? getTribunalInfo(issueType, province) : null;

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Check Your Legal Situation | Justice-Bot"
        description="Answer a few quick questions to understand your legal options. Find out which tribunal handles your case and what forms you need."
        canonicalUrl="https://justice-bot.com/intake"
      />

      {/* Minimal header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-lg text-primary">Justice-Bot</span>
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
        {/* SCREEN 2 — Issue Selection */}
        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold">What's going on?</h1>
              <p className="text-muted-foreground text-lg">Choose the option that best matches your situation.</p>
            </div>

            <div className="space-y-3">
              {ISSUE_TYPES.map((issue) => {
                const Icon = issue.icon;
                return (
                  <Card 
                    key={issue.id}
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary hover:shadow-md",
                      issueType === issue.id && "border-primary bg-primary/5 ring-2 ring-primary shadow-md"
                    )}
                    onClick={() => setIssueType(issue.id)}
                  >
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-full shrink-0",
                        issueType === issue.id ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{issue.label}</h3>
                      </div>
                      {issueType === issue.id && (
                        <Check className="h-5 w-5 text-primary shrink-0" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Continue button */}
            <div className="pt-4">
              <Button 
                onClick={handleNext}
                disabled={!canProceed()}
                className="w-full py-6 text-lg"
                size="lg"
              >
                Continue
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* SCREEN 3 — Location */}
        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold">Where are you located?</h1>
              <p className="text-muted-foreground text-lg">Legal rules depend on your province or territory.</p>
            </div>

            {/* Dropdown style for mobile-friendliness */}
            <div className="space-y-3">
              {PROVINCES.map((prov) => (
                <Card 
                  key={prov.code}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary hover:shadow-md",
                    province === prov.code && "border-primary bg-primary/5 ring-2 ring-primary shadow-md"
                  )}
                  onClick={() => setProvince(prov.code)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <span className="font-medium">{prov.name}</span>
                    {province === prov.code && (
                      <Check className="h-5 w-5 text-primary shrink-0" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-sm text-muted-foreground text-center">
              We'll only show information that applies where you live.
            </p>

            {/* Navigation */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1 py-6">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 py-6"
              >
                Continue
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* SCREEN 4 — One Smart Question */}
        {step === 3 && issueType && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold">
                {CONTEXT_QUESTIONS[issueType]?.question}
              </h1>
            </div>

            <div className="space-y-3 max-w-md mx-auto">
              {CONTEXT_QUESTIONS[issueType]?.options.map((option) => (
                <Button
                  key={option.value}
                  variant={contextAnswer === option.value ? "default" : "outline"}
                  className="w-full justify-center text-center h-auto py-6 px-6 text-xl"
                  onClick={() => setContextAnswer(option.value)}
                >
                  {contextAnswer === option.value && <Check className="h-5 w-5 mr-2 shrink-0" />}
                  {option.label}
                </Button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1 py-6">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 py-6"
              >
                Continue
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* SCREEN 5 — Personalized Summary (THIS SELLS) */}
        {step === 4 && issueType && province && tribunal && (
          <div className="space-y-8 animate-fade-in">
            {/* Title */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold">Here's what applies to your situation</h1>
            </div>

            {/* What applies to you */}
            <Card className="p-6 border-primary bg-primary/5">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">You're likely dealing with the</p>
                  <p className="text-xl font-bold text-primary">{tribunal.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Common forms in cases like this include</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tribunal.forms.map((form) => (
                      <span key={form} className="px-3 py-1 bg-background rounded-full text-sm border font-medium">
                        {form}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Deadlines and evidence matter — mistakes can delay or weaken your case.
                </p>
              </div>
            </Card>

            {/* Warning box */}
            <Card className="p-6 bg-destructive/10 border-destructive/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm">
                  Many people lose time or rights by filing the wrong form or missing steps.
                </p>
              </div>
            </Card>

            {/* What we can help with */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">What we can help with:</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Identifying the correct forms</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Explaining what to file and when</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Evidence checklists</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Step-by-step guidance</span>
                </li>
              </ul>
            </Card>

            {/* Navigation */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1 py-6">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <Button 
                variant="cta"
                onClick={handleSeeOptions}
                className="flex-1 py-6 text-lg"
              >
                See My Legal Options
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
