import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { supabase } from "@/integrations/supabase/client";
import AuthDialog from "@/components/AuthDialog";

const Welcome = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!loading && user) {
        setVerified(true);
        
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

  // Show email verification instructions if not logged in
  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto text-center py-12">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Mail className="h-16 w-16 text-primary" />
              </div>
              <CardTitle className="text-3xl mb-2">Check Your Email</CardTitle>
              <CardDescription className="text-lg">
                We've sent you a verification link
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-left space-y-4 max-w-lg mx-auto">
                <p className="text-muted-foreground">
                  To complete your registration:
                </p>
                <ol className="space-y-3 text-muted-foreground list-decimal list-inside">
                  <li>Check your email inbox (and spam folder)</li>
                  <li>Click the verification link in the email</li>
                  <li>You'll be automatically logged in and redirected here</li>
                </ol>
                <p className="text-sm text-muted-foreground pt-4 border-t">
                  Already verified your email?
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setShowAuthDialog(true)} variant="default">
                  Sign In Now
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <Card className="max-w-2xl mx-auto text-center py-12">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl mb-2">Welcome to Justice-Bot!</CardTitle>
            <CardDescription className="text-lg">
              Your account has been successfully verified
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-left space-y-4 max-w-lg mx-auto">
              <p className="text-muted-foreground">
                You're all set! You can now access all features of Justice-Bot:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>AI-powered case assessment and merit scoring</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Access to legal forms and document templates</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Case management and deadline tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Step-by-step guidance for your legal pathway</span>
                </li>
              </ul>
            </div>
            
            <div className="pt-4">
              <Button onClick={handleGetStarted} size="lg" className="w-full sm:w-auto">
                Get Started
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
