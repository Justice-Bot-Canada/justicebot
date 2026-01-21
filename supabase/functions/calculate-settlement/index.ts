import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      caseType, 
      injuries, 
      medicalCosts, 
      lostWages, 
      painAndSuffering, 
      liabilityPercentage,
      insuranceCoverage,
      additionalFactors 
    } = await req.json();

    console.log('Settlement calculation request:', { caseType, injuries });

    const prompt = `You are an expert legal settlement calculator for Canadian law. Calculate a realistic settlement range based on the following case details:

**Case Type:** ${caseType}
**Injuries:** ${injuries}
**Medical Costs:** $${medicalCosts || 0}
**Lost Wages:** $${lostWages || 0}
**Pain and Suffering Estimate:** $${painAndSuffering || 0}
**Liability Percentage:** ${liabilityPercentage || 100}%
**Insurance Coverage:** $${insuranceCoverage || 'Unknown'}
**Additional Factors:** ${additionalFactors || 'None'}

Provide a detailed settlement analysis in the following JSON format:
{
  "lowEstimate": <number>,
  "midEstimate": <number>,
  "highEstimate": <number>,
  "recommendedSettlement": <number>,
  "breakdown": {
    "economicDamages": <number>,
    "nonEconomicDamages": <number>,
    "adjustments": <number>
  },
  "factors": [
    "List of factors that increase settlement value",
    "List of factors that decrease settlement value"
  ],
  "recommendations": [
    "Strategic recommendations for settlement negotiation"
  ],
  "comparableCases": [
    "Brief description of similar cases and their outcomes"
  ],
  "timelineEstimate": "Expected timeline for settlement",
  "disclaimer": "Legal disclaimer about settlement estimates"
}

Base your calculations on Canadian personal injury precedents, consider the specific jurisdiction, and provide realistic estimates. Be conservative but fair.`;

    // Use Lovable AI Gateway with Gemini (free tier friendly)
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('AI service not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert legal settlement calculator. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('AI Gateway error:', response.status, errText);
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('AI service quota exceeded.');
      }
      throw new Error(`AI service error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    console.log('Settlement calculation completed successfully');

    return new Response(
      JSON.stringify(analysis),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: unknown) {
    console.error('Settlement calculation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
