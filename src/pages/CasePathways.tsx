import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/SEOHead";
import { FlowHeader } from "@/components/FlowHeader";
import { MeritStatusTracker } from "@/components/MeritStatusTracker";
import { Scale, FileText, ChevronRight, AlertCircle, Upload, Loader2 } from "lucide-react";
import { CaseAnalysisResults } from "@/components/CaseAnalysisResults";

// Strict UUID validation
const isValidUUID = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

interface CaseData {
  id: string;
  title: string;
  description: string | null;
  province: string;
  venue: string | null;
  merit_score: number | null;
  merit_status: string | null;
  decision_result_json: any;
  status: string | null;
}

interface EvidenceItem {
  id: string;
  file_name: string;
  file_type: string;
  upload_date: string;
}

/**
 * Case-scoped Pathways page: /case/:caseId/pathways
 * Shows evidence, merit score, and legal pathway recommendations.
 */
const CasePathways = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessError, setAccessError] = useState<string | null>(null);

  // Validate + fetch on mount
  useEffect(() => {
    if (!caseId || !isValidUUID(caseId)) {
      setAccessError("Invalid case ID. Please start a new assessment.");
      setLoading(false);
      return;
    }
    if (!user) {
      navigate("/welcome");
      return;
    }
    loadCaseAndEvidence();
  }, [caseId, user]);

  const loadCaseAndEvidence = async () => {
    if (!caseId || !isValidUUID(caseId)) return;
    
    setLoading(true);
    try {
      // Fetch case data
      const { data: caseResult, error: caseError } = await supabase
        .from('cases')
        .select('id, title, description, province, venue, merit_score, merit_status, decision_result_json, status')
        .eq('id', caseId)
        .single();
      
      if (caseError) {
        if (caseError.code === 'PGRST116') {
          setAccessError("This case doesn't exist or you don't have permission to view it.");
        } else {
          setAccessError("Failed to load case. Please try again.");
        }
        setLoading(false);
        return;
      }
      
      setCaseData(caseResult);

      // Fetch evidence for this case
      const { data: evidenceResult } = await supabase
        .from('evidence')
        .select('id, file_name, file_type, upload_date')
        .eq('case_id', caseId)
        .order('upload_date', { ascending: false });
      
      setEvidence(evidenceResult || []);
    } catch (error) {
      console.error('Error loading case:', error);
      setAccessError("Failed to load case data.");
    } finally {
      setLoading(false);
    }
  };

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

  // Error state
  if (accessError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-8 text-center space-y-4">
            <div className="text-4xl">🔒</div>
            <h2 className="text-xl font-semibold">Can't access this case</h2>
            <p className="text-muted-foreground">{accessError}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => navigate("/welcome")}>
                Sign In
              </Button>
              <Button onClick={() => navigate("/triage")}>
                Start New Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !caseId || !caseData) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title={`Case Analysis - ${caseData.title || 'Your Case'} | Justice Bot`}
        description="View your case analysis, merit score, and legal pathway recommendations."
        canonicalUrl={`https://justice-bot.com/case/${caseId}/pathways`}
      />
      <FlowHeader currentStep="documents" caseTitle={caseData.title} />
      
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Case Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              {caseData.title || 'Your Case Analysis'}
            </h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Badge variant="outline">{caseData.venue || 'Legal Matter'}</Badge>
              <span>•</span>
              <span>{caseData.province}</span>
            </div>
          </div>

          {/* Merit Score Card */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Case Merit Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              {caseData.merit_status === 'pending' ? (
                <MeritStatusTracker caseId={caseId} />
              ) : caseData.merit_score !== null ? (
                <div className="text-center py-4">
                  <p className={`text-5xl font-bold ${getScoreColor(caseData.merit_score)}`}>
                    {caseData.merit_score}/100
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {getScoreBand(caseData.merit_score)}
                  </Badge>
                </div>
              ) : (
                <MeritStatusTracker caseId={caseId} />
              )}
            </CardContent>
          </Card>

          {/* Evidence List - Proof of persistence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Your Evidence ({evidence.length})
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/case/${caseId}/evidence`)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Add More
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {evidence.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No evidence uploaded yet.</p>
                  <Button 
                    className="mt-4"
                    onClick={() => navigate(`/case/${caseId}/evidence`)}
                  >
                    Upload Evidence
                  </Button>
                </div>
              ) : (
                <ul className="divide-y">
                  {evidence.map((item) => (
                    <li key={item.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{item.file_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded {new Date(item.upload_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {item.file_type.split('/')[1]?.toUpperCase() || 'FILE'}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Full Analysis Results if available */}
          {caseData.decision_result_json && (
            <CaseAnalysisResults 
              result={{
                success: true,
                caseId: caseId,
                meritScore: caseData.decision_result_json.merit,
                pathways: caseData.decision_result_json.pathways?.primary 
                  ? [caseData.decision_result_json.pathways.primary, ...(caseData.decision_result_json.pathways.secondary || [])]
                  : [],
                formSuggestions: caseData.decision_result_json.forms || [],
                precedents: [],
                evidenceCount: evidence.length,
                analyzedAt: new Date().toISOString(),
              }}
              caseId={caseId}
              onUnlockClick={() => navigate('/pricing')}
            />
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button 
              size="lg" 
              onClick={() => navigate(`/case/${caseId}/evidence`)}
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              Add More Evidence
            </Button>
            <Button 
              size="lg"
              onClick={() => navigate(`/forms/${caseData.venue || 'LTB'}?case=${caseId}`)}
            >
              Generate Documents
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CasePathways;
