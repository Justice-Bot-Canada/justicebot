import { useState, useEffect } from "react";
import { Check, CreditCard, FileText, Zap, Mail, DollarSign, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Pricing = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [isFreeUser, setIsFreeUser] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    checkFreeEligibility();
  }, [user]);

  const checkFreeEligibility = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.rpc('check_free_tier_eligibility');
      if (error) throw error;
      setIsFreeUser(data === true);
    } catch (error) {
      console.error('Error checking free eligibility:', error);
    }
  };

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
          caseId: null
        }
      });

      if (error) throw error;

      if (data?.approvalUrl) {
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

  const handleETransferPayment = (plan: string, amount: string) => {
    const subject = `Justice Bot - ${plan} Plan Payment`;
    const body = `I would like to purchase the ${plan} plan for $${amount} CAD. Please send me payment instructions for e-transfer.`;
    const mailtoLink = `mailto:admin@justice-bot.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    
    toast({
      title: "Email Client Opened",
      description: "Please send the email to complete your e-transfer payment.",
    });
  };

  const plans = [
    {
      name: "Premium Monthly",
      description: "Full access to all premium features",
      price: "$19.99",
      period: "per month",
      popular: true,
      features: [
        "Everything in Free",
        "Professional PDF generation",
        "Smart form pre-filling",
        "Priority email support",
        "Advanced case tracking",
        "Document templates library",
        "Cancel anytime"
      ],
    },
    {
      name: "Premium Yearly", 
      description: "Best value - Save $140!",
      price: "$99.99",
      period: "per year",
      originalPrice: "$239.88",
      features: [
        "Everything in Premium Monthly",
        "58% discount - Save over $140/year",
        "Priority phone support",
        "Early access to new features",
        "Advanced analytics",
        "Bulk case processing"
      ],
    },
    {
      name: "Low-Income",
      description: "Affordable access for qualified applicants",
      price: "$2.99", 
      period: "per month",
      badge: "Verification Required",
      features: [
        "All Premium features",
        "90% discount rate",
        "Income verification required",
        "Annual billing only - $35.88/year",
        "Same premium support"
      ],
      requiresApproval: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Affordable Legal Help Pricing - Plans from $2.99/month"
        description="Justice-Bot pricing plans for Canadians. Premium legal forms and document services from $19.99/month. Low-income plans available at $2.99/month. Ontario legal help made affordable."
        keywords="legal services pricing Canada, affordable legal help Ontario, legal document pricing, law help subscription, Canadian legal services cost"
        canonicalUrl="https://justice-bot.com/pricing"
      />
      <Header />
      <main className="container mx-auto px-4 py-16">
        {/* Hero Banner */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Professional legal document services built for Canadians
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span>PayPal accepted</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>E-transfer available</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Instant access</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
              {plan.badge && (
                <Badge variant="secondary" className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  {plan.badge}
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-400 line-through ml-2">
                        {plan.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {plan.period}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-2 mb-6 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2">
                  {plan.requiresApproval ? (
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => window.location.href = '/low-income-approval'}
                    >
                      Apply for Low-Income Plan
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        onClick={() => handlePayPalPayment(plan.name, plan.price)}
                        disabled={loading === plan.name}
                        className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                      >
                        <DollarSign className="w-4 h-4" />
                        {loading === plan.name ? "Processing..." : `PayPal - ${plan.price}`}
                      </Button>
                      
                      <Button
                        onClick={() => handleETransferPayment(plan.name, plan.price)}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        E-Transfer - {plan.price}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 text-gray-600 dark:text-gray-300 space-y-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg max-w-2xl mx-auto">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              🇨🇦 Built for Canadians
            </h3>
            <p className="text-sm">
              All plans include access to Canadian legal forms, provincial compliance, 
              and support for all provinces and territories.
            </p>
          </div>
          
          <div className="space-y-2">
            <p>
              <strong>PayPal:</strong> Instant access • <strong>E-Transfer:</strong> 24-hour activation
            </p>
            <p className="text-sm">
              Questions? Email us at admin@justice-bot.com
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;