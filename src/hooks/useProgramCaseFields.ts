import { useProgram } from '@/contexts/ProgramContext';

/**
 * Hook that returns program-specific fields to attach to new cases.
 * Call this when creating a case to automatically tag it with program info.
 */
export function useProgramCaseFields() {
  const { program, isProgramMode } = useProgram();

  if (!isProgramMode || !program) {
    return {};
  }

  return {
    program_id: program.id,
    referral_source: `program:${program.slug}`,
    cohort_batch: program.cohort_batch || null,
    program_referral_code: program.slug,
  };
}
