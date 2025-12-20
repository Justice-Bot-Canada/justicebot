import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Mail, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { supabase } from "@/integrations/supabase/client";
import AuthDialog from "@/components/AuthDialog";

const Welcome = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [verified, setVerified] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(false);

  // Check if this is a fresh signup (came from auth dialog) vs email verification click
  useEffect(() => {
    // If URL has hash with access_token, user clicked email verification link
    const hasAuthHash = location.hash.includes('access_token') || location.hash.includes('type=signup');
    
    if (!hasAuthHash && !user && !loading) {
      // User just signed up and was redirected here - show email verification prompt
      setJustSignedUp(true);
    }
  }, [location, user, loading]);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!loading && user) {
        setVerified(true);
        setJustSignedUp(false);
        
        // Check if user has completed onboarding
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profile && !profile.onboarding_completed) {
          setShowOnboarding(true);
        } else {
          // Auto-redirect to dashboard after 2 seconds if onboarding is complete
          setTimeout(() => navigate("/dashboard"), 2000);
        }
        setCheckingOnboarding(false);
      }
    };

    checkOnboarding();
  }, [user, loading, navigate]);

  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto text-center py-12">
            <CardContent>
              <Loader2 className="mx-auto h-12 w-12 text-primary mb-4 animate-spin" />
              <h3 className="text-lg font-semibold mb-2">Verifying your account...</h3>
              <p className="text-muted-foreground">Please wait a moment</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Show email verification instructions if user just signed up
  if (justSignedUp || (!user && !loading)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto text-center py-12">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-10 w-10 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl mb-2">Check Your Email!</CardTitle>
              <CardDescription className="text-lg">
                We've sent you a verification link to complete your registration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-6 text-left max-w-lg mx-auto">
                <h4 className="font-semibold mb-3 text-foreground">Next Steps:</h4>
                <ol className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">1</span>
                    <span>Open your email inbox (check spam/junk folder too)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">2</span>
                    <span>Click the verification link in the email from Justice-Bot</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">3</span>
                    <span>You'll be automatically signed in and ready to go!</span>
                  </li>
                </ol>
              </div>

              <div className="pt-4 border-t space-y-3">
                <p className="text-sm text-muted-foreground">
                  Already verified your email?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => setShowAuthDialog(true)} variant="default">
                    Sign In Now
                  </Button>
                  <Button onClick={() => navigate("/")} variant="outline">
                    Return to Home
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
        <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      </div>
    );
  }

  // User is verified and logged in - show success
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <Card className="max-w-2xl mx-auto text-center py-12">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-3xl mb-2">Welcome to Justice-Bot!</CardTitle>
            <CardDescription className="text-lg">
              Your account is verified and ready to use
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-left space-y-4 max-w-lg mx-auto">
              <p className="text-muted-foreground">
                You now have access to all features:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>AI-powered case assessment and merit scoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Access to legal forms and document templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Case management and deadline tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Step-by-step guidance for your legal pathway</span>
                </li>
              </ul>
            </div>
            
            <div className="pt-4">
              <Button onClick={handleGetStarted} size="lg" className="w-full sm:w-auto gap-2">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />

      {/* Onboarding Flow */}
      {!checkingOnboarding && (
        <OnboardingFlow 
          open={showOnboarding} 
          onComplete={handleOnboardingComplete}
        />
      )}
    </div>
  );
};

export default Welcome;
