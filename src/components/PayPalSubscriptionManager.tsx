import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast-stub";
import { Crown, CreditCard, Calendar, AlertTriangle, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface SubscriptionInfo {
  hasSubscription: boolean;
  subscriptionType: string | null;
  grantedAt: string | null;
  subscriptionId?: string;
}

export default function PayPalSubscriptionManager() {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("check-paypal-subscription");
      
      if (error) throw error;
      
      setSubscription(data);
    } catch (error) {
      console.error("Error checking subscription:", error);
      setSubscription({ hasSubscription: false, subscriptionType: null, grantedAt: null });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setCancelling(true);
      
      // Get subscription ID from payments table
      const { data: payments } = await supabase
        .from("payments")
        .select("payment_id")
        .in("plan_type", ["monthly", "yearly", "annual"])
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(1);

      const subscriptionId = payments?.[0]?.payment_id;
      
      if (!subscriptionId) {
        // If no PayPal subscription ID, just remove entitlements locally
        toast.info("To cancel your subscription, please contact support or manage it through PayPal directly.");
        setShowCancelDialog(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("cancel-paypal-subscription", {
        body: { subscriptionId, reason: "User requested cancellation" }
      });
      
      if (error) throw error;
      
      toast.success("Subscription cancelled successfully");
      setSubscription({ hasSubscription: false, subscriptionType: null, grantedAt: null });
      setShowCancelDialog(false);
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      toast.error(error.message || "Failed to cancel subscription. Please contact support.");
    } finally {
      setCancelling(false);
    }
  };

  const getSubscriptionLabel = (type: string | null) => {
    switch (type) {
      case "monthly_subscription":
        return "Monthly Plan";
      case "yearly_subscription":
        return "Yearly Plan";
      case "low-income":
        return "Low-Income Access";
      default:
        return "Premium";
    }
  };

  const getSubscriptionPrice = (type: string | null) => {
    switch (type) {
      case "monthly_subscription":
        return "$19/month";
      case "yearly_subscription":
        return "$99.99/year";
      case "low-income":
        return "Reduced Rate";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription
          </CardTitle>
          <CardDescription>
            Manage your plan and billing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Plan</span>
              {subscription?.hasSubscription ? (
                <Badge className="bg-primary">
                  <Crown className="w-3 h-3 mr-1" />
                  {getSubscriptionLabel(subscription.subscriptionType)}
                </Badge>
              ) : (
                <Badge variant="secondary">Free</Badge>
              )}
            </div>
            
            {subscription?.hasSubscription && (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium">{getSubscriptionPrice(subscription.subscriptionType)}</span>
                </div>
                
                {subscription.grantedAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Member Since
                    </span>
                    <span>{new Date(subscription.grantedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </>
            )}

            <p className="text-sm pt-2">
              {subscription?.hasSubscription 
                ? "You have full access to all premium features." 
                : "Upgrade to unlock all forms and premium features."}
            </p>
          </div>

          {subscription?.hasSubscription ? (
            <div className="space-y-3">
              <Separator />
              
              <div className="flex flex-col gap-2">
                <a
                  href="https://www.paypal.com/myaccount/autopay/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Manage in PayPal
                  </Button>
                </a>
                
                <Button
                  variant="ghost"
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setShowCancelDialog(true)}
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
          ) : (
            <Link to="/pricing">
              <Button className="w-full">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            </Link>
          )}

          <div className="text-sm text-muted-foreground pt-2">
            <p>Need help with billing?</p>
            <a 
              href="mailto:admin@justice-bot.com?subject=Billing%20Support" 
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Contact Support <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Cancel Subscription?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Are you sure you want to cancel your subscription?</p>
              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                <li>You'll lose access to premium forms</li>
                <li>Your case data will be preserved</li>
                <li>You can resubscribe anytime</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              disabled={cancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
