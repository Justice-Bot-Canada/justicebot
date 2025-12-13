import { useState, useEffect } from "react";
import { Check, CreditCard, FileText, Zap, Mail, DollarSign, Users, Sparkles, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import { CanonicalURL } from "@/components/CanonicalURL";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { analytics } from "@/utils/analytics";

const VALID_PROMO_CODES: Record<string, { discount: number; label: string }> = {
  "LAUNCH50": { discount: 0.5, label: "50% OFF First Month" },
  "FIRST50": { discount: 0.5, label: "50% OFF First Month" },
  "DEMO2024": { discount: 0.5, label: "Demo Special 50% OFF" },
};

// PayPal Hosted Button IDs
const PAYPAL_BUTTONS = {
  basic: "XYZABC123", // Replace with actual PayPal button ID
  professional: "XYZABC456", // Replace with actual PayPal button ID
  premium: "XYZABC789", // Replace with actual PayPal button ID
};

const Pricing = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [isFreeUser, setIsFreeUser] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; label: string } | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    checkFreeEligibility();
    const savedPromo = localStorage.getItem("promo-code");
    if (savedPromo && VALID_PROMO_CODES[savedPromo]) {
      setAppliedPromo({ code: savedPromo, ...VALID_PROMO_CODES[savedPromo] });
    }
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

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (VALID_PROMO_CODES[code]) {
      setAppliedPromo({ code, ...VALID_PROMO_CODES[code] });
      localStorage.setItem("promo-code", code);
      toast({
        title: "Promo Code Applied!",
        description: `${VALID_PROMO_CODES[code].label} - discount will be applied at checkout.`,
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "This promo code is not valid or has expired.",
        variant: "destructive",
      });
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    localStorage.removeItem("promo-code");
  };

  const getDiscountedPrice = (price: string) => {
    if (!appliedPromo) return null;
    const numPrice = parseInt(price.replace('$', ''));
    return (numPrice * (1 - appliedPromo.discount)).toFixed(2);
  };

  const handlePayPalPayment = (plan: string, price: string) => {
    analytics.paymentInitiated(plan, price, 'paypal');
    // Open PayPal checkout in new tab
    const paypalUrl = `https://www.paypal.com/webapps/hermes?token=${PAYPAL_BUTTONS[plan.toLowerCase() as keyof typeof PAYPAL_BUTTONS]}`;
    window.open(paypalUrl, '_blank');
    
    toast({
      title: "Opening PayPal",
      description: "Complete your payment in the new tab.",
    });
  };

  const handleETransferPayment = (plan: string, amount: string) => {
    analytics.paymentInitiated(plan, amount, 'e-transfer');
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
      name: "Basic",
      description: "Essential legal document tools",
      price: "$19",
      period: "per month",
      features: [
        "Access to basic legal forms",
        "Standard PDF generation",
        "Email support",
        "Case tracking dashboard",
        "Document storage (5 GB)",
        "Cancel anytime"
      ],
    },
    {
      name: "Professional",
      description: "Advanced features for active cases",
      price: "$29",
      period: "per month",
      popular: true,
      features: [
        "Everything in Basic",
        "All premium legal forms",
        "Smart form pre-filling",
        "Priority email support",
        "Advanced case tracking",
        "Document templates library",
        "Evidence builder tools",
        "Document storage (20 GB)",
        "Cancel anytime"
      ],
    },
    {
      name: "Premium",
      description: "Complete legal toolkit with priority support",
      price: "$49",
      period: "per month",
      features: [
        "Everything in Professional",
        "Priority phone support",
        "AI-powered legal analysis",
        "Multi-case management",
        "Custom document templates",
        "Bulk document processing",
        "Unlimited document storage",
        "Early access to new features",
        "Dedicated account manager",
        "Cancel anytime"
      ],
    }
  ];

  // Product structured data for each plan
  const productStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": "Justice-Bot Basic Plan",
        "description": "Essential legal document tools for Canadian legal matters",
        "brand": {
          "@type": "Organization",
          "name": "Justice-Bot"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://justice-bot.com/pricing",
          "priceCurrency": "CAD",
          "price": "19",
          "priceValidUntil": "2025-12-31",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        }
      },
      {
        "@type": "Product",
        "name": "Justice-Bot Professional Plan",
        "description": "Advanced legal document features with priority support for active cases",
        "brand": {
          "@type": "Organization",
          "name": "Justice-Bot"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://justice-bot.com/pricing",
          "priceCurrency": "CAD",
          "price": "29",
          "priceValidUntil": "2025-12-31",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "Product",
        "name": "Justice-Bot Premium Plan",
        "description": "Complete legal toolkit with AI analysis and dedicated support for Canadian legal needs",
        "brand": {
          "@type": "Organization",
          "name": "Justice-Bot"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://justice-bot.com/pricing",
          "priceCurrency": "CAD",
          "price": "49",
          "priceValidUntil": "2025-12-31",
          "availability": "https://schema.org/InStock"
        }
      }
    ]
  };

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Pricing", url: "/pricing" }
  ];

  const faqData = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept PayPal and e-transfer payments. PayPal provides instant access, while e-transfer activation takes 24 hours."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, monthly subscriptions can be cancelled anytime. Annual plans are refundable within 30 days if you haven't generated documents."
    },
    {
      question: "What's included in the premium plans?",
      answer: "Premium plans include professional PDF generation, smart form pre-filling, priority support, advanced case tracking, document templates library, and full access to all legal venues."
    },
    {
      question: "How do I qualify for the low-income plan?",
      answer: "You qualify if you receive Ontario Works, ODSP, or have a household income below Statistics Canada's Low Income Cut-Off (LICO). Income verification is required."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <CanonicalURL />
      <EnhancedSEO
        title="Legal Document Pricing - $19, $29, $49/month Plans"
        description="Justice-Bot tiered pricing for Canadian legal services. Choose from Basic ($19), Professional ($29), or Premium ($49) monthly plans. Flexible legal document solutions for every need."
        keywords="legal services pricing Canada, affordable legal help Ontario, legal document pricing, law help subscription, Canadian legal services cost, tiered legal pricing"
        structuredData={productStructuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
      />
      <Header />
      <main className="container mx-auto px-4 py-16">
        {/* Promo Banner */}
        {appliedPromo ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-green-500" />
                <div>
                  <p className="font-bold text-green-700 dark:text-green-400">{appliedPromo.label}</p>
                  <p className="text-sm text-green-600 dark:text-green-500">Code: {appliedPromo.code}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRemovePromo}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary flex-shrink-0" />
              <p className="text-sm font-medium">Have a promo code?</p>
              <div className="flex items-center gap-2 flex-1">
                <Input
                  placeholder="Enter code (e.g., LAUNCH50)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="max-w-48"
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                />
                <Button onClick={handleApplyPromo} size="sm">Apply</Button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Banner */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Choose the plan that fits your legal needs. All plans include access to Canadian legal forms.
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

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative flex flex-col ${
                plan.popular ? 'border-primary ring-2 ring-primary/20 scale-105 shadow-xl' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                  Most Popular
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
                  {appliedPromo ? (
                    <>
                      <div className="text-2xl text-muted-foreground line-through">
                        {plan.price}
                      </div>
                      <div className="text-4xl font-bold text-green-600">
                        ${getDiscountedPrice(plan.price)}
                      </div>
                      <Badge className="bg-green-500 mt-1">{appliedPromo.label}</Badge>
                    </>
                  ) : (
                    <div className="text-4xl font-bold">
                      {plan.price}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {plan.period}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardContent className="pt-0 space-y-2">
                <Button
                  onClick={() => handlePayPalPayment(plan.name, plan.price)}
                  disabled={loading === plan.name.toLowerCase()}
                  className={`w-full flex items-center justify-center gap-2 ${
                    plan.popular ? 'bg-primary hover:bg-primary/90' : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <CreditCard className="w-4 h-4" />
                  {loading === plan.name.toLowerCase() ? "Processing..." : `Pay with PayPal - ${plan.price}/mo`}
                </Button>
                
                <Button
                  onClick={() => handleETransferPayment(plan.name, plan.price)}
                  variant="ghost"
                  className="w-full flex items-center justify-center gap-2 text-xs"
                >
                  <Mail className="w-3 h-3" />
                  Or pay via E-Transfer
                </Button>
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
              and support for Ontario courts and tribunals. More provinces coming soon.
            </p>
          </div>
        </div>

        {/* Low Income Section */}
        <section className="mt-16 max-w-3xl mx-auto">
          <Card className="border-2 border-dashed border-muted-foreground/30">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-6 w-6 text-primary" />
                <CardTitle>Low Income? We've Got You Covered</CardTitle>
              </div>
              <CardDescription className="text-base">
                Justice should be accessible to everyone. If you're on Ontario Works, ODSP, 
                or have limited income, you may qualify for our reduced-cost program.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex flex-wrap justify-center gap-3">
                <Badge variant="secondary" className="text-sm py-1 px-3">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Up to 80% off
                </Badge>
                <Badge variant="secondary" className="text-sm py-1 px-3">
                  <FileText className="h-3 w-3 mr-1" />
                  Full feature access
                </Badge>
                <Badge variant="secondary" className="text-sm py-1 px-3">
                  <Check className="h-3 w-3 mr-1" />
                  Simple verification
                </Badge>
              </div>
              <Button variant="outline" size="lg" asChild>
                <a href="/low-income-approval">
                  Apply for Low Income Rate
                </a>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
