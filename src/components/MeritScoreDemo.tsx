import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, AlertTriangle, CheckCircle, Info } from "lucide-react";

// DEMO DATA ONLY - Never use real user data on homepage
const DEMO_CASES = [
  {
    title: "Sample Tenant Rights Issue",
    score: 78,
    venue: "LTB",
    status: "Strong Case",
    factors: [
      { type: "positive", text: "Clear legal duty documented" },
      { type: "positive", text: "Written notices provided" },
      { type: "positive", text: "Evidence properly collected" },
      { type: "neutral", text: "Reasonable timeline followed" }
    ],
    recommendation: "Example recommendation for demonstration purposes only."
  },
  {
    title: "Sample Employment Dispute",
    score: 55,
    venue: "HRTO",
    status: "Moderate Case",
    factors: [
      { type: "positive", text: "Documentation exists" },
      { type: "negative", text: "Some gaps in evidence" },
      { type: "positive", text: "Proper procedures followed" },
      { type: "negative", text: "Timeline considerations" }
    ],
    recommendation: "Example assessment for demonstration purposes only."
  },
  {
    title: "Sample Contract Dispute",
    score: 42,
    venue: "Small Claims",
    status: "Weak Case",
    factors: [
      { type: "negative", text: "Limited documentation" },
      { type: "positive", text: "Some evidence available" },
      { type: "negative", text: "Disputed terms" },
      { type: "negative", text: "Unclear agreements" }
    ],
    recommendation: "Example guidance for demonstration purposes only."
  }
];

const getScoreColor = (score: number) => {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-destructive";
};

const getStatusColor = (status: string) => {
  if (status === "Strong Case") return "bg-success/10 text-success border-success/20";
  if (status === "Moderate Case") return "bg-warning/10 text-warning border-warning/20";
  return "bg-destructive/10 text-destructive border-destructive/20";
};

const MeritScoreDemo = () => {
  return (
    <section id="merit" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Merit Score: Know Your Chances
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get an honest assessment of your case based on facts, law, and precedent. 
            No false hope, just reality-based guidance.
          </p>
          <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground text-sm mt-6 max-w-2xl mx-auto">
            "Any person charged with an offence has the right to be presumed innocent until proven guilty according to law in a fair and public hearing." — Charter Section 11(d)
          </blockquote>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {DEMO_CASES.map((caseItem, index) => (
            <Card key={index} className="h-full">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{caseItem.venue}</Badge>
                  <Badge className={getStatusColor(caseItem.status)}>
                    {caseItem.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{caseItem.title}</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Merit Score</span>
                    <span className={`text-2xl font-bold ${getScoreColor(caseItem.score)}`}>
                      {caseItem.score}/100
                    </span>
                  </div>
                  <Progress value={caseItem.score} className="h-2" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-foreground">Key Factors:</h4>
                  <div className="space-y-1">
                    {caseItem.factors.map((factor, factorIndex) => (
                      <div key={factorIndex} className="flex items-start gap-2">
                        {factor.type === "positive" && (
                          <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        )}
                        {factor.type === "negative" && (
                          <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                        )}
                        {factor.type === "neutral" && (
                          <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        )}
                        <span className="text-sm text-foreground">{factor.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm text-foreground mb-2">Recommendation:</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {caseItem.recommendation}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-card rounded-xl p-8 shadow-lg">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <TrendingUp className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-2xl font-bold text-foreground">
              Reality-Based Assessment
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Our merit scoring considers legal precedent, evidence quality, procedural requirements, 
              and success rates for similar cases. We'll never oversell your chances.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeritScoreDemo;