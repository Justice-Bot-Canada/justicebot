import { supabase } from "@/integrations/supabase/client";

export interface LeadInput {
  email: string;
  name?: string;
  phone?: string;
  source?: string;
  journey?: string;
  payload?: Record<string, unknown>;
  turnstileToken?: string;
}

export async function submitLead(input: LeadInput) {
  const { data, error } = await supabase.functions.invoke('submit-lead', {
    body: input
  });
  
  if (error) throw error;
  return data;
}

export async function getMyLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}
