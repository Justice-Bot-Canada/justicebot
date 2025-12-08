const recalculateMerit = async () => {
  if (!caseData) return;

  setAnalyzing(true);
  try {
    const { data, error } = await supabase.functions.invoke<{
      analysis?: { strengthScore?: number } // expected 0–100
    }>('analyze-case-strength', {
      body: {
        caseDetails: caseData.description || caseDescription || '',
        caseType: caseData.venue || caseType,
        jurisdiction: `${caseData.province}, Canada`,
      },
    });

    if (error) throw error;

    // Normalize to 0–100. If your function returns 0–1, multiply by 100.
    const raw = data?.analysis?.strengthScore ?? 0;
    const newScore = Math.max(0, Math.min(100, Math.round(raw)));

    const { error: updateError } = await supabase
      .from('cases')
      .update({ merit_score: newScore })
      .eq('id', caseId);

    if (updateError) throw updateError;

    setCaseData(prev => (prev ? { ...prev, merit_score: newScore } : prev));

    const venueLabel = getVenueLabel(caseData.venue);
    toast({
      title: "Merit Score Updated",
      description: `Your ${venueLabel} case score: ${newScore}/100`,
    });
  } catch (err: any) {
    console.error('Error analyzing case:', err);
    toast({
      title: "Analysis Error",
      description: err?.message || "Failed to analyze case",
      variant: "destructive",
    });
  } finally {
    setAnalyzing(false);
  }
};
