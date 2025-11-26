import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Scale, 
  Users, 
  DollarSign,
  Building2,
  ArrowRight,
  Heart,
  Briefcase,
  Gavel,
  Shield
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/lib/toast-stub";
import legalFormsImg from "@/assets/legal-forms-feature.jpg";
import { supabase } from "@/integrations/supabase/client";

interface FormCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  forms: string[];
  price: number;
  venue: string;
  caseTypes: string[]; // What case types this applies to
}

const allFormCategories: FormCategory[] = [
  {
    id: "ltb",
    title: "Landlord & Tenant Board Forms",
    description: "File disputes about rent, evictions, or repairs with LTB",
    icon: Building2,
    forms: ["Form T2 - Tenant Application", "Form L1 - Landlord Application", "Form T6 - Tenant Rights"],
    price: 29.99,
    venue: "ltb",
    caseTypes: ["ltb", "landlord-tenant", "rental"]
  },
  {
    id: "hrto",
    title: "Human Rights Tribunal Forms",
    description: "File discrimination or human rights complaints with HRTO",
    icon: Shield,
    forms: ["Form 1 - Application", "Form 2 - Response", "Supporting Documents Guide"],
    price: 29.99,
    venue: "hrto",
    caseTypes: ["hrto", "human-rights", "discrimination"]
  },
  {
    id: "small-claims",
    title: "Small Claims Court Forms",
    description: "File claims under $35,000 in Small Claims Court",
    icon: Scale,
    forms: ["Form 7A - Plaintiff's Claim", "Form 9A - Defence", "Form 14A - Offer to Settle"],
    price: 29.99,
    venue: "small-claims",
    caseTypes: ["small-claims", "civil", "debt"]
  },
  {
    id: "family",
    title: "Family Court Forms",
    description: "Custody, support, divorce, and family law matters",
    icon: Heart,
    forms: ["Form 8 - Application", "Form 13 - Financial Statement", "Form 35.1 - Affidavit"],
    price: 29.99,
    venue: "family",
    caseTypes: ["family", "divorce", "custody", "support"]
  },
  {
    id: "employment",
    title: "Employment & Labour Forms",
    description: "Wrongful dismissal, workplace issues, ESA claims",
    icon: Briefcase,
    forms: ["ESA Claim Form", "Human Rights Application", "Labour Board Application"],
    price: 29.99,
    venue: "employment",
    caseTypes: ["employment", "labour", "workplace", "wrongful-dismissal"]
  },
  {
    id: "criminal",
    title: "Criminal Court Documents",
    description: "Bail forms, disclosure requests, appeal documents",
    icon: Gavel,
    forms: ["Bail Application", "Disclosure Request", "Notice of Appeal"],
    price: 29.99,
    venue: "criminal",
    caseTypes: ["criminal", "bail", "appeal"]
  }
];

const Forms = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("forms");
  const [userCases, setUserCases] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllForms, setShowAllForms] = useState(false);

  useEffect(() => {
    loadUserCases();
  }, [user]);

  const loadUserCases = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cases')
        .select('venue, law_section')
        .eq('user_id', user.id);

      if (error) throw error;

      // Extract unique case types from user's cases
      const caseTypes = new Set<string>();
      data?.forEach(c => {
        if (c.venue) caseTypes.add(c.venue.toLowerCase());
        if (c.law_section) caseTypes.add(c.law_section.toLowerCase());
      });

      setUserCases(Array.from(caseTypes));
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter forms based on user's case types
  const getRelevantForms = () => {
    if (showAllForms || !user || userCases.length === 0) {
      return allFormCategories;
    }

    return allFormCategories.filter(category =>
      category.caseTypes.some(type => 
        userCases.some(userCase => 
          userCase.includes(type) || type.includes(userCase)
        )
      )
    );
  };

  const relevantForms = getRelevantForms();
  const hasFilteredForms = relevantForms.length < allFormCategories.length;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Legal Forms & Court Documents - Justice-Bot",
    "description": "AI-powered legal form filling service for Ontario courts and tribunals. Automated document preparation for LTB, HRTO, Small Claims, Family Court, and more. Starting at $29.99 per form.",
    "provider": {
      "@type": "Organization",
      "name": "Justice-Bot",
      "url": "https://justice-bot.com"
    },
    "serviceType": "Legal Document Preparation",
    "areaServed": {
      "@type": "Country",
      "name": "Canada"
    },
    "offers": allFormCategories.map(cat => ({
      "@type": "Offer",
      "name": cat.title,
      "price": cat.price.toString(),
      "priceCurrency": "CAD",
      "availability": "https://schema.org/InStock"
    }))
  };

  const faqData = [
    {
      question: "How much do legal forms cost on Justice-Bot?",
      answer: "Legal forms are $29.99 each as a one-time purchase, or included free with our $19/month subscription. All forms include AI-powered auto-fill and step-by-step guidance."
    },
    {
      question: "Which courts and tribunals do you support?",
      answer: "We support LTB (Landlord Tenant Board), HRTO (Human Rights Tribunal), Small Claims Court, Family Court, Employment/Labour tribunals, and Criminal Court documents for Ontario."
    },
    {
      question: "Will I only see forms relevant to my case?",
      answer: "Yes! If you have an active case with us, we'll show you forms relevant to your case type first. You can always browse all available forms if needed."
    },
    {
      question: "Do forms come pre-filled with my information?",
      answer: "Yes! Our AI automatically pre-fills forms using information from your case profile, saving you time and reducing errors."
    }
  ];

  const breadcrumbs = [
    { name: "Home", url: "https://justice-bot.com/" },
    { name: "Legal Forms", url: "https://justice-bot.com/forms" }
  ];

  const handlePurchase = (category: FormCategory) => {
    if (!user) {
      toast.error("Please sign in to purchase forms");
      navigate("/");
      return;
    }
    
    // Navigate to the form selector for that venue
    navigate(`/forms/${category.venue}`);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    switch (value) {
      case "cases":
        navigate("/dashboard");
        break;
      case "payments":
        navigate("/pricing");
        break;
      case "profile":
        navigate("/profile");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Legal Forms Ontario - LTB, HRTO, Family & Small Claims Court | $29.99"
        description="Purchase Ontario court forms with AI auto-fill. LTB tenant applications, HRTO complaints, Small Claims, Family Court, Employment forms. One-time $29.99 or free with $19/month subscription. Pre-filled forms save hours of work."
        keywords="legal forms Ontario, LTB forms, HRTO application, small claims forms, family court forms Ontario, employment forms, court documents Canada, automated legal forms, Ontario tribunal forms"
        canonicalUrl="https://justice-bot.com/forms"
        structuredData={structuredData}
        faqData={faqData}
        breadcrumbs={breadcrumbs}
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={[
            { label: "Legal Forms" }
          ]} />

          {/* Feature Image */}
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={legalFormsImg} 
              alt="Legal forms and court documents - automated form filling service" 
              className="w-full h-48 object-cover"
              loading="eager"
            />
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="cases" className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Cases
              </TabsTrigger>
              <TabsTrigger value="forms" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Forms
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Payments
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Profile
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Case-Based Filter Notice */}
          {user && hasFilteredForms && !showAllForms && (
            <Card className="mb-6 border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Forms for Your Cases</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Showing {relevantForms.length} form categories relevant to your active cases. 
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAllForms(true)}
                    >
                      Show All {allFormCategories.length} Categories
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Show All Forms Toggle */}
          {user && showAllForms && userCases.length > 0 && (
            <Card className="mb-6 border-muted">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing all {allFormCategories.length} form categories
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAllForms(false)}
                  >
                    Show My Forms Only
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Categories */}
          <div className="space-y-6">
            {loading ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Loading forms...</p>
                </CardContent>
              </Card>
            ) : relevantForms.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground mb-4">
                    No forms match your current cases. Start a case assessment to get personalized form recommendations.
                  </p>
                  <div className="flex justify-center">
                    <Button onClick={() => navigate("/triage")}>
                      Start Case Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              relevantForms.map((category) => {
                const Icon = category.icon;
                return (
                  <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{category.title}</CardTitle>
                          <CardDescription>{category.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Form List */}
                      <div className="flex flex-wrap gap-2">
                        {category.forms.map((form, idx) => (
                          <Badge key={idx} variant="outline" className="text-sm">
                            {form}
                          </Badge>
                        ))}
                      </div>

                      {/* Price and Purchase */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-primary">
                              ${category.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground">one-time</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            or free with $19/mo subscription
                          </p>
                        </div>
                        
                        <Button 
                          onClick={() => handlePurchase(category)}
                          className="gap-2"
                        >
                          Get Forms
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Help Section */}
          <Card className="mt-8 bg-muted/30">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Need Help Choosing?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Not sure which form is right for you? Start with our case assessment for personalized recommendations.
              </p>
              <Button variant="outline" onClick={() => navigate("/triage")}>
                Start Case Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Forms;
