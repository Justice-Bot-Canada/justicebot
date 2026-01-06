import React from 'react';
import { useProgram } from '@/contexts/ProgramContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck } from 'lucide-react';

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
    <Alert className="rounded-none border-x-0 border-t-0 bg-amber-50 dark:bg-amber-950/20 border-amber-200 mb-0">
      <ShieldCheck className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800 dark:text-amber-200">Program Notice</AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-300">
        You are using Justice-Bot through <strong>{program.organization || program.name}</strong>. 
        This tool provides procedural guidance only — not legal advice.
      </AlertDescription>
    </Alert>
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
