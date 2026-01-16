import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RoutingRequest {
  description: string;
  category?: string;
  province?: string;
  amount?: number;
  caseId?: string;
}

interface MatchedRule {
  rule_id: string;
  rule_name: string;
  score: number;
  tribunal: string;
  pathway_id: string;
  recommended_forms: string[];
  timeframe: string;
  filing_fee: string;
  success_rate: number;
  reasoning: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { description, category, province = "ON", amount, caseId }: RoutingRequest = await req.json();

    if (!description || description.trim().length < 10) {
      throw new Error("Description must be at least 10 characters");
    }

    console.log("Pathway router request:", { description: description.slice(0, 100), category, province, amount });

    // Normalize description for keyword matching
    const descLower = description.toLowerCase();
    const words = descLower.split(/\s+/);

    // Fetch all active rules for the province (or rules with no province restriction)
    const { data: rules, error: rulesError } = await supabase
      .from("pathway_rules")
      .select("*")
      .eq("is_active", true)
      .or(`province.eq.${province},province.is.null`)
      .order("priority", { ascending: true });

    if (rulesError) {
      console.error("Error fetching rules:", rulesError);
      throw new Error("Failed to fetch routing rules");
    }

    console.log(`Loaded ${rules?.length || 0} active rules`);

    // Score each rule based on keyword matches
    const matchedRules: MatchedRule[] = [];

    for (const rule of rules || []) {
      let score = 0;
      const matchedKeywords: string[] = [];

      // Check category match (if specified)
      if (category && rule.category && rule.category !== category) {
        continue; // Skip rules that don't match category
      }

      // Score keyword matches
      for (const keyword of rule.issue_keywords || []) {
        const keywordLower = keyword.toLowerCase();
        
        // Exact phrase match (higher score)
        if (descLower.includes(keywordLower)) {
          score += 10;
          matchedKeywords.push(keyword);
        }
        // Word-level match
        else if (words.some(w => w.includes(keywordLower) || keywordLower.includes(w))) {
          score += 3;
          matchedKeywords.push(keyword);
        }
      }

      // Amount-based filtering for money disputes
      if (amount !== undefined && rule.amount_min !== null && rule.amount_max !== null) {
        if (amount >= rule.amount_min && amount <= rule.amount_max) {
          score += 15;
        } else {
          continue; // Skip rules where amount doesn't match
        }
      }

      // Category match bonus
      if (category && rule.category === category) {
        score += 5;
      }

      // Province exact match bonus
      if (rule.province === province) {
        score += 5;
      }

      // Only include rules with positive scores
      if (score > 0) {
        matchedRules.push({
          rule_id: rule.id,
          rule_name: rule.rule_name,
          score,
          tribunal: rule.tribunal,
          pathway_id: rule.pathway_id,
          recommended_forms: rule.recommended_forms || [],
          timeframe: rule.timeframe || "Varies",
          filing_fee: rule.filing_fee || "Varies",
          success_rate: rule.success_rate || 50,
          reasoning: `${rule.reasoning}${matchedKeywords.length > 0 ? ` (matched: ${matchedKeywords.join(", ")})` : ""}`,
        });
      }
    }

    // Sort by score descending
    matchedRules.sort((a, b) => b.score - a.score);

    console.log(`Matched ${matchedRules.length} rules, top: ${matchedRules[0]?.rule_name || "none"}`);

    // If no rules matched, provide a fallback
    if (matchedRules.length === 0) {
      const fallbackResult = {
        recommended_tribunal: "CONSULTATION",
        recommended_pathway: "find-my-path",
        recommended_forms: [],
        confidence_score: 20,
        reasoning: ["Unable to determine specific pathway from description", "Consider providing more details about your situation"],
        alternative_pathways: [],
        matched_rules: [],
      };

      return new Response(JSON.stringify(fallbackResult), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Top match is the recommendation
    const topMatch = matchedRules[0];
    
    // Calculate confidence based on score differential
    const maxScore = topMatch.score;
    const confidenceScore = Math.min(95, Math.max(30, 50 + maxScore * 2));

    // Gather alternatives (different tribunals only)
    const seenTribunals = new Set([topMatch.tribunal]);
    const alternatives = matchedRules
      .filter(r => {
        if (seenTribunals.has(r.tribunal)) return false;
        seenTribunals.add(r.tribunal);
        return true;
      })
      .slice(0, 3)
      .map(r => ({
        tribunal: r.tribunal,
        pathway: r.pathway_id,
        confidence: Math.max(20, confidenceScore - (maxScore - r.score) * 3),
        reasoning: r.reasoning,
        forms: r.recommended_forms,
        timeframe: r.timeframe,
        filing_fee: r.filing_fee,
      }));

    // Compile reasoning
    const reasoning: string[] = [topMatch.reasoning];
    if (topMatch.timeframe) reasoning.push(`Typical timeline: ${topMatch.timeframe}`);
    if (topMatch.filing_fee) reasoning.push(`Filing fee: ${topMatch.filing_fee}`);
    if (topMatch.success_rate) reasoning.push(`Historical success rate: ${topMatch.success_rate}%`);

    const result = {
      recommended_tribunal: topMatch.tribunal,
      recommended_pathway: topMatch.pathway_id,
      recommended_forms: topMatch.recommended_forms,
      confidence_score: confidenceScore,
      reasoning,
      timeframe: topMatch.timeframe,
      filing_fee: topMatch.filing_fee,
      success_rate: topMatch.success_rate,
      alternative_pathways: alternatives,
      matched_rules: matchedRules.slice(0, 5).map(r => ({
        rule_id: r.rule_id,
        rule_name: r.rule_name,
        score: r.score,
        reasoning: r.reasoning,
      })),
    };

    // Save result if user is authenticated
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      try {
        const userClient = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_ANON_KEY") ?? "",
          { global: { headers: { Authorization: authHeader } } }
        );
        
        const { data: { user } } = await userClient.auth.getUser();
        
        if (user) {
          const { error: insertError } = await supabase
            .from("pathway_routing_results")
            .insert({
              user_id: user.id,
              case_id: caseId || null,
              facts: { description, category, province, amount },
              matched_rules: matchedRules.slice(0, 10),
              recommended_tribunal: result.recommended_tribunal,
              recommended_pathway: result.recommended_pathway,
              recommended_forms: result.recommended_forms,
              confidence_score: result.confidence_score,
              reasoning: result.reasoning,
              alternative_pathways: result.alternative_pathways,
            });

          if (insertError) {
            console.error("Failed to save routing result:", insertError);
          } else {
            console.log("Saved routing result for user:", user.id);
          }
        }
      } catch (e) {
        console.error("Auth check failed:", e);
      }
    }

    console.log("Routing complete:", { tribunal: result.recommended_tribunal, confidence: result.confidence_score });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Pathway router error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Routing failed';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
