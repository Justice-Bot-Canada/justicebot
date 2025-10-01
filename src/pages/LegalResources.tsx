import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InteractiveTutorial from '@/components/InteractiveTutorial';
import LegalFAQ from '@/components/LegalFAQ';
import DocumentTemplateLibrary from '@/components/DocumentTemplateLibrary';
import EnhancedSEO from '@/components/EnhancedSEO';
import { useLegalData } from '@/hooks/useLegalData';
import { BookOpen, HelpCircle, FileText, Video, Users, Scale, Phone, ExternalLink, Search, Building2 } from 'lucide-react';

const LegalResources: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tutorials');
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"cases" | "legislation">("cases");
  const [legislationDataset, setLegislationDataset] = useState<string>("all");
  const { loading, data, searchCases, searchLegislation } = useLegalData();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    if (searchType === "cases") {
      await searchCases(searchQuery);
    } else {
      const dataset = legislationDataset === "all" ? undefined : legislationDataset;
      await searchLegislation(searchQuery, { dataset });
    }
  };

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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Database
            </TabsTrigger>
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

          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Canadian Legal Database</CardTitle>
                    <CardDescription>
                      Search 116,000+ cases and 5,700+ federal laws with advanced Boolean search
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">Powered by A2AJ</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={searchType} onValueChange={(v) => setSearchType(v as "cases" | "legislation")}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="cases">
                      <Building2 className="mr-2 h-4 w-4" />
                      Case Law
                    </TabsTrigger>
                    <TabsTrigger value="legislation">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Legislation
                    </TabsTrigger>
                  </TabsList>
                  
                  {searchType === "legislation" && (
                    <Select value={legislationDataset} onValueChange={setLegislationDataset}>
                      <SelectTrigger className="mb-3">
                        <SelectValue placeholder="Select dataset" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Federal Laws</SelectItem>
                        <SelectItem value="LEGISLATION-FED">
                          Federal Statutes (954 docs)
                        </SelectItem>
                        <SelectItem value="REGULATIONS-FED">
                          Federal Regulations (4,808 docs)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder={searchType === "cases" ? "Search cases... (try: discrimination AND employment)" : "Search federal statutes and regulations..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={loading}>
                      <Search className="mr-2 h-4 w-4" />
                      {loading ? "Searching..." : "Search"}
                    </Button>
                  </div>
                </Tabs>
                
                {/* Search Tips */}
                <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                  <strong>Advanced Search Tips:</strong> Use AND/OR/NOT • "exact phrases" • wildcards* • proximity NEAR/5
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {data && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Search Results 
                    {'total' in data && data.total && <span className="text-muted-foreground text-sm ml-2">({data.total} found)</span>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.results?.length > 0 ? (
                      data.results.map((item: any, index: number) => (
                        <div key={index} className="border-b pb-4 last:border-0">
                          <h3 className="font-semibold text-lg mb-1">
                            {item.name || item.title || item.citation}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {item.citation && (
                              <Badge variant="outline">{item.citation}</Badge>
                            )}
                            {item.dataset && (
                              <Badge variant="secondary">{item.dataset}</Badge>
                            )}
                            {item.year && (
                              <Badge variant="outline">{item.year}</Badge>
                            )}
                          </div>
                          {item.snippet && (
                            <p className="text-sm mb-2 text-muted-foreground">
                              {item.snippet}
                            </p>
                          )}
                          {item.url && (
                            <Button variant="link" className="p-0 h-auto" asChild>
                              <a href={item.url} target="_blank" rel="noopener noreferrer">
                                View Full Document <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No results found. Try different keywords or use advanced search operators.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Coverage Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Case Law Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Supreme Court of Canada</strong> (10,845)</li>
                    <li>• <strong>Federal Courts</strong> (FCA: 7,580 | FC: 34,256)</li>
                    <li>• <strong>Ontario Court of Appeal</strong> (16,951)</li>
                    <li>• <strong>Immigration Tribunals</strong> (RAD, RPD)</li>
                    <li>• <strong>Human Rights Tribunal</strong> (1,050)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Legislation Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Federal Statutes</strong> (954)</li>
                    <li>• <strong>Federal Regulations</strong> (4,803)</li>
                    <li>• Coverage: 1870 - 2025</li>
                    <li className="pt-2">
                      <Badge variant="outline">Open Access Data</Badge>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

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