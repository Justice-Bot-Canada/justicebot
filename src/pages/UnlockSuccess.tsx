import { CheckCircle, FileText, ListChecks, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { analytics } from "@/utils/analytics";

/**
 * Success page specifically for $5.99 Form Unlock purchase
 * Shows immediate value - no dead ends
 */
const UnlockSuccess = () => {
  const navigate = useNavigate();
  const eventFired = useRef(false);

  useEffect(() => {
    // Fire purchase event once
    if (!eventFired.current) {
      eventFired.current = true;
      analytics.funnelPurchase({
        transactionId: `unlock_${Date.now()}`,
        value: 5.99,
        itemName: 'Emergency Form Unlock',
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full border-green-200 shadow-lg">
        <CardContent className="pt-8 pb-6 space-y-6">
          {/* Success header - dopamine moment */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              You're unlocked. Let's get you unstuck.
            </h1>
            <p className="text-muted-foreground">
              Your $5.99 access is now active. Here's what you can do:
            </p>
          </div>

          {/* Immediate value - what they bought */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <FileText className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Document Checklist</p>
                <p className="text-sm text-muted-foreground">See exactly what documents you need for your case</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <ListChecks className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Step-by-Step Filing Guide</p>
                <p className="text-sm text-muted-foreground">Follow clear instructions to file your forms correctly</p>
              </div>
            </div>
          </div>

          {/* Primary CTA - start immediately */}
          <Button 
            size="lg"
            onClick={() => navigate("/intake")}
            className="w-full text-lg py-6"
          >
            Start Here
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Questions? Email support@justice-bot.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnlockSuccess;
