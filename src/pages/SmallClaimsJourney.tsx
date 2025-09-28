import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import { UserJourney } from "@/components/UserJourney";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { PremiumGate } from "@/components/PremiumGate";

const SmallClaimsJourney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userSituation } = location.state || {};

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to File a Small Claims Court Case",
    "description": "Step-by-step guide to filing a claim in Small Claims Court for disputes under $35,000 in Ontario",
    "totalTime": "P30D",
    "supply": ["Evidence of claim", "Defendant contact information", "Financial documents"],
    "tool": ["Plaintiff's Claim Form", "Supporting evidence"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Determine Eligibility",
        "text": "Ensure your claim is under $35,000 and falls within Small Claims Court jurisdiction"
      },
      {
        "@type": "HowToStep",
        "name": "Gather Evidence",
        "text": "Collect contracts, receipts, correspondence, and other evidence supporting your claim"
      },
      {
        "@type": "HowToStep",
        "name": "Complete Plaintiff's Claim",
        "text": "Fill out Form 7A with detailed information about your claim and the defendant"
      },
      {
        "@type": "HowToStep",
        "name": "File and Serve",
        "text": "File your claim with the court and properly serve the defendant"
      }
    ]
  };

  const breadcrumbs = [
    { name: "Home", url: "https://justice-bot.com/" },
    { name: "Small Claims Journey", url: "https://justice-bot.com/small-claims-journey" }
  ];

  const faqData = [
    {
      question: "What is the maximum amount I can claim in Small Claims Court?",
      answer: "In Ontario, you can claim up to $35,000 in Small Claims Court, not including interest and costs."
    },
    {
      question: "How much does it cost to file a Small Claims Court case?",
      answer: "Filing fees range from $102 to $350 depending on the claim amount. Additional fees apply for serving documents and other court services."
    },
    {
      question: "How long does a Small Claims Court case take?",
      answer: "Most cases are resolved within 4-8 months, depending on complexity and whether the defendant disputes the claim."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PerformanceMonitor />
      <EnhancedSEO
        title="Small Claims Court Journey - File Your Claim Under $35,000"
        description="Complete guide to filing a small claims court action. Get step-by-step instructions, forms, deadlines, and strategies for your monetary dispute in Ontario."
        keywords="small claims court journey, small claims process, court claim steps, Ontario small claims, lawsuit under 35000"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
        articleData={{
          publishedTime: "2025-01-27T00:00:00Z",
          modifiedTime: new Date().toISOString(),
          author: "Justice-Bot Legal Team",
          section: "Small Claims",
          tags: ["Small Claims Court", "Legal Process", "Ontario", "Civil Litigation", "Monetary Disputes"]
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
            
            <h1 className="text-3xl font-bold mb-2">Small Claims Court Journey</h1>
            <p className="text-muted-foreground">
              Your complete guide to recovering money through Small Claims Court
            </p>
          </div>

          <PremiumGate feature="Small Claims Court Journey Guide">
            <UserJourney 
              venue="small-claims"
              userSituation={userSituation}
              onStepComplete={(stepId) => {
                console.log("Step completed:", stepId);
              }}
            />
          </PremiumGate>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SmallClaimsJourney;