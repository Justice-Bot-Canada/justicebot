import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://justice-bot.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { caseId, formCode, formData } = await req.json();
    
    console.log('Generating PDF for case:', caseId, 'form:', formCode);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');
    
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) throw new Error('User not authenticated');

    // Check if user has premium access or free tier eligibility
    const { data: entitlements } = await supabase
      .from('entitlements')
      .select('product_id')
      .eq('user_id', userData.user.id);

    const hasPremiumAccess = entitlements && entitlements.length > 0;
    
    // Check free tier eligibility if no premium access
    let hasFreeAccess = false;
    if (!hasPremiumAccess) {
      const { data: freeEligible } = await supabase.rpc('check_free_tier_eligibility');
      hasFreeAccess = freeEligible === true;
    }
    
    if (!hasPremiumAccess && !hasFreeAccess) {
      return new Response(JSON.stringify({ 
        error: 'Premium access required for PDF generation',
        requiresPayment: true 
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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

    // Get prefilled data if available
    const { data: prefillData } = await supabase
      .from('form_prefill_data')
      .select('extracted_data')
      .eq('case_id', caseId)
      .single();

    // Merge form data with prefilled data
    const mergedData = {
      ...prefillData?.extracted_data?.formFields,
      ...formData
    };

    // Generate PDF content using HTML template
    const pdfContent = generateFormHTML(formTemplate, mergedData);
    
    // For now, return HTML that can be converted to PDF on frontend
    // In production, you'd use a PDF generation service like Puppeteer
    const pdfData = {
      content: pdfContent,
      fileName: `${formCode}_${caseId}_${Date.now()}.pdf`,
      formTitle: formTemplate.title,
      generatedAt: new Date().toISOString()
    };

    // Log PDF generation for analytics
    const { error: logError } = await supabase
      .from('form_usage')
      .insert({
        user_id: userData.user.id,
        case_id: caseId,
        form_id: formTemplate.id,
        field_data: mergedData,
        completion_status: 'pdf_generated'
      });

    if (logError) {
      console.error('Error logging PDF generation:', logError);
    }

    return new Response(JSON.stringify(pdfData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-pdf function:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateFormHTML(formTemplate: any, formData: any): string {
  const currentDate = new Date().toLocaleDateString('en-CA');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${formTemplate.title}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 40px; 
          line-height: 1.4;
          color: #333;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          border-bottom: 2px solid #1e40af;
          padding-bottom: 20px;
        }
        .form-title { 
          font-size: 24px; 
          font-weight: bold; 
          color: #1e40af;
          margin-bottom: 10px;
        }
        .form-subtitle {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
        }
        .section { 
          margin: 25px 0; 
          padding: 15px;
          border: 1px solid #e5e7eb;
          border-radius: 5px;
        }
        .section-title { 
          font-size: 16px; 
          font-weight: bold; 
          color: #1e40af;
          margin-bottom: 15px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 5px;
        }
        .field-group { 
          margin: 15px 0; 
          display: flex;
          align-items: baseline;
        }
        .field-label { 
          font-weight: bold; 
          min-width: 150px;
          margin-right: 15px;
          color: #374151;
        }
        .field-value { 
          border-bottom: 1px solid #333;
          min-width: 200px;
          padding: 2px 5px;
          flex: 1;
        }
        .footer { 
          margin-top: 40px; 
          text-align: center; 
          font-size: 12px; 
          color: #666;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
        .signature-section {
          margin-top: 40px;
          padding: 20px;
          border: 1px solid #e5e7eb;
        }
        .signature-line {
          border-bottom: 1px solid #333;
          width: 300px;
          height: 30px;
          margin: 20px 0;
        }
        @media print {
          body { margin: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="form-title">${formTemplate.title}</div>
        <div class="form-subtitle">Form Code: ${formTemplate.form_code}</div>
        <div class="form-subtitle">Tribunal: ${formTemplate.tribunal_type}</div>
        <div class="form-subtitle">Generated: ${currentDate}</div>
      </div>

      <div class="section">
        <div class="section-title">Applicant Information</div>
        <div class="field-group">
          <div class="field-label">Full Name:</div>
          <div class="field-value">${formData.applicantName || ''}</div>
        </div>
        <div class="field-group">
          <div class="field-label">Address:</div>
          <div class="field-value">${formData.address || ''}</div>
        </div>
        <div class="field-group">
          <div class="field-label">Phone Number:</div>
          <div class="field-value">${formData.phoneNumber || ''}</div>
        </div>
        <div class="field-group">
          <div class="field-label">Email Address:</div>
          <div class="field-value">${formData.email || ''}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Case Details</div>
        <div class="field-group">
          <div class="field-label">Respondent Name:</div>
          <div class="field-value">${formData.respondentName || ''}</div>
        </div>
        <div class="field-group">
          <div class="field-label">Incident Date:</div>
          <div class="field-value">${formData.incidentDate || ''}</div>
        </div>
        <div class="field-group">
          <div class="field-label">Claim Amount:</div>
          <div class="field-value">${formData.claimAmount || ''}</div>
        </div>
        <div class="field-group">
          <div class="field-label">Description:</div>
          <div class="field-value">${formData.description || ''}</div>
        </div>
      </div>

      ${formTemplate.category === 'Landlord and Tenant' ? `
      <div class="section">
        <div class="section-title">Rental Information</div>
        <div class="field-group">
          <div class="field-label">Property Address:</div>
          <div class="field-value">${formData.propertyAddress || ''}</div>
        </div>
        <div class="field-group">
          <div class="field-label">Monthly Rent:</div>
          <div class="field-value">${formData.monthlyRent || ''}</div>
        </div>
        <div class="field-group">
          <div class="field-label">Lease Start Date:</div>
          <div class="field-value">${formData.leaseStartDate || ''}</div>
        </div>
      </div>
      ` : ''}

      <div class="signature-section">
        <div class="section-title">Applicant Declaration</div>
        <p>I declare that the information provided in this application is true and complete to the best of my knowledge.</p>
        <div style="display: flex; justify-content: space-between; margin-top: 30px;">
          <div>
            <div class="signature-line"></div>
            <div style="text-align: center; margin-top: 5px;">Applicant Signature</div>
          </div>
          <div>
            <div class="signature-line"></div>
            <div style="text-align: center; margin-top: 5px;">Date</div>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>Generated by Justice Bot - Professional Legal Document Service</p>
        <p>This document was automatically generated based on provided information.</p>
        <p>Please review all information for accuracy before submission.</p>
      </div>
    </body>
    </html>
  `;
}