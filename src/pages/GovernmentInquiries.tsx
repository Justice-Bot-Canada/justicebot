import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Mail, FileText, Shield } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

const GovernmentInquiries = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Government Inquiries - Justice Bot"
        description="Government and institutional inquiries for Justice Bot. Contact us for partnerships, compliance information, and institutional collaboration opportunities."
        keywords="government inquiries, institutional partnerships, compliance, legal tech partnerships, government collaboration"
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Government & Institutional Inquiries</h1>
          </div>

          <p className="text-lg text-muted-foreground mb-8">
            Partner with Justice Bot to improve access to justice in your jurisdiction
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Collaboration Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                Justice Bot works with government agencies, legal aid organizations, tribunals, and other institutions 
                to expand access to justice across Canada. We're open to partnerships and collaborations that align with 
                our mission to make legal processes more accessible.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Institutional Partnerships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Legal aid organizations</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Tribunal integrations</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Court service collaborations</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Community legal clinics</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Government programs</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Compliance & Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Privacy compliance (PIPEDA)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Data security standards</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Accessibility compliance</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Provincial regulations</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Regular audits & updates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Platform Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Multi-Jurisdictional Support</h3>
                  <p className="text-muted-foreground">
                    We provide province-specific guidance and procedures for all Canadian jurisdictions, with the ability 
                    to customize content for specific regional requirements.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Scalable Technology</h3>
                  <p className="text-muted-foreground">
                    Our AI-powered platform can handle high volumes of users while maintaining personalized guidance for 
                    each individual case.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Integration Ready</h3>
                  <p className="text-muted-foreground">
                    We can integrate with existing government systems, tribunal platforms, and legal databases to provide 
                    seamless service delivery.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Data Analytics</h3>
                  <p className="text-muted-foreground">
                    Aggregate analytics and insights about access to justice trends, common legal issues, and service 
                    utilization (while protecting individual privacy).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Government Relations</p>
                  <a href="mailto:admin@justice-bot.com" className="text-primary hover:underline">
                    admin@justice-bot.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Partnership Proposals</p>
                  <a href="mailto:partnerships@justice-bot.com" className="text-primary hover:underline">
                    partnerships@justice-bot.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inquiry Form</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Please use the form below to contact us about institutional partnerships, government collaborations, 
                compliance inquiries, or other official matters.
              </p>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GovernmentInquiries;
