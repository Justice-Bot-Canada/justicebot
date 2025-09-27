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
import SEOHead from "@/components/SEOHead";
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
    "@type": "Service",
    "name": "Landlord Tenant Board Ontario Help",
    "description": "Get affordable legal help for LTB applications, eviction disputes, rent increases, and landlord-tenant issues in Ontario",
    "provider": {
      "@type": "Organization",
      "name": "Justice-Bot"
    },
    "serviceType": "Legal Services",
    "areaServed": "Ontario, Canada"
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Landlord Tenant Board (LTB) Help - File Your Application"
        description="Need help with LTB applications? Get affordable legal assistance for eviction disputes, rent increases, repairs, and landlord-tenant issues in Ontario. Expert guidance starting at $5.99."
        keywords="LTB help, Landlord Tenant Board Ontario, eviction help, rent increase dispute, landlord tenant lawyer, tenant rights, LTB application"
        structuredData={structuredData}
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
                LTB Help: Protect Your Tenant Rights
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