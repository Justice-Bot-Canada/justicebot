import { ArrowRight, Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useShouldHidePricing } from '@/components/ProgramBanner';

export const PricingTeaser = () => {
  const navigate = useNavigate();
  const shouldHidePricing = useShouldHidePricing();

  // Don't render for program users with pricing disabled
  if (shouldHidePricing) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-background to-muted/20" id="pricing">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            5-Day Free Trial
          </Badge>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Plans Starting at{' '}
            <span className="text-primary">$19.99/month</span>
          </h2>
          
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Choose from Basic, Professional, or Premium plans. All include full access during your free trial.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-500" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-500" />
              <span>Card required for trial</span>
            </div>
          </div>

          <Button 
            size="lg" 
            onClick={() => navigate('/pricing')}
            className="gap-2"
          >
            View All Plans
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
