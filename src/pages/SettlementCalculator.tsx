import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PremiumGate } from '@/components/PremiumGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Calculator, TrendingUp, AlertCircle, Check, Crown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import SEOHead from '@/components/SEOHead';

interface SettlementAnalysis {
  lowEstimate: number;
  midEstimate: number;
  highEstimate: number;
  recommendedSettlement: number;
  breakdown: {
    economicDamages: number;
    nonEconomicDamages: number;
    adjustments: number;
  };
  factors: string[];
  recommendations: string[];
  comparableCases: string[];
  timelineEstimate: string;
  disclaimer: string;
}

export default function SettlementCalculator() {
  const { toast } = useToast();
  const { isPremium } = usePremiumAccess();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SettlementAnalysis | null>(null);
  
  const [formData, setFormData] = useState({
    caseType: '',
    injuries: '',
    medicalCosts: '',
    lostWages: '',
    painAndSuffering: '',
    liabilityPercentage: '100',
    insuranceCoverage: '',
    additionalFactors: ''
  });

  const handleCalculate = async () => {
    if (!formData.caseType || !formData.injuries) {
      toast({
        title: 'Missing Information',
        description: 'Please provide case type and injury details.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('calculate-settlement', {
        body: formData
      });

      if (error) throw error;

      setAnalysis(data);
      toast({
        title: 'Settlement Calculated',
        description: 'Your settlement range has been estimated.',
      });
    } catch (error) {
      console.error('Settlement calculation error:', error);
      toast({
        title: 'Calculation Failed',
        description: 'Unable to calculate settlement. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
      <SEOHead 
        title="Settlement Calculator - Justice-Bot"
        description="Calculate realistic settlement ranges for your legal case using AI-powered analysis based on Canadian legal precedents. Get detailed breakdowns and negotiation strategies."
        keywords="settlement calculator, legal settlement, case value, compensation calculator, personal injury settlement, Canadian law"
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <PremiumGate 
            feature="Settlement Calculator" 
            showUpgrade={true}
            fallback={
              <Card className="max-w-2xl mx-auto mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-6 h-6" />
                    Settlement Calculator - Premium Feature
                  </CardTitle>
                  <CardDescription>
                    Available with Monthly or Yearly subscription plans
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    The Settlement Calculator provides AI-powered analysis to estimate realistic settlement ranges based on:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5" />
                      <span>Canadian legal precedents and case law</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5" />
                      <span>Economic and non-economic damages breakdown</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5" />
                      <span>Negotiation strategies and comparable cases</span>
                    </li>
                  </ul>
                  <Button className="w-full" onClick={() => window.location.href = '/pricing'}>
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Access
                  </Button>
                </CardContent>
              </Card>
            }
          >
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Settlement Calculator</h1>
                <p className="text-lg text-muted-foreground">
                  Get AI-powered settlement estimates based on Canadian legal precedents
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Case Details
                    </CardTitle>
                    <CardDescription>
                      Provide information about your case for accurate settlement estimates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="caseType">Case Type *</Label>
                      <Select
                        value={formData.caseType}
                        onValueChange={(value) => setFormData({ ...formData, caseType: value })}
                      >
                        <SelectTrigger id="caseType">
                          <SelectValue placeholder="Select case type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal-injury">Personal Injury</SelectItem>
                          <SelectItem value="motor-vehicle">Motor Vehicle Accident</SelectItem>
                          <SelectItem value="slip-fall">Slip and Fall</SelectItem>
                          <SelectItem value="workplace-injury">Workplace Injury</SelectItem>
                          <SelectItem value="medical-malpractice">Medical Malpractice</SelectItem>
                          <SelectItem value="product-liability">Product Liability</SelectItem>
                          <SelectItem value="wrongful-dismissal">Wrongful Dismissal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="injuries">Injuries Sustained *</Label>
                      <Textarea
                        id="injuries"
                        placeholder="Describe the injuries and their impact..."
                        value={formData.injuries}
                        onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="medicalCosts">Medical Costs ($)</Label>
                        <Input
                          id="medicalCosts"
                          type="number"
                          placeholder="0"
                          value={formData.medicalCosts}
                          onChange={(e) => setFormData({ ...formData, medicalCosts: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lostWages">Lost Wages ($)</Label>
                        <Input
                          id="lostWages"
                          type="number"
                          placeholder="0"
                          value={formData.lostWages}
                          onChange={(e) => setFormData({ ...formData, lostWages: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="painAndSuffering">Pain & Suffering Estimate ($)</Label>
                        <Input
                          id="painAndSuffering"
                          type="number"
                          placeholder="0"
                          value={formData.painAndSuffering}
                          onChange={(e) => setFormData({ ...formData, painAndSuffering: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="liabilityPercentage">Liability %</Label>
                        <Input
                          id="liabilityPercentage"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.liabilityPercentage}
                          onChange={(e) => setFormData({ ...formData, liabilityPercentage: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="insuranceCoverage">Insurance Coverage ($)</Label>
                      <Input
                        id="insuranceCoverage"
                        type="number"
                        placeholder="0"
                        value={formData.insuranceCoverage}
                        onChange={(e) => setFormData({ ...formData, insuranceCoverage: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalFactors">Additional Factors</Label>
                      <Textarea
                        id="additionalFactors"
                        placeholder="Any other relevant information..."
                        value={formData.additionalFactors}
                        onChange={(e) => setFormData({ ...formData, additionalFactors: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <Button 
                      onClick={handleCalculate} 
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Calculating...
                        </>
                      ) : (
                        <>
                          <Calculator className="w-4 h-4 mr-2" />
                          Calculate Settlement Range
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  {analysis ? (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Settlement Range
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center p-6 bg-primary/5 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-2">Recommended Settlement</p>
                            <p className="text-4xl font-bold text-primary">
                              {formatCurrency(analysis.recommendedSettlement)}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Low Estimate</span>
                              <span className="font-semibold">{formatCurrency(analysis.lowEstimate)}</span>
                            </div>
                            <Progress value={33} className="h-2" />

                            <div className="flex justify-between items-center">
                              <span className="text-sm">Mid Estimate</span>
                              <span className="font-semibold">{formatCurrency(analysis.midEstimate)}</span>
                            </div>
                            <Progress value={66} className="h-2" />

                            <div className="flex justify-between items-center">
                              <span className="text-sm">High Estimate</span>
                              <span className="font-semibold">{formatCurrency(analysis.highEstimate)}</span>
                            </div>
                            <Progress value={100} className="h-2" />
                          </div>

                          <div className="border-t pt-4 space-y-2">
                            <h4 className="font-semibold">Breakdown</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Economic Damages:</span>
                                <span>{formatCurrency(analysis.breakdown.economicDamages)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Non-Economic Damages:</span>
                                <span>{formatCurrency(analysis.breakdown.nonEconomicDamages)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Adjustments:</span>
                                <span>{formatCurrency(analysis.breakdown.adjustments)}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Key Factors</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.factors.map((factor, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{factor}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Negotiation Strategies</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.recommendations.map((rec, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      {analysis.comparableCases.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Comparable Cases</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {analysis.comparableCases.map((caseInfo, index) => (
                                <li key={index} className="text-sm">{caseInfo}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}

                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {analysis.disclaimer}
                        </AlertDescription>
                      </Alert>
                    </>
                  ) : (
                    <Card className="h-full flex items-center justify-center p-12">
                      <div className="text-center text-muted-foreground">
                        <Calculator className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Enter case details and click calculate to see your settlement range</p>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </PremiumGate>
        </main>

        <Footer />
      </div>
    </>
  );
}
