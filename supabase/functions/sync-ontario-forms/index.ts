import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://justice-bot.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Ontario court forms registry - sourced from https://ontariocourtforms.on.ca/en/
const ONTARIO_FORMS_REGISTRY = [
  // LTB Forms
  {
    form_code: 'ON-LTB-T2',
    title: 'T2 Application - Tenant Rights',
    description: 'Application about tenant rights - maintenance, vital services, harassment, or illegal entry',
    tribunal_type: 'Landlord and Tenant Board',
    category: 'tenant_rights',
    pdf_url: 'https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T2.pdf',
    price_cents: 0,
    is_active: true,
    purchasable: false
  },
  {
    form_code: 'ON-LTB-T6',
    title: 'T6 Application - Maintenance',
    description: 'Application about maintenance issues affecting health, safety, housing standards',
    tribunal_type: 'Landlord and Tenant Board',
    category: 'maintenance',
    pdf_url: 'https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T6.pdf',
    price_cents: 0,
    is_active: true,
    purchasable: false
  },
  {
    form_code: 'ON-LTB-L1',
    title: 'L1 Application - Rent Arrears',
    description: 'Application to evict a tenant for non-payment of rent and to collect rent owed',
    tribunal_type: 'Landlord and Tenant Board',
    category: 'rent_arrears',
    pdf_url: 'https://tribunalsontario.ca/documents/ltb/Landlord%20Applications%20&%20Instructions/L1.pdf',
    price_cents: 0,
    is_active: true,
    purchasable: false
  },
  
  // HRTO Forms
  {
    form_code: 'ON-HRTO-F1',
    title: 'Form 1 - Application',
    description: 'Human Rights Tribunal of Ontario Application to file a complaint',
    tribunal_type: 'Human Rights Tribunal of Ontario',
    category: 'human_rights',
    pdf_url: 'https://tribunalsontario.ca/documents/hrto/Application%20Forms/Form%201%20Application.pdf',
    price_cents: 0,
    is_active: true,
    purchasable: false
  },
  {
    form_code: 'ON-HRTO-F2',
    title: 'Form 2 - Response',
    description: 'Response to an HRTO application (for respondents)',
    tribunal_type: 'Human Rights Tribunal of Ontario',
    category: 'human_rights',
    pdf_url: 'https://tribunalsontario.ca/documents/hrto/Application%20Forms/Form%202%20-%20Response.pdf',
    price_cents: 0,
    is_active: true,
    purchasable: false
  },
  
  // Small Claims Court Forms
  {
    form_code: 'ON-SCC-7A',
    title: 'Form 7A - Plaintiff\'s Claim',
    description: 'Plaintiff\'s claim form for Small Claims Court',
    tribunal_type: 'Small Claims Court',
    category: 'small_claims',
    pdf_url: 'https://ontariocourtforms.on.ca/static/media/7A.pdf',
    price_cents: 0,
    is_active: true,
    purchasable: false
  },
  {
    form_code: 'ON-SCC-9A',
    title: 'Form 9A - Defence',
    description: 'Defence form for Small Claims Court',
    tribunal_type: 'Small Claims Court',
    category: 'small_claims',
    pdf_url: 'https://ontariocourtforms.on.ca/static/media/9A.pdf',
    price_cents: 0,
    is_active: true,
    purchasable: false
  },
  {
    form_code: 'ON-SCC-11A',
    title: 'Form 11A - Affidavit of Service',
    description: 'Affidavit proving documents were properly served',
    tribunal_type: 'Small Claims Court',
    category: 'small_claims',
    pdf_url: 'https://ontariocourtforms.on.ca/static/media/11A.pdf',
    price_cents: 0,
    is_active: true,
    purchasable: false
  },
  
  // Family Court Forms
  {
    form_code: 'ON-FLR-8',
    title: 'Form 8 - Application (General)',
    description: 'General application form for family court',
    tribunal_type: 'Superior Court of Justice - Family Court',
    category: 'family_law',
    pdf_url: 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/family/8/flr-8-apr24-en-fil.docx',
    price_cents: 0,
    is_active: true,
    purchasable: false
  },
  {
    form_code: 'ON-FLR-13',
    title: 'Form 13 - Financial Statement',
    description: 'Financial statement for family law cases (under $150k income)',
    tribunal_type: 'Superior Court of Justice - Family Court',
    category: 'family_law',
    pdf_url: 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/family/13/flr-13-apr24-en-fil.docx',
    price_cents: 0,
    is_active: true,
    purchasable: false
  },
  {
    form_code: 'ON-FLR-13-1',
    title: 'Form 13.1 - Financial Statement',
    description: 'Financial statement for family law cases (over $150k income)',
    tribunal_type: 'Superior Court of Justice - Family Court',
    category: 'family_law',
    pdf_url: 'https://ontariocourtforms.on.ca/static/media/uploads/courtforms/family/13_1/flr-13-1-sept21-en-fil.docx',
    price_cents: 0,
    is_active: true,
    purchasable: false
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Ontario forms sync...');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate admin user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');
    
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) throw new Error('User not authenticated');

    // Check if user is admin
    const { data: adminData } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', userData.user.id)
      .is('revoked_at', null)
      .single();

    if (!adminData) {
      return new Response(JSON.stringify({ 
        error: 'Admin access required' 
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Syncing ${ONTARIO_FORMS_REGISTRY.length} forms...`);

    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const formData of ONTARIO_FORMS_REGISTRY) {
      try {
        // Check if form exists
        const { data: existing } = await supabase
          .from('forms')
          .select('id')
          .eq('form_code', formData.form_code)
          .single();

        if (existing) {
          // Update existing form
          const { error: updateError } = await supabase
            .from('forms')
            .update({
              title: formData.title,
              description: formData.description,
              pdf_url: formData.pdf_url,
              tribunal_type: formData.tribunal_type,
              category: formData.category,
              price_cents: formData.price_cents,
              is_active: formData.is_active,
              purchasable: formData.purchasable,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);

          if (updateError) throw updateError;
          updated++;
          console.log(`Updated: ${formData.form_code}`);
        } else {
          // Create new form
          const { error: insertError } = await supabase
            .from('forms')
            .insert({
              form_code: formData.form_code,
              title: formData.title,
              description: formData.description,
              pdf_url: formData.pdf_url,
              tribunal_type: formData.tribunal_type,
              category: formData.category,
              price_cents: formData.price_cents,
              is_active: formData.is_active,
              purchasable: formData.purchasable,
              usage_count: 0
            });

          if (insertError) throw insertError;
          created++;
          console.log(`Created: ${formData.form_code}`);
        }
      } catch (error) {
        console.error(`Error processing ${formData.form_code}:`, error);
        errors++;
      }
    }

    return new Response(JSON.stringify({
      success: true,
      summary: {
        total: ONTARIO_FORMS_REGISTRY.length,
        created,
        updated,
        errors
      },
      message: `Sync complete: ${created} created, ${updated} updated, ${errors} errors`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in sync-ontario-forms:', error);
    return new Response(JSON.stringify({ 
      error: (error as Error).message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
