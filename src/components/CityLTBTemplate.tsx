import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, FileText, MapPin, Clock, AlertTriangle, ArrowRight, Building, Phone, Car, Train } from "lucide-react";
import { Link } from "react-router-dom";

export interface CityLTBConfig {
  city: string;
  slug: string;
  waitTimes: {
    t2: string;
    t6: string;
    urgent: string;
    eviction: string;
  };
  commonProblems: string[];
  tribunalInfo?: {
    address?: string;
    hours?: string;
    phone?: string;
    parking?: string;
    transit?: string;
    filingDeadline?: string;
    localClinics?: { name: string; phone?: string; url?: string }[];
  };
  customFaqs?: { question: string; answer: string }[];
}

const defaultFaqs = (city: string) => [
  {
    question: `How long are LTB wait times in ${city}?`,
    answer: `LTB wait times in ${city} vary by case type. T2 applications typically take 6-12 months, T6 maintenance applications take 8-14 months. Urgent health/safety cases may be expedited.`
  },
  {
    question: "Can my landlord evict me without going to the LTB?",
    answer: "No. In Ontario, landlords cannot evict you without an LTB order. Even if you receive an eviction notice (N4, N5, N12), you have the right to dispute it at the LTB."
  },
  {
    question: `Do I need a lawyer for tenant rights in ${city}?`,
    answer: "No. Most tenants self-represent successfully at the LTB. Justice-Bot helps you prepare your forms, evidence, and arguments without expensive legal fees."
  },
  {
    question: "What if my landlord won't fix repairs?",
    answer: "File a T6 application with the LTB. You can request rent abatement (refund), repair orders, and compensation for damages. Document everything with photos, texts, and emails."
  },
  {
    question: "Can I request a fee waiver for LTB applications?",
    answer: "Yes. If you receive OW, ODSP, CPP-D, or have low income, you may qualify for a fee waiver. Include proof of income with your application."
  }
];

const evidenceChecklist = [
  "Photos of damage, pests, mold, or unsafe conditions",
  "Text messages to/from landlord",
  "Emails and written correspondence",
  "Work orders or repair requests",
  "Witness statements (neighbors, family)",
  "Medical notes (if health affected)",
  "Receipts (hotel, food, supplies, cleaning)",
  "Police reports (if harassment or illegal entry)",
  "Property Standards reports",
  "Public Health inspection reports"
];

const formsNeeded = [
  { code: "T2", name: "Tenant Rights Application", description: "For harassment, interference, discrimination, illegal entry" },
  { code: "T6", name: "Maintenance Application", description: "For repairs not done, unsafe/unhealthy conditions" },
  { code: "N5", name: "Notice to End Tenancy", description: "For interference with reasonable enjoyment" },
  { code: "N4", name: "Non-payment Notice", description: "For rent arrears disputes" },
  { code: "S2", name: "Request to Review", description: "To appeal or review an LTB order" },
  { code: "HRTO Form 1", name: "Human Rights Application", description: "If discrimination involved (can file both)" }
];

export default function CityLTBTemplate({ config }: { config: CityLTBConfig }) {
  const { city, slug, waitTimes, commonProblems, tribunalInfo, customFaqs } = config;
  const faqs = customFaqs?.length ? customFaqs : defaultFaqs(city);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Landlord and Tenant Board (LTB) Help in ${city}, Ontario`,
    "description": `Complete guide to filing T2 and T6 applications at the LTB for ${city} tenants. Learn tenant rights, evidence requirements, timelines, and how to win your case.`,
    "author": { "@type": "Organization", "name": "Justice-Bot" },
    "publisher": {
      "@type": "Organization",
      "name": "Justice-Bot",
      "logo": { "@type": "ImageObject", "url": "https://www.justice-bot.com/justice-bot-logo.jpeg" }
    },
    "datePublished": "2025-01-01",
    "dateModified": new Date().toISOString(),
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.justice-bot.com/${slug}` }
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to File a Tenant Rights Application in ${city}`,
    "description": `Step-by-step guide to filing LTB applications for ${city} tenants`,
    "step": [
      { "@type": "HowToStep", "name": "Identify your issue", "text": "Determine if you need T2, T6, or both forms based on your situation" },
      { "@type": "HowToStep", "name": "Generate your forms", "text": "Use Justice-Bot to auto-generate your LTB forms" },
      { "@type": "HowToStep", "name": "Upload evidence", "text": "Gather screenshots, texts, photos, and documents" },
      { "@type": "HowToStep", "name": "File with Tribunals Ontario", "text": "Submit online through the Tribunals Ontario portal" },
      { "@type": "HowToStep", "name": "Prepare for hearing", "text": "Organize timeline, strategy, and what to say" }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Landlord and Tenant Board (LTB) Help in {city}, Ontario | 2025 Guide</title>
        <meta name="description" content={`Complete LTB ${city} guide: File T2 tenant rights & T6 maintenance applications. Learn timelines, evidence requirements, and how to win your case. Free tools available.`} />
        <meta name="keywords" content={`LTB ${city}, Landlord Tenant Board ${city}, file T2 ${city}, file T6 ${city}, tenant rights ${city}, LTB hearing ${city}, ${city} tenant board`} />
        <link rel="canonical" href={`https://www.justice-bot.com/${slug}`} />
        <meta property="og:title" content={`LTB Help in ${city} – Complete Tenant Rights Guide`} />
        <meta property="og:description" content={`File T2 & T6 applications at LTB ${city}. Complete guide to tenant rights, evidence, timelines, and winning your case.`} />
        <meta property="og:url" content={`https://www.justice-bot.com/${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.justice-bot.com/justice-bot-logo.jpeg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
      </Helmet>

      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-primary mb-4">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">{city}, Ontario</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Landlord and Tenant Board (LTB) Help in {city}, Ontario
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Filing a T2 or T6 with the LTB? This guide walks you through the step-by-step process for {city} tenants — forms, evidence, timelines, and how to win.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg">
                <Link to="/ltb-journey">
                  <FileText className="w-5 h-5 mr-2" />
                  Generate Your Forms Now
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <a href="#how-to-file">Learn How to File</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Wait Times Alert */}
        <section className="py-6 px-4 bg-orange-50 dark:bg-orange-900/20">
          <div className="max-w-4xl mx-auto">
            <Alert className="border-orange-300 bg-transparent">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <AlertDescription className="text-orange-900 dark:text-orange-100">
                <strong>Current LTB {city} wait times (2025):</strong> T2 cases: {waitTimes.t2} | T6 cases: {waitTimes.t6}. File early to protect your rights.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
          
          {/* Section 1: Step-by-Step Filing */}
          <section id="how-to-file">
            <h2 className="text-3xl font-bold mb-6">Step-by-Step – How to File a Tenant Rights Application in {city}</h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                {[
                  { step: 1, title: "Identify your issue", desc: "T2 (harassment, discrimination, privacy), T6 (repairs, safety), N4/N5/N12 (eviction defense)" },
                  { step: 2, title: "Generate your forms automatically", desc: "Use Justice-Bot's form generator to auto-fill your LTB application" },
                  { step: 3, title: "Upload your evidence", desc: "Screenshots, texts, photos, receipts, medical notes" },
                  { step: 4, title: "File with Tribunals Ontario", desc: "Submit online through the official portal" },
                  { step: 5, title: "Prepare for your hearing", desc: "Organize timeline, strategy, and what to say" }
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-4 items-start p-4 rounded-lg bg-muted/50">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">{step}</span>
                    <div>
                      <div className="font-semibold text-lg">{title}</div>
                      <div className="text-muted-foreground">{desc}</div>
                    </div>
                  </div>
                ))}
                <Button asChild className="w-full mt-6" size="lg">
                  <Link to="/ltb-journey">
                    Generate Your T2/T6 Forms Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Section 2: Common Problems */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Common LTB Problems Tenants Face in {city}</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {commonProblems.map((problem, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span>{problem}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 3: Evidence Checklist */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Evidence Checklist for {city} Tenants</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg mb-6 text-muted-foreground">Strong evidence wins cases. Collect as many of these as possible:</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {evidenceChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 4: Forms Needed */}
          <section>
            <h2 className="text-3xl font-bold mb-6">LTB Forms You'll Need</h2>
            <div className="grid gap-4">
              {formsNeeded.map((form, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-lg">{form.code} – {form.name}</div>
                      <div className="text-muted-foreground">{form.description}</div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/ltb-journey">Generate</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button asChild className="w-full mt-6" size="lg">
              <Link to="/ltb-journey">
                Generate Your Forms Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </section>

          {/* Section 5: FAQ */}
          <section>
            <h2 className="text-3xl font-bold mb-6">FAQ for {city} Tenants</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Section 6: Local Info */}
          {tribunalInfo && (
            <section>
              <h2 className="text-3xl font-bold mb-6">Local Courthouse & Tribunal Info – {city}</h2>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  {tribunalInfo.address && (
                    <div className="flex items-start gap-3">
                      <Building className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div><strong>Address:</strong> {tribunalInfo.address}</div>
                    </div>
                  )}
                  {tribunalInfo.hours && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div><strong>Hours:</strong> {tribunalInfo.hours}</div>
                    </div>
                  )}
                  {tribunalInfo.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div><strong>Phone:</strong> {tribunalInfo.phone}</div>
                    </div>
                  )}
                  {tribunalInfo.parking && (
                    <div className="flex items-start gap-3">
                      <Car className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div><strong>Parking:</strong> {tribunalInfo.parking}</div>
                    </div>
                  )}
                  {tribunalInfo.transit && (
                    <div className="flex items-start gap-3">
                      <Train className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div><strong>Transit:</strong> {tribunalInfo.transit}</div>
                    </div>
                  )}
                  {tribunalInfo.filingDeadline && (
                    <Alert className="mt-4">
                      <AlertDescription>
                        <strong>Filing Deadline:</strong> {tribunalInfo.filingDeadline}
                      </AlertDescription>
                    </Alert>
                  )}
                  {tribunalInfo.localClinics && tribunalInfo.localClinics.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-3">Local Legal Clinics</h3>
                      <div className="space-y-2">
                        {tribunalInfo.localClinics.map((clinic, idx) => (
                          <div key={idx} className="p-3 bg-muted rounded-lg">
                            <div className="font-medium">{clinic.name}</div>
                            {clinic.phone && <div className="text-sm text-muted-foreground">{clinic.phone}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          )}

          {/* Section 7: CTA */}
          <section className="text-center py-12 px-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4">Ready to File Your LTB Application?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get the exact forms you need in 5 minutes — fully automated, fully guided, zero legal jargon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/ltb-journey">
                  <FileText className="w-5 h-5 mr-2" />
                  Generate Your Forms Now
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <Link to="/legal-chat">Chat with AI Assistant</Link>
              </Button>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}