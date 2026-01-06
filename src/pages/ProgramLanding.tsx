import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useProgramBySlug, useProgram } from '@/contexts/ProgramContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Scale, FileText, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import AuthDialog from '@/components/AuthDialog';
import { toast } from 'sonner';

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

  // Once program is loaded, set it in context
  useEffect(() => {
    if (program) {
      setProgram(program);
    }
  }, [program, setProgram]);

  const handleStartCase = async () => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    if (!program) return;

    setIsProcessing(true);
    try {
      // Increment referral count
      await supabase.rpc('increment_program_referral', { p_program_id: program.id });

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
      {/* No Legal Advice Banner - Always prominent for program users */}
      {program.show_no_legal_advice_banner && (
        <Alert className="rounded-none border-x-0 border-t-0 bg-amber-50 dark:bg-amber-950/20 border-amber-200">
          <ShieldCheck className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-200">Important Disclaimer</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            Justice-Bot provides procedural guidance and document preparation tools only. 
            This is not legal advice. For legal advice, please consult a licensed lawyer or legal aid.
          </AlertDescription>
        </Alert>
      )}

      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Program Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            {program.organization || 'Partner Program'}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {program.name}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {program.description || 
              'A practical tool for people navigating legal processes alone — without replacing legal advice.'}
          </p>
        </div>

        {/* Main CTA Card */}
        <Card className="mb-8 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Get Started with Your Case
            </CardTitle>
            <CardDescription>
              No account is required to start. You'll answer a short triage to understand your options.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Answer a short triage</p>
                  <p className="text-xs text-muted-foreground">Understand your legal situation</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Get process orientation</p>
                  <p className="text-xs text-muted-foreground">Know the correct forms & steps</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Scale className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Prepare documents</p>
                  <p className="text-xs text-muted-foreground">Organize evidence & filings</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={handleStartCase}
                disabled={isProcessing}
                className="px-8"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating your case...
                  </>
                ) : user ? (
                  'Start Your Case'
                ) : (
                  'Sign Up to Start'
                )}
              </Button>
            </div>

            {!user && (
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <button 
                  onClick={() => setShowAuth(true)}
                  className="text-primary hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </CardContent>
        </Card>

        {/* What to Expect */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">1</span>
                <span>Answer a short questionnaire about your situation (5–10 minutes)</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">2</span>
                <span>Receive guidance on which tribunal or court handles your issue</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">3</span>
                <span>Get the correct forms and filing instructions</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">4</span>
                <span>Organize your evidence into a court-ready Book of Documents</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            This program is provided in partnership with {program.organization || 'community organizations'}.
          </p>
          <p className="mt-2">
            Questions? Contact{' '}
            {program.contact_email ? (
              <a href={`mailto:${program.contact_email}`} className="text-primary hover:underline">
                {program.contact_email}
              </a>
            ) : (
              <a href="/contact" className="text-primary hover:underline">
                our support team
              </a>
            )}
          </p>
        </div>
      </div>

      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
    </div>
  );
}
