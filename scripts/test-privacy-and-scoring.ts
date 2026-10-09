import { maskSensitiveData } from "../src/lib/privacyShield";
import { computeFinalScore } from "../src/lib/scoring";

console.log("=================================================");
console.log("RUNNING UNIT TESTS FOR PRIVACY SHIELD & SCORING (PHASE 8)");
console.log("=================================================\n");

let passed = 0;
let failed = 0;

function assert(condition: boolean, desc: string) {
  if (condition) {
    passed++;
    console.log(`[PASS] ${desc}`);
  } else {
    failed++;
    console.error(`[FAIL] ${desc}`);
  }
}

// ------------------------------------------------------------------
// SECTION 1: PRIVACY SHIELD TESTS
// ------------------------------------------------------------------
console.log("--- PRIVACY SHIELD UNIT TESTS ---");

// Test 1: Indian Phone Number Masking (+91 format)
const p1 = maskSensitiveData("Call our branch manager at +91 98765 43210 immediately.");
assert(p1.maskedText.includes("[MASKED_PHONE]") && !p1.maskedText.includes("98765"), "Masks +91 Indian phone with spaces");

// Test 2: Standard 10-digit Indian Mobile
const p2 = maskSensitiveData("Contact officer at 9821472910 for bill update.");
assert(p2.maskedText.includes("[MASKED_PHONE]") && !p2.maskedText.includes("9821472910"), "Masks 10-digit mobile number");

// Test 3: Aadhaar 12-digit Identity Masking
const p3 = maskSensitiveData("Your Aadhaar card 5432-1234-9876 is unverified.");
assert(p3.maskedText.includes("[MASKED_AADHAAR]") && !p3.maskedText.includes("5432-1234-9876"), "Masks 12-digit formatted Aadhaar number");

// Test 4: OTP mentions in text
const p4 = maskSensitiveData("Your secret login OTP is 829104. Valid for 5 minutes.");
assert(p4.maskedText.includes("[MASKED_OTP]") && !p4.maskedText.includes("829104"), "Masks 6-digit OTP code");

// Test 5: Hindi Password/OTP (पासवर्ड)
const p5 = maskSensitiveData("सुरक्षा पासवर्ड 4921 किसी के साथ साझा न करें।");
assert(p5.maskedText.includes("[MASKED_OTP]") && !p5.maskedText.includes("4921"), "Masks Hindi OTP mention (पासवर्ड)");

// Test 6: 16-digit Bank Account / Card Sequence
const p6 = maskSensitiveData("Refund will be credited to card 4532 8910 2341 8920.");
assert(p6.maskedText.includes("[MASKED_ACCOUNT]"), "Masks 16-digit bank card sequence");

// Test 7: Email address
const p7 = maskSensitiveData("Reach support at security-alerts@sbi-online.com for help.");
assert(p7.maskedText.includes("[MASKED_EMAIL]") && !p7.maskedText.includes("security-alerts"), "Masks email address");

// Test 8: UPI ID with VPA domain
const p8 = maskSensitiveData("Send Rs 500 processing charge to lotterywinner@paytm to claim.");
assert(p8.maskedText.includes("[MASKED_UPI]") && !p8.maskedText.includes("lotterywinner@paytm"), "Masks UPI VPA address");

// Test 9: Does not over-mask legitimate rupee currency amounts or small dates
const p9 = maskSensitiveData("Amount of Rs 1,450.00 debited on 07-Oct-26.");
assert(!p9.maskedText.includes("[MASKED_ACCOUNT]") && !p9.maskedText.includes("[MASKED_PHONE]"), "Preserves transaction amounts and dates");

// ------------------------------------------------------------------
// SECTION 2: SCORING ENGINE BRANCH TESTS
// ------------------------------------------------------------------
console.log("\n--- SCORING ENGINE BRANCH UNIT TESTS ---");

// Test 10: Standard Combination: 0.25 Rules + 0.25 ML + 0.50 Gemini
// 0.25*30 + 0.25*40 + 0.50*50 = 7.5 + 10 + 25 = 42.5 -> 43 (Spread: 50 - 30 = 20 < 40)
const s1 = computeFinalScore(30, 40, 50, false);
assert(s1.finalScore === 43 && s1.riskLevel === "caution" && !s1.uncertain, "Normal tri-detector calculation: 0.25/0.25/0.50");

// Test 11: Floor Rule Trigger (Rules >= 85 => Final >= 80)
// Without floor rule: 0.25*90 + 0.25*20 + 0.50*20 = 22.5 + 5 + 10 = 37.5 (approx 38).
// Floor rule must force finalScore >= 80!
const s2 = computeFinalScore(90, 20, 20, false);
assert(s2.floorRuleTriggered && s2.finalScore >= 80, "Floor rule forces final score >= 80 when Rules >= 85");

// Test 12: Offline Fallback when Gemini is unavailable (0.50 Rules + 0.50 ML)
// 0.50*60 + 0.50*80 = 30 + 40 = 70
const s3 = computeFinalScore(60, 80, 0, true);
assert(s3.geminiUnavailable && s3.finalScore === 70 && s3.weights.gemini === 0 && s3.weights.rules === 0.5, "Offline fallback uses 0.50 Rules + 0.50 ML");

// Test 13: Detectors Disagree / Uncertainty State (Max - Min >= 40)
// Rules: 10, ML: 20, Gemini: 80 -> diff = 70 >= 40 -> uncertain = true
const s4 = computeFinalScore(10, 20, 80, false);
assert(s4.uncertain && s4.detectorsDisagree, "Detectors disagree uncertainty state triggers when score spread >= 40");

// Test 14: Consensus agreement (Spread < 40 -> uncertain = false)
// Rules: 85, ML: 80, Gemini: 75 -> diff = 10 -> uncertain = false
const s5 = computeFinalScore(85, 80, 75, false);
assert(!s5.uncertain && s5.riskLevel === "danger", "Consensus agreement does not trigger uncertain state");

// Test 15: Safe Risk Level boundary (< 35)
// 0.25*10 + 0.25*10 + 0.50*10 = 10
const s6 = computeFinalScore(10, 10, 10, false);
assert(s6.riskLevel === "safe" && s6.finalScore === 10, "Safe risk level correctly categorized (< 35)");

console.log("\n=================================================");
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED (TOTAL: 15)`);
console.log("=================================================");

if (failed > 0) {
  process.exit(1);
}
