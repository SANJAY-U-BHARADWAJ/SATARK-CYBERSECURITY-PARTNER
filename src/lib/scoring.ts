export interface ScoringResult {
  finalScore: number;
  riskLevel: "safe" | "caution" | "danger";
  floorRuleTriggered: boolean;
  detectorsDisagree: boolean;
  uncertain: boolean;
  geminiUnavailable: boolean;
  weights: {
    rules: number;
    ml: number;
    gemini: number;
  };
}

export function computeFinalScore(
  rulesScore: number,
  mlScore: number,
  geminiScore: number,
  geminiUnavailable: boolean,
): ScoringResult {
  let finalScore = 0;
  let floorRuleTriggered = false;

  const weights = geminiUnavailable
    ? { rules: 0.5, ml: 0.5, gemini: 0.0 }
    : { rules: 0.25, ml: 0.25, gemini: 0.5 };

  if (geminiUnavailable) {
    // 0.5 rules + 0.5 ML
    finalScore = Math.round(0.5 * rulesScore + 0.5 * mlScore);
  } else {
    // 0.25 rules + 0.25 ML + 0.50 Gemini
    finalScore = Math.round(
      0.25 * rulesScore + 0.25 * mlScore + 0.5 * geminiScore,
    );
  }

  // Floor rule: if rules >= 85 then final >= 80
  if (rulesScore >= 85 && finalScore < 80) {
    finalScore = 80;
    floorRuleTriggered = true;
  }

  // "Detectors disagree" uncertainty state: max - min >= 40
  const scores = geminiUnavailable
    ? [rulesScore, mlScore]
    : [rulesScore, mlScore, geminiScore];

  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const diff = maxScore - minScore;
  const uncertain = diff >= 40;

  // Semantic risk levels (guaranteed icon + label pairing)
  let riskLevel: "safe" | "caution" | "danger" = "safe";
  if (finalScore >= 68) {
    riskLevel = "danger";
  } else if (finalScore >= 35) {
    riskLevel = "caution";
  } else {
    riskLevel = "safe";
  }

  return {
    finalScore: Math.min(100, Math.max(0, finalScore)),
    riskLevel,
    floorRuleTriggered,
    detectorsDisagree: uncertain,
    uncertain,
    geminiUnavailable,
    weights,
  };
}
