import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Scale, 
  FileText, 
  Clock, 
  DollarSign, 
  Users, 
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

const HRTOHelp = () => {
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
    "name": "Human Rights Tribunal Ontario Help",
    "description": "Get affordable legal help for HRTO applications, discrimination complaints, and human rights issues in Ontario",
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
        title="Human Rights Tribunal Ontario (HRTO) Help - File Your Application"
        description="Need help with HRTO applications? Get affordable legal assistance for discrimination complaints, human rights violations, and tribunal applications in Ontario. Start your case assessment today."
        keywords="HRTO help, Human Rights Tribunal Ontario, discrimination complaint, human rights lawyer, HRTO application, workplace discrimination, housing discrimination"
        structuredData={structuredData}
      />
      
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                Human Rights Tribunal Ontario
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                HRTO Help: Fight Discrimination with Confidence
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Get expert guidance for your Human Rights Tribunal Ontario application. 
                We help you navigate workplace discrimination, housing issues, and human rights violations 
                with affordable, AI-powered legal assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
                  Start Your HRTO Case Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate("/hrto-journey")}
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
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Justice-Bot for HRTO Cases?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <DollarSign className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>95% Less Than Lawyers</CardTitle>
                  <CardDescription>HRTO applications starting at $5.99 vs $5,000+ for traditional lawyers</CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <Clock className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Fast Turnaround</CardTitle>
                  <CardDescription>Get your HRTO application ready in hours, not weeks</CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <Scale className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Expert AI Analysis</CardTitle>
                  <CardDescription>Our AI reviews 10,000+ HRTO cases to assess your claim's strength</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* HRTO Process */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">How We Help with Your HRTO Application</h2>
              
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Case Assessment & Merit Analysis</h3>
                    <p className="text-muted-foreground">
                      Our AI analyzes your situation against HRTO precedents to determine if you have grounds for discrimination, 
                      harassment, or human rights violations under the Ontario Human Rights Code.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6 items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Application Preparation</h3>
                    <p className="text-muted-foreground">
                      We help you complete HRTO Form 1 (Application) with proper legal language, 
                      ensuring all required information is included and deadlines are met.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6 items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Evidence Organization</h3>
                    <p className="text-muted-foreground">
                      Organize your supporting documents, witness statements, and evidence to build 
                      the strongest possible case for your human rights complaint.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common HRTO Issues */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Common HRTO Cases We Handle</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Workplace Discrimination</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Discrimination based on race, gender, age, disability</li>
                    <li>• Workplace harassment and poisoned work environment</li>
                    <li>• Failure to accommodate disabilities</li>
                    <li>• Pregnancy and family status discrimination</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <FileText className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Housing Discrimination</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Rental discrimination based on protected grounds</li>
                    <li>• Accessibility issues in housing</li>
                    <li>• Harassment by landlords or neighbors</li>
                    <li>• Refusal to accommodate disabilities</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Scale className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Services & Goods</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Discrimination in restaurants, stores, services</li>
                    <li>• Healthcare discrimination</li>
                    <li>• Education-related human rights issues</li>
                    <li>• Public transportation accessibility</li>
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
              <h2 className="text-3xl font-bold text-center mb-12">HRTO Success Statistics</h2>
              
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">68%</div>
                  <p className="text-muted-foreground">Of HRTO applications result in settlements</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">$25K</div>
                  <p className="text-muted-foreground">Average HRTO settlement amount</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">12-18</div>
                  <p className="text-muted-foreground">Months average HRTO process time</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">FREE</div>
                  <p className="text-muted-foreground">No filing fees for HRTO applications</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Don't Let Discrimination Go Unchallenged
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Start your HRTO case assessment today and get the justice you deserve. 
              Our AI-powered platform makes legal help affordable and accessible.
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

export default HRTOHelp;