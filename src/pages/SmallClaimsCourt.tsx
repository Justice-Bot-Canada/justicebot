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
import EnhancedSEO from "@/components/EnhancedSEO";
import { CanonicalURL } from "@/components/CanonicalURL";
import { RelatedPages } from "@/components/RelatedPages";
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
    "@type": "HowTo",
    "name": "How to File a Small Claims Court Case in Ontario",
    "description": "Step-by-step guide to filing a Small Claims Court case in Ontario for debt collection, contract disputes, and civil claims under $35,000",
    "totalTime": "PT2H",
    "supply": ["Contract or invoice", "Evidence documentation", "Defendant information"],
    "tool": ["Justice-Bot platform", "Plaintiff's Claim Form 7A"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Assess Your Claim",
        "text": "Determine if your claim is under $35,000 and suitable for Small Claims Court. Gather evidence of debt, contract breach, or damages."
      },
      {
        "@type": "HowToStep",
        "name": "Complete Plaintiff's Claim",
        "text": "Fill out Form 7A with detailed facts, amounts owed, and what you're seeking from the defendant."
      },
      {
        "@type": "HowToStep",
        "name": "File and Serve",
        "text": "Submit your claim to the court, pay the filing fee, and properly serve the defendant within required timeframes."
      }
    ]
  };

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Small Claims Court Help", url: "/small-claims" }
  ];

  const faqData = [
    {
      question: "What is the maximum claim amount in Ontario Small Claims Court?",
      answer: "The maximum claim amount in Ontario Small Claims Court is $35,000, not including interest and costs."
    },
    {
      question: "How much does it cost to file a Small Claims Court case?",
      answer: "Filing fees range from $102 for claims over $2,500 to $75 for claims under $2,500. There may be additional costs for serving documents."
    },
    {
      question: "How long does a Small Claims Court case take?",
      answer: "Most Small Claims Court cases take 3-6 months from filing to resolution, though complex cases may take longer."
    },
    {
      question: "Do I need a lawyer for Small Claims Court?",
      answer: "No, you can represent yourself in Small Claims Court. Justice-Bot provides affordable guidance to help you prepare your case without expensive lawyer fees."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <CanonicalURL />
      <EnhancedSEO
        title="Small Claims Court Ontario 2025 - Sue for $35,000 | 85% Success Rate"
        description="File Small Claims Court Ontario claim in 3 steps. Sue for up to $35,000. Debt collection, contract disputes, property damage. Forms 7A, 9A, 10A from $5.99. FREE case evaluation. 85% win rate with proper prep."
        keywords="small claims court Ontario, small claims court, how to sue someone Ontario, small claims court forms, small claims Ontario limit, file small claims, debt collection Ontario, sue for money, small claims court fees, Form 7A"
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
                Small Claims Court Ontario
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Small Claims Court Ontario: Sue for Up to $35,000
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
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate("/small-claims-journey")}
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

        {/* Related Pages for Internal Linking */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <RelatedPages 
              title="Related Legal Resources"
              description="Explore other ways to resolve your dispute"
              pages={[
                { title: "LTB Help Ontario", description: "Tenant disputes and eviction help", path: "/ltb-help", icon: "help", category: "Tribunal" },
                { title: "Human Rights Tribunal", description: "File discrimination complaints", path: "/hrto-journey", icon: "file", category: "Tribunal" },
                { title: "Family Court Help", description: "Custody, support, and divorce", path: "/family-journey", icon: "book", category: "Court" },
                { title: "Settlement Calculator", description: "Estimate your claim value", path: "/settlement-calculator", icon: "calculator", category: "Tool" },
              ]}
            />
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