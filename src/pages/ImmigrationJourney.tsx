import React from "react";
import { UserJourney } from "@/components/UserJourney";
import EnhancedSEO from "@/components/EnhancedSEO";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

const ImmigrationJourney = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo", 
    "name": "Immigration and Refugee Board Process in Canada",
    "description": "Step-by-step guidance for Immigration and Refugee Board hearings, appeals, and applications",
    "totalTime": "P365D",
    "supply": ["Identity documents", "Country condition evidence", "Personal narrative", "Supporting documents"],
    "tool": ["IRB application forms", "Legal representation", "Interpreter services"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Determine Your Case Type",
        "text": "Identify whether you need refugee protection, immigration appeal, or detention review"
      },
      {
        "@type": "HowToStep",
        "name": "Prepare Your Case",
        "text": "Gather all supporting documents, evidence, and prepare your personal narrative"
      },
      {
        "@type": "HowToStep",
        "name": "Attend Your Hearing",
        "text": "Present your case before the Immigration and Refugee Board with legal representation"
      }
    ]
  };

  const breadcrumbs = [
    { name: "Home", url: "https://justice-bot.com/" },
    { name: "Immigration Journey", url: "https://justice-bot.com/immigration-journey" }
  ];

  const faqData = [
    {
      question: "What is the Immigration and Refugee Board (IRB)?",
      answer: "The IRB is Canada's largest independent administrative tribunal, responsible for making decisions on immigration and refugee matters including refugee protection claims, immigration appeals, detention reviews, and admissibility hearings."
    },
    {
      question: "How long does an IRB hearing take?",
      answer: "Processing times vary widely. Refugee hearings typically take 12-24 months from claim to hearing. Immigration appeals can take 18-36 months depending on complexity and backlog."
    },
    {
      question: "Do I need a lawyer for my IRB case?",
      answer: "While not mandatory, legal representation is strongly recommended for IRB proceedings. Many organizations offer free or low-cost legal aid for refugee claimants."
    },
    {
      question: "Can I appeal an IRB decision?",
      answer: "Yes, depending on the type of decision. Refugee decisions can be appealed to the Refugee Appeal Division (RAD). Some decisions can be judicially reviewed by Federal Court."
    }
  ];

  return (
    <>
      <PerformanceMonitor />
      <EnhancedSEO 
        title="Immigration Journey - IRB Hearings & Refugee Claims"
        description="Step-by-step guidance for Immigration and Refugee Board hearings, refugee protection claims, immigration appeals, and detention reviews in Canada."
        keywords="immigration canada, IRB, refugee claim, immigration appeal, detention review, refugee protection, immigration hearing"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
        articleData={{
          publishedTime: "2025-01-27T00:00:00Z",
          modifiedTime: new Date().toISOString(),
          author: "Justice-Bot Legal Team",
          section: "Immigration & Refugee Law",
          tags: ["Immigration", "IRB", "Refugee Claims", "Immigration Appeals", "Canada", "Refugee Protection"]
        }}
      />
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <UserJourney 
            venue="immigration"
            userSituation="immigration or refugee matter"
          />
        </div>
      </div>
    </>
  );
};

export default ImmigrationJourney;
