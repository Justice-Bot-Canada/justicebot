import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Scale, TrendingUp, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MeritScoreCalculator = () => {
  const [province, setProvince] = useState("");
  const [venue, setVenue] = useState("");
  const [issue, setIssue] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const calculateMerit = async () => {
    if (!province || !venue || !issue) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to calculate your case merit score.",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);

    try {
      const response = await fetch("https://api.justice-bot.com/merit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ province, venue, issue })
      });

      const data = await response.json();
      setScore(data.score * 100); // Convert to percentage

      toast({
        title: "Merit Score Calculated",
        description: `Your case has a ${(data.score * 100).toFixed(0)}% merit score.`
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Unable to calculate merit score. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return "Strong Case";
    if (score >= 40) return "Moderate Case";
    return "Weak Case";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-primary/20 shadow-lg">
      <CardHeader className="space-y-1 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Case Merit Calculator</CardTitle>
        </div>
        <CardDescription>
          Get an instant assessment of your legal case strength using AI analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="province">Province</Label>
            <Select value={province} onValueChange={setProvince}>
              <SelectTrigger id="province">
                <SelectValue placeholder="Select your province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ON">Ontario</SelectItem>
                <SelectItem value="BC">British Columbia</SelectItem>
                <SelectItem value="AB">Alberta</SelectItem>
                <SelectItem value="QC">Quebec</SelectItem>
                <SelectItem value="MB">Manitoba</SelectItem>
                <SelectItem value="SK">Saskatchewan</SelectItem>
                <SelectItem value="NS">Nova Scotia</SelectItem>
                <SelectItem value="NB">New Brunswick</SelectItem>
                <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                <SelectItem value="PE">Prince Edward Island</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Legal Venue</Label>
            <Select value={venue} onValueChange={setVenue}>
              <SelectTrigger id="venue">
                <SelectValue placeholder="Select venue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LTB">Landlord Tenant Board</SelectItem>
                <SelectItem value="SMALL_CLAIMS">Small Claims Court</SelectItem>
                <SelectItem value="HRTO">Human Rights Tribunal</SelectItem>
                <SelectItem value="FAMILY">Family Court</SelectItem>
                <SelectItem value="SUPERIOR">Superior Court</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue">Describe Your Legal Issue</Label>
            <Textarea
              id="issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Briefly describe your legal situation (e.g., 'landlord refusing to make repairs', 'unpaid wages', 'custody dispute')..."
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <Button 
          onClick={calculateMerit} 
          disabled={isCalculating}
          className="w-full"
          size="lg"
        >
          {isCalculating ? (
            <>Calculating...</>
          ) : (
            <>
              <TrendingUp className="mr-2 h-5 w-5" />
              Calculate Merit Score
            </>
          )}
        </Button>

        {score !== null && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Merit Score:</span>
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                {score.toFixed(0)}%
              </span>
            </div>
            
            <Progress value={score} className="h-3" />
            
            <div className={`flex items-start gap-2 p-4 rounded-lg ${
              score >= 70 ? "bg-green-50" : score >= 40 ? "bg-yellow-50" : "bg-red-50"
            }`}>
              <AlertCircle className={`h-5 w-5 mt-0.5 ${getScoreColor(score)}`} />
              <div className="space-y-1">
                <p className={`font-semibold ${getScoreColor(score)}`}>
                  {getScoreLabel(score)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {score >= 70 && "Your case shows strong merit. Consider proceeding with legal action."}
                  {score >= 40 && score < 70 && "Your case has moderate merit. Gather more evidence to strengthen your position."}
                  {score < 40 && "Your case may face challenges. Consider alternative dispute resolution or legal consultation."}
                </p>
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-center pt-2">
              This is an AI-generated estimate for informational purposes only. Not legal advice.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MeritScoreCalculator;
