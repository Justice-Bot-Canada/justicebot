import SEOHead from "@/components/SEOHead";
import { ArticleSchema } from "@/components/ArticleSchema";
import { LegalServiceSchema } from "@/components/LegalServiceSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Shield, FileText, Scale, AlertCircle, CheckCircle, Home } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TenantRightsGuide = () => {
  const clusterPages = [
    { title: "How to File an LTB T2 Form", path: "/ltb-t2-form-guide", icon: FileText },
    { title: "LTB Hearing Timeline Explained", path: "/ltb-hearing-timeline", icon: Scale },
    { title: "Understanding N12 Eviction Notices", path: "/n12-eviction-guide", icon: AlertCircle },
    { title: "Tenant Rights During Eviction", path: "/tenant-eviction-rights", icon: Shield },
  ];

  return (
    <>
      <SEOHead
        title="Tenant Rights in Ontario: Complete Guide 2025 | LTB Forms & Eviction Help"
        description="Complete guide to tenant rights in Ontario 2025. Learn how to file LTB forms (T2, T6), fight eviction notices (N12, N4), and protect your housing rights. Free AI legal help."
        canonicalUrl="https://justice-bot.com/tenant-rights-ontario-guide"
        keywords="tenant rights Ontario, LTB forms Ontario, eviction notice Ontario, Landlord Tenant Board, T2 form, T6 form, N12 eviction, tenant rights Canada"
      />
      
      <ArticleSchema
        headline="Tenant Rights in Ontario: Complete Guide 2025"
        description="Comprehensive guide covering all aspects of tenant rights in Ontario, including LTB forms, eviction procedures, and legal protections."
        image="https://justice-bot.com/justice-bot-logo.jpeg"
        datePublished="2025-01-09"
        dateModified="2025-01-09"
        author="Justice-Bot Legal Team"
        url="https://justice-bot.com/tenant-rights-ontario-guide"
      />

      <LegalServiceSchema
        serviceName="Tenant Rights Legal Assistance"
        description="AI-powered legal help for Ontario tenants facing eviction, LTB hearings, and housing disputes"
        serviceType={["Tenant Rights", "Housing Law", "LTB Applications"]}
      />

      <div className="min-h-screen bg-background">
        <Header />
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
          <div className="container max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span>/</span>
              <span>Tenant Rights Ontario Guide</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tenant Rights in Ontario: Complete Guide 2025
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Everything you need to know about protecting your housing rights, filing LTB forms, and fighting eviction notices in Ontario.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/ltb-journey">Start LTB Application</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/forms">Browse LTB Forms</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-12 px-4 border-b">
          <div className="container max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl">50,000+</CardTitle>
                  <CardDescription>LTB Applications Filed Annually</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl">14 Days</CardTitle>
                  <CardDescription>Average Time to Respond to Eviction</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl">Free</CardTitle>
                  <CardDescription>AI Legal Help Available 24/7</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-4">
          <div className="container max-w-4xl mx-auto space-y-12">
            
            {/* Overview */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Understanding Your Rights as an Ontario Tenant</h2>
              <div className="prose prose-lg max-w-none space-y-4">
                <p>
                  As a tenant in Ontario, you have strong legal protections under the <strong>Residential Tenancies Act, 2006</strong>. 
                  Whether you're facing an eviction notice, dealing with maintenance issues, or filing a complaint with the 
                  <strong> Landlord and Tenant Board (LTB)</strong>, understanding your rights is crucial.
                </p>
                <p>
                  This comprehensive guide covers everything from <strong>LTB forms Ontario</strong> to 
                  <strong> eviction notice Ontario</strong> procedures, helping you navigate tenant-landlord disputes with confidence.
                </p>
              </div>
            </div>

            {/* Key Topics */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Essential Tenant Rights Topics</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {clusterPages.map((page) => (
                  <Card key={page.path} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <page.icon className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <CardTitle className="mb-2">{page.title}</CardTitle>
                          <CardDescription className="mb-4">
                            Step-by-step guide with forms, timelines, and legal requirements.
                          </CardDescription>
                          <Button asChild variant="link" className="p-0 h-auto">
                            <Link to={page.path}>Read Full Guide →</Link>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            {/* Common LTB Forms */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Most Common LTB Forms Ontario</h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      T2 Form - Tenant's Application About Tenant Rights
                    </CardTitle>
                    <CardDescription>
                      Use this form when your landlord violates your rights, fails to maintain the property, 
                      or breaches the Residential Tenancies Act. <Link to="/ltb-t2-form-guide" className="text-primary hover:underline">Learn how to file T2 form →</Link>
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      T6 Form - Tenant Application About Maintenance
                    </CardTitle>
                    <CardDescription>
                      File T6 when your landlord fails to maintain the rental unit or residential complex. 
                      Common issues include broken heating, plumbing problems, or pest infestations.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      T5 Form - Tenant Application About Harassment
                    </CardTitle>
                    <CardDescription>
                      Use T5 when your landlord harasses you, interferes with your reasonable enjoyment, 
                      or illegally enters your unit.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Eviction Types */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Types of Eviction Notices in Ontario</h2>
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-semibold mb-2">N12 - Landlord's Own Use</h3>
                  <p className="text-muted-foreground mb-2">
                    60-day notice when landlord or their family member wants to move in. You have rights to compensation.
                  </p>
                  <Link to="/n12-eviction-guide" className="text-primary hover:underline">
                    Read N12 eviction guide →
                  </Link>
                </div>

                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-semibold mb-2">N4 - Non-Payment of Rent</h3>
                  <p className="text-muted-foreground mb-2">
                    14-day notice for unpaid rent. You can stop eviction by paying rent owed plus any filing fees.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-semibold mb-2">N5 - Interference with Others</h3>
                  <p className="text-muted-foreground mb-2">
                    Notice for disturbing other tenants or substantial damage. Usually has a 7-day remedy period.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-semibold mb-2">N8 - Conversion/Demolition</h3>
                  <p className="text-muted-foreground mb-2">
                    120-day notice when building will be demolished or converted to non-residential use.
                  </p>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="bg-accent/50 rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-primary" />
                Your Key Tenant Rights
              </h2>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span>Right to a safe, maintained rental unit meeting health and safety standards</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span>Protection from illegal eviction - only LTB can order eviction</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span>Right to dispute rent increases above guideline (2.5% for 2025)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span>Privacy rights - 24 hours notice for entry (except emergencies)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span>Right to file applications and attend hearings at the LTB</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span>Protection from harassment and discrimination under Human Rights Code</span>
                </li>
              </ul>
            </div>

            {/* CTA Section */}
            <div className="bg-primary/10 rounded-lg p-8 text-center">
              <Home className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-4">Need Help with Your Tenant Rights?</h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our AI legal assistant can help you understand your rights, prepare LTB forms, 
                and fight eviction notices. Get started for free today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link to="/ltb-journey">Start LTB Application</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/legal-chat">Chat with AI Assistant</Link>
                </Button>
              </div>
            </div>

            {/* Related Resources */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Related Resources</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Link to="/family-law-ontario-guide" className="hover:text-primary">
                        Family Law Ontario Guide
                      </Link>
                    </CardTitle>
                    <CardDescription>Complete guide to family court, custody, and CAS matters</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Link to="/human-rights-ontario-guide" className="hover:text-primary">
                        Human Rights Ontario Guide
                      </Link>
                    </CardTitle>
                    <CardDescription>HRTO applications, discrimination complaints, and your rights</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default TenantRightsGuide;
