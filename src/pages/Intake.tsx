import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Home, Users, Heart, Scale, HelpCircle, Check, ShieldCheck, MapPin } from "lucide-react";
import { trackEvent } from "@/utils/analytics";
import EnhancedSEO from "@/components/EnhancedSEO";
import { cn } from "@/lib/utils";

// Issue types — max 5, emotionally clear labels
const ISSUE_TYPES = [
  { 
    id: 'housing', 
    label: 'Housing or Eviction', 
    icon: Home,
    shortDesc: 'My landlord is causing problems'
  },
  { 
    id: 'family', 
    label: 'Family or Custody', 
    icon: Users,
    shortDesc: 'I need help with my kids or separation'
  },
  { 
    id: 'child-protection', 
    label: 'Child Protection', 
    icon: Heart,
    shortDesc: 'CAS / Children\'s Aid is involved'
  },
  { 
    id: 'human-rights', 
    label: 'Discrimination', 
    icon: Scale,
    shortDesc: 'I\'m being treated unfairly'
  },
  { 
    id: 'other', 
    label: 'Something Else', 
    icon: HelpCircle,
    shortDesc: 'Money owed, employment, other'
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
        {/* Step 1: What's going on? */}
        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold">What's going on?</h1>
              <p className="text-muted-foreground text-lg">You don't need to explain everything — just pick the closest match.</p>
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
                        <p className="text-sm text-muted-foreground">{issue.shortDesc}</p>
                      </div>
                      {issueType === issue.id && (
                        <Check className="h-5 w-5 text-primary shrink-0" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Where are you? */}
        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 text-primary mb-2">
                <MapPin className="h-5 w-5" />
                <span className="text-sm font-medium">This is important</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Where are you located?</h1>
              <p className="text-muted-foreground text-lg">Legal rules are different in each province. We'll make sure you get the right info.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PROVINCES.map((prov) => (
                <Card 
                  key={prov.code}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary hover:shadow-md text-center",
                    province === prov.code && "border-primary bg-primary/5 ring-2 ring-primary shadow-md"
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

        {/* Step 3: One smart question */}
        {step === 3 && issueType && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold">One more thing</h1>
              <p className="text-muted-foreground text-lg">This helps us understand how urgent your situation is.</p>
            </div>

            <Card className="p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-center">
                {CONTEXT_QUESTIONS[issueType]?.question}
              </h2>
              <div className="space-y-3 max-w-md mx-auto">
                {CONTEXT_QUESTIONS[issueType]?.options.map((option) => (
                  <Button
                    key={option.value}
                    variant={contextAnswer === option.value ? "default" : "outline"}
                    className="w-full justify-center text-center h-auto py-4 px-6 text-base"
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

        {/* Step 4: Summary — this is where trust forms */}
        {step === 4 && issueType && province && (
          <div className="space-y-8 animate-fade-in">
            {(() => {
              const tribunal = getTribunalInfo(issueType, province, contextAnswer || '');
              const selectedIssue = ISSUE_TYPES.find(i => i.id === issueType);
              const selectedProvince = PROVINCES.find(p => p.code === province);
              
              return (
                <>
                  {/* Emotional header */}
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 text-primary mb-2">
                      <ShieldCheck className="h-5 w-5" />
                      <span className="text-sm font-medium">We've got you</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold">Here's what applies to you</h1>
                    <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                      Based on your answers, here's what you're dealing with — and how we can help.
                    </p>
                  </div>

                  {/* What applies to you */}
                  <Card className="p-6 border-primary bg-primary/5">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-4 border-b">
                        <Scale className="h-6 w-6 text-primary shrink-0" />
                        <div>
                          <p className="text-sm text-muted-foreground">Your legal venue</p>
                          <p className="text-xl font-bold text-primary">{tribunal.name}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Issue</p>
                          <p className="font-medium">{selectedIssue?.label}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Province</p>
                          <p className="font-medium">{selectedProvince?.name}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-2">Forms you'll likely need</p>
                        <div className="flex flex-wrap gap-2">
                          {tribunal.forms.map((form) => (
                            <span key={form} className="px-3 py-1 bg-background rounded-full text-sm border font-medium">
                              {form}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* What usually goes wrong */}
                  <Card className="p-6 bg-destructive/5 border-destructive/20">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <span className="text-destructive">⚠️</span> What usually goes wrong
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-destructive shrink-0">•</span>
                        <span>Missing filing deadlines (most people don't know the rules)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive shrink-0">•</span>
                        <span>Using the wrong forms or filling them out incorrectly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive shrink-0">•</span>
                        <span>Not knowing what evidence to bring</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive shrink-0">•</span>
                        <span>Showing up unprepared and losing by default</span>
                      </li>
                    </ul>
                  </Card>

                  {/* What we can help with */}
                  <Card className="p-6 bg-success/5 border-success/20">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <span className="text-success">✓</span> What we can help with
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        <span>The right forms for your exact situation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        <span>Step-by-step guidance from start to hearing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        <span>A clear evidence checklist so you know what to gather</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        <span>Deadline tracking so you never miss a date</span>
                      </li>
                    </ul>
                  </Card>
                </>
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
              size="lg"
              className="min-w-[220px]"
            >
              Unlock My Legal Help
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          )}
        </div>

        {/* Reassurance — emotional copy */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {step === 1 && "You're not alone. Thousands of Canadians face this every year."}
          {step === 2 && "We cover all provinces and territories across Canada."}
          {step === 3 && "Your answers are private. We never share your information."}
          {step === 4 && "You'll see exactly what's included before paying anything."}
        </p>
      </main>
    </div>
  );
}
