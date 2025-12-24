import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scale, Home, Users, Briefcase, Baby, Shield, ChevronDown, ChevronUp, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { analytics } from "@/utils/analytics";

interface Tribunal {
  id: string;
  icon: React.ElementType;
  name: string;
  fullName: string;
  description: string;
  handles: string[];
  timeline: string;
  costs: string;
  lawyerNeeded: string;
  path: string;
  faqs: { q: string; a: string }[];
}

const tribunals: Tribunal[] = [
  {
    id: "ltb",
    icon: Home,
    name: "LTB",
    fullName: "Landlord and Tenant Board",
    description: "Resolves disputes between landlords and tenants in Ontario",
    handles: [
      "Eviction applications and defences",
      "Rent increases above guidelines",
      "Maintenance and repair issues",
      "Harassment by landlord or tenant",
      "Illegal entry or privacy violations",
      "Security deposit disputes"
    ],
    timeline: "Typically 2-6 months from filing to hearing",
    costs: "$53 application fee (may be waived for financial hardship)",
    lawyerNeeded: "Not required. Most tenants self-represent successfully.",
    path: "/ltb-journey",
    faqs: [
      { q: "Can I file at the LTB if I'm being evicted?", a: "Yes, and you can also file counter-applications (like a T2 for harassment) at the same time." },
      { q: "What if I also face discrimination?", a: "You may have claims at both the LTB and HRTO. Justice-Bot can help you identify overlapping pathways." }
    ]
  },
  {
    id: "hrto",
    icon: Users,
    name: "HRTO",
    fullName: "Human Rights Tribunal of Ontario",
    description: "Handles discrimination complaints based on protected grounds",
    handles: [
      "Discrimination in employment",
      "Discrimination in housing",
      "Discrimination in services",
      "Harassment based on protected grounds",
      "Failure to accommodate disability",
      "Reprisal for asserting human rights"
    ],
    timeline: "12-24 months from filing to decision",
    costs: "Free to file",
    lawyerNeeded: "Not required, but complex cases benefit from legal support.",
    path: "/hrto-journey",
    faqs: [
      { q: "What are protected grounds?", a: "Race, ancestry, place of origin, colour, ethnic origin, citizenship, creed, sex, sexual orientation, gender identity, age, marital status, family status, disability, and receipt of public assistance (in housing)." },
      { q: "Can I file at HRTO and another tribunal?", a: "Yes. Many cases involve both HRTO and LTB (housing discrimination) or HRTO and Labour Board (employment discrimination)." }
    ]
  },
  {
    id: "small-claims",
    icon: Scale,
    name: "Small Claims",
    fullName: "Small Claims Court",
    description: "Handles civil disputes up to $35,000",
    handles: [
      "Unpaid debts and loans",
      "Contract disputes",
      "Property damage claims",
      "Consumer disputes",
      "Security deposit recovery",
      "Personal injury (under $35,000)"
    ],
    timeline: "6-12 months from filing to trial",
    costs: "$102-$240 filing fee depending on claim amount",
    lawyerNeeded: "Not required. Designed for self-represented parties.",
    path: "/small-claims-journey",
    faqs: [
      { q: "What if my claim is over $35,000?", a: "You can 'abandon' the excess and file in Small Claims, or file in Superior Court." },
      { q: "Can I recover my filing costs?", a: "Yes, if you win, the court usually orders the losing party to pay your costs." }
    ]
  },
  {
    id: "labour",
    icon: Briefcase,
    name: "Labour Board",
    fullName: "Ontario Labour Relations Board",
    description: "Handles employment and workplace disputes",
    handles: [
      "Unpaid wages and vacation pay",
      "Wrongful termination",
      "Workplace safety violations",
      "Union-related disputes",
      "Employment Standards Act claims",
      "Reprisal complaints"
    ],
    timeline: "1-6 months depending on claim type",
    costs: "Free to file ESA claims",
    lawyerNeeded: "Not required for ESA claims. More complex matters may benefit from representation.",
    path: "/labour-board-journey",
    faqs: [
      { q: "What's the difference between ESA and wrongful dismissal?", a: "ESA provides minimum entitlements (notice, severance). Wrongful dismissal claims for more compensation go to court." },
      { q: "Is there a time limit?", a: "ESA claims must be filed within 2 years. Don't wait!" }
    ]
  },
  {
    id: "family",
    icon: Baby,
    name: "Family Court",
    fullName: "Ontario Court of Justice - Family",
    description: "Handles family law matters including custody and support",
    handles: [
      "Child custody and access",
      "Child support",
      "Spousal support",
      "Restraining orders",
      "Divorce (joint with Superior Court)",
      "Property division"
    ],
    timeline: "Varies widely - 3 months to 2+ years",
    costs: "Court fees apply; fee waivers available",
    lawyerNeeded: "Recommended but not required. Duty counsel available.",
    path: "/family-journey",
    faqs: [
      { q: "Do I need a lawyer for custody?", a: "Not required, but family law is complex. Consider at least consulting one." },
      { q: "What about CAS involvement?", a: "Child protection matters are handled separately. Justice-Bot has a dedicated CAS pathway." }
    ]
  },
  {
    id: "criminal",
    icon: Shield,
    name: "Criminal Court",
    fullName: "Ontario Court of Justice - Criminal",
    description: "Handles criminal charges and proceedings",
    handles: [
      "Criminal charges defence",
      "Bail hearings",
      "Plea negotiations",
      "Trials",
      "Sentencing",
      "Appeals"
    ],
    timeline: "Varies by complexity - months to years",
    costs: "Legal aid may be available",
    lawyerNeeded: "Strongly recommended. Duty counsel available for first appearances.",
    path: "/criminal-journey",
    faqs: [
      { q: "Can I represent myself?", a: "You have the right, but criminal law is complex with serious consequences. Get legal help if possible." },
      { q: "What about police misconduct?", a: "File a complaint with OIPRD. Justice-Bot has a Police Accountability pathway." }
    ]
  }
];

const ExplainMyOptions = () => {
  const navigate = useNavigate();
  const [expandedTribunal, setExpandedTribunal] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Explain My Legal Options | Understanding Ontario Tribunals | Justice-Bot"
        description="Learn about Ontario's legal tribunals and courts. Understand which one handles your case, costs, timelines, and whether you need a lawyer."
        keywords="Ontario tribunals explained, LTB explained, HRTO guide, Small Claims Court Ontario, legal options Canada"
        canonicalUrl="https://www.justice-bot.com/explain-my-options"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Understanding Your Legal Options
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn about Ontario's tribunals and courts before you decide. Click any tribunal to learn more.
          </p>
        </div>

        {/* Key Questions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 text-center">
            <h3 className="font-semibold text-sm text-muted-foreground mb-1">Can I file at multiple tribunals?</h3>
            <p className="text-lg font-bold text-primary">Yes!</p>
            <p className="text-xs text-muted-foreground">Many cases involve overlapping claims</p>
          </Card>
          <Card className="p-4 text-center">
            <h3 className="font-semibold text-sm text-muted-foreground mb-1">Do I need a lawyer?</h3>
            <p className="text-lg font-bold text-primary">Usually not</p>
            <p className="text-xs text-muted-foreground">Most tribunals are designed for self-representation</p>
          </Card>
          <Card className="p-4 text-center">
            <h3 className="font-semibold text-sm text-muted-foreground mb-1">What does it cost?</h3>
            <p className="text-lg font-bold text-primary">$0 - $240</p>
            <p className="text-xs text-muted-foreground">Fee waivers available for hardship</p>
          </Card>
        </div>

        {/* Tribunals */}
        <div className="space-y-4">
          {tribunals.map((tribunal) => {
            const Icon = tribunal.icon;
            const isExpanded = expandedTribunal === tribunal.id;
            
            return (
              <Card key={tribunal.id} className="overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedTribunal(isExpanded ? null : tribunal.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{tribunal.fullName}</h2>
                        <p className="text-sm text-muted-foreground">{tribunal.description}</p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t">
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <h3 className="font-semibold mb-3">What they handle:</h3>
                        <ul className="space-y-2">
                          {tribunal.handles.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="text-primary">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-muted-foreground">Timeline</h4>
                          <p className="text-sm">{tribunal.timeline}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-muted-foreground">Cost</h4>
                          <p className="text-sm">{tribunal.costs}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-muted-foreground">Lawyer needed?</h4>
                          <p className="text-sm">{tribunal.lawyerNeeded}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-semibold mb-3">Common Questions:</h3>
                      <Accordion type="single" collapsible>
                        {tribunal.faqs.map((faq, i) => (
                          <AccordionItem key={i} value={`faq-${i}`}>
                            <AccordionTrigger className="text-sm text-left">
                              {faq.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground">
                              {faq.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>

                    <Button 
                      className="w-full mt-6"
                      onClick={() => {
                        analytics.educationConverted(tribunal.path, tribunal.id);
                        navigate(tribunal.path);
                      }}
                    >
                      Start {tribunal.name} Journey
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4">Ready to find your path?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => {
              analytics.educationConverted('/find-my-path', expandedTribunal || undefined);
              navigate("/find-my-path");
            }}>
              Find My Legal Path
            </Button>
            <Button size="lg" variant="outline" onClick={() => {
              analytics.educationConverted('/triage', expandedTribunal || undefined);
              navigate("/triage");
            }}>
              Get AI Recommendations
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExplainMyOptions;
