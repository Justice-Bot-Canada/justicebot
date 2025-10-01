import React from "react";
import { UserJourney } from "@/components/UserJourney";
import EnhancedSEO from "@/components/EnhancedSEO";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

const AccountabilityJourney = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo", 
    "name": "How to File a Complaint with Ontario Ombudsman or Integrity Commissioner",
    "description": "Step-by-step guidance for government accountability complaints, ombudsman requests, and integrity concerns in Ontario",
    "totalTime": "P90D",
    "supply": ["Complaint details", "Supporting documentation", "Correspondence records"],
    "tool": ["Online complaint forms", "Written submissions"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Identify the Right Body",
        "text": "Determine if your complaint goes to the Ombudsman, Integrity Commissioner, or another oversight body"
      },
      {
        "@type": "HowToStep",
        "name": "Exhaust Internal Remedies",
        "text": "Most accountability bodies require you to complain to the organization first"
      },
      {
        "@type": "HowToStep",
        "name": "Submit Your Complaint",
        "text": "File a detailed complaint with supporting evidence through the appropriate channel"
      }
    ]
  };

  const breadcrumbs = [
    { name: "Home", url: "https://justice-bot.com/" },
    { name: "Accountability Journey", url: "https://justice-bot.com/accountability-journey" }
  ];

  const faqData = [
    {
      question: "What does the Ontario Ombudsman do?",
      answer: "The Ombudsman investigates complaints about provincial government organizations, municipalities, universities, school boards, and other public bodies to ensure fair, accountable administration."
    },
    {
      question: "Can the Ombudsman force a government body to act?",
      answer: "While the Ombudsman can't force action, their recommendations carry significant weight. Most organizations comply with Ombudsman recommendations to resolve issues."
    },
    {
      question: "What's the difference between Ombudsman and Integrity Commissioner?",
      answer: "The Ombudsman handles administrative fairness complaints about government services. The Integrity Commissioner deals with ethical conduct of MPPs and conflicts of interest."
    }
  ];

  return (
    <>
      <PerformanceMonitor />
      <EnhancedSEO 
        title="Government Accountability Journey - Justice Bot"
        description="Step-by-step guidance for filing complaints with Ontario Ombudsman, Integrity Commissioner, and other accountability bodies"
        keywords="ontario ombudsman, integrity commissioner, government accountability, complaints, public oversight, fairness"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
        articleData={{
          publishedTime: "2025-01-27T00:00:00Z",
          modifiedTime: new Date().toISOString(),
          author: "Justice-Bot Legal Team",
          section: "Accountability",
          tags: ["Accountability", "Ombudsman", "Integrity Commissioner", "Ontario", "Government Oversight"]
        }}
      />
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <UserJourney 
            venue="accountability"
            userSituation="accountability complaint"
          />
        </div>
      </div>
    </>
  );
};

export default AccountabilityJourney;
