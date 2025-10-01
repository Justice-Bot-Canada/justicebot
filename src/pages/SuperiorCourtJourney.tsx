import React from "react";
import { UserJourney } from "@/components/UserJourney";
import EnhancedSEO from "@/components/EnhancedSEO";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

const SuperiorCourtJourney = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo", 
    "name": "How to Navigate Ontario Superior Court of Justice",
    "description": "Step-by-step guidance for civil litigation, appeals, and judicial review in Ontario Superior Court",
    "totalTime": "P365D",
    "supply": ["Legal documents", "Evidence", "Court forms", "Filing fees"],
    "tool": ["Superior Court forms", "Legal representation"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Determine Jurisdiction",
        "text": "Confirm your matter belongs in Superior Court based on monetary threshold or case type"
      },
      {
        "@type": "HowToStep",
        "name": "Retain Legal Counsel",
        "text": "Superior Court cases typically require experienced legal representation"
      },
      {
        "@type": "HowToStep",
        "name": "File Statement of Claim",
        "text": "Draft and file your statement of claim or notice of application with supporting documentation"
      }
    ]
  };

  const breadcrumbs = [
    { name: "Home", url: "https://justice-bot.com/" },
    { name: "Superior Court Journey", url: "https://justice-bot.com/superior-court-journey" }
  ];

  const faqData = [
    {
      question: "What types of cases go to Superior Court?",
      answer: "Superior Court hears civil cases over $35,000, complex family matters, judicial reviews, estate litigation, and appeals from lower courts."
    },
    {
      question: "Do I need a lawyer for Superior Court?",
      answer: "While self-representation is allowed, Superior Court cases are complex and legal representation is strongly recommended. The procedural rules are strict and mistakes can be costly."
    },
    {
      question: "How long does a Superior Court case take?",
      answer: "Superior Court cases can take 1-3 years or longer depending on complexity, with multiple pre-trial steps including discoveries, motions, and settlement conferences."
    }
  ];

  return (
    <>
      <PerformanceMonitor />
      <EnhancedSEO 
        title="Superior Court Journey - Justice Bot"
        description="Step-by-step guidance for navigating Ontario Superior Court of Justice civil litigation, appeals, and judicial review"
        keywords="superior court, Ontario court, civil litigation, judicial review, appeals, legal proceedings"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
        articleData={{
          publishedTime: "2025-01-27T00:00:00Z",
          modifiedTime: new Date().toISOString(),
          author: "Justice-Bot Legal Team",
          section: "Superior Court",
          tags: ["Superior Court", "Civil Litigation", "Appeals", "Ontario", "Legal Process"]
        }}
      />
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <UserJourney 
            venue="superior"
            userSituation="superior court matter"
          />
        </div>
      </div>
    </>
  );
};

export default SuperiorCourtJourney;
