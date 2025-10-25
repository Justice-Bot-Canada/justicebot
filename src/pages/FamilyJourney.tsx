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
    "supply": ["Marriage certificate", "Financial documents", "Parenting plan", "Form 8A", "Form 36", "Form 13.1", "Form 35.1"],
    "tool": ["Family court forms", "Legal documentation", "Form 8", "Form 10"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Determine Court Type",
        "text": "Identify whether your matter belongs in Family Court or Superior Court"
      },
      {
        "@type": "HowToStep",
        "name": "Complete Required Forms",
        "text": "Fill out Form 8A for divorce, Form 8B for support, or Form 8 for other family matters"
      },
      {
        "@type": "HowToStep",
        "name": "Complete Financial Disclosure",
        "text": "File Form 13 (support claims under $150k) or Form 13.1 (property division or income over $150k)"
      },
      {
        "@type": "HowToStep",
        "name": "File Affidavit",
        "text": "For divorce: Form 36. For custody: Form 35.1 with parenting plan"
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
      question: "What forms do I need for divorce in Ontario?",
      answer: "You need Form 8A (Application for Divorce), Form 36 (Affidavit for Divorce), and Form 13 or 13.1 (Financial Statement). You'll also need your marriage certificate and proof of separation."
    },
    {
      question: "What's the difference between Form 13 and Form 13.1?",
      answer: "Use Form 13 if you're only claiming support and your income is under $150,000. Use Form 13.1 if you're claiming property division or your income exceeds $150,000."
    },
    {
      question: "What forms do I need for custody and access?",
      answer: "You need Form 8 or Form 8A (depending on if you're also divorcing), Form 35.1 (Affidavit for Decision-Making/Parenting Time), and a detailed parenting plan. The court may also appoint the Office of the Children's Lawyer."
    },
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