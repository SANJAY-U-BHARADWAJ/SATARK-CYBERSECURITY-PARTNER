export type RiskLevel = "safe" | "caution" | "danger";

export type Language = string;

export type InputMode = "upi" | "sms" | "url" | "screenshot" | "email";

export interface DetectorScore {
  score: number;
  weight: number;
  label: string;
  detail: string;
}

export interface SuspiciousPhrase {
  phrase: string;
  reason: string;
  severity: "high" | "medium" | "low";
}

export interface ThreatAnalysis {
  id: string;
  inputText: string;
  inputMode: InputMode;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  scamType: string;
  explanation: string;
  nextSteps: string[];
  timestamp: string;
}

export interface SampleMessage {
  id: string;
  title: string;
  titleHi: string;
  category: string;
  riskBadge: RiskLevel;
  text: string;
  type: InputMode;
}
