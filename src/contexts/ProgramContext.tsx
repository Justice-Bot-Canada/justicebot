import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Program {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  organization: string | null;
  contact_email: string | null;
  is_active: boolean;
  disable_pricing: boolean;
  disable_ai_beyond_procedural: boolean;
  show_no_legal_advice_banner: boolean;
  cohort_batch: string | null;
  max_referrals: number | null;
  referral_count: number;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface ProgramContextValue {
  program: Program | null;
  isLoading: boolean;
  isProgramMode: boolean;
  setProgram: (program: Program | null) => void;
  clearProgram: () => void;
}

const ProgramContext = createContext<ProgramContextValue | undefined>(undefined);

const PROGRAM_STORAGE_KEY = 'justice_bot_program';

export function ProgramProvider({ children }: { children: ReactNode }) {
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load program from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(PROGRAM_STORAGE_KEY);
    if (stored) {
      try {
        setProgram(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem(PROGRAM_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Persist program to sessionStorage when it changes
  useEffect(() => {
    if (program) {
      sessionStorage.setItem(PROGRAM_STORAGE_KEY, JSON.stringify(program));
    }
  }, [program]);

  const clearProgram = () => {
    setProgram(null);
    sessionStorage.removeItem(PROGRAM_STORAGE_KEY);
  };

  return (
    <ProgramContext.Provider
      value={{
        program,
        isLoading,
        isProgramMode: !!program,
        setProgram,
        clearProgram,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
}

export function useProgram() {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error('useProgram must be used within a ProgramProvider');
  }
  return context;
}

// Hook to fetch program by slug
export function useProgramBySlug(slug: string | undefined) {
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    const fetchProgram = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('programs')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (fetchError) {
        setError(fetchError.message);
        setProgram(null);
      } else if (!data) {
        setError('Program not found');
        setProgram(null);
      } else {
        setProgram(data as Program);
      }
      setIsLoading(false);
    };

    fetchProgram();
  }, [slug]);

  return { program, isLoading, error };
}
