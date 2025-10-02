import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, BookOpen, Brain, FileText, MessageSquare, ArrowRight } from "lucide-react";

const Explain = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Our AI analyzes your case details and provides personalized merit scores and pathway recommendations."
    },
    {
      icon: FileText,
      title: "Document Preparation",
      description: "Generate court-ready documents with automated form filling based on your case information."
    },
    {
      icon: BookOpen,
      title: "Step-by-Step Guidance",
      description: "Navigate complex legal procedures with clear, province-specific instructions for each stage."
    },
    {
      icon: MessageSquare,
      title: "Legal Chat Assistant",
      description: "Get answers to legal questions 24/7 from our AI legal assistant trained on Canadian law."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="How Justice Bot Works - AI Legal Assistance Explained"
        description="Learn how Justice Bot helps self-represented litigants navigate Canadian courts and tribunals using AI-powered analysis, document preparation, and step-by-step guidance."
        keywords="how Justice Bot works, AI legal assistance, self-representation guide, legal tech explained, Canadian legal system"
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <HelpCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">How Justice Bot Works</h1>
            <p className="text-xl text-muted-foreground">
              Your AI-powered guide through the Canadian legal system
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What is Justice Bot?</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                Justice Bot is an intelligent legal assistance platform designed to help Canadians navigate courts and 
                tribunals without a lawyer. We combine artificial intelligence, legal knowledge, and user-friendly tools 
                to make the legal system accessible to everyone.
              </p>
              <p>
                Whether you're facing a landlord-tenant dispute, human rights violation, small claims matter, or any other 
                legal issue, Justice Bot provides the guidance, documents, and support you need to represent yourself 
                effectively.
              </p>
            </CardContent>
          </Card>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-primary" />
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>How It Works: Step by Step</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Tell Us About Your Case</h3>
                    <p className="text-muted-foreground">
                      Answer questions about your legal situation, provide relevant details, and upload any documents 
                      you have. The more information you provide, the better we can help.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Get AI Analysis</h3>
                    <p className="text-muted-foreground">
                      Our AI analyzes your case using Canadian legal principles and provides a merit score, identifies 
                      relevant legal issues, and suggests the best pathways forward.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Choose Your Path</h3>
                    <p className="text-muted-foreground">
                      Review your options including filing with a tribunal, going to court, seeking mediation, or other 
                      alternatives. We help you understand the pros and cons of each pathway.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Prepare Documents</h3>
                    <p className="text-muted-foreground">
                      Use our document builder to create court-ready forms and filings. Your case information 
                      automatically pre-fills forms, saving time and reducing errors.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Follow Guided Procedures</h3>
                    <p className="text-muted-foreground">
                      Get step-by-step instructions for filing, serving documents, responding to motions, preparing 
                      for hearings, and all other procedural requirements specific to your venue and province.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    6
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Get Ongoing Support</h3>
                    <p className="text-muted-foreground">
                      Access our legal chat assistant anytime, manage your evidence, track deadlines, and receive 
                      updates throughout your case journey.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Who Should Use Justice Bot?</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>Justice Bot is designed for:</p>
              <ul>
                <li><strong>Self-Represented Litigants:</strong> People who want or need to represent themselves in legal matters</li>
                <li><strong>Those on Limited Budgets:</strong> Individuals who cannot afford traditional legal representation</li>
                <li><strong>Early-Stage Researchers:</strong> People exploring their options before deciding how to proceed</li>
                <li><strong>Document Preparers:</strong> Anyone who needs help creating legal documents</li>
                <li><strong>Legal Information Seekers:</strong> People who want to understand their rights and legal procedures</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What Justice Bot Is NOT</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Justice Bot is an educational and procedural tool. We provide information, guidance, and document 
                preparation assistance. However:
              </p>
              <ul className="text-muted-foreground">
                <li>We do not provide legal advice - only general legal information</li>
                <li>We do not create an attorney-client relationship</li>
                <li>We cannot represent you in court or at hearings</li>
                <li>We cannot guarantee outcomes or success</li>
                <li>For complex matters, you should still consult with a licensed lawyer</li>
              </ul>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <Button size="lg" onClick={() => navigate("/triage")}>
              Get Started with Your Case
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <div>
              <Button variant="outline" onClick={() => navigate("/tutorials")}>
                Watch Tutorial Videos
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Explain;
