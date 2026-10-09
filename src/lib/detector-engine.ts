import { ThreatAnalysis, SampleMessage, InputMode } from "./types";
import { maskSensitiveData } from "./privacyShield";

export const SAMPLE_MESSAGES: SampleMessage[] = [
  {
    id: "sample-electricity",
    title: "Electricity Disconnection",
    titleHi: "बिजली बिल डिस्कनेक्शन",
    category: "Utility Fraud",
    riskBadge: "danger",
    type: "sms",
    text: "Dear consumer, your electricity power will be disconnected tonight at 9:30 PM by BSES/UPPCL office because previous month bill was not updated. Please call Electricity Officer immediately at 98214-72910 or download quick bill update APK.",
  },
  {
    id: "sample-customs",
    title: "FedEx Mumbai Customs",
    titleHi: "कस्टम्स पार्सल धमकी",
    category: "Digital Arrest",
    riskBadge: "danger",
    type: "sms",
    text: "Your FedEx parcel #FDX-9921 containing prohibited passport and illegal contraband has been seized at Mumbai Airport Customs. CBI arrest warrant initiated. Call senior investigation officer at 97112-40291 immediately to avoid detention.",
  },
  {
    id: "sample-kyc",
    title: "Bank KYC Expiry Warning",
    titleHi: "बैंक KYC खाता ब्लॉक",
    category: "Banking Phishing",
    riskBadge: "danger",
    type: "sms",
    text: "Dear SBI Customer, your YONO account access will be suspended within 24 hours due to unverified PAN card. Please update your KYC immediately by logging into: https://sbi-kyc-verify-portal.in/login to keep account active.",
  },
  {
    id: "sample-work",
    title: "YouTube Like Work-from-Home",
    titleHi: "घर बैठे लाइक करें कमाई",
    category: "Task Scam",
    riskBadge: "danger",
    type: "sms",
    text: "Earn ₹3,500 to ₹7,500 daily by simply subscribing and liking YouTube videos from home! No experience required. Immediate payout via UPI. Contact HR Sneha on WhatsApp at +91 91234 56789 to claim your starter task bonus.",
  },
  {
    id: "sample-reward",
    title: "Reward Points Expiring",
    titleHi: "क्रेडिट कार्ड रिवॉर्ड पॉइंट",
    category: "Credit Card",
    riskBadge: "caution",
    type: "sms",
    text: "URGENT ALERT: You have 8,940 unclaimed credit card reward points worth ₹4,470 expiring tonight at 11:59 PM. Redeem directly as cash into your account: http://card-reward-claim.online/redeem",
  },
  {
    id: "sample-safe-bank",
    title: "Official HDFC Bank Credit",
    titleHi: "प्रमाणिक बैंक एसएमएस",
    category: "Legitimate Banking",
    riskBadge: "safe",
    type: "sms",
    text: "Your A/C ending 4091 is credited with INR 25,000.00 on 07-Oct-26 by UPI/Ref 4291028471/Salary. Available Bal: INR 62,310.50. Never share your OTP, UPI PIN, or net banking password with anyone - HDFC Bank.",
  },
  {
    id: "sample-safe-courier",
    title: "Amazon Delivery OTP",
    titleHi: "अमेज़न डिलीवरी सूचना",
    category: "Legitimate Courier",
    riskBadge: "safe",
    type: "sms",
    text: "Your Amazon package with order #402-9182741-29182 is out for delivery with agent Ramesh (Phone: 98101XXXXX). Share OTP 4921 ONLY upon receiving the package at your doorstep.",
  },
  {
    id: "sample-lottery",
    title: "KBC Jio Lucky Winner",
    titleHi: "केबीसी लकी ड्रॉ लाटरी",
    category: "Lottery Fraud",
    riskBadge: "danger",
    type: "sms",
    text: "Congratulations! Your SIM number won ₹25,00,000 in KBC Jio Mega Lucky Draw 2026. Send nominal tax fee of ₹12,500 to General Manager Rana Pratap Singh at UPI: kbcmanager@paytm to release cheque.",
  },
];

// maskSensitiveData is now imported from privacyShield.ts

/**
 * Analyzes raw input (text, SMS, URLs, or image base64) for cyber threats using 
 * the backend AI detection engine.
 * 
 * Before transmission, the input is passed through a Privacy Shield to mask any 
 * Personally Identifiable Information (PII) like phone numbers, PAN cards, or banking details.
 * 
 * @param {string} rawInput - The unprocessed user input string or specially formatted base64 image identifier.
 * @param {InputMode} mode - The context of the input (e.g., 'sms', 'url', 'screenshot').
 * @param {string} language - The preferred language for the explanation and next steps (e.g., 'en', 'hi').
 * @returns {Promise<ThreatAnalysis>} A structured analysis object containing the risk score, exact scam type, explanation, and mitigation steps.
 * @throws {Error} Throws if the AI analysis fails or the network request is rejected.
 */
export async function analyzeThreatAsync(
  rawInput: string,
  mode: InputMode,
  language: string
): Promise<ThreatAnalysis> {
  const privacyResult = maskSensitiveData(rawInput);
  
  let imageBase64: string | undefined = undefined;
  let imageMimeType: string | undefined = undefined;
  let maskedText = privacyResult.maskedText;

  // Handle Base64 Image parsing if present in text
  if (maskedText.startsWith("[IMAGE_BASE64:")) {
    const parts = maskedText.split(":");
    imageMimeType = parts[1];
    imageBase64 = parts[2].slice(0, -1); // remove trailing bracket
    maskedText = "Analyze this uploaded screenshot for potential fraud or malicious activity.";
  }

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      maskedText,
      imageBase64,
      imageMimeType,
      language
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to analyze with AI. Please try again.");
  }

  const data = await res.json();
  
  let riskLevel: ThreatAnalysis["riskLevel"] = "safe";
  if (data.riskScore >= 70) riskLevel = "danger";
  else if (data.riskScore >= 35) riskLevel = "caution";

  return {
    id: `scan-${Date.now()}`,
    inputText: rawInput,
    inputMode: mode,
    riskScore: data.riskScore,
    riskLevel,
    scamType: data.scamType,
    explanation: data.explanation,
    nextSteps: data.nextSteps,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

