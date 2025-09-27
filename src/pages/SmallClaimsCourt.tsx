import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Scale, 
  FileText, 
  Clock, 
  DollarSign, 
  Calculator, 
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

const SmallClaimsCourt = () => {
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
    "name": "Small Claims Court Ontario Help",
    "description": "Get affordable legal help for Small Claims Court applications, debt collection, contract disputes, and civil claims under $35,000 in Ontario",
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
        title="Small Claims Court Ontario Help - File Your Claim Under $35,000"
        description="Need help with Small Claims Court in Ontario? Get affordable legal assistance for debt collection, contract disputes, and civil claims under $35,000. Expert guidance starting at $5.99."
        keywords="Small Claims Court Ontario, debt collection, contract dispute, civil claim, small claims lawyer, sue for money, court forms Ontario"
        structuredData={structuredData}
      />
      
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                Small Claims Court Ontario
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Small Claims Court Help: Get Your Money Back
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                File your Small Claims Court application with confidence. 
                We help you recover debts, settle contract disputes, and pursue civil claims up to $35,000
                with affordable, AI-powered legal assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
                  Start Your Small Claims Assessment
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
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Justice-Bot for Small Claims?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <DollarSign className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Save Thousands</CardTitle>
                  <CardDescription>Small Claims help starting at $5.99 vs $2,500+ for traditional lawyers</CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <Calculator className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Claims Up to $35K</CardTitle>
                  <CardDescription>Handle any dispute under Ontario's Small Claims Court limit</CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <Scale className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>High Success Rate</CardTitle>
                  <CardDescription>Our AI analyzes winning strategies from 20,000+ Small Claims cases</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Small Claims Process */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">How We Help with Your Small Claims Case</h2>
              
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Case Evaluation & Strategy</h3>
                    <p className="text-muted-foreground">
                      We assess your claim's strength, calculate damages, and determine the best legal strategy 
                      to maximize your chances of success in Small Claims Court.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6 items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Plaintiff's Claim Preparation</h3>
                    <p className="text-muted-foreground">
                      Complete Form 7A (Plaintiff's Claim) with proper legal language, 
                      detailed facts, and clear statement of what you're seeking from the defendant.
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
                      Organize contracts, receipts, correspondence, photos, and witness statements 
                      to build a compelling case that meets Small Claims Court standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common Small Claims Issues */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Common Small Claims Cases We Handle</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <DollarSign className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Debt Collection</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Unpaid loans and IOUs</li>
                    <li>• Unpaid invoices and services</li>
                    <li>• Bounced cheques (NSF)</li>
                    <li>• Money borrowed from friends/family</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <FileText className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Contract Disputes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Breach of contract claims</li>
                    <li>• Defective goods and services</li>
                    <li>• Home renovation disputes</li>
                    <li>• Business agreement violations</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Scale className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Property Damage</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Motor vehicle accidents</li>
                    <li>• Property damage by neighbors</li>
                    <li>• Damage to personal belongings</li>
                    <li>• Security deposit disputes</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Filing Fees & Limits */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-center mb-12">Small Claims Court Filing Fees & Limits</h2>
              
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">$35,000</div>
                  <p className="text-muted-foreground">Maximum claim amount in Ontario</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">$102</div>
                  <p className="text-muted-foreground">Filing fee for claims over $2,500</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">3-6</div>
                  <p className="text-muted-foreground">Months typical case duration</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">85%</div>
                  <p className="text-muted-foreground">Success rate with proper preparation</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Stop Letting People Owe You Money
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Get the money you're owed with professional Small Claims Court help. 
              Our AI-powered platform makes it easy and affordable to pursue your claim.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={handleGetStarted}
              className="text-lg px-8"
            >
              Start Your Free Claim Assessment
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

export default SmallClaimsCourt;