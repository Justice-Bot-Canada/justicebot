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
import { useSignupAnalytics } from "@/hooks/useSignupAnalytics";
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
  const [rememberDevice, setRememberDevice] = useState(() => {
    // Default to true if user previously chose to remember, or true by default for convenience
    return localStorage.getItem('jb_remember_device') !== 'false';
  });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Standardized signup analytics - exactly 4 events
  const signupAnalytics = useSignupAnalytics({ source: 'auth_dialog' });

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('jb_remembered_email');
    if (rememberedEmail && rememberDevice) {
      setEmail(rememberedEmail);
    }
  }, []);

  // Lock body scroll when dialog is open + fire signup_view ONCE
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      // Fire signup_view when dialog opens (hook handles deduplication)
      signupAnalytics.trackSignupView();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, signupAnalytics]);

  // Real-time password validation feedback
  const passwordValidation = useMemo(() => ({
    minLength: password.length >= PASSWORD_MIN_LENGTH,
    hasContent: password.length > 0,
  }), [password]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailError("");
    
    // Track login attempt (not signup)
    analytics.loginAttempt(email);

    try {
      // Store remember device preference
      localStorage.setItem('jb_remember_device', rememberDevice ? 'true' : 'false');
      
      // If remember device is enabled, also store email for convenience
      if (rememberDevice) {
        localStorage.setItem('jb_remembered_email', email);
      } else {
        localStorage.removeItem('jb_remembered_email');
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Use loginFailed instead of signupFailed
        analytics.loginFailed(error.message);
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
        // Fire GA4 login event
        analytics.loginGA4('email');
        toast({
          title: "Welcome back!",
          description: "Redirecting to your dashboard...",
        });
        onOpenChange(false);
        navigate('/dashboard');
      }
    } catch (error) {
      analytics.loginFailed('unexpected_error');
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Please enter your email address");
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      // Use Supabase's built-in password reset
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) {
        console.error('[Auth] Password reset error:', error);
        // Show a helpful message even on error (don't reveal if email exists)
        setResetEmailSent(true);
        toast({
          title: "Password Reset",
          description: "If an account exists with this email, you'll receive a reset link. If you don't see it, please contact support@justice-bot.com",
        });
      } else {
        setResetEmailSent(true);
        toast({
          title: "Check your email",
          description: "We've sent you a password reset link. Check spam if you don't see it.",
        });
      }
    } catch (error) {
      console.error('[Auth] Unexpected password reset error:', error);
      // Still show success to not reveal email existence
      setResetEmailSent(true);
      toast({
        title: "Password Reset",
        description: "If an account exists, you'll receive a reset link. Contact support@justice-bot.com for help.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double-submit - button is disabled, but also check state
    if (isLoading) return;
    
    setSubmitAttempted(true);
    setEmailError("");
    setPasswordError("");
    setTermsError("");
    
    let hasError = false;
    
    // Validate email format (NO analytics for validation errors - they don't hit backend)
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
    
    // Stop if validation failed - NO signup_error event (validation is not a backend rejection)
    if (hasError) {
      return;
    }

    // Fire signup_attempt ONCE - this also returns false if already fired (prevents double-click)
    if (!signupAnalytics.trackSignupAttempt(email)) {
      return; // Already submitted, wait for response
    }
    
    // Disable button immediately
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/welcome`;
      
      console.log('[Auth] Attempting signup for:', email);
      
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

      console.log('[Auth] Signup response:', { error: error?.message, hasUser: !!data?.user, hasSession: !!data?.session });

      if (error) {
        console.error('[Auth] Signup error:', error);
        
        // Fire signup_error with error_type (ONLY for backend rejections)
        signupAnalytics.trackSignupError(error.message);
        
        // User-friendly inline error messages
        if (error.message.toLowerCase().includes('already registered')) {
          setEmailError("This email is already registered. Try signing in instead.");
        } else if (error.message.toLowerCase().includes('invalid')) {
          setEmailError("Please check your email format");
        } else if (error.message.toLowerCase().includes('confirmation')) {
          toast({
            title: "Account may have been created",
            description: "There was an issue sending confirmation. Try signing in with these credentials.",
            variant: "default",
          });
        } else {
          toast({
            title: "Signup Error",
            description: error.message,
            variant: "destructive",
          });
        }
        return; // Button re-enabled via resetAttempt in trackSignupError
      }
      
      if (data.session) {
        // SUCCESS: Immediate login - email confirmation is disabled
        console.log('[Auth] Immediate session created');
        
        // Fire signup_success - THE CONVERSION EVENT
        signupAnalytics.trackSignupSuccess(email, 'email');
        
        setSignupSuccess(true);
        toast({
          title: "Account Created ✓",
          description: "Welcome! Redirecting you now...",
        });
        onOpenChange(false);
        navigate('/welcome');
      } else if (data.user && !data.session) {
        // SUCCESS: Email confirmation required
        console.log('[Auth] User created - email confirmation required');
        
        // Fire signup_success - account IS created, just needs confirmation
        signupAnalytics.trackSignupSuccess(email, 'email_pending');
        
        setSignupSuccess(true);
        toast({
          title: "Check Your Email ✓",
          description: "We sent you a confirmation link. Click it to complete signup.",
        });
        setTimeout(() => {
          onOpenChange(false);
          navigate('/triage');
        }, 2000);
      } else {
        // Unexpected state - treat as error
        console.warn('[Auth] Unexpected signup state:', data);
        signupAnalytics.trackSignupError('unexpected_response');
        toast({
          title: "Please try signing in",
          description: "Your account may have been created. Try signing in with these credentials.",
        });
      }
    } catch (error) {
      console.error('[Auth] Unexpected signup error:', error);
      signupAnalytics.trackSignupError('network_error');
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to Justice-Bot</DialogTitle>
          <DialogDescription>
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
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-device"
                  checked={rememberDevice}
                  onCheckedChange={(checked) => setRememberDevice(checked === true)}
                />
                <Label 
                  htmlFor="remember-device" 
                  className="text-sm font-normal text-muted-foreground cursor-pointer"
                >
                  Remember this device
                </Label>
              </div>
              
              {!showForgotPassword ? (
                <>
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
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="w-full text-sm text-primary hover:underline mt-2"
                  >
                    Forgot your password?
                  </button>
                </>
              ) : resetEmailSent ? (
                <div className="text-center space-y-3">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Check your email for a password reset link.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Didn't receive it? Check your spam folder or{" "}
                    <a 
                      href="mailto:support@justice-bot.com?subject=Password Reset Request" 
                      className="text-primary hover:underline"
                    >
                      contact support
                    </a>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmailSent(false);
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Back to sign in
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button 
                    type="button" 
                    onClick={handleForgotPassword}
                    className="w-full h-11" 
                    disabled={isLoading} 
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="w-full text-sm text-muted-foreground hover:underline"
                  >
                    Back to sign in
                  </button>
                </div>
              )}
              
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