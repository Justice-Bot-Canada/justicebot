import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ArrowRight, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/utils/analytics";
import AuthDialog from "@/components/AuthDialog";

interface MeritScoreCTAProps {
  variant?: "hero" | "banner" | "inline";
  className?: string;
}

export const MeritScoreCTA = ({ variant = "banner", className = "" }: MeritScoreCTAProps) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const pendingCreateRef = useRef(false);

  // Detect when user logs in after showing auth dialog
  useEffect(() => {
    if (user && pendingCreateRef.current) {
      pendingCreateRef.current = false;
      setShowAuthDialog(false);
      createCaseAndNavigate();
    }
  }, [user]);

  const handleClick = async () => {
    trackEvent("merit_score_cta_clicked", { variant, isLoggedIn: !!user });

    // If not logged in, show auth dialog
    if (!user) {
      pendingCreateRef.current = true;
      setShowAuthDialog(true);
      return;
    }

    // User is logged in - create case and navigate
    await createCaseAndNavigate();
  };

  const createCaseAndNavigate = async () => {
    const currentUser = user;
    if (!currentUser) {
      // Get fresh session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
    }
    
    const userId = user?.id || (await supabase.auth.getSession()).data.session?.user?.id;
    if (!userId) return;

    setCreating(true);
    try {
      // Create a new case with temporary title
      const { data: newCase, error } = await supabase
        .from("cases")
        .insert({
          user_id: userId,
          title: "New Case - Upload Evidence",
          province: "ON", // Default to Ontario, can be changed later
          status: "pending",
          flow_step: "evidence",
        })
        .select()
        .single();

      if (error) throw error;

      trackEvent("case_created_from_merit_cta", { caseId: newCase.id });
      toast.success("Case created! Upload your evidence to get your merit score.");

      // Navigate to evidence upload with the new case
      navigate(`/evidence?case=${newCase.id}`);
    } catch (err: any) {
      console.error("Error creating case:", err);
      toast.error("Failed to create case. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const isLoading = authLoading || creating;

  if (variant === "hero") {
    return (
      <>
        <div className={`relative ${className}`}>
          {/* Pulsing background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 rounded-xl blur-xl animate-pulse" />
          
          <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-xl p-[2px] sm:p-1">
            <div className="bg-background rounded-lg p-4 sm:p-6 md:p-8">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                    Not sure if you have a legal case?
                  </h3>
                  <p className="text-base sm:text-lg font-medium text-foreground/80 mb-3">
                    Find out now — before deadlines make the decision for you.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground mb-5 max-w-xl mx-auto">
                    Upload your evidence and get a clear, plain-language assessment of your case strength, possible next steps, and the legal forms that may apply — all in one place.
                  </p>
                  <Button
                    size="lg"
                    onClick={handleClick}
                    disabled={isLoading}
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold gap-2 text-sm sm:text-base px-6 py-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        {creating ? "Creating..." : "Loading..."}
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                        Find out if you have a case
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      </>
                    )}
                  </Button>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-4">
                    Private. Secure. Built for Canadian law.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
        />
      </>
    );
  }

  if (variant === "inline") {
    return (
      <>
        <Button
          onClick={handleClick}
          disabled={isLoading}
          className={`gap-2 ${className}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {creating ? "Creating..." : "Loading..."}
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Get My Merit Score
            </>
          )}
        </Button>

        <AuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
        />
      </>
    );
  }

  // Default: banner variant
  return (
    <>
      <div className={`bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border-2 border-amber-500/30 rounded-xl p-6 ${className}`}>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold mb-1">
              Find out now if you have a case
            </h3>
            <p className="text-sm text-muted-foreground">
              Upload evidence and get your merit score — free, instant, private.
            </p>
          </div>
          <Button
            size="lg"
            onClick={handleClick}
            disabled={isLoading}
            className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {creating ? "Creating..." : "Loading..."}
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Upload & Get Score
              </>
            )}
          </Button>
        </div>
      </div>

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
      />
    </>
  );
};

export default MeritScoreCTA;
