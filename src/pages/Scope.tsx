import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, Info, ArrowRight } from "lucide-react";
import EnhancedSEO from "@/components/EnhancedSEO";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Scope() {
  const weCanHelp = [
    {
      category: "Landlord-Tenant Board (LTB)",
      items: [
        "Eviction notices and hearings (N4, N5, N7, N8, N12, N13)",
        "Rent increases and disputes",
        "Maintenance and repair issues",
        "Return of security deposits",
        "Tenant applications (T2, T5, T6)",
        "Preparing evidence and witness statements"
      ]
    },
    {
      category: "Human Rights Tribunal of Ontario (HRTO)",
      items: [
        "Discrimination complaints (employment, housing, services)",
        "Application preparation and filing",
        "Response to applications",
        "Mediation preparation",
        "Evidence organization",
        "Understanding remedies and settlement options"
      ]
    },
    {
      category: "Small Claims Court",
      items: [
        "Claims up to $35,000",
        "Contract disputes",
        "Property damage claims",
        "Unpaid debts and invoices",
        "Consumer disputes",
        "Filing plaintiff and defendant claims"
      ]
    },
    {
      category: "Family Law (Ontario)",
      items: [
        "Simple separation agreements",
        "Child support calculations (basic)",
        "Spousal support basics",
        "Parenting plan templates",
        "Property division information",
        "Court form preparation (simple cases)"
      ]
    },
    {
      category: "Employment Standards",
      items: [
        "Unpaid wages claims",
        "Wrongful dismissal basics",
        "Employment Standards Act violations",
        "Filing complaints with Ministry of Labour",
        "Understanding termination pay and severance",
        "Vacation pay and overtime disputes"
      ]
    }
  ];

  const weCannotHelp = [
    {
      category: "Criminal Law",
      items: [
        "Criminal charges of any kind",
        "DUI or impaired driving",
        "Drug offences",
        "Assault or violent crimes",
        "Youth criminal matters"
      ],
      advice: "You need a criminal defence lawyer immediately. Contact Legal Aid Ontario at 1-800-668-8258."
    },
    {
      category: "Immigration Law",
      items: [
        "Refugee claims",
        "Deportation proceedings",
        "Visa and permit applications",
        "Sponsorship applications",
        "Citizenship applications"
      ],
      advice: "Immigration matters require specialized lawyers. Contact an immigration lawyer or the Law Society Referral Service."
    },
    {
      category: "Complex Corporate/Commercial Law",
      items: [
        "Business incorporation or restructuring",
        "Complex commercial contracts",
        "Intellectual property disputes",
        "Securities law",
        "Bankruptcy and insolvency"
      ],
      advice: "These matters require specialized business lawyers. Consult with a commercial lawyer through the Law Society Referral Service."
    },
    {
      category: "Complex Family Law",
      items: [
        "Contested custody battles",
        "High-conflict divorces",
        "Complex property division (businesses, pensions)",
        "International child abduction",
        "Cases involving domestic violence"
      ],
      advice: "Complex family matters need experienced family lawyers. Contact Family Law Information Centres (FLIC) or Legal Aid Ontario."
    },
    {
      category: "Superior Court Litigation",
      items: [
        "Claims over $35,000",
        "Class action lawsuits",
        "Constitutional challenges",
        "Judicial review applications",
        "Complex civil litigation"
      ],
      advice: "Superior Court matters require legal representation. Contact the Law Society Referral Service for lawyer recommendations."
    }
  ];

  const grayAreas = [
    {
      situation: "Simple vs. Complex Family Matters",
      canHelp: "Basic separation where both parties agree on most issues",
      getNeedLawyer: "Contested custody, significant assets, or domestic violence involved",
      recommendation: "Start with Justice-Bot for form preparation. If issues arise, consult a lawyer."
    },
    {
      situation: "Employment Disputes",
      canHelp: "Simple unpaid wages, basic wrongful dismissal claims",
      getNeedLawyer: "Complex severance negotiations, executive employment contracts, or discrimination",
      recommendation: "Justice-Bot can help with Ministry of Labour complaints. Complex wrongful dismissal may need a lawyer."
    },
    {
      situation: "Tribunal Representation",
      canHelp: "Preparing applications, evidence, and understanding procedures",
      getNeedLawyer: "When facing a lawyer on the other side or case involves complex legal arguments",
      recommendation: "Many people successfully represent themselves at tribunals with proper preparation. Consider a lawyer for complex issues."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="What Justice-Bot Can (and Can't) Help With - Service Scope"
        description="Clear explanation of what legal matters Justice-Bot helps with and when you need a lawyer. Covers Ontario tribunals, small claims, family law, tenant rights, and more."
        canonicalUrl="https://justice-bot.com/scope"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">What We Can (and Can't) Help With</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Justice-Bot is designed to help self-represented individuals navigate Ontario's tribunals and 
            courts for common legal issues. Here's exactly what we cover—and when you need a lawyer instead.
          </p>
        </div>

        {/* Important Notice */}
        <Alert className="mb-12 border-warning/50 bg-warning/10">
          <Info className="h-5 w-5 text-warning" />
          <AlertDescription>
            <strong>Important:</strong> Justice-Bot provides information and tools to help you represent yourself. 
            We are NOT a law firm and do NOT provide legal advice. Complex cases, cases where you're facing a 
            lawyer, or situations with serious consequences should involve consultation with a licensed lawyer or paralegal.
          </AlertDescription>
        </Alert>

        {/* What We CAN Help With */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <h2 className="text-3xl font-bold">What Justice-Bot CAN Help With</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {weCanHelp.map((section, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-xl font-bold mb-4 text-primary">{section.category}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <Card className="mt-6 p-6 bg-success/5 border-success/20">
            <h3 className="font-bold mb-2">Ontario Only (For Now)</h3>
            <p className="text-sm text-muted-foreground">
              Justice-Bot is currently designed for Ontario legal processes, forms, and tribunals. 
              We're working on expanding to other provinces. Rules and procedures differ significantly 
              across Canada, so always verify information applies to your province.
            </p>
          </Card>
        </section>

        {/* What We CANNOT Help With */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
            <h2 className="text-3xl font-bold">What Justice-Bot CANNOT Help With (Get a Lawyer)</h2>
          </div>

          <div className="space-y-6">
            {weCannotHelp.map((section, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3">{section.category}</h3>
                    <ul className="space-y-1 mb-4">
                      {section.items.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground">• {item}</li>
                      ))}
                    </ul>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm">
                        <strong>What to do instead:</strong> {section.advice}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Gray Areas */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
              <Info className="w-6 h-6 text-warning" />
            </div>
            <h2 className="text-3xl font-bold">Gray Areas: When to Consider a Lawyer</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Some situations fall in between. You might be able to handle them yourself with Justice-Bot's 
            help, but there are scenarios where hiring a lawyer would be wise. Here's guidance on these borderline cases:
          </p>

          <div className="space-y-4">
            {grayAreas.map((area, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-bold text-lg mb-4">{area.situation}</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="font-semibold text-sm">Justice-Bot Can Help:</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-7">{area.canHelp}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-destructive" />
                      <span className="font-semibold text-sm">Get a Lawyer If:</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-7">{area.getNeedLawyer}</p>
                  </div>
                </div>
                <div className="bg-primary/5 rounded-lg p-4 border-l-4 border-primary">
                  <p className="text-sm">
                    <strong>Our Recommendation:</strong> {area.recommendation}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Resources Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Finding a Lawyer or Paralegal</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="font-bold mb-2">Legal Aid Ontario</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Free legal help if you qualify financially. Covers criminal, family, immigration, and some other matters.
              </p>
              <a 
                href="https://www.legalaid.on.ca" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                legalaid.on.ca <ArrowRight className="w-3 h-3" />
              </a>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-2">Law Society Referral Service</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get up to 30 minutes free consultation with a lawyer in your area.
              </p>
              <a 
                href="https://lso.ca/public-resources/finding-a-lawyer-or-paralegal/law-society-referral-service" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                Visit LSO Referral <ArrowRight className="w-3 h-3" />
              </a>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-2">Community Legal Clinics</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Free legal help for low-income individuals. Over 70 clinics across Ontario.
              </p>
              <a 
                href="https://www.legalaid.on.ca/legal-clinics/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                Find a Clinic <ArrowRight className="w-3 h-3" />
              </a>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            If your legal issue falls within our scope, Justice-Bot can help you prepare, organize, 
            and navigate the process step-by-step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/triage" 
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-8 py-3 font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Your Case Assessment
            </a>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 font-semibold hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Ask a Question
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
