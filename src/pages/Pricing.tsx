import { useState } from "react";
import { Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Pricing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceKey: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe",
        variant: "destructive",
      });
      return;
    }

    setLoading(priceKey);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { price_key: priceKey }
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      name: "Per-Form",
      description: "Pay as you go for individual forms",
      price: "$5.99",
      lowIncomePrice: "$0.99",
      period: "per form",
      features: [
        "Individual form access",
        "Basic guidance",
        "Document generation",
        "Email support"
      ],
      priceKey: "per_form_regular",
      lowIncomePriceKey: "per_form_low_income"
    },
    {
      name: "Regular",
      description: "Full access to all features",
      price: "$59.99",
      yearlyPrice: "$150",
      period: "per month",
      yearlyPeriod: "per year",
      popular: true,
      features: [
        "Unlimited form access",
        "Smart case triage",
        "Advanced document prep",
        "Merit score analysis",
        "Priority support",
        "Legal pathway guidance"
      ],
      priceKey: "regular_monthly",
      yearlyPriceKey: "regular_yearly"
    },
    {
      name: "Low-Income",
      description: "Affordable access for approved applicants",
      price: "$25",
      period: "per year",
      badge: "Approval Required",
      features: [
        "All Regular features",
        "Significant discount",
        "Annual billing only",
        "Income verification required"
      ],
      priceKey: "low_income_yearly",
      requiresApproval: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Choose the plan that works best for your legal needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary ring-2 ring-primary' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              {plan.badge && (
                <Badge variant="secondary" className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  {plan.badge}
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="text-3xl font-bold">
                    {plan.price}
                    {plan.lowIncomePrice && (
                      <span className="text-lg text-muted-foreground ml-2">
                        (${plan.lowIncomePrice} low-income)
                      </span>
                    )}
                  </div>
                  <div className="text-muted-foreground">
                    {plan.period}
                    {plan.yearlyPrice && (
                      <div className="text-sm mt-1">
                        or {plan.yearlyPrice} {plan.yearlyPeriod}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2">
                  {plan.requiresApproval ? (
                    <Button 
                      className="w-full" 
                      onClick={() => window.location.href = '/low-income'}
                    >
                      Apply for Low-Income
                    </Button>
                  ) : (
                    <>
                      <Button 
                        className="w-full" 
                        variant={plan.popular ? "default" : "outline"}
                        onClick={() => handleSubscribe(plan.priceKey)}
                        disabled={loading === plan.priceKey}
                      >
                        {loading === plan.priceKey ? "Processing..." : `Get ${plan.name}`}
                      </Button>
                      {plan.yearlyPriceKey && (
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={() => handleSubscribe(plan.yearlyPriceKey)}
                          disabled={loading === plan.yearlyPriceKey}
                        >
                          {loading === plan.yearlyPriceKey ? "Processing..." : "Get Yearly (Save 75%)"}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            All plans include access to Ontario legal forms and guidance
          </p>
          <p className="text-sm text-muted-foreground">
            Questions? Contact us at support@justice-bot.com
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;