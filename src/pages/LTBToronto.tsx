import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, FileText, MapPin, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function LTBToronto() {
  const faqData = [
    {
      question: "Do I need a lawyer for LTB Toronto?",
      answer: "No. Most tenants self-represent successfully at the Landlord and Tenant Board."
    },
    {
      question: "Can I request a fee waiver?",
      answer: "Yes. If you receive OW, ODSP, CPP-D, or have low income, you qualify for a fee waiver."
    },
    {
      question: "Can I file multiple forms?",
      answer: "Yes. T2 + T6 is extremely common and often recommended for comprehensive cases."
    },
    {
      question: "Do I have to attend in-person?",
      answer: "No. LTB Toronto hearings are conducted online via Zoom."
    },
    {
      question: "How long do LTB Toronto cases take?",
      answer: "T2 cases typically take 6-12 months, T6 cases take 8-14 months. Urgent health/safety cases may be expedited."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Landlord and Tenant Board Toronto – Complete 2025 Guide for Tenants",
    "description": "Complete guide to filing T2 and T6 applications at the Landlord and Tenant Board Toronto office. Learn tenant rights, evidence requirements, timelines, and how to win your case.",
    "author": {
      "@type": "Organization",
      "name": "Justice-Bot"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Justice-Bot",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.justice-bot.com/justice-bot-logo.jpeg"
      }
    },
    "datePublished": "2025-01-01",
    "dateModified": new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.justice-bot.com/ltb-toronto"
    }
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>Landlord and Tenant Board Toronto – How to File T2/T6 (2025 Guide)</title>
        <meta name="description" content="Complete guide to LTB Toronto: File T2 tenant rights applications & T6 maintenance applications. Learn timelines, evidence, tenant rights, and how to win at the Landlord and Tenant Board Toronto office." />
        <meta name="keywords" content="LTB Toronto, Landlord Tenant Board Toronto, file T2 Toronto, file T6 Toronto, tenant rights Toronto, LTB hearing Toronto, Toronto tenant board, T2 application Toronto, T6 application Toronto" />
        <link rel="canonical" href="https://www.justice-bot.com/ltb-toronto" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Landlord and Tenant Board Toronto – Complete T2/T6 Filing Guide" />
        <meta property="og:description" content="File T2 & T6 applications at LTB Toronto. Complete guide to tenant rights, evidence, timelines, and winning your case in 2025." />
        <meta property="og:url" content="https://www.justice-bot.com/ltb-toronto" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.justice-bot.com/justice-bot-logo.jpeg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructuredData)}</script>
      </Helmet>

      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-primary mb-4">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">Toronto, Ontario</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Landlord and Tenant Board Toronto – Complete 2025 Guide for Tenants
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              The LTB Toronto office handles thousands of applications every year — repairs, harassment, discrimination, illegal entry, unsafe housing, and eviction. This guide walks you through filing T2 and T6 applications step-by-step.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg">
                <Link to="/ltb-journey">
                  <FileText className="w-5 h-5 mr-2" />
                  Generate T2/T6 Forms Now
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <a href="#how-to-file">Learn How to File</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Alert Banner */}
        <section className="py-6 px-4 bg-orange-50 dark:bg-orange-900/20">
          <div className="max-w-4xl mx-auto">
            <Alert className="border-orange-300 bg-transparent">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <AlertDescription className="text-orange-900 dark:text-orange-100">
                <strong>Current LTB Toronto wait times (2025):</strong> T2 cases: 6-12 months | T6 cases: 8-14 months. File early to protect your rights.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
          
          {/* What LTB Toronto Handles */}
          <section>
            <h2 className="text-3xl font-bold mb-6">What the LTB Toronto Handles</h2>
            <p className="text-lg text-muted-foreground mb-6">
              If you're dealing with any of the following, the LTB is the right place:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Repairs not done",
                "Unsafe or unhealthy housing",
                "Bed bugs, cockroaches, pests",
                "Mold, leaks, heating failures",
                "Harassment by landlord or superintendent",
                "Discrimination or retaliation",
                "Illegal entry",
                "Rent issues, improper charges, deposits",
                "Eviction notices (N4, N5, N7, N12, etc.)"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* How to File T2 */}
          <section id="how-to-file">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" />
                  How to File a T2 Application in Toronto (Tenant Rights)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">When to file a T2</h3>
                  <p className="text-muted-foreground mb-3">You file a T2 when the landlord:</p>
                  <ul className="space-y-2 ml-6">
                    {[
                      "Failed to repair",
                      "Violated your privacy",
                      "Interfered with your reasonable enjoyment",
                      "Harassed you",
                      "Discriminated against you",
                      "Shut off utilities",
                      "Allowed unsafe or unclean conditions"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">How to file</h3>
                  <ol className="space-y-3">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</span>
                      <span>Download or complete the T2 online</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</span>
                      <span>Attach your evidence</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</span>
                      <span>Pay the fee or request a fee waiver</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</span>
                      <span>Submit online to the Toronto LTB office</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">5</span>
                      <span>Serve your landlord</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">6</span>
                      <span>Wait for your hearing notice</span>
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Outcomes tenants often receive</h3>
                  <div className="space-y-2">
                    {[
                      "Rent abatement (refund)",
                      "Repair order",
                      "Order to stop harassment",
                      "Compensation for expenses",
                      "Order for landlord to follow human rights obligations"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button asChild className="w-full" size="lg">
                  <Link to="/ltb-journey">
                    Generate Your T2 Application Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* How to File T6 */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" />
                  How to File a T6 Application in Toronto (Maintenance & Repairs)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Use a T6 when:</h3>
                  <ul className="space-y-2">
                    {[
                      "Repairs are not completed",
                      "Work orders were ignored",
                      "Unit is unsafe or unhealthy",
                      "Landlord won't fix pests, mold, leaks, heating, structural issues"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Common T6 awards</h3>
                  <div className="space-y-2">
                    {[
                      "Rent reduction",
                      "Rent abatement (refund)",
                      "Work order forcing repairs",
                      "Compensation for suffering, costs, or health impacts"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button asChild className="w-full" size="lg">
                  <Link to="/ltb-journey">
                    Generate Your T6 Application Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Evidence Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Evidence You Should Submit (Toronto Cases)</h2>
            <Card>
              <CardContent className="pt-6 space-y-6">
                <p className="text-lg">Your evidence should be solid and organized. Accepted evidence includes:</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Photos",
                    "Videos",
                    "Doctor notes",
                    "Children's health notes",
                    "Emails, texts, maintenance logs",
                    "Incident timelines",
                    "Toronto Public Health reports",
                    "Property Standards reports",
                    "Receipts for costs (cleaning, repairs, hotels, etc.)"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <Alert>
                  <AlertDescription>
                    <strong>Winning tip for Toronto cases:</strong> The LTB tends to rely heavily on timelines. Make sure your evidence is chronological.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </section>

          {/* Timeline Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-8 h-8 text-primary" />
              How Long LTB Toronto Cases Take (Realistic 2025 Timeline)
            </h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg mb-6">Current approximate wait times:</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold">T2 Applications</div>
                      <div className="text-muted-foreground">6–12 months</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold">T6 Applications</div>
                      <div className="text-muted-foreground">8–14 months</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold">Urgent health/safety cases</div>
                      <div className="text-muted-foreground">Sometimes faster (expedited)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold">Evictions (N4/N12/N5)</div>
                      <div className="text-muted-foreground">Typically prioritized</div>
                    </div>
                  </div>
                </div>
                <p className="mt-6 text-muted-foreground">
                  Stay ready with documentation — delays don't mean your case is weak.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Location Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="w-8 h-8 text-primary" />
              Location: LTB Toronto Regional Office
            </h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">You can file online, but here's the public Toronto office info:</p>
                <div className="bg-muted p-6 rounded-lg space-y-2">
                  <div className="font-bold text-lg">Landlord and Tenant Board – Toronto East Region</div>
                  <div>20 Dundas Street West</div>
                  <div>Toronto, ON M5G 2C2</div>
                  <div className="text-muted-foreground">(Located near Dundas Station)</div>
                  <div className="mt-4">
                    <strong>Phone:</strong> <a href="tel:1-888-332-3234" className="text-primary hover:underline">1-888-332-3234</a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Process Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">What Happens After You File (Step-by-Step)</h2>
            <Card>
              <CardContent className="pt-6">
                <ol className="space-y-6">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">1</span>
                    <div>
                      <div className="font-semibold text-lg mb-1">You get a Notice of Hearing</div>
                      <div className="text-muted-foreground">This includes date, time, and Zoom link.</div>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">2</span>
                    <div>
                      <div className="font-semibold text-lg mb-1">You must serve your landlord</div>
                      <div className="text-muted-foreground">Usually by email or hand delivery.</div>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">3</span>
                    <div>
                      <div className="font-semibold text-lg mb-1">Evidence must be submitted before the deadline</div>
                      <div className="text-muted-foreground">LTB is strict about disclosure.</div>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">4</span>
                    <div>
                      <div className="font-semibold text-lg mb-1">You attend a Zoom hearing</div>
                      <div className="text-muted-foreground">Organized, calm, and factual = best results.</div>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">5</span>
                    <div>
                      <div className="font-semibold text-lg mb-1">The adjudicator issues a written order</div>
                      <div className="text-muted-foreground">This is emailed to you and legally binding.</div>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">Need Help? Justice-Bot Can Generate Your T2 or T6 Automatically</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                You don't need to guess which form to file. Justice-Bot can analyze your situation, recommend T2, T6, or both, and auto-fill your forms with AI.
              </p>
              <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {[
                  "Analyze your situation",
                  "Recommend T2, T6, or both",
                  "Auto-fill your form",
                  "Build your evidence package",
                  "Show your exact Toronto filing steps",
                  "Create a timeline of incidents",
                  "Prepare your questions for the hearing",
                  "Upload evidence → get form ready"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Button asChild size="lg" className="text-lg">
                <Link to="/ltb-journey">
                  <FileText className="w-5 h-5 mr-2" />
                  Start Your T2/T6 Application Now
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                Upload your evidence → get your legal form ready in minutes
              </p>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">FAQ – LTB Toronto (2025)</h2>
            <div className="space-y-4">
              {faqData.map((faq, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}
