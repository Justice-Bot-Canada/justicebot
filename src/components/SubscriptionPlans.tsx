import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// PayPal Plan IDs from PayPal Dashboard
const PAYPAL_PLANS = {
  monthly: "P-85C49396FY903261CNESQ7AA",
  yearly: "P-9AX658241M042612XM7XYWQA", // Update this with your yearly plan ID when created
};

interface PlanCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  planId: string;
  isPopular?: boolean;
  savingsText?: string;
}

function PlanCard({ title, price, period, features, planId, isPopular, savingsText }: PlanCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    try {
      setIsProcessing(true);

      const { data, error } = await supabase.functions.invoke("create-paypal-subscription", {
        body: { planId },
      });

      if (error) throw error;

      if (data?.approvalUrl) {
        // Open PayPal subscription in new tab
        window.open(data.approvalUrl, "_blank");
        
        toast({
          title: "Subscription initiated",
          description: "Complete the subscription setup in the new window.",
        });
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription failed",
        description: error instanceof Error ? error.message : "Failed to start subscription",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className={isPopular ? "border-primary shadow-lg scale-105" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle>{title}</CardTitle>
          {isPopular && <Badge>Most Popular</Badge>}
        </div>
        <CardDescription>
          <span className="text-3xl font-bold text-foreground">${price}</span>
          <span className="text-muted-foreground">/{period}</span>
        </CardDescription>
        {savingsText && (
          <Badge variant="secondary" className="mt-2 w-fit">
            {savingsText}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubscribe}
          disabled={isProcessing}
          className="w-full"
          variant={isPopular ? "default" : "outline"}
          size="lg"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {isProcessing ? "Processing..." : "Subscribe with PayPal"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function SubscriptionPlans() {
  const monthlyFeatures = [
    "Unlimited legal form access",
    "AI-powered case analysis",
    "Document templates library",
    "Priority support",
    "Case progress tracking",
    "Evidence builder tools",
    "No per-form charges",
  ];

  const yearlyFeatures = [
    ...monthlyFeatures,
    "2 months free (compared to monthly)",
    "Annual billing discount",
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get unlimited access to all legal forms and premium features. Cancel anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <PlanCard
          title="Monthly Plan"
          price="19.99"
          period="month"
          features={monthlyFeatures}
          planId={PAYPAL_PLANS.monthly}
        />
        <PlanCard
          title="Yearly Plan"
          price="199.99"
          period="year"
          features={yearlyFeatures}
          planId={PAYPAL_PLANS.yearly}
          isPopular
          savingsText="Save $39.89 per year"
        />
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          All plans include a 7-day money-back guarantee. Secure payments powered by PayPal.
        </p>
      </div>
    </div>
  );
}
