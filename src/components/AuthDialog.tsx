import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Password validation rules
const PASSWORD_MIN_LENGTH = 6;

export default function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Lock body scroll when dialog is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Real-time password validation feedback
  const passwordValidation = useMemo(() => ({
    minLength: password.length >= PASSWORD_MIN_LENGTH,
    hasContent: password.length > 0,
  }), [password]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailError("");
    
    // Track login attempt
    analytics.signupAttempt(email);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        analytics.signupFailed(`login_${error.message}`);
        // User-friendly error messages
        if (error.message.toLowerCase().includes('invalid')) {
          setEmailError("Invalid email or password. Please try again.");
        } else {
          toast({
            title: "Sign In Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        analytics.signUp('email_login');
        toast({
          title: "Welcome back!",
          description: "Redirecting to your dashboard...",
        });
        onOpenChange(false);
        navigate('/dashboard');
      }
    } catch (error) {
      analytics.signupFailed('login_unexpected_error');
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double-submit
    if (isLoading) return;
    
    setSubmitAttempted(true);
    setEmailError("");
    setPasswordError("");
    setTermsError("");
    
    let hasError = false;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    // Validate password with visible error
    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (!passwordValidation.minLength) {
      setPasswordError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
      hasError = true;
    }

    // Validate terms with visible error
    if (!agreedToTerms) {
      setTermsError("You must agree to continue");
      hasError = true;
    }
    
    // Stop if any validation failed
    if (hasError) {
      analytics.signupFailed('validation_error');
      return;
    }

    analytics.signupAttempt(email);
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/welcome`;
      
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            agreed_to_terms: true,
            agreement_date: new Date().toISOString(),
          }
        },
      });

      if (error) {
        const errorType = error.message.toLowerCase().includes('already registered') 
          ? 'user_exists' 
          : error.message.toLowerCase().includes('invalid') 
            ? 'invalid_email' 
            : `auth_error:${error.message}`;
        analytics.signupFailed(errorType);
        
        // User-friendly inline error messages
        if (error.message.toLowerCase().includes('already registered')) {
          setEmailError("This email is already registered. Try signing in instead.");
        } else if (error.message.toLowerCase().includes('invalid')) {
          setEmailError("Please check your email format");
        } else {
          toast({
            title: "Signup Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else if (data.user && !data.session) {
        // Email confirmation required
        analytics.signupComplete(email, 'email_pending_confirmation');
        // Fire GA4 sign_up event for Canada funnel
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'sign_up', {
            method: 'email',
            country: 'CA',
          });
        }
        setSignupSuccess(true);
        toast({
          title: "Check Your Email ✓",
          description: "We sent you a confirmation link. Click it to complete signup.",
        });
        // Close dialog and redirect after brief delay
        setTimeout(() => {
          onOpenChange(false);
          navigate('/triage');
        }, 2000);
      } else {
        // Immediate login (email confirmation disabled in Supabase)
        analytics.signupComplete(email, 'email');
        // Fire GA4 sign_up event for Canada funnel
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'sign_up', {
            method: 'email',
            country: 'CA',
          });
        }
        sessionStorage.setItem('justSignedUp', 'true');
        setSignupSuccess(true);
        toast({
          title: "Account Created ✓",
          description: "Welcome! Redirecting you now...",
        });
        onOpenChange(false);
        navigate('/welcome');
      }
    } catch (error) {
      analytics.signupFailed('unexpected_error');
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px]" 
        role="dialog" 
        aria-labelledby="auth-dialog-title"
        aria-describedby="auth-dialog-description"
      >
        <DialogHeader>
          <DialogTitle id="auth-dialog-title">Welcome to Justice-Bot</DialogTitle>
          <DialogDescription id="auth-dialog-description">
            Sign in to your account or create a new one to get started with your legal case assessment.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="signin" className="w-full" aria-label="Authentication options">
          <TabsList className="grid w-full grid-cols-2" role="tablist">
            <TabsTrigger value="signin" role="tab" aria-controls="signin-panel">Sign In</TabsTrigger>
            <TabsTrigger value="signup" role="tab" aria-controls="signup-panel" onClick={() => analytics.signupClick()}>Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" id="signin-panel" role="tabpanel" aria-labelledby="signin-tab">
            <form onSubmit={handleSignIn} className="space-y-4" aria-label="Sign in form">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  placeholder="you@example.com"
                  required
                  aria-invalid={!!emailError}
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
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-11" disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" id="signup-panel" role="tabpanel" aria-labelledby="signup-tab">
            <form onSubmit={handleSignUp} className="space-y-4" aria-label="Sign up form">
              {/* Micro-copy to reduce hesitation */}
              <p className="text-xs text-muted-foreground text-center">
                Create a free account to see if you qualify
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email <span className="text-destructive">*</span></Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  placeholder="you@example.com"
                  required
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                  className={emailError ? "border-destructive" : ""}
                />
                {emailError && (
                  <p id="email-error" className="text-xs text-destructive flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {emailError}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password <span className="text-destructive">*</span></Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Min 6 characters"
                  required
                  minLength={PASSWORD_MIN_LENGTH}
                  aria-describedby="password-hint"
                  aria-invalid={!!passwordError}
                  className={passwordError || (submitAttempted && !passwordValidation.minLength) ? "border-destructive" : ""}
                />
                {/* Always visible password hint OR error */}
                <div id="password-hint" className="flex items-center gap-1.5 text-xs">
                  {passwordError ? (
                    <>
                      <XCircle className="h-3 w-3 text-destructive" />
                      <span className="text-destructive">{passwordError}</span>
                    </>
                  ) : password.length === 0 ? (
                    <span className="text-muted-foreground">Must be at least {PASSWORD_MIN_LENGTH} characters</span>
                  ) : passwordValidation.minLength ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-green-600">Password looks good!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 text-destructive" />
                      <span className="text-destructive">{PASSWORD_MIN_LENGTH - password.length} more characters needed</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Simplified single agreement with visible error */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => {
                      setAgreedToTerms(checked as boolean);
                      setTermsError("");
                    }}
                    required
                    className={`mt-0.5 ${termsError ? "border-destructive" : ""}`}
                    aria-invalid={!!termsError}
                  />
                  <label htmlFor="terms" className="text-xs leading-tight cursor-pointer text-muted-foreground">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary underline hover:text-primary/80" target="_blank">Terms</Link>,{" "}
                    <Link to="/privacy" className="text-primary underline hover:text-primary/80" target="_blank">Privacy Policy</Link>, and{" "}
                    <Link to="/disclaimer" className="text-primary underline hover:text-primary/80" target="_blank">Disclaimer</Link>
                  </label>
                </div>
                {termsError && (
                  <p className="text-xs text-destructive flex items-center gap-1 ml-6">
                    <XCircle className="h-3 w-3" />
                    {termsError}
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-medium" 
                disabled={isLoading || signupSuccess}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : signupSuccess ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Success! Redirecting...
                  </>
                ) : (
                  "Create Free Account"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}