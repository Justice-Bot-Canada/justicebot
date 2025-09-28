import React from "react";
import { UserJourney } from "@/components/UserJourney";
import EnhancedSEO from "@/components/EnhancedSEO";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

const FamilyJourney = () => {
  const structuredData = {
    "@context": "https://schema.org", 
    "@type": "HowTo",
    "name": "How to Navigate Family Court in Ontario",
    "description": "Step-by-step guide for divorce, custody, child protection, and family court matters in Ontario",
    "totalTime": "P60D",
    "supply": ["Marriage certificate", "Financial documents", "Parenting plan"],
    "tool": ["Family court forms", "Legal documentation"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Determine Court Type",
        "text": "Identify whether your matter belongs in Family Court or Superior Court"
      },
      {
        "@type": "HowToStep",
        "name": "Complete Required Forms",
        "text": "Fill out the appropriate family court forms for your specific situation"
      },
      {
        "@type": "HowToStep",
        "name": "File Application",
        "text": "Submit your completed forms and supporting documents to the court"
      }
    ]
  };

  const breadcrumbs = [
    { name: "Home", url: "https://justice-bot.com/" },
    { name: "Family Journey", url: "https://justice-bot.com/family-journey" }
  ];

  const faqData = [
    {
      question: "Do I need a lawyer for family court?",
      answer: "While you can represent yourself in family court, complex matters involving custody, property division, or child protection often benefit from legal representation."
    },
    {
      question: "How long does a divorce take in Ontario?",
      answer: "An uncontested divorce typically takes 4-6 months, while contested divorces can take 1-2 years or longer depending on complexity."
    }
  ];

  return (
    <>
      <PerformanceMonitor />
      <EnhancedSEO 
        title="Family Law Journey - Justice Bot"
        description="Step-by-step guidance for divorce, custody, child protection, and family court matters in Ontario"
        keywords="family law, divorce, custody, child protection, family court, Ontario family law"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
        articleData={{
          publishedTime: "2025-01-27T00:00:00Z",
          modifiedTime: new Date().toISOString(),
          author: "Justice-Bot Legal Team",
          section: "Family Law",
          tags: ["Family Law", "Divorce", "Custody", "Ontario", "Legal Process"]
        }}
      />
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <UserJourney 
            venue="family"
            userSituation="family law matter"
          />
        </div>
      </div>
    </>
  );
};

export default FamilyJourney;