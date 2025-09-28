import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InteractiveTutorial from '@/components/InteractiveTutorial';
import LegalFAQ from '@/components/LegalFAQ';
import DocumentTemplateLibrary from '@/components/DocumentTemplateLibrary';
import EnhancedSEO from '@/components/EnhancedSEO';
import { BookOpen, HelpCircle, FileText, Video, Users, Scale, Phone, ExternalLink } from 'lucide-react';

const LegalResources: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tutorials');

  const quickLinks = [
    {
      title: 'Legal Aid Ontario',
      description: 'Free legal services for low-income individuals',
      url: 'https://www.legalaid.on.ca',
      category: 'Legal Aid'
    },
    {
      title: 'Ontario Court Forms',
      description: 'Official court forms and documents',
      url: 'https://www.ontariocourts.ca',
      category: 'Forms'
    },
    {
      title: 'Community Legal Clinics',
      description: 'Find local legal clinics in your area',
      url: 'https://www.legalaid.on.ca/legal-clinics',
      category: 'Legal Aid'
    },
    {
      title: 'Law Society Referral Service',
      description: 'Find qualified lawyers in Ontario',
      url: 'https://lsrs.lso.ca',
      category: 'Lawyers'
    }
  ];

  const emergencyContacts = [
    {
      service: 'Domestic Violence Helpline',
      phone: '1-800-799-7233',
      hours: '24/7'
    },
    {
      service: 'Legal Aid Emergency Line',
      phone: '1-800-668-8258',
      hours: 'Business hours'
    },
    {
      service: 'Victim Services',
      phone: '1-888-579-2888',
      hours: '24/7'
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Legal Resources - Justice-Bot",
    "description": "Comprehensive legal resources including tutorials, FAQ, document templates, and legal guidance for Ontario residents.",
    "url": window.location.href,
    "publisher": {
      "@type": "Organization",
      "name": "Justice-Bot"
    }
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Legal Resources', url: '/legal-resources' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Legal Resources"
        description="Access comprehensive legal resources including interactive tutorials, FAQ, document templates, and expert guidance for Ontario legal matters."
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Legal Resources</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to navigate the Ontario legal system. From step-by-step tutorials 
            to document templates, we provide the tools and guidance to help you succeed.
          </p>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tutorials" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Tutorials
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Guides
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tutorials" className="space-y-6">
            <InteractiveTutorial />
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <LegalFAQ />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <DocumentTemplateLibrary />
          </TabsContent>

          <TabsContent value="guides" className="space-y-6">
            {/* Legal Guides Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    Small Claims Court Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete guide to filing and defending small claims court cases in Ontario.
                  </p>
                  <Button className="w-full">Read Guide</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Landlord & Tenant Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Understanding your rights and responsibilities under Ontario's tenancy laws.
                  </p>
                  <Button className="w-full">Read Guide</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Human Rights Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn about filing human rights complaints and understanding your protections.
                  </p>
                  <Button className="w-full">Read Guide</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Additional Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickLinks.map((link, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{link.title}</h4>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      Visit
                    </a>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Emergency Legal Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{contact.service}</h4>
                  <p className="text-lg font-mono text-blue-600">{contact.phone}</p>
                  <p className="text-sm text-muted-foreground">{contact.hours}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Need Personalized Help?
            </h2>
            <p className="text-blue-800 mb-6 max-w-2xl mx-auto">
              Our AI-powered case assessment can provide personalized guidance for your specific 
              legal situation. Get started with a free consultation today.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Case Assessment
            </Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default LegalResources;