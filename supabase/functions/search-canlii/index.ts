import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  query: string;
  jurisdiction?: string;
  maxResults?: number;
}

// Mock data for demonstration - will be replaced with real CanLII API once key is available
function getMockResults(query: string, jurisdiction: string): any[] {
  const queryLower = query.toLowerCase();
  
  // Sample cases that match common search terms
  const mockCases = [
    {
      title: "Smith v. Jones Residential Tenancies",
      citation: "2023 ONLTB 1234 (CanLII)",
      date: "2023-05-15",
      court: "Ontario Landlord and Tenant Board",
      url: "https://www.canlii.org/en/on/onltb/doc/2023/2023onltb1234/2023onltb1234.html",
      summary: "The Board found that the landlord failed to maintain the rental unit in a good state of repair. The tenant was awarded a rent abatement for the period the unit was not properly maintained. Key issues included water damage and mold.",
      keywords: ["landlord", "tenant", "repair", "maintenance", "rent", "abatement", "ltb"],
    },
    {
      title: "Ontario Human Rights Commission v. ABC Corp",
      citation: "2022 HRTO 567 (CanLII)",
      date: "2022-11-20",
      court: "Human Rights Tribunal of Ontario",
      url: "https://www.canlii.org/en/on/onhrt/doc/2022/2022hrto567/2022hrto567.html",
      summary: "The Tribunal found discrimination on the basis of disability. The employer failed to accommodate the applicant's needs. Damages awarded included compensation for injury to dignity and lost wages.",
      keywords: ["discrimination", "disability", "accommodation", "workplace", "human rights", "hrto"],
    },
    {
      title: "R. v. Thompson",
      citation: "2023 ONSC 890 (CanLII)",
      date: "2023-03-10",
      court: "Ontario Superior Court of Justice",
      url: "https://www.canlii.org/en/on/onsc/doc/2023/2023onsc890/2023onsc890.html",
      summary: "The Court considered the appropriate sentence for assault charges. Mitigating factors included the defendant's lack of prior record and early guilty plea. A conditional discharge was granted with probation.",
      keywords: ["criminal", "assault", "sentence", "discharge", "probation"],
    },
    {
      title: "Johnson v. Johnson",
      citation: "2023 ONCJ 456 (CanLII)",
      date: "2023-06-22",
      court: "Ontario Court of Justice",
      url: "https://www.canlii.org/en/on/oncj/doc/2023/2023oncj456/2023oncj456.html",
      summary: "Family law matter involving child custody and access. The Court applied the best interests of the child test. Joint custody was ordered with a detailed parenting schedule to ensure stability for the children.",
      keywords: ["family", "custody", "child", "access", "parenting", "divorce"],
    },
    {
      title: "Brown v. City of Toronto",
      citation: "2022 ONSC 2345 (CanLII)",
      date: "2022-09-15",
      court: "Ontario Superior Court of Justice",
      url: "https://www.canlii.org/en/on/onsc/doc/2022/2022onsc2345/2022onsc2345.html",
      summary: "Negligence claim against municipality for injuries sustained due to poorly maintained sidewalk. The Court found the city liable for failing to conduct adequate inspections and maintain safe public infrastructure.",
      keywords: ["negligence", "municipality", "liability", "personal injury", "sidewalk"],
    },
  ];

  // Filter cases based on query relevance
  const relevantCases = mockCases.filter(caseItem => {
    const searchableText = `${caseItem.title} ${caseItem.summary} ${caseItem.keywords.join(' ')}`.toLowerCase();
    return caseItem.keywords.some(keyword => queryLower.includes(keyword)) || 
           searchableText.includes(queryLower);
  });

  // Calculate relevance scores
  return relevantCases.map(caseItem => {
    const searchableText = `${caseItem.title} ${caseItem.summary}`.toLowerCase();
    const words = queryLower.split(/\s+/);
    let relevance = 0;
    
    words.forEach(word => {
      const matches = (searchableText.match(new RegExp(word, 'gi')) || []).length;
      relevance += matches * 2;
    });
    
    // Boost relevance for keyword matches
    caseItem.keywords.forEach(keyword => {
      if (queryLower.includes(keyword)) {
        relevance += 5;
      }
    });

    return {
      title: caseItem.title,
      citation: caseItem.citation,
      date: caseItem.date,
      court: caseItem.court,
      url: caseItem.url,
      summary: caseItem.summary,
      relevance,
    };
  }).sort((a, b) => b.relevance - a.relevance);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, jurisdiction = 'on', maxResults = 10 }: SearchRequest = await req.json();

    console.log('Searching CanLII (MOCK MODE):', { query, jurisdiction, maxResults });

    // Return mock results for now
    const mockResults = getMockResults(query, jurisdiction);
    const limitedResults = mockResults.slice(0, maxResults);

    console.log(`Found ${limitedResults.length} mock results`);

    return new Response(
      JSON.stringify({
        success: true,
        results: limitedResults,
        query,
        jurisdiction,
        isMockData: true, // Flag to indicate this is demo data
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in mock CanLII search:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
