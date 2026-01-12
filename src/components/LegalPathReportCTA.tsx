import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Check, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent, analytics } from "@/utils/analytics";

interface LegalPathReportCTAProps {
  province?: string;
  legalArea?: string;
  variant?: 'compact' | 'full';
}

const LegalPathReportCTA = ({ province, legalArea, variant = 'full' }: LegalPathReportCTAProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    trackEvent('legal_path_report_clicked', { province, legalArea });
    analytics.funnelBeginCheckout({ value: 5.99, itemName: 'Legal Path Report' });

    try {
      const { data, error } = await supabase.functions.invoke('create_checkout', {
        body: {
          priceId: 'price_1SohEuL0pLShFbLtsOf8LBxx', // $5.99 Legal Path Report
          planKey: 'legal_path_report',
          mode: 'payment',
          successUrl: `${window.location.origin}/unlock-success?product=legal_path_report&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/`,
          metadata: { 
            product: 'legal_path_report', 
            province: province || 'unknown',
            legalArea: legalArea || 'unknown',
            source: 'legal_path_report_cta' 
          }
        }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Unable to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <Card className="border-2 border-primary bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Get your Legal Path Report</p>
                <p className="text-sm text-muted-foreground">One-time • $5.99 CAD</p>
              </div>
            </div>
            <Button onClick={handlePurchase} disabled={isLoading} size="sm">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get report"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary overflow-hidden">
      <div className="bg-primary/10 px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-medium">Start here</span>
        <Badge variant="secondary" className="bg-primary text-primary-foreground">
          Most popular first step
        </Badge>
      </div>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10 shrink-0">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Legal Path Report</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Your personalized legal roadmap in 2 minutes
            </p>
          </div>
        </div>

        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>Which form applies to your situation</span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>Where and how to file</span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>What evidence you'll need</span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>Deadlines and what happens next</span>
          </li>
        </ul>

        <div className="pt-2">
          <Button 
            onClick={handlePurchase} 
            disabled={isLoading}
            className="w-full h-12 text-lg gap-2"
            variant="cta"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Get my report — $5.99
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            One-time payment • Instant access • 30-day guarantee
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LegalPathReportCTA;
