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

const LTBJourney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userSituation } = location.state || {};

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to File an LTB Application",
    "description": "Step-by-step guide to filing an application with the Landlord and Tenant Board in Ontario",
    "totalTime": "P14D",
    "supply": ["Lease agreement", "Evidence of issues", "Rent receipts", "Photos/videos"],
    "tool": ["LTB Application Form", "Supporting documents"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Identify the Issue",
        "text": "Determine whether your issue falls under LTB jurisdiction and identify the appropriate application form"
      },
      {
        "@type": "HowToStep",
        "name": "Gather Evidence", 
        "text": "Collect all relevant documentation including lease agreements, receipts, photos, and communications"
      },
      {
        "@type": "HowToStep",
        "name": "Complete Application",
        "text": "Fill out the appropriate LTB application form with detailed information about your case"
      },
      {
        "@type": "HowToStep",
        "name": "Pay Filing Fee",
        "text": "Submit the required filing fee along with your application"
      },
      {
        "@type": "HowToStep",
        "name": "Serve Documents",
        "text": "Properly serve the application and supporting documents to the other party"
      }
    ]
  };

  const breadcrumbs = [
    { name: "Home", url: "https://justice-bot.com/" },
    { name: "LTB Journey", url: "https://justice-bot.com/ltb-journey" }
  ];

  const faqData = [
    {
      question: "How much does it cost to file an LTB application?",
      answer: "LTB application fees range from $48 to $201 depending on the type of application. Fee waivers are available for those who qualify based on income."
    },
    {
      question: "How long does the LTB process take?",
      answer: "The time varies depending on the type of application and current caseload, but most hearings are scheduled within 25-70 days of filing."
    },
    {
      question: "Can I represent myself at the LTB?",
      answer: "Yes, you can represent yourself at the LTB. Many people do so successfully, especially with proper preparation and understanding of the process."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PerformanceMonitor />
      <EnhancedSEO
        title="LTB Step-by-Step Journey - File Your Landlord Tenant Board Application"
        description="Complete guide to filing an LTB application. Get step-by-step instructions, forms, deadlines, and expert tips for your landlord-tenant dispute in Ontario."
        keywords="LTB journey, landlord tenant board steps, LTB application guide, tenant rights process, Ontario LTB"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
        articleData={{
          publishedTime: "2025-01-27T00:00:00Z",
          modifiedTime: new Date().toISOString(),
          author: "Justice-Bot Legal Team",
          section: "Landlord Tenant",
          tags: ["LTB", "Landlord Tenant Board", "Tenant Rights", "Ontario", "Rental Disputes"]
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
            
            <h1 className="text-3xl font-bold mb-2">LTB Filing Journey</h1>
            <p className="text-muted-foreground">
              Your complete guide to protecting tenant rights through the Landlord and Tenant Board
            </p>
          </div>

          <PremiumGate feature="LTB Legal Journey Guide">
            <UserJourney 
              venue="ltb"
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

export default LTBJourney;