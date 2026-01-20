import { Check, X, Crown, Heart, Zap, Star, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const plans = [
  {
    id: 'free',
    name: 'Free Access',
    icon: Star,
    price: '$0',
    duration: 'Limited Time',
    description: 'Early tester tier',
    badge: 'Trial',
    badgeVariant: 'secondary' as const,
    features: [
      { name: 'AI form recommender', included: true },
      { name: 'Form preview (no download)', included: true },
      { name: 'Case timeline (read-only)', included: true },
      { name: 'Court locator', included: true },
      { name: 'Basic merit score', included: true },
      { name: 'Form Intelligence (autofill)', included: false },
      { name: 'Document downloads', included: false },
      { name: 'Settlement Calculator', included: false },
    ],
    cta: 'Start Free',
    ctaVariant: 'outline' as const,
  },
  {
    id: 'low-income',
    name: 'Low-Income Plan',
    icon: Heart,
    price: '$25.99',
    duration: 'per year',
    description: 'Verified low-income users',
    badge: 'Affordable',
    badgeVariant: 'default' as const,
    features: [
      { name: 'Everything in Free +', included: true },
      { name: 'Document downloads', included: true },
      { name: 'Form Intelligence (autofill)', included: true },
      { name: 'Deadline Guardian reminders', included: true },
      { name: 'Evidence bundle organizer', included: true },
      { name: 'Merit Scorer dashboard', included: true },
      { name: 'Settlement Calculator', included: false },
      { name: 'Voice Legal Assistant', included: false },
    ],
    cta: 'Apply Now',
    ctaVariant: 'outline' as const,
  },
  {
    id: 'monthly',
    name: 'Basic Monthly',
    icon: Zap,
    price: '$19',
    duration: 'per month',
    description: 'For users figuring things out',
    badge: 'Popular',
    badgeVariant: 'default' as const,
    popular: true,
    features: [
      { name: 'Ongoing access to legal triage', included: true },
      { name: 'Explore multiple legal forms', included: true },
      { name: 'Save case progress', included: true },
      { name: 'View form explanations and next steps', included: true },
      { name: 'Limited document generation', included: true },
      { name: 'Unlimited document generation', included: false },
      { name: 'Settlement Calculator', included: false },
    ],
    cta: 'Subscribe Monthly',
    ctaVariant: 'default' as const,
  },
  {
    id: 'yearly',
    name: 'Yearly Access',
    icon: Crown,
    price: '$99.99',
    duration: 'per year',
    description: 'Best overall value',
    badge: 'Best Value',
    badgeVariant: 'default' as const,
    highlight: true,
    features: [
      { name: 'Everything in Premium Monthly', included: true },
      { name: 'Full year of uninterrupted access', included: true },
      { name: 'Unlimited document generation', included: true },
      { name: 'All supported Canadian tribunals', included: true },
      { name: 'Advanced procedural guidance', included: true },
      { name: 'Priority support', included: true },
      { name: 'Save vs monthly billing', included: true, highlight: true },
    ],
    cta: 'Subscribe Yearly',
    ctaVariant: 'default' as const,
    savings: 'Save $500+/year',
  },
];

const oneTimePlan = {
  id: 'one-time',
  name: 'Legal Form',
  price: '$5.99',
  duration: 'one-time',
  description: 'Access to one specific Canadian legal form',
  features: [
    'Plain-language explanation of the form',
    'Guided walkthrough of required sections',
    'Download completed or partially completed form',
    'No subscription required',
  ],
  cta: 'Browse Forms',
};

export const PricingComparison = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubscribe = async (planType: string) => {
    if (!user) {
      toast({
        title: 'Sign In Required',
        description: 'Please sign in to subscribe to a plan.',
        variant: 'destructive'
      });
      navigate('/triage');
      return;
    }

    setLoadingPlan(planType);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription-checkout', {
        body: { planType }
      });

      if (error) throw error;

      if (data.approvalUrl) {
        window.open(data.approvalUrl, '_blank');
        toast({
          title: 'Redirecting to PayPal',
          description: 'Complete your subscription in the new window.',
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Subscription Failed',
        description: 'Unable to start subscription. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleCTAClick = (planId: string) => {
    if (planId === 'free') {
      navigate('/triage');
    } else if (planId === 'one-time') {
      navigate('/forms');
    } else if (planId === 'low-income') {
      handleSubscribe('low-income');
    } else if (planId === 'monthly') {
      handleSubscribe('monthly');
    } else if (planId === 'yearly') {
      handleSubscribe('yearly');
    }
  };

  const visiblePlans = plans.filter(plan => 
    billingCycle === 'yearly' 
      ? ['free', 'low-income', 'yearly'].includes(plan.id)
      : ['free', 'low-income', 'monthly'].includes(plan.id)
  );

  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/10" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Choose Your Access Level</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Professional legal assistance at a fraction of traditional legal costs
          </p>
          
          <Tabs value={billingCycle} onValueChange={(v) => setBillingCycle(v as 'monthly' | 'yearly')} className="inline-flex">
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">
                Yearly
                <Badge variant="secondary" className="ml-2">Save 58%</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {visiblePlans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={plan.id} 
                className={`relative ${plan.highlight ? 'border-primary shadow-xl scale-105' : ''} ${plan.popular ? 'border-primary/50' : ''}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  
                  {!plan.highlight && plan.badge && (
                    <Badge variant={plan.badgeVariant} className="mx-auto mb-2">
                      {plan.badge}
                    </Badge>
                  )}
                  
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">/ {plan.duration}</span>
                  </div>
                  
                  {plan.savings && (
                    <Badge variant="secondary" className="mt-2">
                      {plan.savings}
                    </Badge>
                  )}
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/30 shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${!feature.included ? 'text-muted-foreground line-through' : ''} ${feature.highlight ? 'font-semibold text-primary' : ''}`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button 
                    variant={plan.ctaVariant}
                    className="w-full"
                    size="lg"
                    onClick={() => handleCTAClick(plan.id)}
                    disabled={loadingPlan === plan.id}
                  >
                    {loadingPlan === plan.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      plan.cta
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* One-Time Document Option */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-dashed">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                {oneTimePlan.name}
              </CardTitle>
              <CardDescription>{oneTimePlan.description}</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">{oneTimePlan.price}</span>
                <span className="text-muted-foreground ml-2">/ {oneTimePlan.duration}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {oneTimePlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 justify-center">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleCTAClick('one-time')}
              >
                {oneTimePlan.cta}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            All plans include secure data storage and encryption. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
};
