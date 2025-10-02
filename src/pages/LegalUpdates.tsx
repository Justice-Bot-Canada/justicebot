import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Bell, FileText } from "lucide-react";

const LegalUpdates = () => {
  const updates = [
    {
      date: "2025-09-15",
      title: "Updates to Ontario Human Rights Tribunal Procedures",
      category: "HRTO",
      description: "The HRTO has updated its application procedures and filing requirements. New forms are now available for discrimination claims.",
      importance: "high"
    },
    {
      date: "2025-08-30",
      title: "Small Claims Court Limit Increase",
      category: "Small Claims",
      description: "Several provinces have increased their small claims court monetary limits. Check your provincial limits before filing.",
      importance: "medium"
    },
    {
      date: "2025-08-15",
      title: "New Landlord-Tenant Board Filing System",
      category: "LTB",
      description: "The LTB has launched a new online filing system for tenant applications. All applications must now be filed electronically.",
      importance: "high"
    },
    {
      date: "2025-07-20",
      title: "Changes to Family Law Act",
      category: "Family Law",
      description: "Ontario has amended sections of the Family Law Act affecting child support guidelines and property division.",
      importance: "high"
    },
    {
      date: "2025-07-05",
      title: "Immigration Appeal Division New Guidelines",
      category: "Immigration",
      description: "The Immigration Appeal Division has released new practice guidelines for sponsorship appeals.",
      importance: "medium"
    }
  ];

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Legal Updates & News - Justice Bot"
        description="Stay informed about the latest changes to legal procedures, tribunal updates, and law reforms across Canada. Important updates for self-represented litigants."
        keywords="legal updates, law changes, tribunal updates, legal news, Canada legal system, procedure changes"
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Legal Updates & News</h1>
          </div>

          <p className="text-lg text-muted-foreground mb-8">
            Stay informed about the latest changes to legal procedures, tribunal updates, and law reforms
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Subscribe to Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Want to receive notifications about legal updates relevant to your case? Sign up for an account and 
                enable notifications in your profile settings. We'll keep you informed about changes that may affect 
                your legal matter.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {updates.map((update, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <CardTitle className="text-xl">{update.title}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={getImportanceColor(update.importance)}
                    >
                      {update.importance === "high" ? "Important" : "Update"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(update.date).toLocaleDateString('en-CA', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{update.category}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{update.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Stay Informed</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                Legal procedures and requirements change regularly. It's important to stay up-to-date with the latest 
                information, especially when you're actively involved in a legal proceeding.
              </p>
              <p>
                Justice Bot automatically updates our guidance and procedures as changes occur. When you use our platform, 
                you can be confident that you're receiving current, accurate information for your jurisdiction.
              </p>
              <p>
                For urgent legal updates or time-sensitive changes, we recommend:
              </p>
              <ul>
                <li>Checking the official website of your tribunal or court</li>
                <li>Enabling notifications in your Justice Bot profile</li>
                <li>Consulting with a legal professional for complex matters</li>
                <li>Reviewing our updates page regularly</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LegalUpdates;
