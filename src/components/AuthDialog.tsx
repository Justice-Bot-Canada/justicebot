import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import { CheckCircle, XCircle } from "lucide-react";

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
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false);
  const [agreedToLiability, setAgreedToLiability] = useState(false);
  const { toast } = useToast();

  // Real-time password validation feedback
  const passwordValidation = useMemo(() => ({
    minLength: password.length >= PASSWORD_MIN_LENGTH,
    hasContent: password.length > 0,
  }), [password]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Track login attempt
    analytics.signupAttempt(email);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        analytics.signupFailed(`login_${error.message}`);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        analytics.signUp('email_login');
        toast({
          title: "Success",
          description: "Signed in successfully!",
        });
        onOpenChange(false);
      }
    } catch (error) {
      analytics.signupFailed('login_unexpected_error');
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track which specific agreements are missing for analytics
    const missingAgreements = [];
    if (!agreedToTerms) missingAgreements.push('terms');
    if (!agreedToPrivacy) missingAgreements.push('privacy');
    if (!agreedToDisclaimer) missingAgreements.push('disclaimer');
    if (!agreedToLiability) missingAgreements.push('liability');

    if (missingAgreements.length > 0) {
      analytics.signupFailed(`missing_agreements:${missingAgreements.join(',')}`);
      toast({
        title: "Agreement Required",
        description: "Please check all the required agreement boxes to continue.",
        variant: "destructive",
      });
      return;
    }

    // Validate password before attempting signup
    if (!passwordValidation.minLength) {
      analytics.signupFailed('password_too_short');
      toast({
        title: "Password Too Short",
        description: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
        variant: "destructive",
      });
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
            agreed_to_privacy: true,
            agreed_to_disclaimer: true,
            agreed_to_liability: true,
            agreement_date: new Date().toISOString(),
          }
        },
      });

      if (error) {
        // Log specific error types for debugging
        const errorType = error.message.toLowerCase().includes('already registered') 
          ? 'user_exists' 
          : error.message.toLowerCase().includes('invalid') 
            ? 'invalid_email' 
            : `auth_error:${error.message}`;
        analytics.signupFailed(errorType);
        
        // User-friendly error messages
        let userMessage = error.message;
        if (error.message.toLowerCase().includes('already registered')) {
          userMessage = "This email is already registered. Try signing in instead.";
        }
        
        toast({
          title: "Signup Error",
          description: userMessage,
          variant: "destructive",
        });
      } else if (data.user && !data.session) {
        // Email confirmation required
        analytics.signupComplete(email, 'email_pending_confirmation');
        toast({
          title: "Check Your Email",
          description: "We sent you a confirmation link. Click it to complete signup.",
        });
        onOpenChange(false);
      } else {
        analytics.signupComplete(email, 'email');
        sessionStorage.setItem('justSignedUp', 'true');
        onOpenChange(false);
        window.location.href = '/welcome';
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" id="signup-panel" role="tabpanel" aria-labelledby="signup-tab">
            <form onSubmit={handleSignUp} className="space-y-4" aria-label="Sign up form">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min 6 characters)"
                  required
                  minLength={PASSWORD_MIN_LENGTH}
                  className={password.length > 0 && !passwordValidation.minLength ? "border-destructive" : ""}
                />
                {/* Password requirements hint */}
                {password.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs">
                    {passwordValidation.minLength ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-destructive" />
                    )}
                    <span className={passwordValidation.minLength ? "text-green-600" : "text-muted-foreground"}>
                      At least {PASSWORD_MIN_LENGTH} characters
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3 pt-2 border-t">
                <p className="text-xs font-semibold text-muted-foreground">
                  Required Legal Agreements:
                </p>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    required
                  />
                  <label htmlFor="terms" className="text-xs leading-tight cursor-pointer">
                    I agree to the <Link to="/terms" className="text-primary underline" target="_blank">Terms of Service</Link>
                  </label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="privacy" 
                    checked={agreedToPrivacy}
                    onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
                    required
                  />
                  <label htmlFor="privacy" className="text-xs leading-tight cursor-pointer">
                    I agree to the <Link to="/privacy" className="text-primary underline" target="_blank">Privacy Policy</Link>
                  </label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="disclaimer" 
                    checked={agreedToDisclaimer}
                    onCheckedChange={(checked) => setAgreedToDisclaimer(checked as boolean)}
                    required
                  />
                  <label htmlFor="disclaimer" className="text-xs leading-tight cursor-pointer">
                    I understand and agree to the <Link to="/disclaimer" className="text-primary underline" target="_blank">Legal Disclaimer</Link>
                  </label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="liability" 
                    checked={agreedToLiability}
                    onCheckedChange={(checked) => setAgreedToLiability(checked as boolean)}
                    required
                  />
                  <label htmlFor="liability" className="text-xs leading-tight cursor-pointer">
                    I acknowledge the <Link to="/liability" className="text-primary underline" target="_blank">Limitation of Liability</Link>
                  </label>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}