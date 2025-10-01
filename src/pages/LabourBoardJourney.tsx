import React from "react";
import { UserJourney } from "@/components/UserJourney";
import EnhancedSEO from "@/components/EnhancedSEO";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

const LabourBoardJourney = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo", 
    "name": "How to File a Labour Board Complaint in Ontario",
    "description": "Step-by-step guidance for filing complaints with Ontario Labour Relations Board for employment disputes",
    "totalTime": "P90D",
    "supply": ["Employment records", "Pay stubs", "Correspondence with employer", "Witness statements"],
    "tool": ["OLRB application forms", "Written submissions", "Legal representation"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Document the Issue",
        "text": "Gather all employment records, emails, and evidence of wrongful dismissal or workplace violations"
      },
      {
        "@type": "HowToStep",
        "name": "File Your Application",
        "text": "Submit your application to the Ontario Labour Relations Board with supporting evidence"
      },
      {
        "@type": "HowToStep",
        "name": "Attend Mediation or Hearing",
        "text": "Participate in mediation sessions or formal hearings to resolve your employment dispute"
      }
    ]
  };

  const breadcrumbs = [
    { name: "Home", url: "https://justice-bot.com/" },
    { name: "Labour Board Journey", url: "https://justice-bot.com/labour-journey" }
  ];

  const faqData = [
    {
      question: "What types of cases does the Labour Board handle?",
      answer: "The Ontario Labour Relations Board handles wrongful dismissal, unjust termination, employment standards violations, union certification, and collective bargaining disputes."
    },
    {
      question: "How long do I have to file a complaint?",
      answer: "Most employment standards complaints must be filed within 2 years of the alleged violation. Union-related matters often have shorter timelines (30-90 days)."
    },
    {
      question: "Do I need a lawyer for a Labour Board case?",
      answer: "While not required, legal representation is recommended for complex cases. The board allows self-representation, and duty counsel may be available."
    },
    {
      question: "What remedies can the Labour Board order?",
      answer: "The board can order reinstatement, back pay, damages, severance pay, and other remedies depending on your case."
    }
  ];

  return (
    <>
      <PerformanceMonitor />
      <EnhancedSEO 
        title="Labour Board Journey - Employment Disputes & Wrongful Dismissal"
        description="Step-by-step guidance for filing Ontario Labour Relations Board complaints for wrongful dismissal, employment standards violations, and workplace rights."
        keywords="labour board ontario, OLRB, wrongful dismissal, employment dispute, workplace rights, unjust termination, employment standards"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
        articleData={{
          publishedTime: "2025-01-27T00:00:00Z",
          modifiedTime: new Date().toISOString(),
          author: "Justice-Bot Legal Team",
          section: "Labour & Employment",
          tags: ["Labour Board", "OLRB", "Employment Law", "Wrongful Dismissal", "Ontario", "Workplace Rights"]
        }}
      />
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <UserJourney 
            venue="labour"
            userSituation="employment dispute or wrongful dismissal"
          />
        </div>
      </div>
    </>
  );
};

export default LabourBoardJourney;
