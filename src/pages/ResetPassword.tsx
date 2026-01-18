import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { FlowHeader } from "@/components/FlowHeader";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle recovery token from URL hash or query params
  useEffect(() => {
    const processRecoveryToken = async () => {
      setVerifying(true);
      setError(null);

      try {
        // Check URL hash for implicit flow tokens
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const type = hashParams.get("type");
        const errorDesc = hashParams.get("error_description");

        // Check for error in hash (e.g., otp_expired)
        if (errorDesc) {
          setError(errorDesc.replace(/_/g, " "));
          setVerifying(false);
          return;
        }

        // Check for PKCE code flow (query params)
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get("code");

        if (code) {
          // PKCE flow - exchange code for session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error("[ResetPassword] Code exchange error:", exchangeError);
            setError(exchangeError.message);
            setVerifying(false);
            return;
          }
          if (data.session) {
            setVerified(true);
            // Clean URL
            window.history.replaceState(null, "", "/reset-password");
          }
        } else if (accessToken && (type === "recovery" || type === "signup")) {
          // Implicit flow - set session directly
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          });
          
          if (sessionError) {
            console.error("[ResetPassword] Session error:", sessionError);
            setError(sessionError.message);
            setVerifying(false);
            return;
          }
          
          if (data.session) {
            setVerified(true);
            // Clean URL
            window.history.replaceState(null, "", "/reset-password");
          }
        } else {
          // Check if already authenticated (user navigated directly)
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setVerified(true);
          } else {
            setError("No recovery token found. Please use the link from your email.");
          }
        }
      } catch (err: any) {
        console.error("[ResetPassword] Error:", err);
        setError(err.message || "Failed to verify recovery link");
      } finally {
        setVerifying(false);
      }
    };

    processRecoveryToken();
  }, [location.hash, location.search]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      // Refresh the session to ensure new credentials are stored
      if (data.user) {
        await supabase.auth.refreshSession();
      }
      
      setSuccess(true);
      toast.success("Password updated successfully!");
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err: any) {
      console.error("[ResetPassword] Update error:", err);
      toast.error(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while verifying token
  if (verifying) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
          <title>Reset Password | Justice-Bot</title>
        </Helmet>
        <FlowHeader currentStep="welcome" showProgress={false} />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Verifying your recovery link...</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
          <title>Reset Password | Justice-Bot</title>
        </Helmet>
        <FlowHeader currentStep="welcome" showProgress={false} />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <CardTitle className="text-xl">Link Expired or Invalid</CardTitle>
              <CardDescription>
                {error}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Password reset links expire after 24 hours for security. Please request a new link.
              </p>
              <Button 
                onClick={() => navigate("/welcome")} 
                className="w-full"
              >
                Request New Reset Link
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Show success state
  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
          <title>Password Updated | Justice-Bot</title>
        </Helmet>
        <FlowHeader currentStep="welcome" showProgress={false} />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h2 className="text-xl font-semibold mb-2">Password Updated!</h2>
              <p className="text-muted-foreground mb-4">
                Redirecting you to your dashboard...
              </p>
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Show password reset form
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Set New Password | Justice-Bot</title>
      </Helmet>
      <FlowHeader currentStep="welcome" showProgress={false} />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Set New Password</CardTitle>
            <CardDescription>
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    minLength={6}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  minLength={6}
                  required
                  disabled={loading}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters long
              </p>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || password.length < 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ResetPassword;
