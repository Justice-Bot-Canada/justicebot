import { LegalChatbot } from '@/components/LegalChatbot';
import { LegalResearchPanel } from '@/components/LegalResearchPanel';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Scale, FileText, Clock, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const FEATURES = [
  { icon: Scale, title: "All Major Tribunals", desc: "LTB, HRTO, Small Claims, Family, Criminal" },
  { icon: FileText, title: "Form Guidance", desc: "Know which forms you need and how to fill them" },
  { icon: Clock, title: "Deadlines & Timelines", desc: "Understand limitation periods and next steps" },
  { icon: Shield, title: "Rights Explained", desc: "Learn your legal rights in plain language" },
];

export default function LegalChat() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Free AI Legal Assistant - Ask Legal Questions"
        description="Get instant answers to your legal questions about Ontario courts and tribunals. Free AI-powered legal chatbot for landlord tenant, human rights, small claims, family court and more."
        keywords="legal chatbot, AI legal assistant, free legal help, Ontario legal questions, LTB help, HRTO help"
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b bg-gradient-to-b from-primary/5 to-background py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <Badge variant="secondary" className="mb-4">
                Free • 24/7 • Ontario-Focused
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                AI Legal Assistant
              </h1>
              <p className="text-lg text-muted-foreground">
                Get instant answers about legal procedures, forms, and deadlines for Ontario courts and tribunals
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2 text-sm">
                  <f.icon className="w-4 h-4 text-primary" />
                  <span className="font-medium">{f.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Chat Section */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Chat - Takes 2/3 on large screens */}
              <div className="lg:col-span-2">
                <LegalChatbot />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* CTA Card */}
                {!user && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Get Started Free
                      </CardTitle>
                      <CardDescription>
                        Sign in to use the AI assistant and save your conversations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link to="/welcome">
                        <Button className="w-full">
                          Create Free Account
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}

                {/* What You Can Ask */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">What You Can Ask</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      "How do I file a complaint at the LTB?",
                      "What evidence do I need for HRTO?",
                      "How long do I have to file in Small Claims?",
                      "What forms do I need for custody?",
                      "Can I represent myself in court?",
                    ].map((q, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{q}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Legal Research */}
                <LegalResearchPanel />

                {/* Quick Links */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Need More Help?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link to="/triage" className="block">
                      <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                        <div>
                          <p className="font-medium">Smart Case Assessment</p>
                          <p className="text-xs text-muted-foreground">Get personalized form recommendations</p>
                        </div>
                      </Button>
                    </Link>
                    <Link to="/forms" className="block">
                      <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                        <div>
                          <p className="font-medium">Browse All Forms</p>
                          <p className="text-xs text-muted-foreground">51+ legal forms for Ontario</p>
                        </div>
                      </Button>
                    </Link>
                    <Link to="/pricing" className="block">
                      <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                        <div>
                          <p className="font-medium">Premium Features</p>
                          <p className="text-xs text-muted-foreground">AI-powered form completion</p>
                        </div>
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Banner */}
        <section className="border-t py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm text-muted-foreground">
                <strong>Important:</strong> Justice-Bot provides legal information, not legal advice. 
                We are not a law firm or Legal Aid Ontario. For complex matters or if you need representation, 
                please consult with a qualified lawyer. Justice-Bot helps you understand procedures and prepare 
                - it does not replace professional legal counsel.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}