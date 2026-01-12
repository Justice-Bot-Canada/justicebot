import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, FileText, MapPin, ListChecks, Clock, Download, Shield, AlertTriangle, Mail, ArrowRight, Lock, Loader2 } from "lucide-react";
import EnhancedSEO from "@/components/EnhancedSEO";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent, analytics } from "@/utils/analytics";
import founderImage from "@/assets/justice-bot-logo.jpeg";

export default function LegalPathReportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  // Track page view
  useEffect(() => {
    trackEvent('legal_path_report_view', { source: searchParams.get('source') || 'direct' });
  }, []);

  // Prefill email if logged in
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handlePurchase = async () => {
    setIsLoading(true);
    trackEvent('begin_checkout', { product: 'legal_path_report', price: 5.99 });

    try {
      // If not logged in, we'll handle checkout that allows guest purchase
      const { data, error } = await supabase.functions.invoke('create_checkout', {
        body: {
          priceId: 'price_1SohEuL0pLShFbLtsOf8LBxx', // $5.99 Legal Path Report
          productType: 'one-time',
          successUrl: `${window.location.origin}/documents-unlocked?product=legal-path-report`,
          cancelUrl: `${window.location.origin}/legal-path-report`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Legal Path Report - $5.99 | Justice-Bot"
        description="Get the right legal form and next steps in minutes. A plain-language report that tells you what to file, where to file it, and what evidence matters."
        canonicalUrl="https://justice-bot.com/legal-path-report"
      />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Get the right legal form and next steps in minutes.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A plain-language Legal Path Report that tells you what to file, where to file it, 
              and what evidence matters — so you don't waste time or miss deadlines.
            </p>
            
            <div className="pt-4">
              <Button 
                onClick={handlePurchase}
                disabled={isLoading}
                className="h-14 px-10 text-lg"
                variant="cta"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Get my report — $5.99"
                )}
              </Button>
              
              <p className="text-sm text-muted-foreground mt-3 flex items-center justify-center gap-4">
                <span className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Instant delivery
                </span>
                <span>•</span>
                <span>One-time purchase</span>
                <span>•</span>
                <span>No subscription</span>
              </p>
            </div>

            <button 
              onClick={() => document.getElementById('whats-included')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-primary hover:underline text-sm"
            >
              See what's included ↓
            </button>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section id="whats-included" className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">What you get</h2>
          
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8">
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">The right form (based on your answers)</p>
                    <p className="text-sm text-muted-foreground">No more guessing which form applies to your situation</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Where to file (court / tribunal / venue)</p>
                    <p className="text-sm text-muted-foreground">Exact location and submission instructions</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Step-by-step next actions</p>
                    <p className="text-sm text-muted-foreground">Clear timeline of what to do and when</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Evidence checklist (what matters most)</p>
                    <p className="text-sm text-muted-foreground">Know exactly what documents to gather</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Common mistakes to avoid</p>
                    <p className="text-sm text-muted-foreground">Learn from others' errors so you don't repeat them</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Downloadable PDF you can keep</p>
                    <p className="text-sm text-muted-foreground">Reference it anytime, print it out</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-green-200 dark:border-green-900/50">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-green-700 dark:text-green-400">
                  ✓ This is for you if:
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    You don't know what form applies
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    You're worried about deadlines
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    You need a clear path, not legal jargon
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-900/50">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-orange-700 dark:text-orange-400">
                  ✗ This isn't for you if:
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                    You want a lawyer-client relationship
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                    You need emergency/legal crisis help tonight
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                    You want guaranteed outcomes
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground mt-4">
                  If you're in crisis, visit{" "}
                  <a href="https://www.legalaid.on.ca/" target="_blank" rel="noopener" className="text-primary hover:underline">
                    Legal Aid Ontario
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Block */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <img 
                  src={founderImage}
                  alt="Terri - Founder of Justice-Bot"
                  className="w-20 h-20 rounded-full object-cover shrink-0"
                />
                <div>
                  <p className="text-lg leading-relaxed">
                    Hi, I'm Terri. I built Justice-Bot because everyday people get crushed by 
                    confusing forms and unclear steps. This report is designed to give you 
                    clarity fast — without legal jargon. If something breaks, you can reach a real person.
                  </p>
                  <p className="mt-4">
                    <a 
                      href="/contact" 
                      className="text-primary hover:underline font-medium"
                    >
                      Need help? Contact support →
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Risk Reversal */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-bold">Money-Back Guarantee</h3>
          </div>
          <p className="text-muted-foreground">
            If the report generates incorrectly, you'll get a replacement or refund. No runaround.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-t from-primary/5 to-background">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Ready to get your Legal Path Report?
          </h2>
          
          <Card className="border-2 border-primary/30">
            <CardContent className="p-8">
              {user?.email && (
                <p className="text-sm text-muted-foreground mb-4">
                  Logged in as: {user.email}
                </p>
              )}
              
              <Button 
                onClick={handlePurchase}
                disabled={isLoading}
                className="w-full h-14 text-lg"
                variant="cta"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Pay $5.99 →"
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground mt-4">
                $5.99 total • Secure checkout powered by Stripe
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
