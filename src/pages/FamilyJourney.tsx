import React from "react";
import { UserJourney } from "@/components/UserJourney";
import EnhancedSEO from "@/components/EnhancedSEO";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { JourneyHeader } from "@/components/JourneyHeader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
        title="Child Custody Ontario 2025 - Custody Forms, CAS Help & Family Court"
        description="Child custody help Ontario. Get custody forms (8A, 35.1), fight CAS removal, file for sole or joint custody. Family court procedures, parenting plans, access schedules. Affordable legal guidance from $5.99."
        keywords="child custody Ontario, custody forms Ontario, how to get custody, sole custody Ontario, joint custody Ontario, CAS removal, family court Ontario, custody agreement, parenting plan Ontario, child access rights"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
        articleData={{
          publishedTime: "2025-01-27T00:00:00Z",
          modifiedTime: new Date().toISOString(),
          author: "Justice-Bot Legal Team",
          section: "Family Law",
          tags: ["Child Custody", "Custody Forms", "CAS", "Family Court", "Ontario", "Parenting Plan"]
        }}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="container mx-auto px-4 py-8" tabIndex={-1}>
          <div className="max-w-4xl mx-auto">
            <JourneyHeader
              title="Child Custody Ontario: Get Custody Forms & Family Court Help"
              description="Complete guide to child custody in Ontario. File for sole or joint custody, get parenting plans, access schedules, and fight CAS removal with affordable AI legal assistance."
              whoIsItFor="Anyone dealing with divorce, custody/access, child support, spousal support, property division, or child protection matters in Ontario"
              whatYouGet={[
                "Step-by-step guidance for your specific family law matter",
                "Help completing required forms (8, 8A, 8B, 13, 13.1, 35.1, 36)",
                "Financial statement preparation guidance",
                "Custody and parenting plan assistance",
                "Timeline tracking and deadline management"
              ]}
              timeToComplete="1-2 hours for initial forms, ongoing support throughout your case"
              whatYouNeed={[
                "Marriage certificate (for divorce)",
                "Financial documents (pay stubs, tax returns, assets/debts)",
                "Details about children (for custody/support)",
                "Separation date and circumstances",
                "Property and debt information (if applicable)"
              ]}
              ctaText="Start Family Law Journey"
              ctaLink="/triage"
            />
            
            <UserJourney 
              venue="family"
              userSituation="family law matter"
            />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default FamilyJourney;