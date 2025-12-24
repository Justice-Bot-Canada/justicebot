import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Star, FileText, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecommendedForm {
  code: string;
  name: string;
  formId: string | null;
}

interface PathwayProps {
  pathway: {
    id: string;
    title: string;
    description: string;
    suitability: string;
    recommended?: boolean;
    timeframe: string;
    cost: string;
    successRate: number;
    pros: string[];
    cons: string[];
    recommendedForms: RecommendedForm[];
    nextSteps: string[];
  };
  caseId: string;
  caseData: any;
}

export function PathwayRecommendation({ pathway, caseId, caseData }: PathwayProps) {
  const navigate = useNavigate();

  const handleStartForm = async (form: RecommendedForm) => {
    // Navigate to form page with case context for autofill
    // If we have a formId, use it; otherwise navigate to the forms list for the venue
    if (form.formId) {
      navigate(`/form/${form.formId}`, {
        state: {
          caseId,
          caseData,
          pathway: pathway.id,
          autoFill: true
        }
      });
    } else {
      // Navigate to forms list for this pathway type
      navigate(`/forms/${pathway.id}`, {
        state: {
          caseId,
          caseData,
          recommendedForm: form.code
        }
      });
    }
  };

  const handleStartJourney = () => {
    // Navigate to the specific pathway journey
    const journeyMap: Record<string, string> = {
      'ltb': '/ltb-journey',
      'hrto': '/hrto-journey',
      'small-claims': '/small-claims-journey',
      'family': '/family-journey',
      'superior': '/superior-court-journey'
    };
    
    const pathwayId = pathway.id?.toLowerCase() || '';
    const journeyPath = journeyMap[pathwayId];
    
    console.log('PathwayRecommendation: handleStartJourney called', {
      pathwayId: pathway.id,
      normalizedId: pathwayId,
      journeyPath,
      caseId
    });
    
    if (journeyPath) {
      navigate(journeyPath, { state: { caseId } });
    } else {
      console.error('Unknown pathway:', pathway.id);
      navigate('/dashboard', { state: { caseId } });
    }
  };

  const suitabilityColor = {
    excellent: 'bg-green-100 text-green-800 border-green-200',
    good: 'bg-blue-100 text-blue-800 border-blue-200',
    fair: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    poor: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <Card className={`relative ${pathway.recommended ? 'border-primary border-2' : ''}`}>
      {pathway.recommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-4 py-1">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Recommended for Your Case
          </Badge>
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{pathway.title}</CardTitle>
            <CardDescription className="text-sm">{pathway.description}</CardDescription>
          </div>
          <Badge className={suitabilityColor[pathway.suitability as keyof typeof suitabilityColor]}>
            {pathway.suitability}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Timeline</p>
            <p className="text-sm font-medium">{pathway.timeframe}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <DollarSign className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Cost</p>
            <p className="text-sm font-medium">{pathway.cost}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <CheckCircle className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Success Rate</p>
            <p className="text-sm font-medium">{pathway.successRate}%</p>
          </div>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold mb-2 text-green-700">Pros</p>
            <ul className="space-y-1">
              {pathway.pros.map((pro, idx) => (
                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                  <CheckCircle className="w-3 h-3 mt-0.5 text-green-600 flex-shrink-0" />
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-orange-700">Cons</p>
            <ul className="space-y-1">
              {pathway.cons.map((con, idx) => (
                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                  <span className="w-3 h-3 mt-0.5 flex-shrink-0">•</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Forms */}
        <div>
          <p className="text-sm font-semibold mb-3">📋 Required Forms</p>
          <div className="space-y-2">
            {pathway.recommendedForms.map((form, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{form.code}</p>
                    <p className="text-xs text-muted-foreground">{form.name}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleStartForm(form)}
                  className="gap-1"
                >
                  Start Filling
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div>
          <p className="text-sm font-semibold mb-2">Next Steps</p>
          <ol className="space-y-1">
            {pathway.nextSteps.map((step, idx) => (
              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="font-semibold text-primary">{idx + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleStartJourney} 
          className="w-full"
          variant={pathway.recommended ? "default" : "outline"}
        >
          Start {pathway.title} Journey
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
