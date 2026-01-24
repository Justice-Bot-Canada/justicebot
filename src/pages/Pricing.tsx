import { useState, useEffect } from "react";
import { Check, CreditCard, FileText, Zap, Mail, DollarSign, Users, Sparkles, X, Clock } from "lucide-react";
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
import StripeTrialButton from "@/components/StripeTrialButton";

const VALID_PROMO_CODES: Record<string, { discount: number; label: string }> = {
  "LAUNCH50": { discount: 0.5, label: "50% OFF First Month" },
  "FIRST50": { discount: 0.5, label: "50% OFF First Month" },
  "DEMO2024": { discount: 0.5, label: "Demo Special 50% OFF" },
};

// Stripe Price IDs for monthly subscriptions
const STRIPE_PRICE_IDS = {
  basic: "price_1SgdrpL0pLShFbLtWKJfGCO3",
  professional: "price_1SgdzJL0pLShFbLtcFrnbeiV", 
  premium: "price_1Sge6YL0pLShFbLtR8BpRnuM",
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
    
    // Fire view_item for each plan when pricing page loads (GA4 Purchase Journey)
    plans.forEach(plan => {
      const price = parseInt(plan.price.replace('$', ''));
      analytics.viewItem(plan.key, plan.name, price);
    });
  }, [user]);

  const checkFreeEligibility = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.rpc('check_free_tier_eligibility', {
        p_user_id: user.id
      });
      if (error) {
        console.error('Free tier check error:', error);
        setIsFreeUser(false);
      } else {
        setIsFreeUser(data === true);
      }
    } catch (error) {
      console.error('Error checking free eligibility:', error);
      setIsFreeUser(false);
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
      key: "basic" as const,
      description: "Still figuring things out or dealing with a single issue over time",
      price: "$19",
      period: "per month",
      features: [
        "Ongoing access to legal triage",
        "Explore multiple legal forms",
        "Save case progress",
        "View form explanations and next steps",
        "Limited document generation",
        "Cancel anytime"
      ],
    },
    {
      name: "Professional",
      key: "professional" as const,
      description: "Actively preparing filings or managing a complex issue",
      price: "$29.99",
      period: "per month",
      popular: true,
      features: [
        "Everything in Basic",
        "Full document generation access",
        "Multiple form downloads",
        "Case timeline and walkthrough tools",
        "Priority access to advanced explanations",
        "Cancel anytime"
      ],
    },
    {
      name: "Premium",
      key: "premium" as const,
      description: "Power users, advocates, or managing multiple legal matters",
      price: "$49.99",
      period: "per month",
      features: [
        "Everything in Professional",
        "Unlimited document generation",
        "Full case tracking and history",
        "Advanced procedural guidance",
        "Access to all supported Canadian tribunals and courts",
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
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        }
      },
      {
        "@type": "Product",
        "name": "Justice-Bot Professional Plan",
        "description": "Full document generation and case management for active cases",
        "brand": {
          "@type": "Organization",
          "name": "Justice-Bot"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://justice-bot.com/pricing",
          "priceCurrency": "CAD",
          "price": "29.99",
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "Product",
        "name": "Justice-Bot Premium Plan",
        "description": "Complete legal toolkit with unlimited access for power users",
        "brand": {
          "@type": "Organization",
          "name": "Justice-Bot"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://justice-bot.com/pricing",
          "priceCurrency": "CAD",
          "price": "49.99",
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "Product",
        "name": "Justice-Bot Yearly Access",
        "description": "Full year of uninterrupted premium access at the best value",
        "brand": {
          "@type": "Organization",
          "name": "Justice-Bot"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://justice-bot.com/pricing",
          "priceCurrency": "CAD",
          "price": "99.99",
          "priceValidUntil": "2026-12-31",
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
      answer: "We accept credit/debit cards and e-transfer payments. Card payments via Stripe provide instant access, while e-transfer activation takes 24 hours."
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
        title="Pricing | Justice-Bot Legal Tools"
        description="Court-Ready Document Pack $39 one-time. Everything you need to file correctly. No subscription required."
        keywords="legal services pricing Canada, affordable legal help Ontario, legal document pricing"
        structuredData={productStructuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
      />
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            One-time payment for your Court-Ready Document Pack. No subscription required.
          </p>
        </div>

        {/* Featured: One-Time Purchase */}
        <Card className="max-w-2xl mx-auto mb-12 border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="text-center pb-4">
            <Badge className="w-fit mx-auto mb-3 bg-primary text-primary-foreground">
              Most Popular
            </Badge>
            <CardTitle className="text-2xl md:text-3xl">Court-Ready Document Pack</CardTitle>
            <CardDescription className="text-base">
              Everything you need to file correctly — prepared for submission
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold">$39</span>
                <span className="text-muted-foreground">CAD</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2 font-medium">
                One-time payment. No subscription. No ongoing charges.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "AI-powered legal triage",
                "Evidence upload & organization",
                "Auto-organized Book of Documents",
                "Tribunal form generation",
                "Step-by-step filing instructions",
                "Deadline tracking"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="w-full text-lg py-6"
              onClick={() => window.location.href = '/triage'}
            >
              <FileText className="mr-2 h-5 w-5" />
              Get Started — Free Triage First
            </Button>
          </CardContent>
        </Card>

        {/* Subscription Plans - Secondary */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-muted-foreground">Or choose a subscription plan</h2>
          <p className="text-sm text-muted-foreground">For ongoing legal needs with additional features</p>
        </div>

        {/* Free Trial Banner */}
        <div className="bg-muted/50 border border-border rounded-xl p-4 mb-10 max-w-2xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-muted-foreground/20 text-muted-foreground rounded-full p-2">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">5-Day Free Trial</p>
              <p className="text-sm text-muted-foreground">Full access. No charge until trial ends.</p>
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            Card required
          </Badge>
        </div>

        {/* Promo Code Input */}
        {appliedPromo ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-8 max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-500" />
              <span className="font-medium text-green-700 dark:text-green-400">{appliedPromo.label}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRemovePromo}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 mb-8">
            <Input
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="max-w-32 h-9"
              onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
            />
            <Button onClick={handleApplyPromo} size="sm" variant="outline">Apply</Button>
          </div>
        )}

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

              <CardContent className="pt-0 space-y-3">
                <StripeTrialButton 
                  priceId={STRIPE_PRICE_IDS[plan.key]} 
                  planKey={plan.key}
                  trialDays={5} 
                />
                
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

        {/* Transparent Pricing Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-center mb-6">Transparent Pricing — No Hidden Fees</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Check className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="font-medium text-sm">No Setup Fees</p>
              <p className="text-xs text-muted-foreground">Start using immediately</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Check className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="font-medium text-sm">No Hidden Charges</p>
              <p className="text-xs text-muted-foreground">What you see is what you pay</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Check className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="font-medium text-sm">Cancel Anytime</p>
              <p className="text-xs text-muted-foreground">No cancellation fees</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Check className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="font-medium text-sm">Billed Monthly</p>
              <p className="text-xs text-muted-foreground">After 5-day free trial</p>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            All prices in CAD. Tax may apply based on your province. Your card will be charged after the 5-day trial ends unless you cancel.
          </p>
        </div>

        <div className="text-center mt-12 text-muted-foreground space-y-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg max-w-2xl mx-auto">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              🇨🇦 Built for Canadians
            </h3>
            <p className="text-sm">
              All plans include access to Canadian legal forms, provincial compliance, 
              and support for Ontario courts and tribunals. More provinces coming soon.
            </p>
          </div>
          <p className="text-sm">
            Secure payments powered by Stripe. 5-day free trial on all plans.
          </p>
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
