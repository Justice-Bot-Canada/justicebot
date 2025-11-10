import SEOHead from "@/components/SEOHead";
import { ArticleSchema } from "@/components/ArticleSchema";
import { LegalServiceSchema } from "@/components/LegalServiceSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart, FileText, Users, AlertCircle, CheckCircle, Baby } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FamilyLawGuide = () => {
  const clusterPages = [
    { title: "CAS Removal: Your Rights and Options", path: "/cas-removal-guide", icon: Baby },
    { title: "Child Custody Forms Ontario Guide", path: "/custody-forms-guide", icon: Users },
    { title: "Supervised Access Order Explained", path: "/supervised-access-guide", icon: AlertCircle },
    { title: "Family Court Ontario Process", path: "/family-court-process", icon: FileText },
  ];

  return (
    <>
      <SEOHead
        title="Family Law Ontario: Complete Guide 2025 | Custody, CAS & Family Court Help"
        description="Complete guide to family law in Ontario 2025. Learn about child custody forms, CAS removal rights, supervised access orders, and family court procedures. Free AI legal help."
        canonicalUrl="https://justice-bot.com/family-law-ontario-guide"
        keywords="family law Ontario, child custody forms Ontario, CAS removal, family court Ontario, supervised access order, custody rights Canada"
      />
      
      <ArticleSchema
        headline="Family Law Ontario: Complete Guide 2025"
        description="Comprehensive guide covering child custody, CAS matters, family court procedures, and parental rights in Ontario."
        image="https://justice-bot.com/justice-bot-logo.jpeg"
        datePublished="2025-01-09"
        dateModified="2025-01-09"
        author="Justice-Bot Legal Team"
        url="https://justice-bot.com/family-law-ontario-guide"
      />

      <LegalServiceSchema
        serviceName="Family Law Legal Assistance"
        description="AI-powered legal help for Ontario families dealing with custody disputes, CAS matters, and family court"
        serviceType={["Family Law", "Child Custody", "Child Protection"]}
      />

      <div className="min-h-screen bg-background">
        <Header />
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
          <div className="container max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span>/</span>
              <span>Family Law Ontario Guide</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Family Law Ontario: Complete Guide 2025
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Everything you need to know about child custody, CAS matters, family court procedures, and protecting your parental rights in Ontario.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/family-journey">Start Family Law Journey</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/forms">Browse Family Law Forms</Link>
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
                  <CardTitle className="text-3xl">30,000+</CardTitle>
                  <CardDescription>Family Court Cases Filed Annually</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl">24/7</CardTitle>
                  <CardDescription>Free AI Legal Assistant Available</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl">100%</CardTitle>
                  <CardDescription>Confidential Legal Guidance</CardDescription>
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
              <h2 className="text-3xl font-bold mb-6">Understanding Family Law in Ontario</h2>
              <div className="prose prose-lg max-w-none space-y-4">
                <p>
                  <strong>Family law in Ontario</strong> covers a wide range of legal matters affecting families, including 
                  child custody and access, Children's Aid Society (CAS) interventions, child protection proceedings, 
                  and family court procedures. Whether you're dealing with a <strong>CAS removal</strong>, navigating 
                  <strong> child custody forms Ontario</strong>, or preparing for a family court hearing, understanding 
                  your rights is essential.
                </p>
                <p>
                  This guide helps Ontario parents and caregivers understand the <strong>family court Ontario</strong> process, 
                  protect their parental rights, and access the legal resources they need.
                </p>
              </div>
            </div>

            {/* Key Topics */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Essential Family Law Topics</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {clusterPages.map((page) => (
                  <Card key={page.path} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <page.icon className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <CardTitle className="mb-2">{page.title}</CardTitle>
                          <CardDescription className="mb-4">
                            Step-by-step guide with forms, procedures, and legal requirements.
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

            {/* CAS Matters */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Children's Aid Society (CAS) Matters</h2>
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-semibold mb-2">What to Do If CAS Comes to Your Door</h3>
                  <p className="text-muted-foreground mb-2">
                    You have the right to refuse entry without a warrant, request to see ID, and have a support person present. 
                    Anything you say can be used in court proceedings.
                  </p>
                  <Link to="/cas-removal-guide" className="text-primary hover:underline">
                    Read complete CAS rights guide →
                  </Link>
                </div>

                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-semibold mb-2">Types of CAS Interventions</h3>
                  <p className="text-muted-foreground">
                    <strong>In-Home Support:</strong> CAS provides services while child remains at home<br/>
                    <strong>Kinship Care:</strong> Child placed with family members<br/>
                    <strong>Foster Care:</strong> Temporary placement with licensed foster parents<br/>
                    <strong>Society Care:</strong> CAS has legal custody of the child
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-semibold mb-2">Child Protection Court Process</h3>
                  <p className="text-muted-foreground">
                    CAS must file a court application within 5 days of removing a child. You have the right to legal representation, 
                    to present evidence, and to appeal court decisions. The court's primary consideration is the best interests of the child.
                  </p>
                </div>
              </div>
            </div>

            {/* Custody & Access */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Child Custody and Access in Ontario</h2>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Types of Custody Arrangements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Sole Custody</h4>
                    <p className="text-muted-foreground">
                      One parent makes all major decisions about the child's upbringing (education, healthcare, religion). 
                      The other parent typically has access/parenting time.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Joint Custody</h4>
                    <p className="text-muted-foreground">
                      Both parents share decision-making responsibility. Requires cooperation and communication between parents. 
                      Children may live primarily with one parent or split time equally.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Shared Custody</h4>
                    <p className="text-muted-foreground">
                      Child spends at least 40% of time with each parent. Often involves week-on/week-off or 2-2-3 schedules. 
                      May affect child support calculations.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Essential Custody Forms Ontario</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <strong>Form 8:</strong> Application (General) - Used to start most family law cases
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <strong>Form 35.1:</strong> Affidavit in Support of Claim for Custody or Access
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <strong>Form 14B:</strong> Motion Form - For urgent motions or changes to orders
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <strong>Form 36:</strong> Affidavit for Divorce - If divorce includes custody/access
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Your Rights */}
            <div className="bg-accent/50 rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-primary" />
                Your Key Parental Rights
              </h2>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span>Right to legal representation in all CAS and family court matters</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span>Right to participate in decisions affecting your child's welfare</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span>Right to access and review CAS files and reports about your family</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span>Right to visit your child during CAS care (unless court ordered otherwise)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span>Right to appeal family court orders and CAS decisions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span>Right to request supervised access if denied unsupervised access</span>
                </li>
              </ul>
            </div>

            {/* CTA Section */}
            <div className="bg-primary/10 rounded-lg p-8 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-4">Need Help with Family Law Matters?</h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our AI legal assistant can help you understand your parental rights, prepare custody forms, 
                and navigate CAS interventions. Get started for free today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link to="/family-journey">Start Family Law Journey</Link>
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

export default FamilyLawGuide;
