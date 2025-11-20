import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  Clock, 
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle,
  Building2,
  Heart
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
// ❌ REMOVED - Sonner causing runtime errors
// import { toast } from "sonner";
import { toast } from "@/lib/toast-stub";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCaseProfile } from "@/hooks/useCaseProfile";
import { useSearchParams } from "react-router-dom";

interface FormInfo {
  id: string;
  form_code: string;
  title: string;
  description: string;
  tribunal_type: string;
  price_cents: number;
  filing_requirements: any;
  form_fields: any;
}

const venueInfo = {
  ltb: {
    title: "Landlord & Tenant Board",
    icon: Building2,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    portal: "https://tribunalsontario.ca/ltb/",
    commonForms: ["T2", "T6", "L1", "L2"]
  },
  hrto: {
    title: "Human Rights Tribunal",
    icon: Users,
    color: "bg-purple-50 text-purple-700 border-purple-200", 
    portal: "https://www.sjto.gov.on.ca/hrto/",
    commonForms: ["Form 1", "Form 1G"]
  },
  "small-claims": {
    title: "Small Claims Court",
    icon: DollarSign,
    color: "bg-green-50 text-green-700 border-green-200",
    portal: "https://www.ontariocourts.ca/scj/",
    commonForms: ["Plaintiff's Claim", "Defence"]
  },
  family: {
    title: "Family Court",
    icon: Heart,
    color: "bg-rose-50 text-rose-700 border-rose-200",
    portal: "https://www.ontariocourts.ca/scj/",
    commonForms: ["Form 8", "Form 35.1"]
  }
};

const FormSelector = () => {
  const { venue } = useParams<{ venue: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('caseId');
  const { caseProfile } = useCaseProfile(caseId || undefined);
  
  const [forms, setForms] = useState<FormInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<FormInfo | null>(null);

  const triageData = location.state;
  const currentVenue = venue && venue in venueInfo ? venueInfo[venue as keyof typeof venueInfo] : null;

  useEffect(() => {
    fetchForms();
  }, [venue]);

  // Auto-select form from case profile
  useEffect(() => {
    if (caseProfile?.recommendedForm && forms.length > 0 && !selectedForm) {
      const matchingForm = forms.find(f => 
        f.form_code.toLowerCase().includes(caseProfile.recommendedForm.toLowerCase())
      );
      if (matchingForm) {
        setSelectedForm(matchingForm);
        toast.success(`Auto-selected: ${matchingForm.title}`);
      }
    }
  }, [caseProfile, forms, selectedForm]);

  const fetchForms = async () => {
    if (!venue) return;
    
    try {
      // Map venue codes to tribunal types
      const tribunalTypeMap: Record<string, string> = {
        'ltb': 'Landlord and Tenant Board',
        'hrto': 'Human Rights Tribunal of Ontario',
        'small-claims': 'Small Claims Court',
        'family': 'Family Court'
      };

      const tribunalType = tribunalTypeMap[venue] || venue;
      
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('tribunal_type', tribunalType)
        .eq('is_active', true)
        .order('usage_count', { ascending: false });

      if (error) throw error;
      setForms(data || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.error('Failed to fetch forms');
    } finally {
      setLoading(false);
    }
  };

  const startForm = (form: FormInfo) => {
    if (!user) {
      toast.error("Please sign in to access forms");
      return;
    }

    // Navigate to form filling with pre-fill data
    navigate(`/form/${form.id}`, {
      state: {
        prefillData: triageData?.userInput || "",
        location: triageData?.location || {},
        triageResult: triageData?.triageResult || {}
      }
    });
  };

  const getFormIcon = (formCode: string) => {
    if (formCode.startsWith('T')) return <Users className="h-5 w-5" />;
    if (formCode.startsWith('L')) return <Building2 className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  if (!currentVenue) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-2">Invalid Venue</h1>
            <p className="text-muted-foreground mb-4">The requested legal venue was not found.</p>
            <Button onClick={() => navigate("/triage")}>
              Back to Triage
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate("/triage")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Triage
            </Button>
            
            <div className="flex items-center gap-4 mb-4">
              {React.createElement(currentVenue.icon, { className: "h-8 w-8" })}
              <div>
                <h1 className="text-3xl font-bold">{currentVenue.title}</h1>
                <p className="text-muted-foreground">Select the appropriate form for your situation</p>
              </div>
            </div>

            {triageData?.triageResult && (
              <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Based on Your Situation:</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  "{triageData.userInput.substring(0, 100)}..."
                </p>
                <p className="text-sm">
                  <strong>Recommendation:</strong> {triageData.triageResult.reasoning}
                </p>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse">Loading forms...</div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4">
                {forms.map((form) => (
                  <Card 
                    key={form.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => setSelectedForm(form)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg ${currentVenue.color}`}>
                            {getFormIcon(form.form_code)}
                          </div>
                          <div>
                            <CardTitle className="group-hover:text-primary transition-colors">
                              {form.form_code}: {form.title}
                            </CardTitle>
                            <CardDescription>{form.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {form.price_cents > 0 ? (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              ${(form.price_cents / 100).toFixed(2)}
                            </Badge>
                          ) : (
                            <Badge className="bg-success text-success-foreground">
                              Free
                            </Badge>
                          )}
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </CardHeader>
                    {form.filing_requirements && (
                      <CardContent>
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-warning mt-0.5" />
                          <p className="text-sm text-muted-foreground">
                            {form.filing_requirements.deadline || "Check official guidelines for deadlines"}
                          </p>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>

              {forms.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Forms Available</h3>
                    <p className="text-muted-foreground mb-4">
                      Forms for {currentVenue.title} are being updated. 
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => window.open(currentVenue.portal, '_blank')}
                    >
                      Visit Official Portal
                    </Button>
                  </CardContent>
                </Card>
              )}

              <div className="mt-8 p-4 border rounded-lg bg-muted/30">
                <h3 className="font-semibold mb-2">Need Help Choosing?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Not sure which form is right for you? Start with our full case assessment 
                  for personalized recommendations.
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/assessment")}
                  >
                    Full Case Assessment
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open(currentVenue.portal, '_blank')}
                  >
                    Official Forms Hub
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Selection Modal */}
        {selectedForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getFormIcon(selectedForm.form_code)}
                  {selectedForm.form_code}: {selectedForm.title}
                </CardTitle>
                <CardDescription>{selectedForm.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What This Form Is For:</h4>
                  <p className="text-sm text-muted-foreground">{selectedForm.description}</p>
                </div>

                {selectedForm.filing_requirements && (
                  <div>
                    <h4 className="font-semibold mb-2">Filing Requirements:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {Object.entries(selectedForm.filing_requirements).map(([key, value]) => (
                        <li key={key} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                          <span><strong>{key}:</strong> {String(value)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/5">
                  <div>
                    <p className="font-medium">Form Fee</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedForm.price_cents > 0 
                        ? `$${(selectedForm.price_cents / 100).toFixed(2)} CAD`
                        : "Free"
                      }
                    </p>
                  </div>
                  {selectedForm.price_cents > 0 && (
                    <Badge variant="outline">
                      Payment required
                    </Badge>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedForm(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => startForm(selectedForm)}
                    className="flex-1"
                  >
                    Start This Form
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default FormSelector;