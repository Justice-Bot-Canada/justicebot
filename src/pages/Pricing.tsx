import { useState } from "react";
import { Check, CreditCard, FileText, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Pricing = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePayPalPayment = async (plan: string, amount: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase a premium plan.",
        variant: "destructive",
      });
      return;
    }

    setLoading(plan);
    try {
      const { data, error } = await supabase.functions.invoke('create-paypal-payment', {
        body: {
          planType: plan,
          amount: amount.replace('$', ''),
          caseId: null // For general premium access
        }
      });

      if (error) throw error;

      if (data?.approvalUrl) {
        // Open PayPal in new tab
        window.open(data.approvalUrl, '_blank');
        toast({
          title: "Redirecting to PayPal",
          description: "Complete your payment in the new tab.",
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to create payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      name: "Basic",
      description: "Essential legal document services",
      price: "$29.99",
      period: "per month",
      features: [
        "Legal case analysis",
        "Merit score assessment",
        "Basic form templates",
        "Standard recommendations",
        "Community support"
      ],
    },
    {
      name: "Premium", 
      description: "Professional legal document suite",
      price: "$59.99",
      period: "per month",
      popular: true,
      features: [
        "Everything in Basic",
        "Professional PDF generation",
        "Smart form pre-filling",
        "Priority support",
        "Advanced case tracking",
        "Document templates library"
      ],
    },
    {
      name: "Enterprise",
      description: "Complete legal practice solution",
      price: "$149.99", 
      period: "per month",
      features: [
        "Everything in Premium",
        "Automated form filing",
        "Real-time case tracking",
        "Dedicated legal consultant",
        "Custom document generation",
        "API access",
        "White-label options"
      ],
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Professional legal document services powered by AI
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span>Secure PayPal payments</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Professional PDF generation</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Instant access</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative ${
                plan.popular ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {plan.period}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3">
                  <Button
                    onClick={() => handlePayPalPayment(plan.name, plan.price)}
                    disabled={loading === plan.name}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {loading === plan.name ? "Processing..." : `Pay with PayPal - ${plan.price} CAD`}
                  </Button>
                  
                  {plan.name === "Basic" && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.location.href = "/low-income-approval"}
                    >
                      Apply for Low-Income Discount
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 text-gray-600 dark:text-gray-300 space-y-2">
          <p>
            <strong>PayPal payments:</strong> Instant access after successful payment
          </p>
          <p>
            <strong>Need help?</strong> Contact us at admin@justice-bot.com
          </p>
          <p className="text-sm">
            All plans include Canadian legal compliance and professional document generation
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;