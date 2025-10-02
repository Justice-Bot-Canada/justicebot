import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Mail, Phone, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/ContactForm";

const MediaInquiries = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Media Inquiries - Justice Bot"
        description="Press and media inquiries for Justice Bot. Contact our media relations team for interviews, press releases, and information about our legal technology platform."
        keywords="media inquiries, press contact, Justice Bot media, legal tech news, press releases"
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Newspaper className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Media Inquiries</h1>
          </div>

          <p className="text-lg text-muted-foreground mb-8">
            Press contacts and media resources for Justice Bot
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About Justice Bot</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                Justice Bot is a Canadian legal technology platform that provides AI-powered guidance for self-represented 
                litigants. We help individuals navigate various tribunals and courts across Canada, offering case analysis, 
                document preparation, and procedural guidance.
              </p>
              <p>
                Our mission is to democratize access to justice by making legal processes more accessible, affordable, and 
                understandable for all Canadians, particularly those who cannot afford traditional legal representation.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Media Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Email</p>
                  <a href="mailto:media@justice-bot.com" className="text-primary hover:underline">
                    media@justice-bot.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-muted-foreground">Available upon request for urgent media inquiries</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Key Statistics & Facts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Covering 13+ legal venues and tribunals across Canada</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>AI-powered case analysis with merit scoring</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Free access available for low-income individuals</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Province-specific legal procedures and forms</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Document preparation and evidence organization tools</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Topics We Can Discuss</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Access to justice in Canada</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>AI and legal technology</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Self-represented litigants</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Legal system navigation</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Affordable legal assistance</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Tribunal and court procedures</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media Inquiry Form</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                For all media inquiries, interviews, and press information, please use the form below. 
                We aim to respond to all media requests within 24 hours.
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

export default MediaInquiries;
