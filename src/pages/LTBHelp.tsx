import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  FileText, 
  Clock, 
  DollarSign, 
  Shield, 
  AlertCircle,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";
import EnhancedSEO from "@/components/EnhancedSEO";
import { CanonicalURL } from "@/components/CanonicalURL";
import { RelatedPages } from "@/components/RelatedPages";
import { useAuth } from "@/hooks/useAuth";

const LTBHelp = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleGetStarted = () => {
    if (user) {
      navigate("/triage");
    } else {
      setShowAuthDialog(true);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to File an LTB Application in Ontario",
    "description": "Step-by-step guide to filing Landlord and Tenant Board applications for eviction disputes, rent issues, and maintenance complaints in Ontario",
    "totalTime": "PT2H",
    "supply": ["Rental agreement", "Evidence of issue", "Receipts and photos"],
    "tool": ["Justice-Bot platform", "LTB application forms (T1-T6, L1-L2)"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Identify Your Issue",
        "text": "Determine which LTB form applies to your situation: T2 for tenant rights, T6 for maintenance, L1 for rent arrears, etc."
      },
      {
        "@type": "HowToStep",
        "name": "Complete Application",
        "text": "Fill out the correct LTB form with detailed information about your landlord-tenant dispute and what remedy you're seeking."
      },
      {
        "@type": "HowToStep",
        "name": "Submit and Prepare",
        "text": "File your application with the $53 fee, serve your landlord/tenant, and prepare evidence for your hearing."
      }
    ]
  };

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "LTB Help", url: "/ltb-help" }
  ];

  const faqData = [
    {
      question: "How do I file an LTB application in Ontario?",
      answer: "To file an LTB application, complete the appropriate form (T1-T6 for tenants, L1-L9 for landlords), pay the $53 filing fee, and submit it online or by mail to the Landlord and Tenant Board."
    },
    {
      question: "How long does the LTB process take?",
      answer: "LTB hearings typically occur 6-8 weeks after filing, though this can vary. Most cases are resolved within 3-4 months from initial filing."
    },
    {
      question: "Can I fight an eviction notice in Ontario?",
      answer: "Yes, you can dispute an eviction by filing the appropriate LTB application (usually T2 or T5) within the deadline specified on your eviction notice, typically 10-30 days."
    },
    {
      question: "Do I need a lawyer for LTB hearings?",
      answer: "No, most people represent themselves at LTB hearings. Justice-Bot helps you prepare strong applications and evidence without expensive lawyer fees."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <CanonicalURL />
      <EnhancedSEO
        title="LTB Help Ontario 2025 - FREE Case Assessment | Fight Evictions & Get Repairs"
        description="Need LTB help? Get FREE case assessment + forms from $5.99. 75% tenant success rate. File T2, T6, fight N4 evictions, force repairs. Step-by-step guidance for Landlord Tenant Board Ontario."
        keywords="LTB help, LTB Ontario, landlord tenant board help, LTB application help, LTB forms help, Ontario tenant help, LTB assistance, file LTB application, T2 form, T6 form, N4 eviction"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
      />
      
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                Landlord & Tenant Board Ontario
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                LTB Help Ontario: Expert Landlord Tenant Board Assistance
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Get expert guidance for your Landlord & Tenant Board application. 
                We help you fight unfair evictions, excessive rent increases, and get repairs done
                with affordable, AI-powered legal assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
                  Start Your LTB Case Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate("/ltb-journey")}
                >
                  View Step-by-Step Guide
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/pricing")}>
                  View Pricing
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Justice-Bot for LTB Cases?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <DollarSign className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Affordable Legal Help</CardTitle>
                  <CardDescription>LTB applications starting at $5.99 vs $3,000+ for traditional lawyers</CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <Clock className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Quick Turnaround</CardTitle>
                  <CardDescription>Get your LTB application ready in hours, beat tight deadlines</CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <Shield className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Proven Success</CardTitle>
                  <CardDescription>Our AI analyzes 15,000+ LTB cases to maximize your chances</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* LTB Process */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">How We Help with Your LTB Application</h2>
              
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Case Assessment & Form Selection</h3>
                    <p className="text-muted-foreground">
                      We analyze your landlord-tenant issue and determine the correct LTB forms to file 
                      (T1, T2, T3, T4, T5, T6, L1, L2, etc.) based on your specific situation.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6 items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Application Completion</h3>
                    <p className="text-muted-foreground">
                      Our AI helps you complete complex LTB forms with proper legal language, 
                      ensuring all required information is included and nothing is missed.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6 items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Evidence & Documentation</h3>
                    <p className="text-muted-foreground">
                      Organize your evidence, receipts, photos, communications, and supporting documents 
                      to build a strong case for your LTB hearing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common LTB Issues */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Common LTB Cases We Handle</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Home className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Eviction Disputes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Non-payment of rent (N4 notices)</li>
                    <li>• Bad faith evictions for renovations</li>
                    <li>• Personal use evictions (N12)</li>
                    <li>• Illegal rent increases</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <DollarSign className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Rent Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Above-guideline rent increases</li>
                    <li>• Illegal rent charges and fees</li>
                    <li>• Rent rebates and applications</li>
                    <li>• Security deposit disputes</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <FileText className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Maintenance & Repairs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Landlord refuses to do repairs</li>
                    <li>• Poor living conditions</li>
                    <li>• Harassment by landlord</li>
                    <li>• Interference with enjoyment</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Success Stats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-center mb-12">LTB Success Statistics</h2>
              
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">75%</div>
                  <p className="text-muted-foreground">Of tenant applications succeed at LTB</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">$53</div>
                  <p className="text-muted-foreground">LTB application filing fee</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">30</div>
                  <p className="text-muted-foreground">Days to file after notice served</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">89%</div>
                  <p className="text-muted-foreground">Cases resolved without hearing</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Pages for Internal Linking */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <RelatedPages 
              title="Related LTB Resources"
              description="More guides to help with your tenant case"
              pages={[
                { title: "How to File T2 Form", description: "Fight landlord violations and bad faith evictions", path: "/how-to-file-t2-ontario", icon: "file", category: "Forms" },
                { title: "How to File T6 Form", description: "Force repairs when landlord refuses to fix", path: "/how-to-file-t6-ontario", icon: "file", category: "Forms" },
                { title: "Fight N4 Eviction", description: "Challenge unfair eviction notices", path: "/how-to-fight-n4-eviction-ontario", icon: "help", category: "Guide" },
                { title: "Small Claims Court", description: "Sue for damages up to $35,000", path: "/small-claims", icon: "calculator", category: "Court" },
              ]}
            />
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Don't Let Landlords Take Advantage
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Protect your tenant rights with professional LTB help. 
              Our AI-powered platform makes quality legal assistance affordable for everyone.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={handleGetStarted}
              className="text-lg px-8"
            >
              Start Your Free Case Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
      />
    </div>
  );
};

export default LTBHelp;