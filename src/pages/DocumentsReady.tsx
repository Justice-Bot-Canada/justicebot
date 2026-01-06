import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { trackEvent } from '@/utils/analytics';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  Download,
  FileText,
  RefreshCw,
  ArrowLeft,
  Upload,
} from 'lucide-react';

export default function DocumentsReady() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('case') || searchParams.get('caseId');
  const [regenerationsUsed, setRegenerationsUsed] = useState(0);
  const maxRegenerations = 2;

  useEffect(() => {
    trackEvent('documents_ready_viewed', { caseId });
    loadRegenerationCount();
  }, [caseId]);

  const loadRegenerationCount = async () => {
    if (!caseId) return;
    // In a full implementation, this would query the database
    // For now, we'll track in local state
    const stored = localStorage.getItem(`regenerations_${caseId}`);
    if (stored) {
      setRegenerationsUsed(parseInt(stored, 10));
    }
  };

  const handleDownload = () => {
    trackEvent('documents_downloaded', { caseId });
    // Navigate to the actual download/export functionality
    navigate(`/smart-documents?case=${caseId}`);
  };

  const handleAddMoreEvidence = () => {
    trackEvent('add_more_evidence_clicked', { caseId, source: 'documents_ready' });
    navigate(`/evidence?case=${caseId}`);
  };

  const canRegenerate = regenerationsUsed < maxRegenerations;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Your Documents Are Ready
            </h1>
            <p className="text-muted-foreground">
              Your court-ready documents have been generated and are ready for download.
            </p>
          </div>

          {/* Documents Available */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                What's Available
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-medium">📄 Book of Documents (PDF)</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-medium">📄 Filing forms (PDF)</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-medium">📄 Step-by-step filing instructions</span>
              </div>
            </CardContent>
          </Card>

          {/* Primary CTA */}
          <div className="text-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white gap-2"
              onClick={handleDownload}
            >
              <Download className="h-5 w-5" />
              Download My Documents
            </Button>
          </div>

          {/* Regeneration Option */}
          <Card className="border-dashed">
            <CardContent className="py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="font-medium flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Need to update your documents?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {canRegenerate
                      ? `You can add more evidence and regenerate documents (${maxRegenerations - regenerationsUsed} of ${maxRegenerations} regenerations remaining)`
                      : 'You have used all available regenerations'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleAddMoreEvidence}
                  disabled={!canRegenerate}
                  className="gap-2 whitespace-nowrap"
                >
                  <RefreshCw className="h-4 w-4" />
                  Add More Evidence
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Regeneration Policy Note */}
          <Alert className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
            <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
              You can update evidence and regenerate documents up to {maxRegenerations} times if needed.
            </AlertDescription>
          </Alert>

          {/* Back Navigation */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          {/* Legal Clarity Footer */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Justice-Bot helps you prepare documents and understand procedure.<br />
              It does not provide legal advice or representation.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
