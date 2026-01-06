import React from 'react';
import { useProgram } from '@/contexts/ProgramContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

/**
 * Displays the "No Legal Advice" banner for program users.
 * Should be included on key pages where program users interact.
 */
export function ProgramBanner() {
  const { program, isProgramMode } = useProgram();

  if (!isProgramMode || !program?.show_no_legal_advice_banner) {
    return null;
  }

  return (
    <Alert className="rounded-none border-x-0 border-t-0 bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 mb-0 py-3">
      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-900 dark:text-amber-100 font-semibold">
        Important: Procedural Assistance Only
      </AlertTitle>
      <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
        You are using Justice-Bot through <strong>{program.organization || program.name}</strong>. 
        This tool helps organize evidence and prepare documents — <strong>it does not provide legal advice</strong>. 
        No lawyer-client relationship is created. You are responsible for reviewing and filing your own documents.
      </AlertDescription>
    </Alert>
  );
}

/**
 * Footer disclaimer for program pages - more prominent warning.
 */
export function ProgramFooterDisclaimer() {
  const { program, isProgramMode } = useProgram();

  if (!isProgramMode) {
    return null;
  }

  return (
    <div className="bg-muted/50 border-t py-6 mt-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">Legal Notice</p>
            <p>
              Justice-Bot is a self-help legal technology platform. It provides procedural guidance and 
              document preparation assistance only. <strong>It does not provide legal advice</strong>, and 
              using this service does not create a lawyer-client relationship.
            </p>
            <p>
              You are responsible for reviewing all documents before filing. For complex matters or 
              if you are unsure, consult with a licensed legal professional.
            </p>
            {program?.organization && (
              <p className="text-xs mt-2">
                Referred by: {program.organization}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to check if pricing/upsells should be hidden for the current user.
 * Returns true if the user is in a program with pricing disabled.
 */
export function useShouldHidePricing(): boolean {
  const { program, isProgramMode } = useProgram();
  return isProgramMode && (program?.disable_pricing ?? false);
}

/**
 * Hook to check if AI should be limited to procedural guidance only.
 * Returns true if the program has this restriction enabled.
 */
export function useShouldLimitAI(): boolean {
  const { program, isProgramMode } = useProgram();
  return isProgramMode && (program?.disable_ai_beyond_procedural ?? false);
}
