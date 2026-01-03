import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Home, Briefcase, Users, Heart, Scale, HelpCircle, Check } from "lucide-react";
import { trackEvent } from "@/utils/analytics";
import EnhancedSEO from "@/components/EnhancedSEO";
import { cn } from "@/lib/utils";

// Issue types with icons and mapping to tribunals
const ISSUE_TYPES = [
  { 
    id: 'housing', 
    label: 'Housing / Eviction', 
    icon: Home,
    description: 'Rent disputes, evictions, repairs, landlord issues'
  },
  { 
    id: 'family', 
    label: 'Family / Custody', 
    icon: Users,
    description: 'Divorce, child custody, support payments'
  },
  { 
    id: 'child-protection', 
    label: 'Child Protection (CAS)', 
    icon: Heart,
    description: 'CAS involvement, child welfare matters'
  },
  { 
    id: 'human-rights', 
    label: 'Human Rights / Discrimination', 
    icon: Scale,
    description: 'Workplace, housing, or service discrimination'
  },
  { 
    id: 'other', 
    label: 'Other Legal Issue', 
    icon: HelpCircle,
    description: 'Small claims, employment, other disputes'
  }
];

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
  { code: 'NL', name: 'Newfoundland & Labrador' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'YT', name: 'Yukon' }
];

// Context questions based on issue type
const CONTEXT_QUESTIONS: Record<string, { question: string; options: { value: string; label: string }[] }> = {
  'housing': {
    question: 'Have you received a notice or court form from your landlord?',
    options: [
      { value: 'yes', label: 'Yes, I have received a notice or form' },
      { value: 'no', label: 'No, not yet' }
    ]
  },
  'family': {
    question: 'Are you currently going through a separation or divorce?',
    options: [
      { value: 'yes', label: 'Yes, we are separating' },
      { value: 'no', label: 'No, but I need help with custody/support' }
    ]
  },
  'child-protection': {
    question: 'Has CAS (Children\'s Aid) contacted you or opened a file?',
    options: [
      { value: 'yes', label: 'Yes, CAS has contacted me' },
      { value: 'no', label: 'No, I\'m concerned about a child' }
    ]
  },
  'human-rights': {
    question: 'Where did the discrimination occur?',
    options: [
      { value: 'employment', label: 'At work / employment' },
      { value: 'housing', label: 'In housing / rental' },
      { value: 'services', label: 'In services / business' }
    ]
  },
  'other': {
    question: 'What best describes your situation?',
    options: [
      { value: 'money-owed', label: 'Someone owes me money (under $35,000)' },
      { value: 'employment', label: 'Employment / workplace issue' },
      { value: 'other', label: 'Something else' }
    ]
  }
};

// Tribunal mapping based on province and issue
const getTribunalInfo = (issueType: string, province: string, context: string) => {
  const tribunals: Record<string, Record<string, { name: string; description: string; forms: string[] }>> = {
    'ON': {
      'housing': { name: 'Landlord and Tenant Board (LTB)', description: 'Handles all residential tenancy disputes in Ontario', forms: ['T2', 'T6', 'L1', 'L2'] },
      'human-rights': { name: 'Human Rights Tribunal of Ontario (HRTO)', description: 'Handles discrimination complaints under the Ontario Human Rights Code', forms: ['Form 1 Application'] },
      'family': { name: 'Ontario Court of Justice - Family Court', description: 'Handles family law matters including custody, support, and divorce', forms: ['Form 8', 'Form 13', 'Form 35.1'] },
      'child-protection': { name: 'Ontario Court of Justice - Child Protection', description: 'Handles CAS matters and child welfare proceedings', forms: ['Answer to Application'] },
      'other': { name: 'Small Claims Court', description: 'Handles civil disputes up to $35,000', forms: ['Plaintiff\'s Claim', 'Defence'] }
    },
    'BC': {
      'housing': { name: 'Residential Tenancy Branch (RTB)', description: 'Handles residential tenancy disputes in BC', forms: ['Application for Dispute Resolution'] },
      'human-rights': { name: 'BC Human Rights Tribunal', description: 'Handles discrimination complaints in BC', forms: ['Complaint Form'] },
      'family': { name: 'BC Provincial Court - Family Division', description: 'Handles family law matters in BC', forms: ['Application About a Family Law Matter'] },
      'child-protection': { name: 'BC Provincial Court - Child Protection', description: 'Handles MCFD matters', forms: ['Response to Application'] },
      'other': { name: 'Civil Resolution Tribunal (CRT)', description: 'Handles small claims up to $5,000 online', forms: ['CRT Application'] }
    },
    'AB': {
      'housing': { name: 'Residential Tenancy Dispute Resolution Service (RTDRS)', description: 'Handles tenancy disputes in Alberta', forms: ['Application for Dispute Resolution'] },
      'human-rights': { name: 'Alberta Human Rights Commission', description: 'Handles discrimination complaints in Alberta', forms: ['Human Rights Complaint Form'] },
      'family': { name: 'Court of King\'s Bench - Family Division', description: 'Handles family law matters in Alberta', forms: ['Statement of Claim for Divorce'] },
      'child-protection': { name: 'Alberta Court - Child Protection', description: 'Handles child welfare matters', forms: ['Response to Application'] },
      'other': { name: 'Provincial Court - Civil Division', description: 'Handles civil disputes up to $50,000', forms: ['Civil Claim'] }
    }
  };

  // Default for provinces without specific mapping
  const defaultTribunal = {
    'housing': { name: 'Residential Tenancy Board', description: 'Handles residential tenancy disputes in your province', forms: ['Application Form'] },
    'human-rights': { name: 'Human Rights Commission', description: 'Handles discrimination complaints in your province', forms: ['Complaint Form'] },
    'family': { name: 'Family Court', description: 'Handles family law matters in your province', forms: ['Application Form'] },
    'child-protection': { name: 'Child Protection Court', description: 'Handles child welfare matters', forms: ['Response Form'] },
    'other': { name: 'Small Claims Court', description: 'Handles civil disputes in your province', forms: ['Claim Form'] }
  };

  return tribunals[province]?.[issueType] || defaultTribunal[issueType as keyof typeof defaultTribunal];
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

  const handleComplete = () => {
    trackEvent('intake_complete', { issueType, province, contextAnswer });
    navigate('/intake/summary');
  };

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Check Your Legal Situation | Justice-Bot"
        description="Answer a few quick questions to understand your legal options. Find out which tribunal handles your case and what forms you need."
        canonicalUrl="https://justice-bot.com/intake"
      />

      {/* Minimal header - no navigation escape */}
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
        {/* Step 1: Issue Type */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">What's your legal issue about?</h1>
              <p className="text-muted-foreground">Select the category that best describes your situation</p>
            </div>

            <div className="space-y-3">
              {ISSUE_TYPES.map((issue) => {
                const Icon = issue.icon;
                return (
                  <Card 
                    key={issue.id}
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary",
                      issueType === issue.id && "border-primary bg-primary/5 ring-2 ring-primary"
                    )}
                    onClick={() => setIssueType(issue.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-full",
                        issueType === issue.id ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{issue.label}</h3>
                        <p className="text-sm text-muted-foreground">{issue.description}</p>
                      </div>
                      {issueType === issue.id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Province */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Where are you located?</h1>
              <p className="text-muted-foreground">This determines which tribunal handles your case</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PROVINCES.map((prov) => (
                <Card 
                  key={prov.code}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary text-center",
                    province === prov.code && "border-primary bg-primary/5 ring-2 ring-primary"
                  )}
                  onClick={() => setProvince(prov.code)}
                >
                  <CardContent className="p-4">
                    <span className="text-2xl font-bold text-primary">{prov.code}</span>
                    <p className="text-sm text-muted-foreground mt-1">{prov.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Context Question */}
        {step === 3 && issueType && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">One quick question</h1>
              <p className="text-muted-foreground">This helps us give you the right information</p>
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {CONTEXT_QUESTIONS[issueType]?.question}
              </h2>
              <div className="space-y-3">
                {CONTEXT_QUESTIONS[issueType]?.options.map((option) => (
                  <Button
                    key={option.value}
                    variant={contextAnswer === option.value ? "default" : "outline"}
                    className="w-full justify-start text-left h-auto py-4 px-4"
                    onClick={() => setContextAnswer(option.value)}
                  >
                    {contextAnswer === option.value && <Check className="h-4 w-4 mr-2 shrink-0" />}
                    {option.label}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Step 4: Summary Preview */}
        {step === 4 && issueType && province && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Here's what we found</h1>
              <p className="text-muted-foreground">Based on your answers, here's your legal pathway</p>
            </div>

            {(() => {
              const tribunal = getTribunalInfo(issueType, province, contextAnswer || '');
              const selectedIssue = ISSUE_TYPES.find(i => i.id === issueType);
              const selectedProvince = PROVINCES.find(p => p.code === province);
              
              return (
                <div className="space-y-4">
                  <Card className="p-6 border-primary bg-primary/5">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Your issue type</p>
                        <p className="font-semibold">{selectedIssue?.label}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Your location</p>
                        <p className="font-semibold">{selectedProvince?.name}</p>
                      </div>
                      <div className="border-t pt-4">
                        <p className="text-sm text-muted-foreground">Likely venue</p>
                        <p className="text-xl font-bold text-primary">{tribunal.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">{tribunal.description}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Common forms you may need</p>
                        <div className="flex flex-wrap gap-2">
                          {tribunal.forms.map((form) => (
                            <span key={form} className="px-3 py-1 bg-background rounded-full text-sm border">
                              {form}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-warning/10 border-warning">
                    <p className="text-sm font-medium text-warning-foreground">
                      ⚠️ Important: Most tribunals have strict deadlines. Missing a deadline can mean losing your case.
                    </p>
                  </Card>
                </div>
              );
            })()}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className={step === 1 ? 'invisible' : ''}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {step < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="min-w-[140px]"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              variant="cta"
              className="min-w-[180px]"
            >
              Unlock My Legal Package
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Reassurance */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {step === 1 && "Takes about 2 minutes. No signup required."}
          {step === 2 && "We support all Canadian provinces and territories."}
          {step === 3 && "Your answers are private and secure."}
          {step === 4 && "See what's included before you pay."}
        </p>
      </main>
    </div>
  );
}
