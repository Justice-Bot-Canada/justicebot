import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ArticleSchema } from "@/components/ArticleSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Scale, Clock, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function LTBGuide() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Resources", href: "/legal-resources" },
    { label: "LTB Guide" }
  ];

  return (
    <>
      <SEOHead
        title="Ultimate Guide to Landlord and Tenant Board (LTB) and Ontario Tribunals 2025"
        description="Complete guide to navigating the Landlord and Tenant Board (LTB), Human Rights Tribunal (HRTO), and other Ontario tribunals. Learn procedures, timelines, forms, and winning strategies."
        keywords="LTB guide, landlord tenant board Ontario, tribunal procedures, HRTO guide, Ontario tribunals, tenant rights, eviction process, N4 form, L1 application"
        canonicalUrl="https://justice-bot.com/ltb-guide"
      />
      <ArticleSchema
        headline="Ultimate Guide to LTB and Ontario Tribunals"
        description="Comprehensive 2025 guide covering LTB procedures, HRTO processes, tribunal timelines, required forms, and strategies for success in Ontario's legal tribunals."
        image="https://justice-bot.com/justice-bot-logo.jpeg"
        datePublished="2025-01-15T00:00:00Z"
        dateModified={new Date().toISOString()}
        url="https://justice-bot.com/ltb-guide"
      />

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-12 max-w-5xl">
          <Breadcrumbs items={breadcrumbs} />

          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ultimate Guide to LTB and Ontario Tribunals
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Everything you need to know about navigating the Landlord and Tenant Board (LTB), 
              Human Rights Tribunal of Ontario (HRTO), and other administrative tribunals in 2025.
            </p>
            
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> This guide provides general information. For case-specific advice, 
                consult with a lawyer or paralegal. Contact{" "}
                <a href="mailto:admin@justice-bot.com" className="text-primary hover:underline">
                  admin@justice-bot.com
                </a>{" "}
                for questions.
              </AlertDescription>
            </Alert>
          </div>

          {/* Quick Navigation */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <a href="#ltb-overview" className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <h3 className="font-semibold mb-2">LTB Overview</h3>
                  <p className="text-sm text-muted-foreground">Understanding the Landlord and Tenant Board</p>
                </a>
                <a href="#common-applications" className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <h3 className="font-semibold mb-2">Common Applications</h3>
                  <p className="text-sm text-muted-foreground">N4, L1, L2, T2, T6 and more</p>
                </a>
                <a href="#hrto-guide" className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <h3 className="font-semibold mb-2">HRTO Guide</h3>
                  <p className="text-sm text-muted-foreground">Human Rights Tribunal procedures</p>
                </a>
                <a href="#timelines" className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <h3 className="font-semibold mb-2">Timelines & Deadlines</h3>
                  <p className="text-sm text-muted-foreground">Critical dates you must know</p>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* LTB Overview Section */}
          <section id="ltb-overview" className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Scale className="h-8 w-8 text-primary" />
              What is the Landlord and Tenant Board (LTB)?
            </h2>
            
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-muted-foreground mb-4">
                The Landlord and Tenant Board (LTB) is an administrative tribunal that resolves disputes 
                between residential landlords and tenants in Ontario. It operates under the{" "}
                <strong>Residential Tenancies Act, 2006 (RTA)</strong>.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <FileText className="h-10 w-10 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">What LTB Handles</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Evictions for non-payment</li>
                      <li>• Rent increases</li>
                      <li>• Maintenance disputes</li>
                      <li>• Application to end tenancy</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <Clock className="h-10 w-10 text-accent mb-3" />
                    <h3 className="font-semibold mb-2">Processing Times</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• L1 (rent): 6-10 weeks</li>
                      <li>• L2 (other): 8-12 weeks</li>
                      <li>• T2 (tenant): 10-16 weeks</li>
                      <li>• Urgent: 1-3 weeks</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <CheckCircle className="h-10 w-10 text-success mb-3" />
                    <h3 className="font-semibold mb-2">Success Tips</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• File applications correctly</li>
                      <li>• Organize all evidence</li>
                      <li>• Meet all deadlines</li>
                      <li>• Attend hearings prepared</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Common LTB Applications */}
          <section id="common-applications" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Common LTB Applications & Forms</h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="n4-l1" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="text-left">
                    <h3 className="font-semibold">N4 Notice / L1 Application (Non-Payment of Rent)</h3>
                    <p className="text-sm text-muted-foreground">Most common eviction process</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4 space-y-4">
                    <p><strong>When to Use:</strong> Landlord seeking eviction for unpaid rent</p>
                    <p><strong>Key Deadlines:</strong></p>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>N4 must give 14 days notice (or 7 days if paying monthly)</li>
                      <li>L1 can be filed after N4 period expires and rent remains unpaid</li>
                      <li>Tenant has 11 days to pay after L1 is served to void application</li>
                    </ul>
                    <p><strong>Required Documents:</strong> N4 notice, rent ledger, lease agreement, proof of service</p>
                    <Alert>
                      <AlertDescription>
                        <strong>Tenant Defense:</strong> You can avoid eviction by paying all arrears plus fees 
                        before the hearing date. Document any payment agreements in writing.
                      </AlertDescription>
                    </Alert>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="n5-l2" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="text-left">
                    <h3 className="font-semibold">N5 Notice / L2 Application (Tenant Behaviour)</h3>
                    <p className="text-sm text-muted-foreground">For noise, damage, illegal activities</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4 space-y-4">
                    <p><strong>When to Use:</strong> Tenant causing problems, damage, or violating lease terms</p>
                    <p><strong>Key Deadlines:</strong></p>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>First N5: 20 days notice, tenant can void by fixing issue within 7 days</li>
                      <li>Second N5 (if first voided): 14 days notice, non-voidable</li>
                      <li>L2 filed after N5 period expires</li>
                    </ul>
                    <p><strong>Evidence Needed:</strong> Photos, videos, witness statements, police reports, complaint logs</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="t2-tenant" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="text-left">
                    <h3 className="font-semibold">T2 Application (Tenant Rights)</h3>
                    <p className="text-sm text-muted-foreground">Tenant complaints against landlord</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4 space-y-4">
                    <p><strong>When to Use:</strong> Landlord harassment, illegal entry, failure to maintain, illegal rent increase</p>
                    <p><strong>Common Grounds:</strong></p>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Landlord entered without proper notice (24 hours required)</li>
                      <li>Substantial interference with reasonable enjoyment</li>
                      <li>Failure to maintain property (no heat, water issues, pests)</li>
                      <li>Harassment or threats</li>
                    </ul>
                    <p><strong>Potential Remedies:</strong> Rent abatement, order for repairs, compensation for damages</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="t6-maintenance" className="border rounded-lng px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="text-left">
                    <h3 className="font-semibold">T6 Application (Maintenance Issues)</h3>
                    <p className="text-sm text-muted-foreground">For serious maintenance problems</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4 space-y-4">
                    <p><strong>When to Use:</strong> Landlord fails to maintain property or vital services</p>
                    <p><strong>Examples:</strong> No heat in winter, mold issues, pest infestations, plumbing failures, structural problems</p>
                    <p><strong>Documentation:</strong> Photos with timestamps, repair requests (written), city inspection reports, receipts for temporary fixes</p>
                    <Alert>
                      <AlertDescription>
                        <strong>Pro Tip:</strong> Always make repair requests in writing (email or text) to create 
                        a paper trail. Take photos with dates visible.
                      </AlertDescription>
                    </Alert>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* HRTO Section */}
          <section id="hrto-guide" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Human Rights Tribunal of Ontario (HRTO)</h2>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <p className="mb-4">
                  The HRTO handles discrimination complaints based on protected grounds under the 
                  <strong> Ontario Human Rights Code</strong>.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Protected Grounds</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Race, ancestry, color, ethnic origin</li>
                      <li>• Citizenship, place of origin</li>
                      <li>• Creed (religion)</li>
                      <li>• Sex (including pregnancy, gender identity)</li>
                      <li>• Sexual orientation</li>
                      <li>• Age (18+)</li>
                      <li>• Marital status, family status</li>
                      <li>• Disability (physical, mental)</li>
                      <li>• Record of offences</li>
                      <li>• Receipt of public assistance (housing)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">HRTO Process</h3>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      <li>1. File Application (Form 1) within 1 year</li>
                      <li>2. Respondent receives copy, has 35 days to reply</li>
                      <li>3. Mediation offered (optional, confidential)</li>
                      <li>4. Written hearing or in-person hearing</li>
                      <li>5. Decision issued (usually 6-12 months total)</li>
                      <li>6. Remedies: Compensation, orders to stop discrimination</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertDescription>
                <strong>Important Deadline:</strong> HRTO applications must be filed within 1 year of the last 
                incident of discrimination. Missing this deadline usually means your case cannot proceed.
              </AlertDescription>
            </Alert>
          </section>

          {/* Timelines Section */}
          <section id="timelines" className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Clock className="h-8 w-8 text-primary" />
              Critical Timelines & Deadlines
            </h2>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">LTB Notice Periods</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="p-3 border rounded">
                        <strong>N4 (Non-payment):</strong> 14 days (7 if monthly rental)
                      </div>
                      <div className="p-3 border rounded">
                        <strong>N5 (First):</strong> 20 days (7 day remedy period)
                      </div>
                      <div className="p-3 border rounded">
                        <strong>N5 (Second):</strong> 14 days (non-voidable)
                      </div>
                      <div className="p-3 border rounded">
                        <strong>N12 (Own use):</strong> 60 days + end of term
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Response Deadlines</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Answer LTB Application:</strong> No set deadline, but attend hearing</li>
                      <li>• <strong>HRTO Response:</strong> 35 days from receiving application</li>
                      <li>• <strong>Request Review:</strong> 30 days from LTB order</li>
                      <li>• <strong>Appeal to Divisional Court:</strong> 30 days from LTB order</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Success Strategies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Strategies for Success at Tribunals</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Evidence Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Create chronological timeline of events</p>
                  <p>• Label all documents clearly</p>
                  <p>• Prepare exhibit book with tabs</p>
                  <p>• Make 3 copies (tribunal, other party, yourself)</p>
                  <p>• Bring originals to hearing</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hearing Preparation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Practice your testimony</p>
                  <p>• Prepare questions for witnesses</p>
                  <p>• Review relevant sections of RTA/Human Rights Code</p>
                  <p>• Arrive 30 minutes early</p>
                  <p>• Dress professionally</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">Need Help With Your Tribunal Case?</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Justice-Bot provides AI-powered guidance, form filling assistance, and document generation 
                  for LTB, HRTO, and other Ontario tribunals.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Button size="lg" asChild>
                    <a href="/journey">
                      Start Case Assessment <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="/legal-chat">
                      Ask AI Assistant
                    </a>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Questions? Email <a href="mailto:admin@justice-bot.com" className="text-primary hover:underline">admin@justice-bot.com</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    </>
  );
}