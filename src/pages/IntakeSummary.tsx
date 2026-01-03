import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Check, 
  FileText, 
  ListChecks, 
  Download, 
  Clock, 
  Shield, 
  Scale,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { trackEvent } from "@/utils/analytics";
import EnhancedSEO from "@/components/EnhancedSEO";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Reuse tribunal mapping logic
const getTribunalInfo = (issueType: string, province: string) => {
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

  const defaultTribunal = {
    'housing': { name: 'Residential Tenancy Board', description: 'Handles residential tenancy disputes in your province', forms: ['Application Form'] },
    'human-rights': { name: 'Human Rights Commission', description: 'Handles discrimination complaints in your province', forms: ['Complaint Form'] },
    'family': { name: 'Family Court', description: 'Handles family law matters in your province', forms: ['Application Form'] },
    'child-protection': { name: 'Child Protection Court', description: 'Handles child welfare matters', forms: ['Response Form'] },
    'other': { name: 'Small Claims Court', description: 'Handles civil disputes in your province', forms: ['Claim Form'] }
  };

  return tribunals[province]?.[issueType] || defaultTribunal[issueType as keyof typeof defaultTribunal];
};

const ISSUE_LABELS: Record<string, string> = {
  'housing': 'Housing / Eviction',
  'family': 'Family / Custody',
  'child-protection': 'Child Protection (CAS)',
  'human-rights': 'Human Rights / Discrimination',
  'other': 'Other Legal Issue'
};

const PROVINCE_NAMES: Record<string, string> = {
  'ON': 'Ontario', 'BC': 'British Columbia', 'AB': 'Alberta', 'QC': 'Quebec',
  'MB': 'Manitoba', 'SK': 'Saskatchewan', 'NS': 'Nova Scotia', 'NB': 'New Brunswick',
  'NL': 'Newfoundland & Labrador', 'PE': 'Prince Edward Island', 
  'NT': 'Northwest Territories', 'NU': 'Nunavut', 'YT': 'Yukon'
};

export default function IntakeSummary() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [intakeData, setIntakeData] = useState<{
    issueType: string | null;
    province: string | null;
    contextAnswer: string | null;
  }>({ issueType: null, province: null, contextAnswer: null });

  useEffect(() => {
    const saved = sessionStorage.getItem('intake_data');
    if (saved) {
      const data = JSON.parse(saved);
      setIntakeData(data);
      
      // If no data, redirect back to intake
      if (!data.issueType || !data.province) {
        navigate('/intake');
      }
    } else {
      navigate('/intake');
    }
  }, [navigate]);

  const handleUnlock = async () => {
    setIsLoading(true);
    trackEvent('unlock_click', { ...intakeData });
    
    try {
      // Call the payment edge function
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: {
          priceId: 'price_intake_unlock', // This would be your actual Stripe price ID
          successUrl: `${window.location.origin}/payment-success?type=intake`,
          cancelUrl: `${window.location.origin}/intake/summary`,
          metadata: {
            issueType: intakeData.issueType,
            province: intakeData.province
          }
        }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Unable to process payment",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!intakeData.issueType || !intakeData.province) {
    return null; // Will redirect
  }

  const tribunal = getTribunalInfo(intakeData.issueType, intakeData.province);

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Your Legal Package | Justice-Bot"
        description="Unlock your personalized legal package with step-by-step guidance, forms, and evidence checklists."
        canonicalUrl="https://justice-bot.com/intake/summary"
      />

      {/* Minimal header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-lg text-primary">Justice-Bot</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/intake')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Edit Answers
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left: Summary of their situation */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-primary font-medium mb-2">Your personalized pathway</p>
              <h1 className="text-3xl font-bold mb-2">You're not starting from scratch.</h1>
              <p className="text-muted-foreground">Here's what we know about your situation.</p>
            </div>

            <Card className="border-primary">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Scale className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tribunal / Court</p>
                    <p className="font-bold text-lg">{tribunal.name}</p>
                    <p className="text-sm text-muted-foreground">{tribunal.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Issue Type</p>
                    <p className="font-medium">{ISSUE_LABELS[intakeData.issueType]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{PROVINCE_NAMES[intakeData.province]}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Forms you may need</p>
                  <div className="flex flex-wrap gap-2">
                    {tribunal.forms.map((form) => (
                      <span key={form} className="px-3 py-1 bg-muted rounded-full text-sm">
                        {form}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warning about deadlines */}
            <Card className="bg-warning/10 border-warning">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-warning-foreground">Deadline Warning</p>
                    <p className="text-sm text-muted-foreground">
                      Most tribunals have strict filing deadlines. Missing a deadline can mean losing your right to file.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: What's included + Payment */}
          <div className="space-y-6">
            <Card className="border-2 border-primary overflow-hidden">
              <CardHeader className="bg-primary text-primary-foreground">
                <CardTitle className="flex items-center justify-between">
                  <span>Unlock Your Legal Help</span>
                  <span className="text-2xl font-bold">$5.99</span>
                </CardTitle>
                <p className="text-sm opacity-90">One-time • No subscription • Instant access</p>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-6 text-center">
                  Everything you need to handle this yourself — with confidence.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">The Right Forms</p>
                      <p className="text-sm text-muted-foreground">Official tribunal forms for your exact situation</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Step-by-Step Guidance</p>
                      <p className="text-sm text-muted-foreground">Plain-language instructions from filing to hearing</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Evidence Checklist</p>
                      <p className="text-sm text-muted-foreground">Know exactly what documents you need</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Deadline Tracker</p>
                      <p className="text-sm text-muted-foreground">Never miss a filing date</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Downloadable Package</p>
                      <p className="text-sm text-muted-foreground">Save and print everything you need</p>
                    </div>
                  </li>
                </ul>

                <Button 
                  variant="cta" 
                  size="lg" 
                  className="w-full mt-8 py-6 text-lg"
                  onClick={handleUnlock}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      Unlock My Legal Help
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Secure payment • 30-day money-back guarantee
                </p>
              </CardContent>
            </Card>

            {/* Trust Bridge */}
            <Card className="bg-muted/50">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Built for Self-Represented Canadians
                </h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span>Uses official tribunal forms only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span>Not a law firm — we provide legal information, not advice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span>Your data is encrypted and stored in Canada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span>Respects your Charter rights to access justice</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
