import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ArrowLeft,
  Building2, 
  Users, 
  DollarSign, 
  Heart,
  Scale,
  CheckCircle,
  Clock,
  MapPin
} from "lucide-react";
import TribunalLocator from "@/components/TribunalLocator";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RelatedPages } from "@/components/RelatedPages";
import CanonicalURL from "@/components/CanonicalURL";
import EnhancedSEO from "@/components/EnhancedSEO";
import { useCaseProfile, CaseProfile } from "@/hooks/useCaseProfile";

interface TriageResult {
  venue: string;
  confidence: number;
  reasoning: string;
  urgentDeadlines: string[];
  recommendedForms: string[];
  nextSteps: string[];
}

const venues = {
  "ltb": {
    title: "Landlord & Tenant Board",
    description: "Rent disputes, evictions, maintenance issues",
    icon: Building2,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    portal: "https://tribunalsontario.ca/ltb/",
    timeLimit: "Most applications must be filed within 1 year"
  },
  "hrto": {
    title: "Human Rights Tribunal",
    description: "Discrimination, harassment, accessibility",
    icon: Users,
    color: "bg-purple-50 text-purple-700 border-purple-200",
    portal: "https://www.sjto.gov.on.ca/hrto/",
    timeLimit: "Must file within 1 year of incident"
  },
  "small-claims": {
    title: "Small Claims Court",
    description: "Disputes under $35,000",
    icon: DollarSign,
    color: "bg-green-50 text-green-700 border-green-200",
    portal: "https://www.ontariocourts.ca/scj/",
    timeLimit: "Generally 2 years from discovery"
  },
  "family": {
    title: "Family Court / CAS",
    description: "Custody, support, child protection",
    icon: Heart,
    color: "bg-rose-50 text-rose-700 border-rose-200",
    portal: "https://www.ontariocourts.ca/scj/",
    timeLimit: "Varies by matter type"
  }
};

const Triage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveCaseProfile } = useCaseProfile();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [userInput, setUserInput] = useState("");
  const [location, setLocation] = useState({ province: "Ontario", postalCode: "" });
  const [showLocator, setShowLocator] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<any>(null);

  const analyzeUserInput = async () => {
    if (!userInput.trim()) {
      toast.error("Please describe your legal issue");
      return;
    }

    setLoading(true);
    try {
      // Simple keyword-based triage (in production, use AI)
      const input = userInput.toLowerCase();
      let venue = "small-claims";
      let confidence = 70;
      let reasoning = "";
      let urgentDeadlines: string[] = [];
      let recommendedForms: string[] = [];
      let nextSteps: string[] = [];

      if (input.includes("rent") || input.includes("evict") || input.includes("landlord") || input.includes("tenant")) {
        venue = "ltb";
        confidence = 90;
        reasoning = "Your issue involves landlord-tenant matters, which fall under LTB jurisdiction.";
        urgentDeadlines = ["File within 1 year of incident", "Service deadlines vary by form type"];
        recommendedForms = ["T2 - Tenant Rights", "T6 - Maintenance", "L1 - Non-payment"];
        nextSteps = [
          "Gather evidence (photos, receipts, communications)",
          "Complete appropriate LTB form",
          "File application and pay fee",
          "Serve documents to other party"
        ];
      } else if (input.includes("discriminat") || input.includes("harassment") || input.includes("human rights") || input.includes("accessibility")) {
        venue = "hrto";
        confidence = 85;
        reasoning = "Your issue involves human rights discrimination, which is handled by HRTO.";
        urgentDeadlines = ["CRITICAL: Must file within 1 year of last incident"];
        recommendedForms = ["Form 1 - Application", "Form 1G - Group Application"];
        nextSteps = [
          "Document incidents with dates and witnesses",
          "Check if you're within 1-year deadline",
          "Complete HRTO Form 1",
          "Submit application online"
        ];
      } else if (input.includes("custody") || input.includes("child support") || input.includes("cas") || input.includes("family")) {
        venue = "family";
        confidence = 80;
        reasoning = "Your issue involves family law matters requiring Family Court.";
        urgentDeadlines = ["Urgent matters may require immediate filing"];
        recommendedForms = ["Form 8 - Application", "Form 35.1 - Affidavit"];
        nextSteps = [
          "Gather financial documents",
          "Complete required family law forms",
          "File at Superior Court of Justice",
          "Serve other party"
        ];
      } else {
        venue = "small-claims";
        confidence = 60;
        reasoning = "Based on your description, Small Claims Court may be appropriate for monetary disputes under $35,000.";
        urgentDeadlines = ["Generally 2 years from when you discovered the issue"];
        recommendedForms = ["Plaintiff's Claim", "Defence"];
        nextSteps = [
          "Calculate your damages",
          "Attempt to resolve directly first",
          "Complete Small Claims forms",
          "File at local courthouse"
        ];
      }

      setTriageResult({
        venue,
        confidence,
        reasoning,
        urgentDeadlines,
        recommendedForms,
        nextSteps
      });
      setStep(1);
    } catch (error) {
      console.error('Triage error:', error);
      toast.error('Failed to analyze your case');
    } finally {
      setLoading(false);
    }
  };

  const proceedToForms = async () => {
    if (!user) {
      toast.error("Please sign in to continue");
      navigate("/");
      return;
    }

    if (!triageResult) return;

    try {
      // Extract timeline seeds from triage
      const timelineSeeds = extractTimelineSeeds(userInput, triageResult);
      
      // Build case profile
      const profile: CaseProfile = {
        issueType: triageResult.venue,
        tribunal: triageResult.venue,
        recommendedForm: triageResult.recommendedForms[0] || '',
        facts: extractFacts(userInput),
        keywords: extractKeywords(userInput, triageResult.venue),
        timelineSeeds,
        flags: extractFlags(userInput),
        venue: triageResult.venue,
        confidence: triageResult.confidence,
        reasoning: triageResult.reasoning,
        location: {
          province: location.province,
          postalCode: location.postalCode,
        },
      };

      // Create a case with triage data
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .insert({
          user_id: user.id,
          title: `${triageResult.venue.toUpperCase()} Case`,
          description: userInput,
          venue: triageResult.venue,
          province: location.province,
          municipality: location.postalCode || undefined,
          status: 'active',
          triage: profile as any,
        })
        .select()
        .single();

      if (caseError) throw caseError;

      // Save case profile
      await saveCaseProfile(profile, caseData.id);

      toast.success("Case created successfully");
      navigate(`/form-selector?venue=${triageResult.venue}&caseId=${caseData.id}`);
    } catch (error) {
      console.error("Error creating case:", error);
      toast.error("Failed to create case");
    }
  };

  const extractTimelineSeeds = (input: string, result: TriageResult) => {
    const seeds = [];
    const text = input.toLowerCase();
    
    // Extract dates and create events
    const datePattern = /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})|(\w+ \d{1,2},? \d{4})/g;
    const dates = input.match(datePattern);
    
    if (dates && dates.length > 0) {
      seeds.push({
        date: new Date().toISOString().split('T')[0],
        type: 'Issue Reported',
        description: `User reported ${result.venue} issue`,
      });
    }

    // Add venue-specific seeds
    if (text.includes('evict') || text.includes('notice')) {
      seeds.push({
        date: new Date().toISOString().split('T')[0],
        type: 'Notice Received',
        description: 'Notice or eviction document received',
      });
    }

    if (text.includes('discriminat') || text.includes('harass')) {
      seeds.push({
        date: new Date().toISOString().split('T')[0],
        type: 'Incident',
        description: 'Discrimination or harassment incident occurred',
      });
    }

    return seeds;
  };

  const extractFacts = (input: string): string[] => {
    const facts = [];
    const sentences = input.split(/[.!?]+/);
    
    for (const sentence of sentences) {
      if (sentence.trim().length > 20) {
        facts.push(sentence.trim());
      }
    }
    
    return facts.slice(0, 5);
  };

  const extractKeywords = (input: string, venue: string): string[] => {
    const text = input.toLowerCase();
    const keywords = new Set<string>();
    
    const venueKeywords = {
      'ltb': ['rent', 'eviction', 'landlord', 'tenant', 'maintenance', 'repair', 'lease'],
      'hrto': ['discrimination', 'harassment', 'disability', 'race', 'gender', 'accommodation'],
      'family': ['custody', 'support', 'access', 'child', 'parent', 'cas'],
      'small-claims': ['debt', 'contract', 'property', 'damage', 'breach'],
    };

    const relevantWords = venueKeywords[venue as keyof typeof venueKeywords] || [];
    
    for (const word of relevantWords) {
      if (text.includes(word)) {
        keywords.add(word);
      }
    }

    return Array.from(keywords);
  };

  const extractFlags = (input: string): string[] => {
    const text = input.toLowerCase();
    const flags = [];

    if (text.includes('discriminat')) flags.push('discrimination');
    if (text.includes('health') || text.includes('safety')) flags.push('health/safety');
    if (text.includes('urgent') || text.includes('emergency')) flags.push('urgent');
    if (text.includes('child') || text.includes('minor')) flags.push('child-involved');
    if (text.includes('disab')) flags.push('disability');
    if (text.includes('harass')) flags.push('harassment');

    return flags;
  };

  const startFullAssessment = () => {
    navigate('/assessment', { 
      state: { 
        prefillData: {
          description: userInput,
          province: location.province,
          venue: triageResult?.venue
        }
      } 
    });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Legal Triage Tool",
    "description": "Smart AI-powered legal triage to determine the best legal pathway for your situation",
    "url": "https://justice-bot.com/triage"
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
      title: "Legal Resources",
      description: "Free guides, forms, and templates",
      path: "/legal-resources",
      icon: "book" as const,
      category: "Resources"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <CanonicalURL />
      <EnhancedSEO
        title="Free Legal Triage Tool - Find Your Legal Pathway in Ontario"
        description="Use our AI-powered legal triage to instantly determine if you need Small Claims Court, LTB, HRTO, or Family Court. Get personalized recommendations and next steps."
        keywords="legal triage, legal pathway, small claims or ltb, Ontario legal help, legal assessment tool"
        structuredData={structuredData}
      />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">Smart Legal Triage</h1>
            <p className="text-muted-foreground">
              Get instant guidance on the right legal pathway for your situation.
            </p>
          </div>

          {step === 0 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Describe Your Legal Issue</CardTitle>
                  <CardDescription>
                    Tell us what happened in your own words. We'll analyze your situation and recommend the best legal pathway.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="issue">What's your legal issue? *</Label>
                    <Textarea
                      id="issue"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Example: My landlord is trying to evict me for no reason, or My employer fired me after I complained about discrimination..."
                      className="mt-2 min-h-32"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      The more detail you provide, the better we can guide you.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="province">Province/Territory</Label>
                      <select
                        id="province"
                        value={location.province}
                        onChange={(e) => setLocation({ ...location, province: e.target.value })}
                        className="w-full mt-2 p-2 border border-input rounded-md bg-background"
                      >
                        <option value="Ontario">Ontario</option>
                        <option value="Quebec">Quebec</option>
                        <option value="British Columbia">British Columbia</option>
                        <option value="Alberta">Alberta</option>
                        <option value="Manitoba">Manitoba</option>
                        <option value="Saskatchewan">Saskatchewan</option>
                        <option value="Nova Scotia">Nova Scotia</option>
                        <option value="New Brunswick">New Brunswick</option>
                        <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
                        <option value="Prince Edward Island">Prince Edward Island</option>
                        <option value="Northwest Territories">Northwest Territories</option>
                        <option value="Nunavut">Nunavut</option>
                        <option value="Yukon">Yukon</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="postal">Postal Code (Optional)</Label>
                      <input
                        id="postal"
                        value={location.postalCode}
                        onChange={(e) => setLocation({ ...location, postalCode: e.target.value })}
                        placeholder="For courthouse locator"
                        className="w-full mt-2 p-2 border border-input rounded-md bg-background"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={analyzeUserInput}
                    disabled={loading || !userInput.trim()}
                    className="w-full"
                  >
                    {loading ? "Analyzing..." : "Get Legal Pathway Recommendation"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 1 && triageResult && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    Recommended Legal Pathway
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
                    <div className="flex items-center gap-4">
                      {React.createElement(venues[triageResult.venue as keyof typeof venues].icon, {
                        className: "h-8 w-8"
                      })}
                      <div>
                        <h3 className="font-semibold text-lg">
                          {venues[triageResult.venue as keyof typeof venues].title}
                        </h3>
                        <p className="text-muted-foreground">
                          {venues[triageResult.venue as keyof typeof venues].description}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-success text-success-foreground">
                      {triageResult.confidence}% Match
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Why This Venue?</h4>
                    <p className="text-muted-foreground">{triageResult.reasoning}</p>
                  </div>

                  {triageResult.urgentDeadlines.length > 0 && (
                    <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Clock className="h-5 w-5 text-destructive mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-destructive mb-2">Important Deadlines</h4>
                          <ul className="space-y-1">
                            {triageResult.urgentDeadlines.map((deadline, index) => (
                              <li key={index} className="text-sm">{deadline}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Recommended Forms</h4>
                      <ul className="space-y-1">
                        {triageResult.recommendedForms.map((form, index) => (
                          <li key={index} className="text-sm flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-success" />
                            {form}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Next Steps</h4>
                      <ol className="space-y-1">
                        {triageResult.nextSteps.map((step, index) => (
                          <li key={index} className="text-sm flex gap-2">
                            <span className="text-primary font-bold">{index + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Button 
                      onClick={() => setShowLocator(true)} 
                      variant="outline" 
                      className="w-full"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Find Nearby Courts & Tribunals
                    </Button>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button onClick={proceedToForms} className="flex-1">
                        Start Forms for {venues[triageResult.venue as keyof typeof venues].title}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                      <Button variant="outline" onClick={startFullAssessment} className="flex-1">
                        Full Case Assessment
                      </Button>
                    </div>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>
                      Official portal: {" "}
                      <a 
                        href={venues[triageResult.venue as keyof typeof venues].portal} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {venues[triageResult.venue as keyof typeof venues].portal}
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Button 
                variant="outline" 
                onClick={() => setStep(0)} 
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Try Different Issue
              </Button>
            </div>
          )}

          {/* Related Pages - Show after triage result */}
          {step === 1 && (
            <RelatedPages 
              pages={relatedPages}
              title="Explore More Resources"
              description="Get additional help with your legal journey"
            />
          )}

          {/* Tribunal Locator Modal */}
          {showLocator && triageResult && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Find Your {venues[triageResult.venue as keyof typeof venues].title}</h2>
                    <Button variant="outline" onClick={() => setShowLocator(false)}>
                      Close
                    </Button>
                  </div>
                  
                  <TribunalLocator
                    venue={triageResult.venue}
                    userProvince={location.province}
                    userMunicipality={location.postalCode ? `${location.postalCode}, ${location.province}` : location.province}
                    caseDescription={userInput}
                    onCourtSelected={(court) => {
                      setSelectedCourt(court);
                    }}
                  />
                  
                  {selectedCourt && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Selected Court:</p>
                          <p className="font-medium">{selectedCourt.name}</p>
                        </div>
                        <Button onClick={() => setShowLocator(false)}>
                          Continue with This Location
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Triage;