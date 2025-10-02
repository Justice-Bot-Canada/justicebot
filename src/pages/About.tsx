import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Users, Target, Sparkles } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About Justice Bot - AI-Powered Legal Assistance"
        description="Learn about Justice Bot's mission to democratize access to justice through AI-powered legal guidance and self-representation tools."
        keywords="about Justice Bot, legal tech, access to justice, AI legal assistance, self-representation"
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About Justice Bot</h1>
            <p className="text-xl text-muted-foreground">
              Empowering Canadians to navigate the legal system with confidence
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                Justice Bot was created to bridge the access-to-justice gap in Canada. We believe that everyone deserves 
                the tools and knowledge to understand their legal rights and navigate legal processes, regardless of their 
                financial situation.
              </p>
              <p>
                By combining artificial intelligence with comprehensive legal knowledge, we provide affordable, accessible 
                guidance for self-represented litigants across various legal venues and tribunals.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                What We Offer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>AI-powered case analysis and merit scoring</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Guided legal pathways for multiple tribunals and courts</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Document preparation and form-filling assistance</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Evidence organization and Book of Documents creation</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Jurisdiction-specific procedure guidance</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Free access for low-income individuals</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Our Approach
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                Justice Bot leverages cutting-edge AI technology to provide personalized legal guidance. Our platform:
              </p>
              <ul>
                <li>Analyzes your specific situation to provide tailored recommendations</li>
                <li>Simplifies complex legal procedures into step-by-step guidance</li>
                <li>Helps you prepare professional-quality legal documents</li>
                <li>Assists in organizing evidence and building strong cases</li>
                <li>Provides province-specific information for Canadian jurisdictions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Who We Serve
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                Justice Bot serves self-represented litigants across Canada, including:
              </p>
              <ul>
                <li>Individuals facing human rights violations</li>
                <li>Tenants dealing with landlord-tenant disputes</li>
                <li>Parties in small claims matters</li>
                <li>People navigating family law issues</li>
                <li>Those seeking accountability for police or government misconduct</li>
                <li>Workers with labour board complaints</li>
                <li>Anyone needing assistance with tribunal or court processes</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
