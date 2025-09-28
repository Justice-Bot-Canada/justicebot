import React from "react";
import { UserJourney } from "@/components/UserJourney";
import EnhancedSEO from "@/components/EnhancedSEO";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

const CriminalJourney = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo", 
    "name": "How to Navigate Criminal Court Proceedings in Ontario",
    "description": "Step-by-step guidance for navigating criminal charges and court proceedings in Ontario",
    "totalTime": "P180D",
    "supply": ["Legal documentation", "Evidence", "Character references"],
    "tool": ["Court forms", "Legal representation"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Understand Charges",
        "text": "Review and understand the criminal charges laid against you"
      },
      {
        "@type": "HowToStep",
        "name": "Seek Legal Representation", 
        "text": "Contact a criminal lawyer or apply for legal aid if you qualify"
      },
      {
        "@type": "HowToStep",
        "name": "Prepare for Court",
        "text": "Gather evidence and prepare your defence with your lawyer"
      }
    ]
  };

  const breadcrumbs = [
    { name: "Home", url: "https://justice-bot.com/" },
    { name: "Criminal Journey", url: "https://justice-bot.com/criminal-journey" }
  ];

  const faqData = [
    {
      question: "Do I need a lawyer for criminal charges?",
      answer: "Yes, it's strongly recommended to have legal representation for criminal charges as the consequences can be severe. Legal aid may be available if you qualify financially."
    },
    {
      question: "What happens at my first court appearance?",
      answer: "At your first appearance, charges will be read, you'll enter a plea, and dates for future proceedings will be set. This is usually brief and procedural."
    }
  ];

  return (
    <>
      <PerformanceMonitor />
      <EnhancedSEO 
        title="Criminal Law Journey - Justice Bot"
        description="Step-by-step guidance for navigating criminal charges and court proceedings in Ontario"
        keywords="criminal law, criminal charges, court proceedings, Ontario criminal law, legal representation"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
        articleData={{
          publishedTime: "2025-01-27T00:00:00Z",
          modifiedTime: new Date().toISOString(),
          author: "Justice-Bot Legal Team",
          section: "Criminal Law",
          tags: ["Criminal Law", "Criminal Charges", "Court Proceedings", "Ontario", "Legal Defence"]
        }}
      />
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <UserJourney 
            venue="criminal"
            userSituation="criminal charges"
          />
        </div>
      </div>
    </>
  );
};

export default CriminalJourney;