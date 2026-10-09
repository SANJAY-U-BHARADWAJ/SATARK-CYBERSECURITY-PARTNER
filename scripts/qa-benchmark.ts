import { analyzeThreatAsync } from "../src/lib/detector-engine";

interface QATestCase {
  id: number;
  category: "scam" | "legitimate" | "tricky";
  description: string;
  input: string;
  expectedVerdict: "danger" | "safe" | "caution";
}

const testCases: QATestCase[] = [
  // 7 Scams
  {
    id: 1,
    category: "scam",
    description: "Electricity Disconnection APK Scam",
    input: "Dear consumer, your electricity power will be disconnected at 9:30 PM tonight by BSES office. Call electricity officer immediately at 98214-72910 or download bill update APK.",
    expectedVerdict: "danger"
  },
  {
    id: 2,
    category: "scam",
    description: "FedEx Mumbai Customs / Digital Arrest",
    input: "Your FedEx parcel #FDX-9921 containing prohibited passport and contraband has been seized at Mumbai Customs. CBI arrest warrant initiated. Call officer at 97112-40291 immediately.",
    expectedVerdict: "danger"
  },
  {
    id: 3,
    category: "scam",
    description: "SBI YONO KYC Phishing Link",
    input: "Dear SBI Customer, your YONO account access will be suspended within 24 hours due to unverified PAN card. Please update KYC immediately at: https://sbi-kyc-verify-portal.in/login",
    expectedVerdict: "danger"
  },
  {
    id: 4,
    category: "scam",
    description: "Part-time YouTube Like Task Scam",
    input: "Earn Rs 3,500 to 7,500 daily by simply subscribing and liking YouTube videos from home! Payout via UPI. Contact HR Sneha on WhatsApp at +91 91234 56789.",
    expectedVerdict: "danger"
  },
  {
    id: 5,
    category: "scam",
    description: "KBC Jio Lucky Winner Lottery",
    input: "Congratulations! Your SIM number won Rs 25,00,000 in KBC Jio Mega Lucky Draw 2026. Send nominal processing fee of Rs 12,500 to UPI: kbcmanager@paytm to release cheque.",
    expectedVerdict: "danger"
  },
  {
    id: 6,
    category: "scam",
    description: "Expiring Credit Card Reward Points",
    input: "URGENT ALERT: You have 8,940 unclaimed credit card reward points worth Rs 4,470 expiring tonight at 11:59 PM. Redeem directly as cash: http://card-reward-claim.online/redeem",
    expectedVerdict: "danger"
  },
  {
    id: 7,
    category: "scam",
    description: "TRAI Mobile Number Disconnection Notice",
    input: "TRAI Notice: Your SIM card will be deactivated within 2 hours due to illegal activity and abusive messaging. Press 9 to connect with verification officer.",
    expectedVerdict: "danger"
  },

  // 7 Legitimate
  {
    id: 8,
    category: "legitimate",
    description: "Official HDFC Bank Salary Credit Alert",
    input: "Your A/C ending 4091 is credited with INR 25,000.00 on 07-Oct-26 by UPI/Ref 4291028471/Salary. Available Bal: INR 62,310.50. Never share your OTP, UPI PIN - HDFC Bank.",
    expectedVerdict: "safe"
  },
  {
    id: 9,
    category: "legitimate",
    description: "Amazon Delivery OTP Alert",
    input: "Your Amazon package with order #402-9182741 is out for delivery with agent Ramesh (Phone: 98101XXXXX). Share OTP 4921 ONLY upon receiving the package at your doorstep.",
    expectedVerdict: "safe"
  },
  {
    id: 10,
    category: "legitimate",
    description: "Bluedart Courier Tracking Update",
    input: "Your shipment #82910291 from LIFESTYLE has been dispatched via Bluedart. Expected delivery by Friday. Track at https://www.bluedart.com",
    expectedVerdict: "safe"
  },
  {
    id: 11,
    category: "legitimate",
    description: "Apartment Society Maintenance Notice",
    input: "Dear Resident, maintenance dues of Rs 3,500 for the month of October are due by 15th. Please pay via society bank account or app. - Palm Heights RWA",
    expectedVerdict: "safe"
  },
  {
    id: 12,
    category: "legitimate",
    description: "Apollo Clinic Doctor Appointment Confirmation",
    input: "Reminder: Your appointment with Dr. Sharma at Apollo Clinic Indiranagar is confirmed for tomorrow at 4:30 PM. Please arrive 10 mins early.",
    expectedVerdict: "safe"
  },
  {
    id: 13,
    category: "legitimate",
    description: "Google Security Sign-in Notification",
    input: "Security alert: A new sign-in to your Google Account from Windows in Mumbai, India was detected. If this was you, you can disregard this alert.",
    expectedVerdict: "safe"
  },
  {
    id: 14,
    category: "legitimate",
    description: "Casual Personal Coffee Meetup Chat",
    input: "Hey Rahul, let us catch up for coffee this evening around 6 PM near the metro station. Let me know if that time works for you!",
    expectedVerdict: "safe"
  },

  // 6 Tricky Inputs
  {
    id: 15,
    category: "tricky",
    description: "Urgent but Legitimate Bank Security Alert",
    input: "ALERT: Transaction of INR 45,000.00 debited from A/C 4091 via NEFT. If not done by you, immediately SMS BLOCK to 567676 or call 18002026161 - HDFC Bank.",
    expectedVerdict: "safe"
  },
  {
    id: 16,
    category: "tricky",
    description: "Hinglish Electricity Disconnection Scam",
    input: "Bijli bill update nahi hua hai. Aaj raat 9:30 baje connection cut ho jayega. Turant call karein 9821472910 par electricity officer ko bill jama karne ke liye.",
    expectedVerdict: "danger"
  },
  {
    id: 17,
    category: "tricky",
    description: "Typo Obfuscated Lottery Scam",
    input: "Conqqratulations! Ur number win 25,00,000 in J-i-o meg-a l0ttery 2026. Contact lottery offiser on Wh-atsApp 9811223344 to claim cheque.",
    expectedVerdict: "danger"
  },
  {
    id: 18,
    category: "tricky",
    description: "Long Newsletter with Mixed Links (>500 chars)",
    input: "Weekly Tech Digest: Top 5 cybersecurity practices for 2026. Keep your two factor authentication active, avoid public wifi for payments, and inspect email sender addresses carefully. Read our complete whitepaper on secure digital habits at https://cybercrime.gov.in/resources/safe-habits.pdf. Published by Open Tech Foundation.",
    expectedVerdict: "safe"
  },
  {
    id: 19,
    category: "tricky",
    description: "Minimal / Single Word Input",
    input: "hello",
    expectedVerdict: "safe"
  },
  {
    id: 20,
    category: "tricky",
    description: "Emoji Only Suspicious Sequence",
    input: "🚨⚠️💳🔥🎉💰",
    expectedVerdict: "safe"
  }
];

console.log("==========================================================================================");
console.log("SATARK QA BENCHMARK: 20 TEST INPUTS (7 SCAMS, 7 LEGITIMATE, 6 TRICKY)");
console.log("==========================================================================================\n");

interface ResultRow {
  id: number;
  description: string;
  category: string;
  score: number;
  verdict: string;
  expected: string;
  status: "PASS" | "WRONG VERDICT";
}

const results: ResultRow[] = [];
let passCount = 0;
let failCount = 0;

async function runTests() {
  for (const tc of testCases) {
    const analysis = await analyzeThreatAsync(tc.input, "sms", "en"); // Run in resilient mode
    const actualVerdict = analysis.riskLevel;

    // For tricky tests, caution is acceptable if expected was safe but contains high urgency words
    const isMatch = actualVerdict === tc.expectedVerdict || (tc.category === "tricky" && tc.expectedVerdict === "safe" && actualVerdict === "caution");
    const status = isMatch ? "PASS" : "WRONG VERDICT";

    if (isMatch) passCount++;
    else failCount++;

  results.push({
    id: tc.id,
    description: tc.description,
    category: tc.category,
    score: analysis.riskScore,
    verdict: actualVerdict,
    expected: tc.expectedVerdict,
    status
  });
}

console.log("| #  | Category   | Description                              | Score | Actual  | Expected | Status |");
console.log("|----|------------|------------------------------------------|-------|---------|----------|--------|");
for (const r of results) {
  const padDesc = r.description.padEnd(40, " ").slice(0, 40);
  const padCat = r.category.padEnd(10, " ");
  const padScore = r.score.toString().padStart(5, " ");
  const padActual = r.verdict.padEnd(7, " ");
  const padExp = r.expected.padEnd(8, " ");
  console.log(`| ${r.id.toString().padStart(2, "0")} | ${padCat} | ${padDesc} | ${padScore} | ${padActual} | ${padExp} | ${r.status} |`);
}

  console.log("\n==========================================================================================");
  console.log(`BENCHMARK SUMMARY: ${passCount} / ${testCases.length} PASSED (${((passCount/testCases.length)*100).toFixed(1)}%)`);
  if (failCount > 0) {
    console.log(`WRONG VERDICTS: ${failCount} (See table above for detailed discrepancy analysis)`);
  }
  console.log("==========================================================================================");
}

runTests().catch(console.error);
