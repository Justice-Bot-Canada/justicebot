import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ArrowRight, MapPin, Shield } from "lucide-react";
import { FlowHeader } from "@/components/FlowHeader";
import { FlowProgressIndicator } from "@/components/FlowProgressIndicator";
import { ProgramBanner } from "@/components/ProgramBanner";
import { supabase } from "@/integrations/supabase/client";
import AuthDialog from "@/components/AuthDialog";
import { PROVINCE_NAMES } from "@/config/provinceConfig";
import { useProgramCaseFields } from "@/hooks/useProgramCaseFields";

const Welcome = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const programCaseFields = useProgramCaseFields();
  
  // State
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(false);
  const [processingVerification, setProcessingVerification] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [existingCase, setExistingCase] = useState<string | null>(null);

  // Handle email verification callback
  useEffect(() => {
    const handleAuthCallback = async () => {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');
      
      if (accessToken && type === 'signup') {
        setProcessingVerification(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          window.history.replaceState(null, '', '/welcome');
        }
        setProcessingVerification(false);
      }
    };

    handleAuthCallback();
  }, [location.hash]);

  // Check if user just signed up
  useEffect(() => {
    const signupPending = sessionStorage.getItem('justSignedUp') === 'true';
    if (signupPending && !user && !loading) {
      setJustSignedUp(true);
      sessionStorage.removeItem('justSignedUp');
    }
  }, [user, loading]);

  // Check for existing case and load user's province preference
  useEffect(() => {
    const loadUserState = async () => {
      if (!user) return;
      setJustSignedUp(false);

      // Check for existing case
      const { data: cases } = await supabase
        .from('cases')
        .select('id, flow_step, province')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (cases && cases.length > 0) {
        const activeCase = cases[0];
        setExistingCase(activeCase.id);
        
        // If case is beyond welcome step, redirect to appropriate page
        if (activeCase.flow_step && activeCase.flow_step !== 'welcome') {
          const routes: Record<string, string> = {
            'triage': '/triage',
            'evidence': `/evidence?caseId=${activeCase.id}`,
            'timeline': `/case-timeline?caseId=${activeCase.id}`,
            'documents': '/dashboard',
            'complete': '/dashboard',
          };
          navigate(routes[activeCase.flow_step] || '/dashboard');
          return;
        }
        
        // Pre-fill province if set on case
        if (activeCase.province) {
          setSelectedProvince(activeCase.province);
        }
      }

      // Load profile province preference
      const { data: profile } = await supabase
        .from('profiles')
        .select('selected_province')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile?.selected_province && !selectedProvince) {
        setSelectedProvince(profile.selected_province);
      }
    };

    loadUserState();
  }, [user, navigate]);

  // Handle continue to triage
  const handleContinue = async () => {
    if (!user || !selectedProvince) return;

    setIsSaving(true);

    try {
      // Save province to profile
      await supabase
        .from('profiles')
        .update({ selected_province: selectedProvince })
        .eq('user_id', user.id);

      // Create or update case
      if (existingCase) {
        await supabase
          .from('cases')
          .update({ 
            province: selectedProvince, 
            flow_step: 'triage',
            updated_at: new Date().toISOString() 
          })
          .eq('id', existingCase);
        
        navigate('/triage');
      } else {
        // Create new case stub
        const { data: newCase, error } = await supabase
          .from('cases')
          .insert({
            user_id: user.id,
            title: 'New Case',
            province: selectedProvince,
            flow_step: 'triage',
            status: 'pending',
            ...programCaseFields,
          })
          .select()
          .single();

        if (error) throw error;
        navigate('/triage');
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (loading || processingVerification) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <FlowHeader currentStep="welcome" showProgress={false} />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center py-12">
            <CardContent>
              <Loader2 className="mx-auto h-12 w-12 text-primary mb-4 animate-spin" />
              <h3 className="text-lg font-semibold mb-2">
                {processingVerification ? "Completing verification..." : "Loading..."}
              </h3>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Email verification instructions (just signed up)
  if (justSignedUp) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <FlowHeader currentStep="welcome" showProgress={false} />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>
                We've sent you a verification link to complete registration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">1</span>
                  <span>Open your email inbox (check spam folder too)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">2</span>
                  <span>Click the verification link from Justice-Bot</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">3</span>
                  <span>You'll be signed in and ready to go</span>
                </li>
              </ol>
              <div className="pt-4 border-t">
                <Button 
                  onClick={() => setShowAuthDialog(true)} 
                  variant="outline" 
                  className="w-full"
                >
                  Already verified? Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      </div>
    );
  }

  // Not logged in - prompt to sign in
  if (!user) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
          <title>Welcome | Justice-Bot</title>
        </Helmet>
        <div className="min-h-screen bg-background flex flex-col">
        <FlowHeader currentStep="welcome" showProgress={false} />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome to Justice-Bot</CardTitle>
              <CardDescription>
                Your AI-powered legal preparation assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => setShowAuthDialog(true)} 
                size="lg"
                className="w-full"
              >
                Sign In to Get Started
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Free to start. No credit card required.
              </p>
            </CardContent>
          </Card>
        </main>
        <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      </div>
      </>
    );
  }

  // ============================================
  // STEP 1: GATED ENTRY - Province Selection
  // ============================================
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Get Started | Justice-Bot</title>
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
      <FlowHeader currentStep="welcome" />
      <ProgramBanner />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <FlowProgressIndicator currentStep="welcome" />
        </div>

        {/* Main card */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Let's Begin Your Case</CardTitle>
            <CardDescription className="text-base">
              First, tell us which province you're in. This helps us find the right tribunals and forms for your situation.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Province selector */}
            <div className="space-y-2">
              <Label htmlFor="province" className="text-sm font-medium">
                Your Province or Territory
              </Label>
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger id="province" className="w-full h-12">
                  <SelectValue placeholder="Select your province..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PROVINCE_NAMES).map(([code, name]) => (
                    <SelectItem key={code} value={code}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Primary CTA */}
            <Button
              onClick={handleContinue}
              size="lg"
              className="w-full text-lg py-6 gap-2"
              disabled={!selectedProvince || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Start AI Triage
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>

            {/* Reassurance copy */}
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <Shield className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                No commitment required. We'll help you understand your options. Takes about 2 minutes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What to expect */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">What happens next:</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 justify-center">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">2</span>
              <span className="text-muted-foreground">AI Triage</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-medium flex items-center justify-center">3</span>
              <span className="text-muted-foreground">Upload Evidence</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-medium flex items-center justify-center">4</span>
              <span className="text-muted-foreground">Review Timeline</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-medium flex items-center justify-center">5</span>
              <span className="text-muted-foreground">Generate Documents</span>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
};

export default Welcome;
