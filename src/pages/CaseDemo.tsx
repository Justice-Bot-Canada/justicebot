import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, AlertTriangle, Scale, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";

interface DemoCase {
  id: string;
  title: string;
  category: string;
  summary: string;
  situation: string;
  analysis: {
    pathways: { name: string; reason: string; strength: number }[];
    keyFacts: string[];
    timeline: string;
    estimatedCosts: string;
  };
  outcome: string;
  lessonsLearned: string[];
}

const demoCases: Record<string, DemoCase> = {
  "hrto-housing-reprisal": {
    id: "hrto-housing-reprisal",
    title: "Housing Discrimination with Reprisal",
    category: "HRTO + LTB",
    summary: "Tenant with disability faces harassment and eviction after requesting accommodations",
    situation: `Maria, a tenant with mobility limitations, requested a ramp installation and accessible parking spot from her landlord. Instead of accommodating, the landlord began entering her unit without notice, making comments about her disability being "too much trouble," and eventually served an N5 notice claiming she was "causing problems" by making accommodation requests.

When Maria filed a T2 at the LTB for harassment, the landlord retaliated with an N12 notice claiming he needed the unit for his son. Maria recognized this as reprisal but felt overwhelmed by the multiple legal issues.`,
    analysis: {
      pathways: [
        { name: "Human Rights Tribunal (HRTO)", reason: "Discrimination based on disability in housing; failure to accommodate; reprisal for asserting human rights", strength: 88 },
        { name: "Landlord-Tenant Board (LTB)", reason: "Illegal entry, harassment (T2), and defence against N5/N12 evictions", strength: 82 }
      ],
      keyFacts: [
        "Disability accommodation request documented",
        "Illegal entries without 24-hour notice",
        "Direct comments linking harassment to disability",
        "Suspicious timing of eviction notices after T2 filing",
        "Pattern of escalation following accommodation requests"
      ],
      timeline: "HRTO: 12-18 months | LTB: 2-4 months for hearing",
      estimatedCosts: "$53 LTB filing fee (waivable) | HRTO: Free to file"
    },
    outcome: "Maria filed at both the LTB and HRTO. At the LTB, she successfully defended against the N5 and N12, with the adjudicator noting the suspicious timing. At the HRTO, she received a monetary award for discrimination and the landlord was ordered to accommodate her disability.",
    lessonsLearned: [
      "Document everything - especially dates and exact words used",
      "File at multiple tribunals when issues overlap",
      "Reprisal claims strengthen your case significantly",
      "Don't let landlord intimidation stop you from asserting rights",
      "Keep copies of all notices and communications"
    ]
  },
  "ltb-repairs-harassment": {
    id: "ltb-repairs-harassment",
    title: "Repair Requests Leading to Harassment",
    category: "LTB",
    summary: "Tenant faces retaliation after requesting essential repairs",
    situation: `James noticed mold in his bathroom and a broken heater in January. He submitted written repair requests to his landlord, who ignored them. When James called the city inspector, his landlord became hostile - texting him angry messages, showing up unannounced, and serving an N5 notice claiming James was being "difficult."`,
    analysis: {
      pathways: [
        { name: "Landlord-Tenant Board (LTB) - T6", reason: "Landlord failed to maintain rental unit in good repair", strength: 90 },
        { name: "Landlord-Tenant Board (LTB) - T2", reason: "Harassment and illegal entry by landlord", strength: 78 }
      ],
      keyFacts: [
        "Written repair requests documented",
        "City inspector involvement strengthens case",
        "Text message evidence of hostility",
        "Unannounced entries are illegal",
        "N5 appears retaliatory - suspicious timing"
      ],
      timeline: "LTB: 2-4 months for combined hearing",
      estimatedCosts: "$53 LTB filing fee (waivable)"
    },
    outcome: "James combined his T2 and T6 applications. The LTB ordered repairs within 30 days, awarded James a rent abatement for living in substandard conditions, and dismissed the N5 as retaliatory.",
    lessonsLearned: [
      "Always make repair requests in writing",
      "City inspectors add credibility to your case",
      "Combine related applications for efficiency",
      "Keep all texts and communications",
      "Retaliation for asserting rights is itself a violation"
    ]
  },
  "small-claims-contractor": {
    id: "small-claims-contractor",
    title: "Contractor Didn't Complete Work",
    category: "Small Claims",
    summary: "Homeowner paid for renovations that were never finished",
    situation: `Sandra hired a contractor for a $15,000 kitchen renovation. She paid $10,000 upfront as requested. After demolition, the contractor stopped showing up, wouldn't return calls, and left her kitchen unusable. She had to hire another contractor to finish the work.`,
    analysis: {
      pathways: [
        { name: "Small Claims Court", reason: "Breach of contract; recovery of funds for incomplete work", strength: 85 }
      ],
      keyFacts: [
        "Written contract exists",
        "Payment records documented",
        "Photos of incomplete work",
        "Communication attempts documented",
        "Cost to complete by second contractor"
      ],
      timeline: "6-12 months to trial",
      estimatedCosts: "$102-$145 filing fee (recoverable if successful)"
    },
    outcome: "Sandra won her Small Claims case, receiving $8,500 in damages - the difference between what she paid and the value of work completed, plus the premium paid to the second contractor.",
    lessonsLearned: [
      "Always get written contracts",
      "Don't pay large amounts upfront",
      "Document progress with photos",
      "Keep all receipts and payment records",
      "Get quotes from other contractors to prove damages"
    ]
  }
};

const CaseDemo = () => {
  const { demoId } = useParams<{ demoId: string }>();
  const navigate = useNavigate();
  
  const demoCase = demoId ? demoCases[demoId] : null;
  
  // If no specific demo, show demo selection
  if (!demoCase) {
    return (
      <div className="min-h-screen bg-background">
        <EnhancedSEO
          title="Real Case Examples | See Justice-Bot in Action | Justice-Bot"
          description="See how Justice-Bot analyzes real legal situations. Walk through actual case examples to understand how our AI identifies pathways and builds cases."
          keywords="legal case examples, tribunal case study, LTB example, HRTO case study, legal demo"
          canonicalUrl="https://www.justice-bot.com/case-demo"
        />
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              See Real Case Examples
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Walk through actual scenarios to see how Justice-Bot analyzes cases and identifies legal pathways.
            </p>
          </div>

          <div className="grid gap-6">
            {Object.values(demoCases).map((demo) => (
              <Card 
                key={demo.id}
                className="p-6 cursor-pointer hover:shadow-lg hover:border-primary transition-all"
                onClick={() => navigate(`/case-demo/${demo.id}`)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Scale className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{demo.title}</h3>
                      <span className="text-xs bg-muted px-2 py-1 rounded">{demo.category}</span>
                    </div>
                    <p className="text-muted-foreground">{demo.summary}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">Ready to analyze your own situation?</p>
            <Button size="lg" onClick={() => navigate("/triage")}>
              Start Your Case Assessment
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title={`${demoCase.title} | Case Example | Justice-Bot`}
        description={demoCase.summary}
        keywords="legal case example, tribunal case study, how to file, legal pathway example"
        canonicalUrl={`https://www.justice-bot.com/case-demo/${demoId}`}
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate("/case-demo")}
          >
            ← Back to examples
          </Button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              {demoCase.category}
            </span>
            <span className="text-xs bg-muted px-2 py-1 rounded">Demo Case</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{demoCase.title}</h1>
          <p className="text-lg text-muted-foreground">{demoCase.summary}</p>
        </div>

        {/* Situation */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            The Situation
          </h2>
          <p className="text-muted-foreground whitespace-pre-line">{demoCase.situation}</p>
        </Card>

        {/* Analysis */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            Justice-Bot Analysis
          </h2>

          <div className="space-y-6">
            {/* Pathways */}
            <div>
              <h3 className="font-semibold mb-3">Identified Legal Pathways:</h3>
              <div className="space-y-3">
                {demoCase.analysis.pathways.map((pathway, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{pathway.name}</h4>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        {pathway.strength}% match
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{pathway.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Facts */}
            <div>
              <h3 className="font-semibold mb-3">Key Facts Identified:</h3>
              <ul className="space-y-2">
                {demoCase.analysis.keyFacts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline & Costs */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold text-sm">Expected Timeline</h4>
                </div>
                <p className="text-sm">{demoCase.analysis.timeline}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold text-sm">Estimated Costs</h4>
                </div>
                <p className="text-sm">{demoCase.analysis.estimatedCosts}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Outcome */}
        <Card className="p-6 mb-6 border-green-200 bg-green-50/50">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            The Outcome
          </h2>
          <p className="text-muted-foreground">{demoCase.outcome}</p>
        </Card>

        {/* Lessons Learned */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Lessons Learned
          </h2>
          <ul className="space-y-2">
            {demoCase.lessonsLearned.map((lesson, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-primary font-bold">{i + 1}.</span>
                {lesson}
              </li>
            ))}
          </ul>
        </Card>

        {/* CTA */}
        <div className="text-center mt-8">
          <h3 className="text-xl font-semibold mb-4">Ready to analyze your situation?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/triage")}>
              Start Your Case Assessment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/case-demo")}>
              View More Examples
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CaseDemo;
