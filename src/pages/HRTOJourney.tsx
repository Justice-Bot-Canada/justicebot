import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import { UserJourney } from "@/components/UserJourney";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

const HRTOJourney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userSituation } = location.state || {};

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to File an HRTO Human Rights Complaint",
    "description": "Step-by-step guide to filing a human rights complaint with the Human Rights Tribunal of Ontario",
    "totalTime": "P7D",
    "supply": ["Evidence of discrimination", "Contact information", "Written statement", "Form 1", "Schedule A"],
    "tool": ["HRTO Application Form", "Supporting documents", "Form 2 Response"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Gather Evidence",
        "text": "Collect all evidence of discrimination including emails, witness statements, and documentation"
      },
      {
        "@type": "HowToStep", 
        "name": "Complete Form 1 and Schedule A",
        "text": "Fill out the HRTO Form 1 Application and Schedule A with detailed information about your complaint, including specific incidents and protected grounds"
      },
      {
        "@type": "HowToStep",
        "name": "Submit Application",
        "text": "Submit your completed application to the Human Rights Tribunal of Ontario"
      },
      {
        "@type": "HowToStep",
        "name": "Respond to Form 2",
        "text": "If you're a respondent, file Form 2 Response within 35 days with your defences and evidence"
      }
    ]
  };

  const breadcrumbs = [
    { name: "Home", url: "https://justice-bot.com/" },
    { name: "HRTO Journey", url: "https://justice-bot.com/hrto-journey" }
  ];

  const faqData = [
    {
      question: "How long do I have to file an HRTO complaint?",
      answer: "You generally have one year from the date of the last incident of discrimination to file your application with the HRTO."
    },
    {
      question: "What forms do I need for HRTO?",
      answer: "You need Form 1 (Application) and Schedule A (Details of Application). If you're responding to a complaint, you need Form 2 (Response)."
    },
    {
      question: "What is Schedule A?",
      answer: "Schedule A is attached to Form 1 and requires you to provide detailed information about each incident of discrimination, including dates, people involved, what happened, and how it affected you."
    },
    {
      question: "What evidence do I need for my HRTO complaint?",
      answer: "You should gather emails, witness statements, documentation of incidents, and any other evidence that supports your claim of discrimination."
    },
    {
      question: "How much does it cost to file an HRTO complaint?",
      answer: "Filing an application with the HRTO is free. However, you may need legal representation for complex cases."
    },
    {
      question: "What if I receive a Form 2 Response?",
      answer: "Review the respondent's defences carefully with your representative. You may need to file a reply and gather additional evidence to address their claims."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PerformanceMonitor />
      <EnhancedSEO
        title="HRTO Step-by-Step Journey - File Your Human Rights Complaint"
        description="Complete guide to filing an HRTO application. Get step-by-step instructions, deadlines, forms, and pro tips for your human rights complaint in Ontario."
        keywords="HRTO journey, human rights complaint steps, HRTO application guide, discrimination complaint process, Ontario human rights"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
        articleData={{
          publishedTime: "2025-01-27T00:00:00Z",
          modifiedTime: new Date().toISOString(),
          author: "Justice-Bot Legal Team",
          section: "Human Rights",
          tags: ["HRTO", "Human Rights", "Discrimination", "Ontario", "Legal Process"]
        }}
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">HRTO Filing Journey</h1>
            <p className="text-muted-foreground">
              Your complete guide to fighting discrimination through the Human Rights Tribunal of Ontario. We'll help you complete Form 1, Schedule A, and Form 2.
            </p>
          </div>

          <UserJourney 
            venue="hrto"
            userSituation={userSituation}
            onStepComplete={(stepId) => {
              console.log("Step completed:", stepId);
            }}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HRTOJourney;