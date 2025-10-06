import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedSEO from '@/components/EnhancedSEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Scale, 
  Users, 
  Home, 
  Shield, 
  Gavel, 
  Baby, 
  Briefcase, 
  Globe, 
  Building2,
  ArrowRight,
  MapPin
} from 'lucide-react';

const Journey = () => {
  const journeys = [
    {
      title: "Human Rights Tribunal (HRTO)",
      description: "File discrimination complaints based on protected grounds in Ontario",
      icon: Users,
      path: "/hrto-journey",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      topics: ["Discrimination", "Harassment", "Accommodation"]
    },
    {
      title: "Landlord & Tenant Board (LTB)",
      description: "Resolve rental disputes, evictions, and maintenance issues",
      icon: Home,
      path: "/ltb-journey",
      color: "text-green-600",
      bgColor: "bg-green-50",
      topics: ["Evictions", "Rent Issues", "Repairs"]
    },
    {
      title: "Small Claims Court",
      description: "Civil disputes up to $35,000 - debt, contracts, property damage",
      icon: Scale,
      path: "/small-claims-journey",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      topics: ["Contract Disputes", "Debt Collection", "Property Damage"]
    },
    {
      title: "Police Accountability",
      description: "File complaints about police conduct in your province",
      icon: Shield,
      path: "/police-accountability-journey",
      color: "text-red-600",
      bgColor: "bg-red-50",
      topics: ["Police Complaints", "Misconduct", "Rights Violations"]
    },
    {
      title: "Family Court",
      description: "Child custody, support, divorce, and family matters",
      icon: Users,
      path: "/family-journey",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      topics: ["Custody", "Support", "Divorce"]
    },
    {
      title: "Criminal Court",
      description: "Navigate criminal charges and court proceedings",
      icon: Gavel,
      path: "/criminal-journey",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      topics: ["Criminal Charges", "Court Appearance", "Defence"]
    },
    {
      title: "Child Protection (CAS)",
      description: "Respond to Children's Aid Society involvement",
      icon: Baby,
      path: "/cas-journey",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      topics: ["Child Welfare", "CAS Proceedings", "Family Support"]
    },
    {
      title: "Labour Relations Board",
      description: "Employment disputes and wrongful dismissal matters",
      icon: Briefcase,
      path: "/labour-journey",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      topics: ["Employment", "Wrongful Dismissal", "Labour Rights"]
    },
    {
      title: "Immigration & Refugee Board",
      description: "Navigate Canadian immigration and refugee proceedings",
      icon: Globe,
      path: "/immigration-journey",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      topics: ["Immigration", "Refugee Claims", "Appeals"]
    },
    {
      title: "Superior Court of Justice",
      description: "Complex civil litigation, appeals, and judicial review",
      icon: Building2,
      path: "/superior-court-journey",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      topics: ["Civil Litigation", "Appeals", "Judicial Review"]
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Legal Journey Guides - Ontario Courts & Tribunals",
    "description": "Step-by-step guidance for navigating Ontario courts, tribunals, and legal proceedings",
    "url": "https://justice-bot.com/journey",
    "publisher": {
      "@type": "Organization",
      "name": "Justice-Bot"
    }
  };

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Legal Journeys", url: "/journey" }
  ];

  const faqData = [
    {
      question: "What is a legal journey?",
      answer: "A legal journey is a step-by-step guide that walks you through the entire process of resolving your legal matter, from initial assessment to final resolution. Each journey is tailored to a specific court or tribunal."
    },
    {
      question: "Which journey should I choose?",
      answer: "Choose the journey that matches your legal issue. For discrimination, use HRTO. For rental disputes, use LTB. For small debts or property damage, use Small Claims Court. If unsure, start with our Triage tool."
    },
    {
      question: "Are these journeys specific to Ontario?",
      answer: "Most journeys focus on Ontario courts and tribunals. However, we also provide guidance for federal matters like immigration and some accountability processes that vary by province."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Legal Journey Guides - Ontario Courts & Tribunals"
        description="Step-by-step guidance for navigating Ontario courts and tribunals including HRTO, LTB, Small Claims Court, Family Court, Criminal Court, and more."
        keywords="legal journey, Ontario courts, tribunals, HRTO, LTB, small claims court, family court, criminal court, legal guidance"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
        articleData={{
          publishedTime: "2025-01-27T00:00:00Z",
          modifiedTime: new Date().toISOString(),
          author: "Justice-Bot Legal Team",
          section: "Legal Journeys",
          tags: ["Legal Guidance", "Courts", "Tribunals", "Ontario", "Self-Representation"]
        }}
      />

      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-12" aria-labelledby="journey-heading">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm font-medium">Your Guided Legal Journey</span>
          </div>
          <h1 id="journey-heading" className="text-5xl font-bold mb-4">Choose Your Legal Journey</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Select the court or tribunal that matches your legal matter. We'll guide you through 
            every step with clear instructions, required forms, and deadlines.
          </p>
        </section>

        {/* Journey Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" aria-label="Available legal journeys">
          {journeys.map((journey, index) => {
            const IconComponent = journey.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${journey.bgColor} flex items-center justify-center mb-4`} aria-hidden="true">
                    <IconComponent className={`h-6 w-6 ${journey.color}`} />
                  </div>
                  <CardTitle className="text-xl">{journey.title}</CardTitle>
                  <CardDescription>{journey.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2" role="list" aria-label={`${journey.title} topics`}>
                    {journey.topics.map((topic, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs" role="listitem">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild className="w-full">
                    <Link to={journey.path} aria-label={`Start ${journey.title} journey`}>
                      Start Journey <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Additional Resources */}
        <section className="bg-muted/30 rounded-lg p-8" aria-labelledby="resources-heading">
          <h2 id="resources-heading" className="text-3xl font-bold mb-6 text-center">Not Sure Where to Start?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Take the Triage</CardTitle>
                <CardDescription>
                  Answer a few questions and we'll recommend the right journey for your situation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/triage">Start Triage</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Legal Resources</CardTitle>
                <CardDescription>
                  Browse tutorials, FAQs, and templates to understand your options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/legal-resources">View Resources</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Speak with our team to get personalized guidance for your case
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/contact">Get Help</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Journey;
