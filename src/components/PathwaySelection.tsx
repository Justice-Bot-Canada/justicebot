import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Scale, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Clock,
  DollarSign
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Pathway {
  id: string;
  title: string;
  description: string;
  suitability: "excellent" | "good" | "fair" | "poor";
  timeframe: string;
  cost: string;
  successRate: number;
  pros: string[];
  cons: string[];
  recommendedForms: string[];
  nextSteps: string[];
}

interface PathwaySelectionProps {
  caseId: string;
  meritScore: number;
  province: string;
  pathways: Pathway[];
}

export default function PathwaySelection({ 
  caseId, 
  meritScore, 
  province, 
  pathways 
}: PathwaySelectionProps) {
  const navigate = useNavigate();

  const getSuitabilityColor = (suitability: Pathway["suitability"]) => {
    switch (suitability) {
      case "excellent": return "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200";
      case "good": return "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200";
      case "fair": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200";
      case "poor": return "text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200";
    }
  };

  const getSuitabilityIcon = (suitability: Pathway["suitability"]) => {
    switch (suitability) {
      case "excellent": return <CheckCircle className="w-5 h-5" />;
      case "good": return <TrendingUp className="w-5 h-5" />;
      case "fair": return <AlertTriangle className="w-5 h-5" />;
      case "poor": return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const handleSelectPathway = (pathway: Pathway) => {
    // Navigate to form selector with pathway context
    navigate(`/forms/${pathway.id}`, {
      state: {
        caseId,
        pathwayTitle: pathway.title,
        recommendedForms: pathway.recommendedForms
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Merit Score Summary */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            Your Case Merit Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">{meritScore}</div>
              <div className="text-sm text-muted-foreground">out of 100</div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                Based on our analysis, your case has {meritScore >= 70 ? "strong" : meritScore >= 50 ? "moderate" : "limited"} merit. 
                Below are the recommended legal pathways ranked by suitability for your situation.
              </p>
              <Badge variant={meritScore >= 70 ? "default" : "secondary"}>
                {meritScore >= 70 ? "Strong Case" : meritScore >= 50 ? "Moderate Case" : "Challenging Case"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pathway Options */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Recommended Legal Pathways</h3>
        <p className="text-sm text-muted-foreground">
          Choose the best path forward for your case. Each option includes estimated timeframes, costs, and success likelihood.
        </p>

        {pathways.map((pathway, index) => (
          <Card 
            key={pathway.id}
            className={`${index === 0 ? 'border-2 border-primary/40 shadow-lg' : ''}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle>{pathway.title}</CardTitle>
                    {index === 0 && (
                      <Badge variant="default">Recommended</Badge>
                    )}
                  </div>
                  <CardDescription>{pathway.description}</CardDescription>
                </div>
                <div className={`px-3 py-2 rounded-lg border flex items-center gap-2 ${getSuitabilityColor(pathway.suitability)}`}>
                  {getSuitabilityIcon(pathway.suitability)}
                  <span className="font-semibold capitalize">{pathway.suitability}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-sm font-medium">{pathway.timeframe}</div>
                  <div className="text-xs text-muted-foreground">Timeline</div>
                </div>
                <div className="text-center">
                  <DollarSign className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-sm font-medium">{pathway.cost}</div>
                  <div className="text-xs text-muted-foreground">Estimated Cost</div>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-sm font-medium">{pathway.successRate}%</div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
              </div>

              {/* Pros and Cons */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-green-600 dark:text-green-400">Advantages</h4>
                  <ul className="space-y-1">
                    {pathway.pros.map((pro, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-orange-600 dark:text-orange-400">Considerations</h4>
                  <ul className="space-y-1">
                    {pathway.cons.map((con, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <AlertTriangle className="w-3 h-3 mt-0.5 text-orange-600 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Next Steps */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Next Steps</h4>
                <ol className="space-y-1 list-decimal list-inside text-sm text-muted-foreground">
                  {pathway.nextSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* Recommended Forms */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Required Forms ({province})</h4>
                <div className="flex flex-wrap gap-2">
                  {pathway.recommendedForms.map((form, i) => (
                    <Badge key={i} variant="outline">
                      <FileText className="w-3 h-3 mr-1" />
                      {form}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => handleSelectPathway(pathway)}
                className="w-full"
                variant={index === 0 ? "default" : "outline"}
              >
                Select This Pathway
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Need Help Section */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h4 className="font-semibold">Not sure which path to choose?</h4>
            <p className="text-sm text-muted-foreground">
              Consider scheduling a consultation with a legal professional for personalized advice.
            </p>
            <Button variant="outline" size="sm">
              Find Legal Help
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}