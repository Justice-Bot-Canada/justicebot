import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Mail, AlertCircle, Scale, Users, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const GovernmentInquiries = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Government & Public Institutions - Justice Bot"
        description="Information for government agencies and public institutions about Justice-Bot, a legal navigation and literacy tool that complements existing public services."
        keywords="government, public institutions, legal navigation, access to justice, civic technology, Canada"
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Government & Public Institutions</h1>
          </div>

          <p className="text-lg text-muted-foreground mb-8">
            Information for government agencies, tribunals, courts, and public service organizations.
          </p>

          {/* Important Disclaimer */}
          <Alert className="mb-8 border-primary/50 bg-primary/5">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-base">
              <strong>Important:</strong> Justice-Bot does not provide legal advice or legal representation. 
              It is a legal navigation and literacy tool designed to complement — not replace — existing public services, 
              legal aid programs, courts, and tribunals.
            </AlertDescription>
          </Alert>

          {/* What Justice-Bot Is */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                What Justice-Bot Is
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Justice-Bot is a free legal navigation and legal-literacy tool designed to help people:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Understand what type of legal issue they are facing</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Identify relevant processes, services, or institutions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Reduce early confusion and missed steps</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Prepare before engaging with clinics, courts, tribunals, or public agencies</span>
                </li>
              </ul>
              <p className="text-muted-foreground">
                It supports common everyday legal issues, including housing, family and parenting matters, 
                income and benefits, disability and accommodation, employment, and human rights.
              </p>
            </CardContent>
          </Card>

          {/* What Justice-Bot Is Not */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                What Justice-Bot Is Not
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Justice-Bot is not a lawyer</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>It does not provide legal advice or opinions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>It does not replace lawyers, legal aid, clinics, courts, or tribunals</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>It does not make legal decisions for users</span>
                </li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                Its purpose is to improve understanding and access — not to substitute professional services.
              </p>
            </CardContent>
          </Card>

          {/* Why It Matters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Why It Matters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Across Canada, more people are being forced to navigate legal systems without representation 
                due to rising costs, backlogs, and limited access to legal aid.
              </p>
              <p className="text-muted-foreground">
                Justice-Bot was created in response to this gap — as a grassroots, responsible civic-tech 
                approach to help people engage more effectively with existing systems rather than abandon them.
              </p>
            </CardContent>
          </Card>

          {/* Complementary Role */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Complementary to Public Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Justice-Bot is designed to work alongside — not compete with — existing public services:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Helps users prepare before contacting legal aid or clinics</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Directs users to appropriate tribunals and court services</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Reduces confusion about processes and procedures</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Supports informed engagement with public institutions</span>
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                The goal is to help people arrive at public services better prepared and with clearer 
                understanding of their situation.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                For inquiries from government agencies, courts, tribunals, or public institutions:
              </p>
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Institutional Inquiries</p>
                  <a 
                    href="mailto:admin@justice-bot.com" 
                    className="text-primary hover:underline"
                  >
                    admin@justice-bot.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Disclaimer */}
          <div className="text-center text-sm text-muted-foreground border-t pt-6">
            <p>
              Justice-Bot is a civic-technology initiative. It does not provide legal advice.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GovernmentInquiries;
