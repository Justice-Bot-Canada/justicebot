import { useState } from "react";
import { Check, Mail, DollarSign } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Pricing = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePayPalPayment = (plan: string, amount: string) => {
    setLoading(plan);
    // For demo purposes - in production, integrate with PayPal SDK
    toast({
      title: "PayPal Payment",
      description: `Redirecting to PayPal for ${plan} payment of ${amount}...`,
    });
    // Simulate PayPal redirect
    setTimeout(() => {
      window.location.href = "/payment-success";
    }, 2000);
  };

  const handleETransferPayment = (plan: string, amount: string) => {
    const email = "payments@justice-bot.com";
    const subject = `Justice-Bot ${plan} Payment`;
    const body = `Hello,

I would like to purchase the ${plan} plan for ${amount}.

Please confirm receipt of this email and provide payment instructions.

Thank you!`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    
    toast({
      title: "E-Transfer Instructions",
      description: "Check your email client for payment instructions. We'll contact you within 24 hours.",
    });
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
      ]
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
      ]
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
          <div className="flex justify-center gap-4 mb-8">
            <Badge variant="outline" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              PayPal Accepted
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              E-Transfer Available
            </Badge>
          </div>
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
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="default"
                          onClick={() => handlePayPalPayment(plan.name, plan.price)}
                          disabled={loading === plan.name}
                          className="flex items-center gap-2"
                        >
                          <DollarSign className="w-4 h-4" />
                          PayPal
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleETransferPayment(plan.name, plan.price)}
                          className="flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          E-Transfer
                        </Button>
                      </div>
                      {plan.yearlyPrice && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Button 
                            variant="secondary"
                            onClick={() => handlePayPalPayment(plan.name + " Yearly", plan.yearlyPrice)}
                            disabled={loading === plan.name + " Yearly"}
                            className="flex items-center gap-2 text-xs"
                          >
                            <DollarSign className="w-3 h-3" />
                            PayPal Yearly
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleETransferPayment(plan.name + " Yearly", plan.yearlyPrice)}
                            className="flex items-center gap-2 text-xs"
                          >
                            <Mail className="w-3 h-3" />
                            E-Transfer Yearly
                          </Button>
                        </div>
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
          <p className="text-sm text-muted-foreground mb-2">
            <strong>PayPal:</strong> Instant access after payment confirmation
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            <strong>E-Transfer:</strong> Manual processing within 24 hours
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