import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Save, 
  FileText, 
  Upload, 
  Clock, 
  Loader2, 
  XCircle,
  CheckCircle,
  Shield
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSignupAnalytics } from "@/hooks/useSignupAnalytics";
import { analytics } from "@/utils/analytics";
import { Link } from "react-router-dom";

interface SaveCaseSignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  venue?: string;
  venueTitle?: string;
}

export default function SaveCaseSignupModal({ 
  open, 
  onOpenChange, 
  onSuccess,
  venue,
  venueTitle
}: SaveCaseSignupModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');

  // Standardized signup analytics - exactly 4 events
  const signupAnalytics = useSignupAnalytics({ source: 'save_case_modal' });

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
          toast.success("Account created! Saving your case...");
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
        toast.success("Welcome back! Saving your case...");
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

  const benefits = [
    { icon: Save, text: "Save your triage results" },
    { icon: FileText, text: "Generate legal documents" },
    { icon: Upload, text: "Upload and store evidence" },
    { icon: Clock, text: "Return anytime to continue" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
        <div className="p-6 pb-4 bg-gradient-to-b from-primary/10 to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-primary/20">
              <Save className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Save your case and documents</h2>
              {venueTitle && (
                <p className="text-sm text-muted-foreground">{venueTitle} case ready</p>
              )}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Create a free account to save your answers, evidence, and access your documents later.
          </p>

          {/* Benefits list */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-muted-foreground">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 pt-2">
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
                autoComplete="email"
              />
              {emailError && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {mode === 'signup' ? 'Create password' : 'Password'}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder={mode === 'signup' ? "At least 6 characters" : "Your password"}
                className={passwordError ? "border-destructive" : ""}
                autoComplete={mode === 'signup' ? "new-password" : "current-password"}
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
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline" target="_blank">
                      Terms
                    </Link>{" "}
                    &{" "}
                    <Link to="/privacy" className="text-primary hover:underline" target="_blank">
                      Privacy Policy
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
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'signup' ? 'Creating account...' : 'Signing in...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === 'signup' ? 'Save my case' : 'Sign in & save'}
                </>
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                className="text-sm text-primary hover:underline"
              >
                {mode === 'signup' 
                  ? 'Already have an account? Sign in' 
                  : 'Need an account? Sign up free'}
              </button>
            </div>

            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" />
              Your data is encrypted and never sold.
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}