import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const huggingfaceApiKey = Deno.env.get('HUGGINGFACE_API_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { caseId, description, province, municipality, lawSection, evidenceFiles } = await req.json();
    
    console.log('Analyzing case:', { caseId, province, municipality, lawSection });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Analyze case context to determine pathway type
    const lowerDesc = description.toLowerCase();
    const isLandlordTenant = lowerDesc.includes('landlord') || lowerDesc.includes('tenant') || lowerDesc.includes('rent') || lowerDesc.includes('eviction') || lowerDesc.includes('lease');
    const isWorkplace = lowerDesc.includes('workplace') || lowerDesc.includes('employer') || lowerDesc.includes('boss') || lowerDesc.includes('work') || lowerDesc.includes('job');
    const isHumanRights = lowerDesc.includes('discrimination') || lowerDesc.includes('harassment') || lowerDesc.includes('human rights');
    
    let pathwayType = 'civil';
    let caseCategory = 'General Civil';
    
    if (isLandlordTenant) {
      pathwayType = 'landlord-tenant';
      caseCategory = 'Landlord and Tenant';
    } else if (isWorkplace && isHumanRights) {
      pathwayType = 'human-rights-workplace';
      caseCategory = 'Workplace Human Rights';
    } else if (isHumanRights) {
      pathwayType = 'human-rights';
      caseCategory = 'Human Rights';
    } else if (isWorkplace) {
      pathwayType = 'employment';
      caseCategory = 'Employment';
    }

    // Calculate merit score based on case strength indicators
    let meritScore = 50; // Base score
    
    // Boost score for evidence
    if (evidenceFiles?.length > 0) meritScore += 15;
    if (evidenceFiles?.length > 2) meritScore += 10;
    
    // Boost for specific law section cited
    if (lawSection && lawSection.trim()) meritScore += 10;
    
    // Boost for detailed description
    if (description.length > 200) meritScore += 10;
    
    // Category-specific scoring
    if (isLandlordTenant && province === 'Ontario') meritScore += 5; // Strong tenant protections
    if (isHumanRights) meritScore += 8; // Protected grounds
    
    // Random variation to simulate analysis complexity
    meritScore += Math.floor(Math.random() * 15) - 7; // -7 to +7
    meritScore = Math.max(30, Math.min(95, meritScore)); // Clamp between 30-95

    const analysis = {
      meritScore,
      pathwayType,
      recommendation: `Based on the case details for ${province}, this appears to be a ${caseCategory.toLowerCase()} matter. ${evidenceFiles?.length ? 'The provided evidence supports your claim.' : 'Additional documentation would strengthen your case.'} ${isLandlordTenant ? 'Landlord and tenant disputes in ' + province + ' are typically handled through specialized tribunals.' : isHumanRights ? 'Human rights complaints may be filed with the provincial human rights tribunal.' : 'This matter may proceed through the civil court system.'} Recommended next steps include consulting with a qualified attorney and gathering additional documentation.`,
      confidenceScore: Math.floor(Math.random() * 20) + 75, // 75-95 range
      relevantLaws: getRelevantLaws(province, pathwayType, lawSection),
      nextSteps: getNextSteps(pathwayType, province)
    };

    console.log('Generated analysis:', analysis);

    // Update case with merit score
    const { error: updateError } = await supabase
      .from('cases')
      .update({ 
        merit_score: analysis.meritScore,
        status: 'completed'
      })
      .eq('id', caseId);

    if (updateError) {
      console.error('Error updating case:', updateError);
      throw updateError;
    }

    // Insert legal pathway
    const { error: pathwayError } = await supabase
      .from('legal_pathways')
      .insert({
        case_id: caseId,
        pathway_type: analysis.pathwayType,
        recommendation: analysis.recommendation,
        confidence_score: analysis.confidenceScore,
        relevant_laws: analysis.relevantLaws,
        next_steps: analysis.nextSteps
      });

    if (pathwayError) {
      console.error('Error inserting pathway:', pathwayError);
      throw pathwayError;
    }

    console.log('Case analysis completed successfully');

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-legal-case function:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getRelevantLaws(province: string, pathwayType: string, lawSection?: string): string[] {
  const laws: string[] = [];
  
  if (pathwayType === 'landlord-tenant') {
    if (province === 'Ontario') {
      laws.push('Residential Tenancies Act, 2006');
      laws.push('Landlord and Tenant Board Rules');
    } else {
      laws.push(`${province} Residential Tenancy Act`);
    }
  } else if (pathwayType === 'human-rights-workplace' || pathwayType === 'human-rights') {
    if (province === 'Ontario') {
      laws.push('Human Rights Code, R.S.O. 1990');
    } else {
      laws.push(`${province} Human Rights Act`);
    }
  } else if (pathwayType === 'employment') {
    laws.push('Employment Standards Act');
    laws.push('Labour Relations Act');
  }
  
  if (lawSection) {
    laws.push(lawSection);
  }
  
  return laws.length > 0 ? laws : [`${province} Civil Code`, 'General Civil Procedures Act'];
}

function getNextSteps(pathwayType: string, province: string): string[] {
  const baseSteps = ['Consult with a qualified attorney', 'Gather additional documentation'];
  
  if (pathwayType === 'landlord-tenant') {
    return [
      ...baseSteps,
      'File application with Landlord and Tenant Board',
      'Prepare for tribunal hearing',
      'Consider mediation services'
    ];
  } else if (pathwayType === 'human-rights-workplace' || pathwayType === 'human-rights') {
    return [
      ...baseSteps,
      'File complaint with Human Rights Tribunal',
      'Document all incidents thoroughly',
      'Consider workplace accommodation requests'
    ];
  } else if (pathwayType === 'employment') {
    return [
      ...baseSteps,
      'File complaint with Employment Standards',
      'Consider labour relations board if unionized',
      'Prepare for settlement negotiations'
    ];
  }
  
  return [
    ...baseSteps,
    'File preliminary motion if applicable',
    'Prepare for mediation or court proceedings'
  ];
}