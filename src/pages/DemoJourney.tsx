import { useState } from "react";
import { CheckCircle2, Circle, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import { useNavigate } from "react-router-dom";

/**
 * Public demo page showing a sample legal journey
 * No authentication required - purely for SEO and user education
 */
const DemoJourney = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Initial Situation",
      description: "Your landlord hasn't fixed the broken heating in your apartment for 3 months, despite multiple requests.",
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            <strong>Scenario:</strong> You're a tenant in Ontario facing a serious maintenance issue.
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-semibold mb-2">Your Details:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Province: Ontario</li>
              <li>Issue: Landlord not maintaining property (no heat)</li>
              <li>Duration: 3 months</li>
              <li>Attempted resolution: Multiple verbal and written requests</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "AI Triage & Analysis",
      description: "Justice-Bot analyzes your situation and identifies the correct legal pathway.",
      content: (
        <div className="space-y-4">
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
            <p className="font-semibold text-primary mb-2">🤖 AI Analysis Result:</p>
            <p className="text-sm mb-3">
              Based on your situation, this is a <strong>Landlord and Tenant Board (LTB)</strong> matter.
            </p>
            <p className="text-sm">
              <strong>Recommended Action:</strong> File a T6 Application (Tenant Application About Maintenance)
            </p>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-semibold mb-2">Your Legal Rights:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Landlords must maintain rental units in good repair</li>
              <li>You can apply to the LTB for a rent reduction</li>
              <li>You may be entitled to compensation for inconvenience</li>
              <li>Filing fee: $53 (may be waived for low income)</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Document Generation",
      description: "Get your T6 application form pre-filled with your information.",
      content: (
        <div className="space-y-4">
          <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg">
            <p className="font-semibold mb-2">📄 Generated Documents:</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span><strong>T6 Application Form</strong> - Pre-filled with your details</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span><strong>Evidence Checklist</strong> - What to gather and how to organize</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span><strong>Timeline Template</strong> - Document all maintenance requests</span>
              </li>
            </ul>
          </div>
          <div className="bg-muted p-4 rounded-lg text-sm">
            <p className="mb-2">
              <strong>What Justice-Bot filled in for you:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Your name and contact information</li>
              <li>Rental property address</li>
              <li>Description of the maintenance issue</li>
              <li>Dates of all repair requests</li>
              <li>Requested remedies and compensation</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Filing Instructions",
      description: "Step-by-step guidance on how to submit your application to the LTB.",
      content: (
        <div className="space-y-4">
          <div className="bg-secondary/10 border border-secondary/20 p-4 rounded-lg">
            <p className="font-semibold mb-3">📮 How to File Your T6 Application:</p>
            <ol className="list-decimal list-inside space-y-3 text-sm">
              <li>
                <strong>Review your completed form</strong>
                <p className="ml-6 mt-1 text-muted-foreground">
                  Double-check all information is accurate
                </p>
              </li>
              <li>
                <strong>Gather your evidence</strong>
                <p className="ml-6 mt-1 text-muted-foreground">
                  Photos of heating system, written requests, receipts for space heaters, etc.
                </p>
              </li>
              <li>
                <strong>Submit online or by mail</strong>
                <p className="ml-6 mt-1 text-muted-foreground">
                  Online: tribunalsontario.ca/ltb (fastest)
                  <br />
                  Mail: Landlord and Tenant Board, 15 Grosvenor St, Toronto
                </p>
              </li>
              <li>
                <strong>Pay the filing fee</strong>
                <p className="ml-6 mt-1 text-muted-foreground">
                  $53 (or apply for fee waiver if low income)
                </p>
              </li>
              <li>
                <strong>Serve your landlord</strong>
                <p className="ml-6 mt-1 text-muted-foreground">
                  Send a copy to your landlord within 5 days of filing
                </p>
              </li>
            </ol>
          </div>
          <div className="bg-muted p-4 rounded-lg text-sm">
            <p className="font-semibold mb-2">⏰ What Happens Next:</p>
            <ul className="space-y-1">
              <li>• You'll receive a hearing notice (usually 4-8 weeks)</li>
              <li>• Prepare for your hearing with our hearing guide</li>
              <li>• Attend the hearing (in-person or virtual)</li>
              <li>• Receive the Board's decision within 2-4 weeks</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Success!",
      description: "You're now prepared to pursue your legal rights confidently.",
      content: (
        <div className="space-y-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
            <h3 className="font-bold text-xl mb-3 text-green-900">
              You're Ready to Take Action!
            </h3>
            <p className="text-green-800 mb-4">
              With Justice-Bot, you've learned:
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Your legal rights as a tenant in Ontario</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>The correct tribunal to file with (LTB)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>How to complete and file the T6 form</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>What evidence to gather and how to present it</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Step-by-step filing instructions</span>
              </li>
            </ul>
          </div>
          <div className="pt-4">
            <p className="text-muted-foreground mb-4">
              Ready to get help with your own legal issue?
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/welcome")}
              className="gap-2"
            >
              Start Your Free Journey
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to File a Landlord and Tenant Board Application in Ontario",
    "description": "Step-by-step demo showing how Justice-Bot helps tenants file LTB applications for maintenance issues without a lawyer",
    "totalTime": "PT30M",
    "step": demoSteps.slice(0, -1).map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.title,
      "text": step.description
    }))
  };

  const breadcrumbs = [
    { name: "Home", url: "https://justice-bot.com/" },
    { name: "Demo Journey", url: "https://justice-bot.com/demo-journey" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <EnhancedSEO
        title="Live Demo: Filing an LTB Application | Justice-Bot"
        description="See how Justice-Bot helps Ontario tenants file Landlord and Tenant Board applications step-by-step. No lawyer required. Watch a real example with a maintenance issue."
        keywords="LTB application demo, landlord tenant board example, tenant rights Ontario, file T6 application, legal help demo"
        canonicalUrl="https://justice-bot.com/demo-journey"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            See Justice-Bot in Action
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow this interactive demo showing how a tenant uses Justice-Bot to file 
            a Landlord and Tenant Board application for a maintenance issue.
          </p>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-between items-center mb-8">
          {demoSteps.map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              <button
                onClick={() => setCurrentStep(index)}
                className="flex flex-col items-center gap-2 group"
              >
                {index <= currentStep ? (
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                ) : (
                  <Circle className="w-8 h-8 text-muted-foreground" />
                )}
                <span className={`text-xs hidden md:block ${index <= currentStep ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
              </button>
              {index < demoSteps.length - 1 && (
                <div className={`flex-1 h-0.5 ${index < currentStep ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Current step content */}
        <Card className="p-8">
          <div className="mb-6">
            <div className="text-sm text-primary font-semibold mb-2">
              Step {currentStep + 1} of {demoSteps.length}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {demoSteps[currentStep].title}
            </h2>
            <p className="text-muted-foreground">
              {demoSteps[currentStep].description}
            </p>
          </div>

          <div className="mb-8">
            {demoSteps[currentStep].content}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            {currentStep < demoSteps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="gap-2"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/welcome")}
                className="gap-2"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>

        {/* Additional info */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            This is a demonstration scenario. Your actual case will be customized to your specific situation.
          </p>
          <p className="mt-2">
            Justice-Bot supports multiple legal pathways including LTB, HRTO, Small Claims Court, and more.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DemoJourney;
