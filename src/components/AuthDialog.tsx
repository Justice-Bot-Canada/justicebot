import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false);
  const [agreedToLiability, setAgreedToLiability] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Signed in successfully!",
        });
        onOpenChange(false);
      }
    } catch (error) {
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
    
    // Validate all legal agreements
    if (!agreedToTerms || !agreedToPrivacy || !agreedToDisclaimer || !agreedToLiability) {
      toast({
        title: "Agreement Required",
        description: "You must agree to all Terms, Privacy Policy, Disclaimer, and Liability agreements to create an account.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = window.location.origin.includes('localhost')
        ? 'https://justice-bot.lovable.app/welcome'
        : `${window.location.origin}/welcome`;
      
      const { error } = await supabase.auth.signUp({
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
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your registration.",
        });
        onOpenChange(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
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
            <TabsTrigger value="signup" role="tab" aria-controls="signup-panel">Sign Up</TabsTrigger>
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
                  placeholder="Create a password"
                  required
                  minLength={6}
                />
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