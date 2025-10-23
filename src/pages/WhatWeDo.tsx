import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WhatWeDo() {
  const weCanHelp = [
    {
      category: "Landlord-Tenant Board (LTB)",
      items: [
        "Tenant applications for maintenance, rent abatement, illegal entry",
        "Responding to eviction notices (N4, N5, N7, N12)",
        "Above-guideline rent increase challenges",
        "Illegal lockouts and harassment claims"
      ],
      link: "/ltb-journey"
    },
    {
      category: "Human Rights Tribunal of Ontario (HRTO)",
      items: [
        "Discrimination claims (housing, employment, services)",
        "Applications based on protected grounds",
        "Reasonable accommodation disputes",
        "HRTO mediation preparation"
      ],
      link: "/hrto-journey"
    },
    {
      category: "Small Claims Court",
      items: [
        "Claims up to $35,000",
        "Contract disputes, unpaid debts, property damage",
        "Consumer complaints",
        "Neighbour disputes"
      ],
      link: "/small-claims-journey"
    },
    {
      category: "Family Court",
      items: [
        "Parenting arrangements and access",
        "Child support calculations",
        "Spousal support applications",
        "Restraining orders (non-criminal)"
      ],
      link: "/family-journey"
    },
    {
      category: "Employment & Labour",
      items: [
        "Ontario Labour Relations Board complaints",
        "Wrongful dismissal claims",
        "Employment Standards Act violations",
        "Workplace harassment and discrimination"
      ],
      link: "/labour-board-journey"
    },
    {
      category: "Government Accountability",
      items: [
        "Ombudsman complaints",
        "Freedom of Information requests",
        "Municipal bylaw challenges",
        "Tribunal complaints"
      ],
      link: "/accountability-journey"
    }
  ];

  const weCannotHelp = [
    {
      category: "Criminal Law",
      items: [
        "Criminal charges and bail hearings",
        "Defence for criminal trials",
        "Parole and probation matters",
        "→ Referral: Legal Aid Ontario Criminal Law"
      ]
    },
    {
      category: "Immigration & Refugee Law",
      items: [
        "Immigration applications and appeals",
        "Refugee claims",
        "Deportation defence",
        "→ Referral: Immigration & Refugee Board, Legal Aid Immigration"
      ]
    },
    {
      category: "Corporate & Commercial Law",
      items: [
        "Business incorporation",
        "Shareholder disputes",
        "Mergers and acquisitions",
        "→ Referral: Business lawyer required"
      ]
    },
    {
      category: "Complex Appeals",
      items: [
        "Appeals to Divisional Court or Court of Appeal",
        "Judicial review applications",
        "Constitutional challenges",
        "→ Referral: Lawyer with appellate experience required"
      ]
    },
    {
      category: "Immediate Emergencies",
      items: [
        "Active domestic violence (call 911)",
        "Child abduction",
        "Immediate risk of serious harm",
        "→ Contact: Emergency services or crisis lines"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="What Justice-Bot Can Help With | Services & Scope"
        description="Learn exactly what legal issues Justice-Bot can help with—from landlord-tenant disputes to human rights claims—and what requires a lawyer. Clear scope of services."
        keywords="justice-bot services, legal help scope, what we do, landlord tenant board, human rights tribunal, small claims court"
      />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">What Justice-Bot Can Help With</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Understanding our scope helps you make the right choice. Here's exactly what we do—and what requires professional legal representation.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-8 h-8 text-success" />
                <h2 className="text-3xl font-bold">We Can Help With</h2>
              </div>
              <div className="space-y-4">
                {weCanHelp.map((area, idx) => (
                  <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold mb-3 text-primary">{area.category}</h3>
                    <ul className="space-y-2 mb-4">
                      {area.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = area.link}>
                      Start This Journey <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-8 h-8 text-destructive" />
                <h2 className="text-3xl font-bold">We Cannot Help With</h2>
              </div>
              <div className="space-y-4">
                {weCannotHelp.map((area, idx) => (
                  <Card key={idx} className="p-6 border-destructive/20 bg-destructive/5">
                    <h3 className="text-xl font-bold mb-3 text-destructive">{area.category}</h3>
                    <ul className="space-y-2">
                      {area.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          {item.startsWith("→") ? (
                            <>
                              <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <span className="font-semibold text-primary">{item}</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Not Sure Where You Fit?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Use our Smart Triage tool to identify the right legal venue for your situation. It takes just 2 minutes and provides a clear recommendation.
            </p>
            <Button variant="cta" size="lg" onClick={() => window.location.href = '/triage'}>
              Start Smart Triage <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="mt-12 bg-warning/10 border border-warning/20 rounded-lg p-8">
            <h3 className="text-xl font-bold mb-4">Important Disclaimer</h3>
            <p className="text-muted-foreground">
              Justice-Bot is a self-help legal technology platform. We do not provide legal advice, and using our service does not create a lawyer-client relationship. For complex cases, urgent matters, or if you're unsure whether to hire a lawyer, we recommend consulting with a licensed legal professional. See our full <a href="/liability" className="text-primary underline">Terms and Liability Disclaimer</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
