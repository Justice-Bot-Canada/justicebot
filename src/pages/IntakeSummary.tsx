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
  ArrowRight,
  ArrowLeft,
  Lock
} from "lucide-react";
import { trackEvent } from "@/utils/analytics";
import EnhancedSEO from "@/components/EnhancedSEO";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Tribunal mapping
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

  const defaultTribunal: Record<string, { name: string; forms: string[] }> = {
    'housing': { name: 'Provincial Tenancy Board', forms: ['Application Form'] },
    'human-rights': { name: 'Provincial Human Rights Commission', forms: ['Complaint Form'] },
    'family': { name: 'Provincial Family Court', forms: ['Application Form'] },
    'child-protection': { name: 'Provincial Child Protection Court', forms: ['Response Form'] },
    'other': { name: 'Provincial Small Claims Court', forms: ['Claim Form'] }
  };

  return tribunals[province]?.[issueType] || defaultTribunal[issueType];
};

const ISSUE_LABELS: Record<string, string> = {
  'housing': 'Housing / Eviction / Repairs',
  'family': 'Family / Custody / Access',
  'child-protection': 'Child Protection (CAS)',
  'human-rights': 'Human Rights / Discrimination',
  'other': 'Other Legal Issue'
};

const PROVINCE_NAMES: Record<string, string> = {
  'AB': 'Alberta', 'BC': 'British Columbia', 'MB': 'Manitoba', 
  'NB': 'New Brunswick', 'NL': 'Newfoundland and Labrador', 'NS': 'Nova Scotia',
  'NT': 'Northwest Territories', 'NU': 'Nunavut', 'ON': 'Ontario',
  'PE': 'Prince Edward Island', 'QC': 'Quebec', 'SK': 'Saskatchewan', 'YT': 'Yukon'
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
      const { data, error } = await supabase.functions.invoke('create_checkout', {
        body: {
          priceId: 'price_1SYLdJL0pLShFbLttpxYfuas', // $5.99 Legal Form - One-Time Purchase
          planKey: 'form_unlock',
          mode: 'payment',
          successUrl: `${window.location.origin}/unlock-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/intake/summary`,
          metadata: {
            issueType: intakeData.issueType,
            province: intakeData.province,
            product: 'form_unlock',
            source: 'intake_summary'
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
    return null;
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

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-8">
          
          {/* SCREEN 6 — Trust Bridge */}
          <Card className="bg-muted/30 border-muted">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">About Justice-Bot</h2>
              <p className="text-muted-foreground">
                Justice-Bot was built to help self-represented Canadians navigate legal processes with clarity and dignity.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Designed for Canadian laws and tribunals</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Uses official government and tribunal forms</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Built by a Canadian legal advocate</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Not a law firm — no legal advice provided</span>
                </li>
              </ul>
              <p className="text-sm italic text-muted-foreground border-l-2 border-primary pl-4 mt-4">
                "Everyone has the right to a fair hearing." — Canadian Charter of Rights and Freedoms
              </p>
            </CardContent>
          </Card>

          {/* SCREEN 7 — Payment (UNLOCK, NOT BUY) */}
          <Card className="border-2 border-primary overflow-hidden">
            <CardHeader className="bg-primary text-primary-foreground text-center py-8">
              <CardTitle className="text-2xl md:text-3xl">Unlock My Legal Help</CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              
              {/* What they get */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Correct forms for your province</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Step-by-step filing guidance</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Evidence checklist</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Downloadable documents</p>
                  </div>
                </li>
              </ul>

              {/* Price */}
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-2">One-time access</p>
                <p className="text-4xl font-bold text-primary">$5.99</p>
              </div>

              {/* Micro-reassurance */}
              <p className="text-center text-sm text-muted-foreground mb-6">
                No subscription. No commitment.
              </p>

              {/* Unlock button */}
              <Button 
                variant="cta" 
                size="lg" 
                className="w-full py-8 text-xl"
                onClick={handleUnlock}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Unlock Now
                  </>
                )}
              </Button>

            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
