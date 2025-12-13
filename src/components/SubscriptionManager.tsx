import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Calendar, 
  RefreshCw, 
  ExternalLink, 
  Crown,
  Sparkles,
  Shield
} from "lucide-react";
import { format } from "date-fns";

const PLAN_FEATURES: Record<string, string[]> = {
  Basic: ["Basic legal forms", "Standard PDF generation", "Email support", "5 GB storage"],
  Professional: ["All premium forms", "Smart pre-filling", "Priority support", "20 GB storage"],
  Premium: ["AI legal analysis", "Phone support", "Unlimited storage", "Dedicated manager"],
};

const PLAN_ICONS: Record<string, React.ReactNode> = {
  Basic: <Shield className="w-5 h-5" />,
  Professional: <Sparkles className="w-5 h-5" />,
  Premium: <Crown className="w-5 h-5" />,
};

export function SubscriptionManager() {
  const { 
    subscribed, 
    plan, 
    subscriptionEnd, 
    loading, 
    error,
    checkSubscription,
    openCustomerPortal 
  } = useSubscription();
  const { toast } = useToast();
  const [portalLoading, setPortalLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      await openCustomerPortal();
      toast({
        title: "Opening Stripe Portal",
        description: "Manage your subscription in the new tab.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to open customer portal",
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await checkSubscription();
    setRefreshing(false);
    toast({
      title: "Subscription Status Refreshed",
      description: "Your subscription status has been updated.",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Checking subscription status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="py-6">
          <div className="text-center space-y-4">
            <p className="text-destructive">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={subscribed ? "border-primary/50 bg-primary/5" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${subscribed ? "bg-primary/20" : "bg-muted"}`}>
              <CreditCard className={`w-5 h-5 ${subscribed ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <CardTitle className="text-lg">Subscription</CardTitle>
              <CardDescription>
                {subscribed ? "Manage your subscription" : "You're on the free plan"}
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {subscribed && plan ? (
          <>
            <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  {PLAN_ICONS[plan] || <Shield className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{plan} Plan</span>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                      Active
                    </Badge>
                  </div>
                  {subscriptionEnd && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>Renews {format(new Date(subscriptionEnd), "MMM d, yyyy")}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {PLAN_FEATURES[plan] && (
              <div className="grid grid-cols-2 gap-2">
                {PLAN_FEATURES[plan].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button 
                onClick={handleManageSubscription} 
                disabled={portalLoading}
                className="flex-1"
              >
                {portalLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4 mr-2" />
                )}
                Manage Subscription
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              Cancel, upgrade, or change payment method via Stripe
            </p>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">
                Upgrade to unlock premium features like AI analysis, smart form pre-filling, and priority support.
              </p>
            </div>
            <Button asChild className="w-full">
              <a href="/pricing">
                <Sparkles className="w-4 h-4 mr-2" />
                View Plans
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
