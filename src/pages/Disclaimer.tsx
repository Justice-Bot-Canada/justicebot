import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ArticleSchema } from "@/components/ArticleSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Legal Disclaimer & Terms of Use"
        description="Important legal disclaimers for Justice Bot users. Understand our service limitations, liability terms, and AI-generated content notices. Not a substitute for legal advice."
        keywords="legal disclaimer, terms of use, AI disclaimer, legal notices, service limitations, liability terms"
        canonicalUrl="https://justice-bot.com/disclaimer"
      />
      <ArticleSchema
        headline="Justice Bot Legal Disclaimer"
        description="Legal disclaimers and important notices for Justice Bot users. Understand our service scope, limitations, and user responsibilities."
        image="https://justice-bot.com/justice-bot-logo.jpeg"
        datePublished="2025-01-10T00:00:00Z"
        dateModified={new Date().toISOString()}
        url="https://justice-bot.com/disclaimer"
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="h-8 w-8 text-warning" />
            <h1 className="text-4xl font-bold">Legal Disclaimer</h1>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Not Legal Advice</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                Justice Bot is an educational and informational platform designed to help users understand legal processes 
                and prepare legal documents. The information provided by Justice Bot does not constitute legal advice and 
                should not be relied upon as a substitute for professional legal counsel.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>No Attorney-Client Relationship</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                Use of Justice Bot does not create an attorney-client relationship. All information provided is for general 
                educational purposes only. For specific legal advice tailored to your situation, you should consult with a 
                licensed attorney in your jurisdiction.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Accuracy and Completeness</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                While we strive to provide accurate and up-to-date information, Justice Bot makes no representations or 
                warranties about the accuracy, completeness, or reliability of any information provided. Laws and regulations 
                change frequently, and legal procedures vary by jurisdiction.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>User Responsibility</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                Users are responsible for verifying all information and ensuring that any documents or actions taken are 
                appropriate for their specific situation. Justice Bot is not responsible for any outcomes, damages, or 
                consequences resulting from the use of this platform.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>AI-Generated Content</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                Some content on Justice Bot is generated using artificial intelligence. While AI assistance can be helpful, 
                it may contain errors or omissions. All AI-generated content should be carefully reviewed and verified by 
                the user or a qualified legal professional.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Consultation</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                For complex legal matters, time-sensitive issues, or cases involving significant consequences, we strongly 
                recommend consulting with a licensed attorney. Justice Bot can help you prepare and organize information, 
                but cannot replace professional legal representation.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Disclaimer;
