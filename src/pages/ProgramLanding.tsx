import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useProgramBySlug, useProgram } from '@/contexts/ProgramContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Scale, FileText, CheckCircle, AlertTriangle, ShieldCheck, Upload } from 'lucide-react';
import AuthDialog from '@/components/AuthDialog';
import { toast } from 'sonner';
import { trackEvent } from '@/utils/analytics';

export default function ProgramLanding() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { program, isLoading, error } = useProgramBySlug(slug);
  const { setProgram } = useProgram();
  const { user, loading: authLoading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const referralSource = searchParams.get('ref') || searchParams.get('source') || slug;
  const cohortBatch = searchParams.get('cohort') || program?.cohort_batch;

  // Once program is loaded, set it in context and track view
  useEffect(() => {
    if (program) {
      setProgram(program);
      trackEvent('program_landing_viewed', {
        program_id: program.id,
        program_slug: slug,
        organization: program.organization,
      });
    }
  }, [program, setProgram, slug]);

  const handleStartCase = async () => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    if (!program) return;

    setIsProcessing(true);
    
    trackEvent('program_intake_started', {
      program_id: program.id,
      program_slug: slug,
    });

    try {
      // Increment referral count - wrap in try/catch as function may not exist
      try {
        await supabase.rpc('increment_program_referral', { p_program_slug: program.slug });
      } catch {
        console.log('increment_program_referral not available');
      }

      // Create case with program tagging
      const { data: newCase, error: caseError } = await supabase
        .from('cases')
        .insert({
          user_id: user.id,
          title: `${program.name} Referral`,
          province: 'ON', // Default, will be updated in welcome
          program_id: program.id,
          referral_source: referralSource,
          cohort_batch: cohortBatch,
          program_referral_code: slug,
          flow_step: 'welcome',
        })
        .select()
        .single();

      if (caseError) throw caseError;

      toast.success('Your case has been created');
      navigate('/welcome');
    } catch (err) {
      console.error('Error creating case:', err);
      toast.error('Failed to start case. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Program Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This program link is invalid or no longer active. Please check with your referrer for a valid link.
            </p>
            <Button variant="outline" onClick={() => navigate('/')}>
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            You've Been Referred by {program.organization || program.name}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            This tool helps you organize evidence and prepare court-ready documents for your legal matter.
          </p>
          <p className="text-lg font-semibold text-foreground mt-2">
            No payment is required.
          </p>
        </div>

        {/* What This Tool Does */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              What This Tool Does
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Guides you through questions about your situation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Helps you upload and organize evidence</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Prepares filing-ready documents for court or tribunal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Explains next steps in plain language</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* What This Tool Does NOT Do */}
        <Card className="mb-6 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <AlertTriangle className="h-5 w-5" />
              What This Tool Does NOT Do
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Does not provide legal advice</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Does not replace a lawyer</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Does not submit documents on your behalf</span>
              </li>
            </ul>
            <p className="mt-4 text-sm font-medium text-foreground">
              You remain responsible for reviewing and filing your documents.
            </p>
          </CardContent>
        </Card>

        {/* Privacy & Safety */}
        <Card className="mb-10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Privacy & Safety
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Your information is private and secure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Your agency will not see your personal documents</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Your case is not shared without your consent</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Primary CTA */}
        <div className="mb-6">
          <Button
            size="lg"
            onClick={handleStartCase}
            disabled={isProcessing}
            className="w-full py-6 text-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating your case...
              </>
            ) : (
              'Start My Case'
            )}
          </Button>
        </div>

        {/* Secondary reassurance */}
        <p className="text-center text-sm text-muted-foreground mb-8">
          You can stop and come back at any time. Progress is saved automatically.
        </p>

        {!user && (
          <p className="text-center text-sm text-muted-foreground mb-8">
            Already have an account?{' '}
            <button 
              onClick={() => setShowAuth(true)}
              className="text-primary hover:underline"
            >
              Sign in
            </button>
          </p>
        )}

        {/* Footer Legal Notice */}
        <div className="border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Justice-Bot provides procedural assistance only.<br />
            No lawyer-client relationship is created.
          </p>
        </div>
      </div>

      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
    </div>
  );
}
