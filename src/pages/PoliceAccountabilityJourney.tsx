import React from "react";
import { UserJourney } from "@/components/UserJourney";
import EnhancedSEO from "@/components/EnhancedSEO";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

const PoliceAccountabilityJourney = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo", 
    "name": "How to File a Complaint Against Police in Ontario",
    "description": "Step-by-step guidance for filing complaints with SIU, OIPRD, or professional standards for police misconduct",
    "totalTime": "P120D",
    "supply": ["Incident details", "Witness statements", "Medical records if applicable", "Photos or videos"],
    "tool": ["Online complaint forms", "Written submissions", "Legal representation"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Determine Which Agency",
        "text": "Identify if your complaint goes to SIU (serious injury/death), OIPRD (misconduct), or Police Service complaint process"
      },
      {
        "@type": "HowToStep",
        "name": "Document Everything",
        "text": "Write down dates, times, officer names/badge numbers, witnesses, and a detailed description of what happened"
      },
      {
        "@type": "HowToStep",
        "name": "File Your Complaint",
        "text": "Submit your complaint through the appropriate channel with all supporting evidence within time limits"
      }
    ]
  };

  const breadcrumbs = [
    { name: "Home", url: "https://justice-bot.com/" },
    { name: "Police Accountability Journey", url: "https://justice-bot.com/police-accountability-journey" }
  ];

  const faqData = [
    {
      question: "What is the SIU and when do they investigate?",
      answer: "The Special Investigations Unit (SIU) investigates incidents involving police where someone has been seriously injured, died, or alleges sexual assault. They are independent of police services."
    },
    {
      question: "How do I file a complaint about police conduct?",
      answer: "Most police conduct complaints go through the Ontario Independent Police Review Director (OIPRD). You can file online, by mail, or in person. There are strict time limits (usually 1 year)."
    },
    {
      question: "Can I remain anonymous when filing a police complaint?",
      answer: "While you can report anonymously to OIPRD initially, you'll need to identify yourself if you want the investigation to proceed. SIU complaints require identification."
    },
    {
      question: "What happens after I file a complaint?",
      answer: "The complaint is screened, investigated, and you receive a decision. For OIPRD, you have appeal rights. SIU investigations can lead to criminal charges against officers."
    }
  ];

  return (
    <>
      <PerformanceMonitor />
      <EnhancedSEO 
        title="Police Accountability Journey - File Complaints (SIU/OIPRD)"
        description="Step-by-step guidance for filing police complaints in Ontario through SIU, OIPRD, or police service professional standards. Know your rights."
        keywords="police complaint ontario, SIU, OIPRD, police misconduct, file complaint against police, police accountability, excessive force"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
        articleData={{
          publishedTime: "2025-01-27T00:00:00Z",
          modifiedTime: new Date().toISOString(),
          author: "Justice-Bot Legal Team",
          section: "Police Accountability",
          tags: ["Police Accountability", "SIU", "OIPRD", "Police Complaints", "Ontario", "Police Misconduct"]
        }}
      />
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <UserJourney 
            venue="police-accountability"
            userSituation="police complaint or misconduct"
          />
        </div>
      </div>
    </>
  );
};

export default PoliceAccountabilityJourney;
