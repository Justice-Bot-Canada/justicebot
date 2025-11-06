import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ArticleSchema } from "@/components/ArticleSchema";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  X, 
  CheckCircle, 
  FileText, 
  MessageSquare,
  Calendar,
  Shield,
  Scale,
  Clock,
  Users
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function FamilyCourtMistakes() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Resources", href: "/legal-resources" },
    { label: "Family Court Mistakes" }
  ];

  const mistakes = [
    {
      number: 1,
      icon: FileText,
      title: "Filing Incomplete or Incorrect Documents",
      problem: "Missing information, wrong forms, or unsigned documents delay your case by weeks or months",
      consequence: "Court rejects your filing, hearing dates get postponed, other party gains advantage",
      solution: "Use court-approved checklists, review every field, get documents reviewed before filing",
      avoidance: [
        "Download the correct form version from official court website",
        "Complete ALL mandatory fields (marked with *)",
        "Attach required supporting documents",
        "Sign and date where indicated",
        "Make copies for yourself and other parties"
      ]
    },
    {
      number: 2,
      icon: Clock,
      title: "Missing Critical Deadlines",
      problem: "Family law has strict timelines - missing them can end your case or limit available remedies",
      consequence: "Lose right to respond, default judgment entered against you, case dismissed",
      solution: "Create deadline tracking system immediately upon receiving any court document",
      avoidance: [
        "Answer to Application: 30 days from service",
        "Financial Statement: Within timeline set by court (usually 30 days)",
        "Motion materials: Served at least 4 days before motion date",
        "Appeal deadline: 30 days from order/judgment",
        "Set reminders 7 days before each deadline"
      ]
    },
    {
      number: 3,
      icon: Shield,
      title: "Not Protecting Children's Best Interests",
      problem: "Courts prioritize children's wellbeing above all else - failing to demonstrate this focus hurts your case",
      consequence: "Lose custody/access rights, reduced parenting time, mandatory supervision orders",
      solution: "Every decision and argument must center on child's needs, stability, and safety",
      avoidance: [
        "Never badmouth other parent in front of children or in documents",
        "Maintain consistent routines and schedules",
        "Document your involvement in child's life (school, activities, medical)",
        "Show willingness to co-parent and communicate",
        "Prioritize child's existing relationships and community ties"
      ]
    },
    {
      number: 4,
      icon: MessageSquare,
      title: "Poor Communication with Other Party",
      problem: "Hostile, aggressive, or no communication creates negative impression and wastes court resources",
      consequence: "Judge views you as uncooperative, increased legal costs, orders against you",
      solution: "Keep ALL communication respectful, in writing, and focused on children/issues",
      avoidance: [
        "Use email or parenting apps (OurFamilyWizard, TalkingParents)",
        "Never text or call in anger - wait 24 hours",
        "Keep messages brief, factual, and child-focused",
        "Save all communications as evidence",
        "Consider using lawyer or mediator for difficult conversations"
      ]
    },
    {
      number: 5,
      icon: FileText,
      title: "Failing to Disclose Financial Information",
      problem: "Family law requires FULL financial disclosure - hiding assets or income is serious",
      consequence: "Contempt of court charges, costs against you, case reopened later, criminal charges",
      solution: "Provide complete, accurate, and timely financial disclosure with supporting documents",
      avoidance: [
        "Complete Form 13.1 (Financial Statement) accurately",
        "Include: T4s, NOAs, pay stubs, bank statements (3 months)",
        "List ALL assets, debts, income sources",
        "Update if circumstances change significantly",
        "Keep copies of everything you disclose"
      ]
    },
    {
      number: 6,
      icon: Scale,
      title: "Not Following Existing Court Orders",
      problem: "Violating court orders is contempt of court - judges take this extremely seriously",
      consequence: "Fines up to $5,000, jail time, losing credibility with court, varied orders",
      solution: "Follow every order exactly as written, even if you disagree - seek variation if needed",
      avoidance: [
        "Read orders carefully and note all requirements",
        "If order is unclear, ask lawyer or court clerk for clarification",
        "Document compliance (payment receipts, exchange logs)",
        "Never self-help or decide order doesn't apply",
        "Bring variation motion if order is unworkable"
      ]
    },
    {
      number: 7,
      icon: AlertTriangle,
      title: "Bringing Children to Court or Involving Them",
      problem: "Children should never be exposed to parental conflict or court proceedings",
      consequence: "Judge questions your judgment, negative impact on custody decision, traumatized children",
      solution: "Arrange childcare, never discuss case with children, shield them from conflict",
      avoidance: [
        "Never bring children to courthouse unless subpoenaed",
        "Don't ask children to take sides or relay messages",
        "Never discuss case details, hearings, or other parent with them",
        "Don't let children see court documents",
        "Maintain normal routines and reassure children"
      ]
    },
    {
      number: 8,
      icon: Users,
      title: "Not Attempting Alternative Dispute Resolution",
      problem: "Courts strongly prefer mediation/arbitration before litigation - refusing looks bad",
      consequence: "Costs orders against you, delayed resolution, judge's disapproval, wasted money",
      solution: "Participate in mediation in good faith, document reasonable settlement offers",
      avoidance: [
        "Attend mandatory information sessions (MIP)",
        "Try mediation before bringing motions",
        "Consider collaborative family law",
        "Make reasonable settlement proposals in writing",
        "Document other party's refusal to mediate (if applicable)"
      ]
    },
    {
      number: 9,
      icon: FileText,
      title: "Over-Using Motions and Court Resources",
      problem: "Filing unnecessary motions wastes court time and money - judges notice and penalize this",
      consequence: "Costs awards against you, judge loses patience, future motions viewed skeptically",
      solution: "Only bring necessary motions, try to resolve issues through communication first",
      avoidance: [
        "Ask: Is this motion absolutely necessary?",
        "Try direct communication or lawyer letters first",
        "Bundle multiple issues into one motion when possible",
        "Follow proper motion procedures (forms, timelines, service)",
        "Be prepared and brief at motion hearings"
      ]
    },
    {
      number: 10,
      icon: Calendar,
      title: "Not Preparing Properly for Court",
      problem: "Showing up unprepared shows disrespect to court and undermines your credibility",
      consequence: "Adjournments (with costs against you), missed opportunities, poor outcomes",
      solution: "Prepare thoroughly: organize evidence, practice testimony, know your case",
      avoidance: [
        "Review all documents and orders before hearing",
        "Prepare exhibit book with tabs",
        "Practice what you'll say (briefly, clearly)",
        "Arrive 30 minutes early",
        "Dress appropriately (business attire)",
        "Bring extra copies of all documents",
        "Know the facts, dates, and amounts in your case"
      ]
    }
  ];

  const childProtectionMistakes = [
    {
      title: "Not Taking CAS Involvement Seriously",
      risk: "CRITICAL",
      description: "Treating CAS visits or concerns casually can result in children being removed from your care",
      solutions: [
        "Attend all meetings and visits",
        "Follow service plans exactly",
        "Complete required programs/assessments",
        "Maintain clean, safe home environment",
        "Get legal representation immediately"
      ]
    },
    {
      title: "Failing to Address Underlying Issues",
      risk: "HIGH",
      description: "Not addressing substance abuse, mental health, domestic violence, or housing issues",
      solutions: [
        "Enroll in counseling/treatment programs",
        "Attend regularly and get completion certificates",
        "Document your progress",
        "Show understanding of risks to children",
        "Demonstrate sustainable changes"
      ]
    },
    {
      title: "Poor Communication with CAS Workers",
      risk: "HIGH",
      description: "Being hostile, uncooperative, or dishonest with child protection workers",
      solutions: [
        "Return calls and emails promptly",
        "Be honest about challenges",
        "Ask questions if you don't understand",
        "Keep calm even when frustrated",
        "Put agreements in writing"
      ]
    },
    {
      title: "Not Understanding Your Rights",
      risk: "MEDIUM",
      description: "Agreeing to things you shouldn't or not knowing you can challenge findings",
      solutions: [
        "Get lawyer immediately (duty counsel or legal aid)",
        "Know your right to challenge findings",
        "Understand service plan requirements",
        "Ask for reasonable modifications",
        "Document everything"
      ]
    }
  ];

  return (
    <>
      <SEOHead
        title="10 Critical Mistakes in Family Court & Child Protection Cases in Ontario"
        description="Avoid these common mistakes in family court and CAS cases. Learn what NOT to do in custody, access, support, and child protection proceedings in Ontario."
        keywords="family court mistakes, child protection errors, custody mistakes, CAS involvement, family law Ontario, child welfare, parenting mistakes court"
        canonicalUrl="https://justice-bot.com/family-court-mistakes"
      />
      <ArticleSchema
        headline="10 Critical Mistakes to Avoid in Family Court and Child Protection Cases"
        description="Comprehensive guide to common mistakes in Ontario family court and child protection proceedings, with solutions to avoid them."
        image="https://justice-bot.com/justice-bot-logo.jpeg"
        datePublished="2025-01-15T00:00:00Z"
        dateModified={new Date().toISOString()}
        url="https://justice-bot.com/family-court-mistakes"
      />

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-12 max-w-5xl">
          <Breadcrumbs items={breadcrumbs} />

          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-12 w-12 text-destructive" />
              <h1 className="text-4xl md:text-5xl font-bold">
                10 Critical Mistakes in Family Court
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground mb-6">
              Family court and child protection cases have high stakes. These mistakes can cost you custody, 
              access to your children, or thousands in legal fees. Learn what to avoid and how to succeed.
            </p>

            <Alert className="mb-6 border-destructive/50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Disclaimer:</strong> This is general information only, not legal advice. Family law is 
                complex and every case is unique. For advice on your specific situation, consult a family lawyer. 
                Contact: <a href="mailto:admin@justice-bot.com" className="text-primary hover:underline">admin@justice-bot.com</a>
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card className="border-l-4 border-l-destructive">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-destructive mb-2">10</div>
                  <div className="text-sm text-muted-foreground">Common Mistakes</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-warning">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-warning mb-2">4</div>
                  <div className="text-sm text-muted-foreground">CAS Errors</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-success">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-success mb-2">50+</div>
                  <div className="text-sm text-muted-foreground">Prevention Tips</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Family Court Mistakes */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Family Court Mistakes to Avoid</h2>

            <div className="space-y-8">
              {mistakes.map((mistake) => {
                const Icon = mistake.icon;
                return (
                  <Card key={mistake.number} className="overflow-hidden">
                    <div className="bg-destructive/10 border-b px-6 py-4">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive text-destructive-foreground font-bold text-xl flex-shrink-0">
                          {mistake.number}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className="h-6 w-6 text-destructive" />
                            <h3 className="text-xl font-bold">{mistake.title}</h3>
                          </div>
                          <p className="text-muted-foreground">{mistake.problem}</p>
                        </div>
                      </div>
                    </div>

                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start gap-3 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                        <X className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold mb-1">Consequences:</div>
                          <p className="text-sm text-muted-foreground">{mistake.consequence}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-success/5 rounded-lg border border-success/20">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold mb-1">Solution:</div>
                          <p className="text-sm text-muted-foreground">{mistake.solution}</p>
                        </div>
                      </div>

                      <div>
                        <div className="font-semibold mb-3">How to Avoid:</div>
                        <ul className="space-y-2">
                          {mistake.avoidance.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Child Protection Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Child Protection (CAS) Mistakes</h2>
            
            <Alert className="mb-6 border-warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Critical:</strong> Child protection cases move FAST. Children can be removed within 
                days. If CAS is involved, get a lawyer immediately. Legal Aid may cover costs.
              </AlertDescription>
            </Alert>

            <div className="grid gap-6">
              {childProtectionMistakes.map((mistake, idx) => (
                <Card key={idx} className={`border-l-4 ${
                  mistake.risk === 'CRITICAL' ? 'border-l-destructive' :
                  mistake.risk === 'HIGH' ? 'border-l-warning' :
                  'border-l-primary'
                }`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="text-lg font-bold flex-1">{mistake.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        mistake.risk === 'CRITICAL' ? 'bg-destructive/20 text-destructive' :
                        mistake.risk === 'HIGH' ? 'bg-warning/20 text-warning' :
                        'bg-primary/20 text-primary'
                      }`}>
                        {mistake.risk} RISK
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{mistake.description}</p>
                    
                    <div>
                      <div className="font-semibold mb-2">Solutions:</div>
                      <ul className="space-y-2">
                        {mistake.solutions.map((solution, sidx) => (
                          <li key={sidx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            <span>{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Quick Tips */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Quick Reference: Do's and Don'ts</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-success">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4 text-success flex items-center gap-2">
                    <CheckCircle className="h-6 w-6" />
                    DO These Things
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Keep all communication in writing</li>
                    <li>✓ Document everything with dates/times</li>
                    <li>✓ Follow court orders exactly</li>
                    <li>✓ Put children's needs first always</li>
                    <li>✓ Be respectful in all communications</li>
                    <li>✓ Attend all court dates prepared</li>
                    <li>✓ Provide full financial disclosure</li>
                    <li>✓ Try mediation before motions</li>
                    <li>✓ Get legal advice early</li>
                    <li>✓ Stay calm and professional</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4 text-destructive flex items-center gap-2">
                    <X className="h-6 w-6" />
                    DON'T Do These Things
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>✗ Badmouth other parent to/around children</li>
                    <li>✗ Use children as messengers</li>
                    <li>✗ Violate court orders</li>
                    <li>✗ Hide assets or income</li>
                    <li>✗ Miss deadlines</li>
                    <li>✗ Bring children to court</li>
                    <li>✗ Text/call other party in anger</li>
                    <li>✗ Refuse to communicate reasonably</li>
                    <li>✗ File unnecessary motions</li>
                    <li>✗ Show up to court unprepared</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 text-center space-y-4">
              <h3 className="text-2xl font-bold">Get Help With Your Family Court Case</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Justice-Bot can help you prepare forms, organize evidence, track deadlines, and 
                understand court procedures for family law matters.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button size="lg" asChild>
                  <a href="/family-journey">Start Family Law Journey</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/legal-chat">Ask Legal Questions</a>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Questions? Email <a href="mailto:admin@justice-bot.com" className="text-primary hover:underline">admin@justice-bot.com</a>
              </p>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    </>
  );
}