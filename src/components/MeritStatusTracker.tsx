import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle, RefreshCw, Scale } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MeritStatusTrackerProps {
  caseId: string;
  onComplete?: (score: number) => void;
  variant?: "compact" | "full";
}

interface MeritStatus {
  merit_status: "pending" | "complete" | "error" | null;
  merit_score: number | null;
  merit_error: string | null;
  merit_updated_at: string | null;
}

export function MeritStatusTracker({ caseId, onComplete, variant = "full" }: MeritStatusTrackerProps) {
  const [status, setStatus] = useState<MeritStatus | null>(null);
  const [polling, setPolling] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const MAX_POLLS = 30; // Max 60 seconds of polling (2s intervals)

  // Fetch current merit status
  const fetchStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("cases")
        .select("merit_status, merit_score, merit_error, merit_updated_at")
        .eq("id", caseId)
        .single();

      if (error) {
        console.error("Error fetching merit status:", error);
        return null;
      }

      setStatus(data as MeritStatus);
      return data as MeritStatus;
    } catch (err) {
      console.error("Failed to fetch merit status:", err);
      return null;
    }
  };

  // Start polling when status is pending
  useEffect(() => {
    if (!caseId) return;

    // Initial fetch
    fetchStatus().then((data) => {
      if (data?.merit_status === "pending") {
        setPolling(true);
      }
    });
  }, [caseId]);

  // Polling effect
  useEffect(() => {
    if (!polling || pollCount >= MAX_POLLS) {
      if (pollCount >= MAX_POLLS) {
        // Timeout - stop polling
        setPolling(false);
      }
      return;
    }

    const interval = setInterval(async () => {
      const data = await fetchStatus();
      setPollCount((c) => c + 1);

      if (data?.merit_status === "complete") {
        setPolling(false);
        if (onComplete && data.merit_score !== null) {
          onComplete(data.merit_score);
        }
      } else if (data?.merit_status === "error") {
        setPolling(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [polling, pollCount, onComplete]);

  // Manual retry
  const handleRetry = async () => {
    setPollCount(0);
    setPolling(true);
    
    // Optionally trigger re-analysis
    try {
      await supabase.functions.invoke("run-case-pipeline", {
        body: { caseId },
      });
    } catch (err) {
      console.error("Failed to trigger pipeline:", err);
    }
  };

  if (!status) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBand = (score: number) => {
    if (score >= 80) return "Very Strong";
    if (score >= 65) return "Strong";
    if (score >= 50) return "Moderate";
    if (score >= 35) return "Fair";
    return "Weak";
  };

  // Compact variant
  if (variant === "compact") {
    if (status.merit_status === "pending") {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Scoring your case...</span>
        </div>
      );
    }

    if (status.merit_status === "complete" && status.merit_score !== null) {
      return (
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" />
          <span className={`font-semibold ${getScoreColor(status.merit_score)}`}>
            {status.merit_score}/100
          </span>
          <Badge variant="outline" className="text-xs">
            {getScoreBand(status.merit_score)}
          </Badge>
        </div>
      );
    }

    if (status.merit_status === "error") {
      return (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>Scoring failed</span>
          <Button variant="ghost" size="sm" onClick={handleRetry}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    return null;
  }

  // Full variant
  return (
    <Card>
      <CardContent className="py-6">
        {status.merit_status === "pending" && (
          <div className="text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
            <div>
              <p className="font-semibold">Scoring your case...</p>
              <p className="text-sm text-muted-foreground">
                Analyzing evidence and legal pathways
              </p>
            </div>
            <Progress value={(pollCount / MAX_POLLS) * 100} className="h-2 max-w-xs mx-auto" />
          </div>
        )}

        {status.merit_status === "complete" && status.merit_score !== null && (
          <div className="text-center space-y-4">
            <CheckCircle className="h-10 w-10 mx-auto text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your Case Strength</p>
              <p className={`text-4xl font-bold ${getScoreColor(status.merit_score)}`}>
                {status.merit_score}/100
              </p>
              <Badge variant="outline" className="mt-2">
                {getScoreBand(status.merit_score)}
              </Badge>
            </div>
            {status.merit_updated_at && (
              <p className="text-xs text-muted-foreground">
                Scored {new Date(status.merit_updated_at).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {status.merit_status === "error" && (
          <div className="text-center space-y-4">
            <AlertCircle className="h-10 w-10 mx-auto text-destructive" />
            <div>
              <p className="font-semibold text-destructive">Scoring Failed</p>
              <p className="text-sm text-muted-foreground">
                {status.merit_error || "An error occurred while scoring your case"}
              </p>
            </div>
            <Button onClick={handleRetry} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        )}

        {!status.merit_status && (
          <div className="text-center space-y-4">
            <Scale className="h-10 w-10 mx-auto text-muted-foreground/50" />
            <div>
              <p className="font-medium">No score yet</p>
              <p className="text-sm text-muted-foreground">
                Upload evidence to get your case assessed
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
