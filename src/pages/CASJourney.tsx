import React from "react";
import { UserJourney } from "@/components/UserJourney";
import EnhancedSEO from "@/components/EnhancedSEO";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

const CASJourney = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo", 
    "name": "How to Navigate CAS Involvement and Child Protection Proceedings",
    "description": "Step-by-step guidance for parents dealing with Children's Aid Society (CAS) investigations and child protection court proceedings",
    "totalTime": "P365D",
    "supply": ["Legal representation", "Medical records", "Character references", "Parenting assessment results"],
    "tool": ["Family lawyer", "Legal aid", "Court forms", "Support services"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Understand CAS Powers",
        "text": "Learn what CAS can and cannot do, your rights during investigations, and when they can remove children"
      },
      {
        "@type": "HowToStep",
        "name": "Get Legal Representation",
        "text": "Contact a family lawyer experienced in child protection immediately. Legal aid is available for CAS cases."
      },
      {
        "@type": "HowToStep",
        "name": "Comply and Document",
        "text": "Cooperate with CAS, follow safety plans, attend required services, and document all interactions"
      },
      {
        "@type": "HowToStep",
        "name": "Court Proceedings",
        "text": "Attend all court dates, present evidence of changes made, and work toward reunification or alternative plan"
      }
    ]
  };

  const breadcrumbs = [
    { name: "Home", url: "https://justice-bot.com/" },
    { name: "CAS Journey", url: "https://justice-bot.com/cas-journey" }
  ];

  const faqData = [
    {
      question: "What should I do if CAS contacts me?",
      answer: "Cooperate respectfully, ask to see their identification, understand why they're investigating, and contact a family lawyer immediately. You have rights, but refusing to cooperate can escalate the situation."
    },
    {
      question: "Can CAS take my children without a court order?",
      answer: "CAS can apprehend children without a court order only if they believe the child is at immediate risk of harm. They must bring the case to court within 5 days for a hearing."
    },
    {
      question: "How do I get my children back from CAS?",
      answer: "Work with your lawyer to address the concerns raised, complete required programs (parenting, counseling, etc.), demonstrate changes, and present evidence at court hearings. The process takes time."
    },
    {
      question: "Do I qualify for legal aid in a CAS case?",
      answer: "Yes! Legal aid is available for parents involved in child protection proceedings regardless of income. This is one of the few areas where legal aid is broadly accessible."
    },
    {
      question: "What happens at a child protection court hearing?",
      answer: "The court determines if your child needs protection, what plan is in the child's best interests, and sets conditions. You'll present evidence through your lawyer and have the right to challenge CAS's claims."
    }
  ];

  return (
    <>
      <PerformanceMonitor />
      <EnhancedSEO 
        title="CAS & Child Protection Journey - Navigate Children's Aid Society"
        description="Step-by-step guidance for parents dealing with CAS investigations and child protection court proceedings. Understand your rights, legal aid, and reunification."
        keywords="CAS ontario, children's aid society, child protection, family court, CAS investigation, child apprehension, legal aid, reunification"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
        articleData={{
          publishedTime: "2025-01-27T00:00:00Z",
          modifiedTime: new Date().toISOString(),
          author: "Justice-Bot Legal Team",
          section: "Child Protection",
          tags: ["Child Protection", "CAS", "Family Law", "Ontario", "Child Welfare", "Legal Aid"]
        }}
      />
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <UserJourney 
            venue="cas"
            userSituation="CAS involvement or child protection"
          />
        </div>
      </div>
    </>
  );
};

export default CASJourney;
