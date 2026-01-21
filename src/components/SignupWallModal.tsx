import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Lock, Eye, FileText, MapPin, ListChecks, Loader2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSignupAnalytics } from "@/hooks/useSignupAnalytics";
import { analytics } from "@/utils/analytics";
import { Link } from "react-router-dom";

interface BlurredPreview {
  form: string;
  venue: string;
  nextSteps: string[];
  evidenceChecklist: string[];
}

interface SignupWallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preview: BlurredPreview;
  onSuccess: () => void;
}

export default function SignupWallModal({ 
  open, 
  onOpenChange, 
  preview,
  onSuccess 
}: SignupWallModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');

  // Standardized signup analytics - exactly 4 events
  const signupAnalytics = useSignupAnalytics({ source: 'signup_wall' });

  // Fire signup_view when modal opens (hook handles deduplication)
  useEffect(() => {
    if (open) {
      signupAnalytics.trackSignupView();
    }
  }, [open, signupAnalytics]);

  const validateForm = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    setTermsError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    }

    if (mode === 'signup' && !agreedToTerms) {
      setTermsError("You must agree to continue");
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double-submit
    if (isLoading) return;
    
    // Validate form (no analytics for validation - it's not a backend rejection)
    if (!validateForm()) return;

    if (mode === 'signup') {
      // Fire signup_attempt ONCE - returns false if already fired
      if (!signupAnalytics.trackSignupAttempt(email)) {
        return;
      }
    }

    // Disable button immediately
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              agreed_to_terms: true,
              agreement_date: new Date().toISOString(),
            }
          },
        });

        if (error) {
          // Fire signup_error with error_type (ONLY for backend rejections)
          signupAnalytics.trackSignupError(error.message);
          
          if (error.message.toLowerCase().includes('already registered')) {
            setEmailError("This email is already registered. Try signing in.");
            setMode('signin');
          } else {
            setEmailError(error.message);
          }
          return;
        }

        if (data.session) {
          // SUCCESS: Account created and logged in
          signupAnalytics.trackSignupSuccess(email, 'email');
          toast.success("Account created! Showing your results...");
          onSuccess();
        } else if (data.user) {
          // SUCCESS: Account created, needs email confirmation
          signupAnalytics.trackSignupSuccess(email, 'email_pending');
          toast.success("Check your email to confirm, then come back!");
        }
      } else {
        // Sign in (not signup - no signup analytics)
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          analytics.loginFailed(error.message);
          setEmailError("Invalid email or password");
          return;
        }

        analytics.loginGA4('email');
        toast.success("Welcome back! Showing your results...");
        onSuccess();
      }
    } catch (error) {
      if (mode === 'signup') {
        signupAnalytics.trackSignupError('network_error');
      }
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 gap-0 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left: Blurred Preview */}
          <div className="p-6 bg-muted/50 border-r relative">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Your legal path is ready</h3>
            </div>
            
            <p className="text-xs text-muted-foreground mb-4">
              Preview (unlocked after free account)
            </p>

            {/* Blurred preview content */}
            <div className="space-y-4 relative">
              <div className="blur-sm select-none pointer-events-none">
                <div className="p-3 bg-background rounded-lg border">
                  <p className="text-xs text-muted-foreground">Recommended form</p>
                  <p className="font-semibold text-primary">{preview.form}</p>
                </div>
                
                <div className="p-3 bg-background rounded-lg border mt-2">
                  <p className="text-xs text-muted-foreground">Where to file</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {preview.venue}
                  </p>
                </div>

                <div className="p-3 bg-background rounded-lg border mt-2">
                  <p className="text-xs text-muted-foreground mb-2">Next steps</p>
                  <ul className="space-y-1">
                    {preview.nextSteps.map((step, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <ListChecks className="h-3 w-3 mt-1 text-primary" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-background rounded-lg border mt-2">
                  <p className="text-xs text-muted-foreground mb-2">Evidence checklist</p>
                  <ul className="space-y-1">
                    {preview.evidenceChecklist.map((item, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <FileText className="h-3 w-3 mt-1 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Lock overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-3 bg-background/90 rounded-full shadow-lg border">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Signup Form */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Your legal path is ready.</h2>
              <p className="text-muted-foreground mt-1">
                Create a free account to see which form applies to your situation and what to do next.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Takes under 30 seconds.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  placeholder="you@example.com"
                  className={emailError ? "border-destructive" : ""}
                />
                {emailError && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {emailError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Create a password"
                  className={passwordError ? "border-destructive" : ""}
                />
                {passwordError && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {passwordError}
                  </p>
                )}
              </div>

              {mode === 'signup' && (
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => {
                      setAgreedToTerms(checked as boolean);
                      setTermsError("");
                    }}
                    className={termsError ? "border-destructive" : ""}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link to="/terms" className="text-primary hover:underline" target="_blank">
                        Terms
                      </Link>{" "}
                      +{" "}
                      <Link to="/privacy" className="text-primary hover:underline" target="_blank">
                        Privacy
                      </Link>
                    </label>
                    {termsError && (
                      <p className="text-xs text-destructive">{termsError}</p>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base"
                variant="cta"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'signup' ? 'Creating account...' : 'Signing in...'}
                  </>
                ) : (
                  "Show my result →"
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                  className="text-sm text-primary hover:underline"
                >
                  {mode === 'signup' 
                    ? 'I already have an account (Sign in)' 
                    : 'Create a new account'}
                </button>
              </div>

              <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                We never sell your email.
              </p>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}