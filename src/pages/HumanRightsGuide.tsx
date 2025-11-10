import SEOHead from "@/components/SEOHead";
import { ArticleSchema } from "@/components/ArticleSchema";
import { LegalServiceSchema } from "@/components/LegalServiceSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Scale, FileText, Users, AlertCircle, CheckCircle, Briefcase } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HumanRightsGuide = () => {
  const clusterPages = [
    { title: "How to File HRTO Application Form 1", path: "/hrto-form-1-guide", icon: FileText },
    { title: "Workplace Discrimination Complaints", path: "/workplace-discrimination-guide", icon: Briefcase },
    { title: "HRTO Hearing Process Explained", path: "/hrto-hearing-process", icon: Scale },
    { title: "Human Rights Code Ontario Overview", path: "/human-rights-code-guide", icon: Users },
  ];

  return (
    <>
      <SEOHead
        title="Human Rights Ontario: Complete Guide 2025 | HRTO Application Form 1 & Discrimination Help"
        description="Complete guide to human rights in Ontario 2025. Learn how to file HRTO Application Form 1, fight workplace discrimination, and protect your rights under the Human Rights Code. Free AI legal help."
        canonicalUrl="https://justice-bot.com/human-rights-ontario-guide"
        keywords="human rights Ontario, HRTO application form 1, workplace discrimination Ontario, human rights complaint Canada, discrimination at work Ontario tribunal, HRTO Ontario"
      />
      
      <ArticleSchema
        headline="Human Rights Ontario: Complete Guide 2025"
        description="Comprehensive guide covering HRTO applications, workplace discrimination, and human rights protections in Ontario."
        image="https://justice-bot.com/justice-bot-logo.jpeg"
        datePublished="2025-01-09"
        dateModified="2025-01-09"
        author="Justice-Bot Legal Team"
        url="https://justice-bot.com/human-rights-ontario-guide"
      />

      <LegalServiceSchema
        serviceName="Human Rights Legal Assistance"
        description="AI-powered legal help for HRTO applications, discrimination complaints, and human rights matters in Ontario"
        serviceType={["Human Rights Law", "HRTO Applications", "Discrimination Law"]}
      />

      <div className="min-h-screen bg-background">
        <Header />
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
          <div className="container max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span>/</span>
              <span>Human Rights Ontario Guide</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Human Rights Ontario: Complete Guide 2025
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Everything you need to know about filing HRTO applications, fighting discrimination, and protecting your rights under Ontario's Human Rights Code.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/hrto-journey">Start HRTO Application</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/forms">Browse HRTO Forms</Link>
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
                  <CardTitle className="text-3xl">4,000+</CardTitle>
                  <CardDescription>HRTO Applications Filed Annually</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl">1 Year</CardTitle>
                  <CardDescription>Time Limit to File Most Human Rights Claims</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl">17</CardTitle>
                  <CardDescription>Protected Grounds Under Human Rights Code</CardDescription>
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
              <h2 className="text-3xl font-bold mb-6">Understanding Human Rights Law in Ontario</h2>
              <div className="prose prose-lg max-w-none space-y-4">
                <p>
                  The <strong>Human Rights Code of Ontario</strong> protects people from discrimination and harassment in five key areas: 
                  employment, housing, services, contracts, and membership in unions or professional associations. If you've experienced 
                  <strong> discrimination at work Ontario tribunal</strong> matters or other forms of discrimination, you can file a 
                  <strong> human rights complaint Canada</strong> with the Human Rights Tribunal of Ontario (HRTO).
                </p>
                <p>
                  This guide covers everything from <strong>HRTO Application Form 1 Ontario</strong> filing procedures to understanding 
                  the HRTO hearing process and your rights under the Human Rights Code.
                </p>
              </div>
            </div>

            {/* Key Topics */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Essential Human Rights Topics</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {clusterPages.map((page) => (
                  <Card key={page.path} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <page.icon className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <CardTitle className="mb-2">{page.title}</CardTitle>
                          <CardDescription className="mb-4">
                            Step-by-step guide with forms, deadlines, and legal requirements.
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

            {/* Protected Grounds */}
            <div>
              <h2 className="text-3xl font-bold mb-6">17 Protected Grounds Under the Human Rights Code</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <strong>Age</strong>
                        <p className="text-sm text-muted-foreground">18+ in employment, 16+ in housing</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <strong>Ancestry, Colour, Race</strong>
                        <p className="text-sm text-muted-foreground">Protection from racial discrimination</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <strong>Citizenship</strong>
                        <p className="text-sm text-muted-foreground">Employment protections</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <strong>Ethnic Origin</strong>
                        <p className="text-sm text-muted-foreground">National or cultural background</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <strong>Place of Origin</strong>
                        <p className="text-sm text-muted-foreground">Where you were born</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <strong>Creed (Religion)</strong>
                        <p className="text-sm text-muted-foreground">Religious beliefs or practices</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <strong>Disability</strong>
                        <p className="text-sm text-muted-foreground">Physical or mental disabilities</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <strong>Family Status</strong>
                        <p className="text-sm text-muted-foreground">Parent-child relationships</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <strong>Marital Status</strong>
                        <p className="text-sm text-muted-foreground">Married, single, divorced, etc.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <strong>Gender Identity, Gender Expression</strong>
                        <p className="text-sm text-muted-foreground">How you identify and express</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <strong>Receipt of Public Assistance</strong>
                        <p className="text-sm text-muted-foreground">Housing protections only</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <strong>Record of Offences</strong>
                        <p className="text-sm text-muted-foreground">Employment protections</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <strong>Sex (including pregnancy)</strong>
                        <p className="text-sm text-muted-foreground">Gender-based discrimination</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <strong>Sexual Orientation</strong>
                        <p className="text-sm text-muted-foreground">LGBTQ+ protections</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filing Process */}
            <div>
              <h2 className="text-3xl font-bold mb-6">How to File an HRTO Application</h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Step 1: Complete HRTO Application Form 1
                    </CardTitle>
                    <CardDescription>
                      Download and complete Application Form 1 from the HRTO website. Include detailed information about 
                      the discrimination, who discriminated against you, and how it affected you.
                      <Link to="/hrto-form-1-guide" className="text-primary hover:underline ml-2">
                        Detailed Form 1 guide →
                      </Link>
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Step 2: Gather Supporting Evidence</CardTitle>
                    <CardDescription>
                      Collect emails, text messages, photos, witness statements, medical records, and any other documents 
                      that support your claim. The more evidence, the stronger your case.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Step 3: File Within Time Limits</CardTitle>
                    <CardDescription>
                      You must file within 1 year of the last incident of discrimination. The HRTO may extend this 
                      deadline in exceptional circumstances, but don't wait - file as soon as possible.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Step 4: Submit Your Application</CardTitle>
                    <CardDescription>
                      File online through the HRTO's Case Management System or by mail/courier. There is no filing fee 
                      for HRTO applications.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Workplace Discrimination */}
            <div className="bg-accent/50 rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-6">Common Workplace Discrimination Examples</h2>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span>Not hiring someone because of their race, religion, or disability</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span>Harassment based on sex, sexual orientation, or gender identity</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span>Refusing to accommodate an employee's disability or religious practices</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span>Firing or demoting someone because of their age or family status</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span>Paying employees differently based on protected grounds</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span>Creating a poisoned work environment through discriminatory comments</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link to="/workplace-discrimination-guide">
                  <Button>Read Full Workplace Discrimination Guide</Button>
                </Link>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-primary/10 rounded-lg p-8 text-center">
              <Scale className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-4">Need Help Filing an HRTO Application?</h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our AI legal assistant can help you understand your human rights, prepare Form 1, 
                and gather evidence for your HRTO application. Get started for free today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link to="/hrto-journey">Start HRTO Application</Link>
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
                      <Link to="/tenant-rights-ontario-guide" className="hover:text-primary">
                        Tenant Rights Ontario Guide
                      </Link>
                    </CardTitle>
                    <CardDescription>Complete guide to LTB forms, eviction notices, and housing rights</CardDescription>
                  </CardHeader>
                </Card>
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
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default HumanRightsGuide;
