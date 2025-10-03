import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, Building, Users, FileText, ArrowRight } from "lucide-react";
import courthouseImg from "@/assets/courthouse.jpg";

const CourtInformation = () => {
  const navigate = useNavigate();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Small Claims Court?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Small Claims Court handles monetary claims up to $35,000 in Ontario. It features simplified procedures, lower court costs, and is designed for self-representation."
        }
      },
      {
        "@type": "Question",
        "name": "When should I use Superior Court?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Superior Court handles larger claims over the small claims limit, complex legal matters, and appeals from lower courts with more formal procedures."
        }
      },
      {
        "@type": "Question",
        "name": "What types of tribunals exist in Canada?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Specialized tribunals include Human Rights Tribunal, Landlord-Tenant Board, Labour Relations Board, and Immigration and Refugee Board, each handling specific areas of law."
        }
      }
    ]
  };

  const courtTypes = [
    {
      title: "Small Claims Court",
      icon: Scale,
      description: "For monetary claims up to $35,000 in Ontario (varies by province)",
      path: "/small-claims-journey",
      features: [
        "Simplified procedures",
        "Lower court costs",
        "Designed for self-representation",
        "Fast resolution timeline"
      ]
    },
    {
      title: "Superior Court",
      icon: Building,
      description: "For larger claims, complex matters, and appeals",
      path: "/superior-court-journey",
      features: [
        "Handles claims over small claims limit",
        "More formal procedures",
        "Broader jurisdiction",
        "Appeals from lower courts"
      ]
    },
    {
      title: "Family Court",
      icon: Users,
      description: "For divorce, custody, support, and family matters",
      path: "/family-journey",
      features: [
        "Divorce proceedings",
        "Child custody and access",
        "Child and spousal support",
        "Property division"
      ]
    },
    {
      title: "Tribunals",
      icon: FileText,
      description: "Specialized decision-making bodies for specific areas of law",
      path: "/tribunal-locator",
      features: [
        "Human Rights Tribunal",
        "Landlord-Tenant Board",
        "Labour Relations Board",
        "Immigration and Refugee Board"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Courts & Tribunals Information - Find Your Legal Venue"
        description="Complete guide to Canadian courts and tribunals. Learn about Small Claims Court, Superior Court, Family Court, and specialized tribunals. Find the right venue for your case."
        keywords="courts Canada, tribunals Ontario, small claims court, superior court, family court, legal venues, tribunal information, court procedures"
        canonicalUrl="https://justice-bot.com/court"
        ogImage="https://justice-bot.com/courthouse.jpg"
        structuredData={structuredData}
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs items={[
            { label: "Courts & Tribunals" }
          ]} />

          {/* Hero Image */}
          <div className="mb-12 rounded-lg overflow-hidden">
            <img 
              src={courthouseImg} 
              alt="Canadian courthouse - courts and tribunals information" 
              className="w-full h-64 md:h-96 object-cover"
              loading="eager"
            />
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Courts & Tribunals</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Understanding the different courts and tribunals in Canada and finding the right venue for your legal matter
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {courtTypes.map((court, index) => {
              const Icon = court.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-8 w-8 text-primary" />
                      <CardTitle>{court.title}</CardTitle>
                    </div>
                    <CardDescription>{court.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {court.features.map((feature, idx) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <span className="text-primary">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={() => navigate(court.path)}
                      className="w-full"
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Choosing the Right Venue</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                Selecting the correct court or tribunal is crucial for your legal matter. Each venue has specific 
                jurisdiction, procedures, and requirements. Here's how to determine where to file:
              </p>
              
              <h3>Consider These Factors:</h3>
              <ul>
                <li><strong>Type of Legal Issue:</strong> Different courts handle different types of cases</li>
                <li><strong>Monetary Amount:</strong> Small claims courts have monetary limits</li>
                <li><strong>Geographic Location:</strong> File in the jurisdiction where the issue occurred or parties reside</li>
                <li><strong>Urgency:</strong> Some venues have faster timelines than others</li>
                <li><strong>Complexity:</strong> More complex matters may require superior court</li>
              </ul>

              <h3>Not Sure Where to Start?</h3>
              <p>
                Use our tribunal locator and triage tools to help determine the best venue for your specific situation. 
                We'll guide you through a series of questions to identify the appropriate court or tribunal.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>General Court Procedures</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                While procedures vary by venue, most courts and tribunals follow a similar general process:
              </p>
              
              <ol>
                <li><strong>Filing:</strong> Submit your application or claim with required documents and fees</li>
                <li><strong>Service:</strong> Deliver copies of your documents to other parties</li>
                <li><strong>Response:</strong> Other parties have time to respond to your claim</li>
                <li><strong>Disclosure:</strong> Exchange relevant documents and evidence</li>
                <li><strong>Pre-Hearing:</strong> May include mediation, settlement conferences, or case management</li>
                <li><strong>Hearing:</strong> Present your case before a judge, adjudicator, or panel</li>
                <li><strong>Decision:</strong> Receive a written decision or order</li>
                <li><strong>Enforcement:</strong> If needed, take steps to enforce the decision</li>
              </ol>

              <p>
                Justice Bot provides step-by-step guidance for each stage of the process, customized to your specific 
                venue and jurisdiction.
              </p>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Button size="lg" onClick={() => navigate("/triage")}>
              Find Your Legal Pathway
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourtInformation;
