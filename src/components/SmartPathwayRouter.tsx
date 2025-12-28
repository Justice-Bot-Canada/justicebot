import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, Scale, Clock, DollarSign, CheckCircle, AlertTriangle, FileText, Sparkles } from "lucide-react";
import { usePathwayRouter, PathwayResult, tribunalNames, pathwayUrls } from "@/hooks/usePathwayRouter";
import { cn } from "@/lib/utils";

const categories = [
  { value: "housing", label: "Housing & Tenancy" },
  { value: "discrimination", label: "Discrimination & Human Rights" },
  { value: "employment", label: "Employment & Workplace" },
  { value: "money", label: "Money & Contracts" },
  { value: "family", label: "Family & Children" },
  { value: "criminal", label: "Criminal & Police" },
];

const provinces = [
  { value: "ON", label: "Ontario" },
  { value: "BC", label: "British Columbia" },
  { value: "AB", label: "Alberta" },
  { value: "QC", label: "Quebec" },
  { value: "MB", label: "Manitoba" },
  { value: "SK", label: "Saskatchewan" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "NT", label: "Northwest Territories" },
  { value: "YT", label: "Yukon" },
  { value: "NU", label: "Nunavut" },
];

interface SmartPathwayRouterProps {
  onRouted?: (result: PathwayResult) => void;
  caseId?: string;
  initialDescription?: string;
}

export function SmartPathwayRouter({ onRouted, caseId, initialDescription = "" }: SmartPathwayRouterProps) {
  const navigate = useNavigate();
  const { routeCase, result, isLoading, reset } = usePathwayRouter({ onSuccess: onRouted });

  const [description, setDescription] = useState(initialDescription);
  const [category, setCategory] = useState<string>("");
  const [province, setProvince] = useState("ON");
  const [amount, setAmount] = useState<string>("");

  const handleSubmit = async () => {
    if (description.trim().length < 20) return;

    await routeCase({
      description,
      category: category || undefined,
      province,
      amount: amount ? parseInt(amount, 10) : undefined,
      caseId,
    });
  };

  const handleStartJourney = (pathwayId: string) => {
    const url = pathwayUrls[pathwayId] || "/find-my-path";
    navigate(url, { state: { caseId, routingResult: result } });
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 70) return "text-green-600 bg-green-100 border-green-200";
    if (score >= 50) return "text-amber-600 bg-amber-100 border-amber-200";
    return "text-red-600 bg-red-100 border-red-200";
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 70) return "High Confidence";
    if (score >= 50) return "Medium Confidence";
    return "Low Confidence";
  };

  if (result) {
    return (
      <div className="space-y-6">
        {/* Main Recommendation */}
        <Card className="border-2 border-primary">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Recommended Path
                </CardTitle>
                <CardDescription className="mt-1">Based on your situation</CardDescription>
              </div>
              <Badge className={cn("border", getConfidenceColor(result.confidence_score))}>
                {getConfidenceLabel(result.confidence_score)} ({result.confidence_score}%)
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tribunal Info */}
            <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
              <Scale className="w-10 h-10 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">
                  {tribunalNames[result.recommended_tribunal] || result.recommended_tribunal}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {result.recommended_pathway.replace("-journey", "").replace(/-/g, " ").toUpperCase()}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {result.timeframe && (
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Timeline</p>
                  <p className="text-sm font-medium">{result.timeframe}</p>
                </div>
              )}
              {result.filing_fee && (
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <DollarSign className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Filing Fee</p>
                  <p className="text-sm font-medium">{result.filing_fee}</p>
                </div>
              )}
              {result.success_rate && (
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                  <p className="text-sm font-medium">{result.success_rate}%</p>
                </div>
              )}
            </div>

            {/* Reasoning */}
            <div>
              <h4 className="font-medium mb-2">Why this pathway?</h4>
              <ul className="space-y-1">
                {result.reasoning.map((reason, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Forms */}
            {result.recommended_forms.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Forms You'll Need
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.recommended_forms.map((form, idx) => (
                    <Badge key={idx} variant="secondary">
                      {form}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={() => handleStartJourney(result.recommended_pathway)} className="flex-1">
                Start This Journey
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={reset}>
                Try Different Description
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Pathways */}
        {result.alternative_pathways.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alternative Options</CardTitle>
              <CardDescription>Other pathways that may apply to your situation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.alternative_pathways.map((alt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{tribunalNames[alt.tribunal] || alt.tribunal}</h4>
                      <Badge variant="outline" className="text-xs">
                        {alt.confidence}% match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alt.reasoning}</p>
                    {alt.forms.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {alt.forms.map((form, fIdx) => (
                          <Badge key={fIdx} variant="secondary" className="text-xs">
                            {form}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleStartJourney(alt.pathway)}>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Matched Rules Debug (collapsed by default) */}
        <details className="text-sm text-muted-foreground">
          <summary className="cursor-pointer hover:text-foreground">View matching details</summary>
          <div className="mt-2 p-4 bg-muted/30 rounded-lg space-y-2">
            {result.matched_rules.map((rule, idx) => (
              <div key={idx} className="text-xs">
                <span className="font-medium">{rule.rule_name}</span>
                <span className="text-muted-foreground"> (score: {rule.score})</span>
              </div>
            ))}
          </div>
        </details>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="w-5 h-5" />
          Smart Pathway Finder
        </CardTitle>
        <CardDescription>
          Describe your situation and we'll recommend the best legal pathway
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Describe your situation</Label>
          <Textarea
            id="description"
            placeholder="Example: My landlord hasn't fixed the broken heater for 3 months despite multiple requests. The apartment is cold and I want to get this repaired or reduce my rent..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            {description.length < 20
              ? `Add at least ${20 - description.length} more characters`
              : "The more detail you provide, the better our recommendation"}
          </p>
        </div>

        {/* Category (optional) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category (optional)</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="province">Province</Label>
            <Select value={province} onValueChange={setProvince}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((prov) => (
                  <SelectItem key={prov.value} value={prov.value}>
                    {prov.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Amount (for money disputes) */}
        {(category === "money" || description.toLowerCase().includes("owe") || description.toLowerCase().includes("money")) && (
          <div className="space-y-2">
            <Label htmlFor="amount">Amount in dispute (optional)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="35000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-9"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Helps determine Small Claims (under $35,000) vs Superior Court
            </p>
          </div>
        )}

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={isLoading || description.trim().length < 20}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing your situation...
            </>
          ) : (
            <>
              Find My Legal Path
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-400">
            This tool provides general guidance based on common patterns. It is not legal advice. 
            Complex cases may require professional consultation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
