import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { PDFDocument, StandardFonts, rgb } from 'https://cdn.skypack.dev/pdf-lib@1.17.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Official form URLs mapped to form codes
const OFFICIAL_FORM_URLS: Record<string, string> = {
  'ON-LTB-T2': 'https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T2.pdf',
  'ON-LTB-T6': 'https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T6.pdf',
  'ON-HRTO-F1': 'https://tribunalsontario.ca/documents/hrto/Application%20Forms/Form%201%20Application.pdf',
  'FC-T-2062-23': 'https://www.fct-cf.ca/Content/assets/pdf/Forms/T2062%20-%20Statement%20of%20Claim%20(Action).pdf',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { caseId, formCode, formData } = await req.json();
    
    console.log('Filling official PDF for case:', caseId, 'form:', formCode);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');
    
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) throw new Error('User not authenticated');

    // Check premium access
    const { data: entitlements } = await supabase
      .from('entitlements')
      .select('product_id')
      .eq('user_id', userData.user.id);

    const hasPremiumAccess = entitlements && entitlements.length > 0;
    
    if (!hasPremiumAccess) {
      const { data: freeEligible } = await supabase.rpc('check_free_tier_eligibility');
      const hasFreeAccess = freeEligible === true;
      
      if (!hasFreeAccess) {
        return new Response(JSON.stringify({ 
          error: 'Premium access required for PDF generation',
          requiresPayment: true 
        }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Get form template
    const { data: formTemplate } = await supabase
      .from('forms')
      .select('*')
      .eq('form_code', formCode)
      .single();

    if (!formTemplate) {
      throw new Error('Form template not found');
    }

    // Get official PDF URL
    const pdfUrl = OFFICIAL_FORM_URLS[formCode];
    
    if (!pdfUrl) {
      console.log('No official PDF found for', formCode, '- falling back to custom generation');
      return new Response(JSON.stringify({ 
        error: 'Official PDF not available for this form',
        fallbackToCustom: true 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Download official PDF
    console.log('Downloading official PDF from:', pdfUrl);
    const pdfResponse = await fetch(pdfUrl);
    
    if (!pdfResponse.ok) {
      throw new Error(`Failed to download PDF: ${pdfResponse.statusText}`);
    }
    
    const pdfBytes = await pdfResponse.arrayBuffer();
    
    // Load the PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    
    // Get all form fields for debugging
    const fields = form.getFields();
    console.log('Available PDF form fields:', fields.map(f => f.getName()));

    // Fill PDF form fields based on formData
    // This mapping will need to be customized per form type
    try {
      fillPDFFields(form, formCode, formData);
    } catch (fillError) {
      console.error('Error filling PDF fields:', fillError);
      // Continue even if some fields fail
    }

    // Flatten the form to make it read-only
    form.flatten();

    // Save the filled PDF
    const filledPdfBytes = await pdfDoc.save();
    
    // Upload to Supabase Storage
    const fileName = `${formCode}_${caseId}_${Date.now()}.pdf`;
    const filePath = `filled-forms/${userData.user.id}/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('legal-docs')
      .upload(filePath, filledPdfBytes, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload PDF: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('legal-docs')
      .getPublicUrl(filePath);

    // Log form generation
    await supabase
      .from('form_usage')
      .insert({
        user_id: userData.user.id,
        case_id: caseId,
        form_id: formTemplate.id,
        field_data: formData,
        completion_status: 'pdf_generated'
      });

    return new Response(JSON.stringify({
      success: true,
      pdfUrl: urlData.publicUrl,
      fileName,
      formTitle: formTemplate.title,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fill-official-pdf function:', error);
    return new Response(JSON.stringify({ 
      error: (error as Error).message,
      stack: (error as Error).stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function fillPDFFields(form: any, formCode: string, formData: any) {
  // Generic field mapping - customize per form type
  const fieldMappings: Record<string, string[]> = {
    // Common fields across forms
    'applicant_name': ['applicantName', 'name', 'fullName', 'appellant_name'],
    'applicant_address': ['address', 'applicantAddress', 'street_address'],
    'applicant_phone': ['phone', 'phoneNumber', 'telephone'],
    'applicant_email': ['email', 'emailAddress', 'e_mail'],
    'respondent_name': ['respondentName', 'defendant', 'landlordName'],
    'incident_date': ['incidentDate', 'dateOfIncident', 'event_date'],
    'description': ['description', 'details', 'particulars'],
    
    // LTB-specific
    'rental_address': ['rentalAddress', 'propertyAddress', 'rental_unit'],
    'monthly_rent': ['monthlyRent', 'rent', 'rental_amount'],
    
    // HRTO-specific
    'discrimination_ground': ['discriminationGround', 'ground', 'protected_ground'],
    
    // Federal Court specific
    'claim_amount': ['claimAmount', 'amount', 'damages_sought'],
  };

  // Try to fill each field in formData
  for (const [dataKey, value] of Object.entries(formData)) {
    if (!value) continue;

    // Get possible PDF field names for this data key
    const possibleFieldNames = fieldMappings[dataKey] || [dataKey];

    // Try each possible field name
    for (const fieldName of possibleFieldNames) {
      try {
        const field = form.getTextField(fieldName);
        field.setText(String(value));
        console.log(`Filled field: ${fieldName} with value: ${value}`);
        break; // Stop trying once we successfully fill a field
      } catch {
        // Field doesn't exist, try next one
        continue;
      }
    }
  }

  // Handle checkboxes
  for (const [dataKey, value] of Object.entries(formData)) {
    if (typeof value === 'boolean') {
      const possibleFieldNames = fieldMappings[dataKey] || [dataKey];
      
      for (const fieldName of possibleFieldNames) {
        try {
          const checkbox = form.getCheckBox(fieldName);
          if (value) {
            checkbox.check();
          } else {
            checkbox.uncheck();
          }
          console.log(`Set checkbox: ${fieldName} to ${value}`);
          break;
        } catch {
          continue;
        }
      }
    }
  }
}
