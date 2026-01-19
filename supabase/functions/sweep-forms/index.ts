import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-service-token',
};

/**
 * DAILY FORM SWEEP - 5:00 AM America/Toronto
 * 
 * Scheduled via cron to:
 * 1. Verify all form source URLs are still valid
 * 2. Check for updated forms on government sites
 * 3. Mark broken forms as deprecated
 * 4. Log sweep results to sweep_runs table
 * 
 * Called by: Cloud Scheduler / pg_cron
 * Requires: x-service-token header for internal calls
 */

interface SweepError {
  form_code: string;
  error: string;
  url?: string;
}

interface SweepResult {
  run_id: string;
  status: 'success' | 'fail';
  forms_checked: number;
  forms_changed: number;
  forms_deprecated: number;
  errors: SweepError[];
  duration_ms: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const serviceToken = Deno.env.get('SWEEP_SERVICE_TOKEN');

  // Verify internal service call
  const providedToken = req.headers.get('x-service-token');
  const authHeader = req.headers.get('Authorization');
  
  // Allow service_role key or service token
  const isServiceCall = providedToken === serviceToken || 
                        authHeader?.includes(supabaseServiceKey);

  if (!isServiceCall && req.method === 'POST') {
    // Check if caller is admin for manual triggers
    if (authHeader) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const token = authHeader.replace('Bearer ', '');
      const { data: userData } = await supabase.auth.getUser(token);
      
      if (userData.user) {
        const { data: isAdmin } = await supabase.rpc('is_admin');
        if (!isAdmin) {
          return new Response(JSON.stringify({ 
            error: 'FORBIDDEN',
            message: 'Admin access required'
          }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    }
  }

  const startTime = Date.now();
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Create sweep run record
  const { data: sweepRun, error: runError } = await supabase
    .from('sweep_runs')
    .insert({
      status: 'running',
      started_at: new Date().toISOString()
    })
    .select()
    .single();

  if (runError) {
    console.error('Failed to create sweep run:', runError);
    return new Response(JSON.stringify({ 
      error: 'SWEEP_INIT_FAILED',
      message: runError.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const runId = sweepRun.id;
  console.log(`Starting sweep run: ${runId}`);

  try {
    // Fetch all active forms
    const { data: forms, error: formsError } = await supabase
      .from('forms')
      .select('id, form_code, pdf_url, source_url, checksum, last_verified_at')
      .eq('status', 'active')
      .eq('is_active', true);

    if (formsError) throw formsError;

    let formsChecked = 0;
    let formsChanged = 0;
    let formsDeprecated = 0;
    const errors: SweepError[] = [];

    // Check each form's URL
    for (const form of forms || []) {
      formsChecked++;
      const urlToCheck = form.source_url || form.pdf_url;

      if (!urlToCheck) {
        console.log(`No URL for form ${form.form_code}`);
        continue;
      }

      try {
        // HEAD request to check if URL is still valid
        const response = await fetch(urlToCheck, { 
          method: 'HEAD',
          headers: {
            'User-Agent': 'Justice-Bot Form Verifier/1.0'
          }
        });

        if (!response.ok) {
          // URL is broken - mark form as deprecated
          console.log(`Form ${form.form_code} URL broken: ${response.status}`);
          
          await supabase
            .from('forms')
            .update({ 
              status: 'deprecated',
              updated_at: new Date().toISOString()
            })
            .eq('id', form.id);

          formsDeprecated++;
          errors.push({
            form_code: form.form_code,
            error: `HTTP ${response.status}`,
            url: urlToCheck
          });
        } else {
          // URL is valid - update last_verified_at
          const contentLength = response.headers.get('content-length');
          const lastModified = response.headers.get('last-modified');
          
          // Simple checksum from content-length + last-modified
          const newChecksum = `${contentLength || 'unknown'}_${lastModified || 'unknown'}`;

          if (form.checksum && form.checksum !== newChecksum) {
            // Form may have been updated
            formsChanged++;
            console.log(`Form ${form.form_code} checksum changed`);
          }

          await supabase
            .from('forms')
            .update({ 
              checksum: newChecksum,
              last_verified_at: new Date().toISOString()
            })
            .eq('id', form.id);
        }
      } catch (fetchError) {
        console.error(`Error checking ${form.form_code}:`, fetchError);
        errors.push({
          form_code: form.form_code,
          error: fetchError instanceof Error ? fetchError.message : 'Fetch failed',
          url: urlToCheck
        });
      }

      // Rate limit: don't hammer the servers
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const duration = Date.now() - startTime;
    const finalStatus = errors.length > (forms?.length || 0) / 2 ? 'fail' : 'success';

    // Update sweep run record
    await supabase
      .from('sweep_runs')
      .update({
        status: finalStatus,
        finished_at: new Date().toISOString(),
        forms_checked: formsChecked,
        forms_changed: formsChanged,
        forms_deprecated: formsDeprecated,
        errors: errors.slice(0, 50), // Limit errors stored
        metadata: {
          duration_ms: duration,
          total_forms: forms?.length || 0
        }
      })
      .eq('id', runId);

    const result: SweepResult = {
      run_id: runId,
      status: finalStatus,
      forms_checked: formsChecked,
      forms_changed: formsChanged,
      forms_deprecated: formsDeprecated,
      errors: errors,
      duration_ms: duration
    };

    console.log(`Sweep complete: ${formsChecked} checked, ${formsDeprecated} deprecated, ${errors.length} errors`);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('Sweep failed:', error);

    // Update sweep run as failed
    await supabase
      .from('sweep_runs')
      .update({
        status: 'fail',
        finished_at: new Date().toISOString(),
        errors: [{ 
          form_code: 'SWEEP', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }],
        metadata: { duration_ms: duration }
      })
      .eq('id', runId);

    return new Response(JSON.stringify({ 
      error: 'SWEEP_FAILED',
      run_id: runId,
      message: error instanceof Error ? error.message : 'Sweep failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
