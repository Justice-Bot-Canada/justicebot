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
  const [processingVerification, setProcessingVerification] = useState(false);

  // Handle email verification callback - Supabase sends hash fragments
  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check if URL has hash with access_token (email verification click)
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');
      
      if (accessToken && type === 'signup') {
        setProcessingVerification(true);
        // Supabase client will automatically pick up the tokens from the URL
        // Just wait for the auth state to update
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session) {
          setVerified(true);
          setProcessingVerification(false);
          // Clear the hash from URL for cleaner look
          window.history.replaceState(null, '', '/welcome');
        } else if (error) {
          console.error('Auth callback error:', error);
          setProcessingVerification(false);
        }
      }
    };

    handleAuthCallback();
  }, [location.hash]);

  // Check if user just signed up (stored in sessionStorage)
  useEffect(() => {
    const signupPending = sessionStorage.getItem('justSignedUp') === 'true';
    if (signupPending && !user && !loading) {
      setJustSignedUp(true);
      // Clear the flag so it doesn't persist across sessions
      sessionStorage.removeItem('justSignedUp');
    }
  }, [user, loading]);

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

  if (loading || processingVerification) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto text-center py-12">
            <CardContent>
              <Loader2 className="mx-auto h-12 w-12 text-primary mb-4 animate-spin" />
              <h3 className="text-lg font-semibold mb-2">
                {processingVerification ? "Completing your verification..." : "Verifying your account..."}
              </h3>
              <p className="text-muted-foreground">
                {processingVerification ? "Just a moment while we set up your account" : "Please wait a moment"}
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Show email verification instructions if user just signed up
  if (justSignedUp) {
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

  // If not logged in and not just signed up, show sign in prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto text-center py-12">
            <CardHeader>
              <CardTitle className="text-3xl mb-2">Welcome to Justice-Bot</CardTitle>
              <CardDescription className="text-lg">
                Sign in to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setShowAuthDialog(true)} variant="default">
                  Sign In
                </Button>
                <Button onClick={() => navigate("/")} variant="outline">
                  Return to Home
                </Button>
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
