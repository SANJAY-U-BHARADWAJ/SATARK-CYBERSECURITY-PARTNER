import { analyzeURL } from "../src/lib/urlAnalyzer";

interface TestCase {
  id: number;
  description: string;
  input: string;
  expectedRisk: "safe" | "medium" | "high";
  minScore?: number;
  maxScore?: number;
  expectedRuleSnippet?: string;
}

const testCases: TestCase[] = [
  // Legitimate domains
  { id: 1, description: "Official SBI Portal", input: "https://onlinesbi.sbi/portal", expectedRisk: "safe", maxScore: 10 },
  { id: 2, description: "Official HDFC Netbanking", input: "https://netbanking.hdfcbank.com/netbanking/", expectedRisk: "safe", maxScore: 10 },
  { id: 3, description: "Official ICICI Banking", input: "https://infinity.icicibank.com/corp/AuthenticationController", expectedRisk: "safe", maxScore: 10 },
  { id: 4, description: "Official Paytm Portal", input: "https://paytm.com/recharge", expectedRisk: "safe", maxScore: 10 },
  { id: 5, description: "Official IRCTC Booking", input: "https://www.irctc.co.in/nget/train-search", expectedRisk: "safe", maxScore: 10 },
  { id: 6, description: "Official India Post", input: "https://www.indiapost.gov.in/vas/pages/indiaposthome.aspx", expectedRisk: "safe", maxScore: 10 },
  { id: 7, description: "Official Cybercrime Reporting Portal", input: "https://cybercrime.gov.in/Webform/Index.aspx", expectedRisk: "safe", maxScore: 10 },

  // Phishing brand lookalikes
  { id: 8, description: "SBI Phishing Lookalike", input: "https://sbi-kyc-verify-login.xyz", expectedRisk: "high", minScore: 75, expectedRuleSnippet: "Impersonation" },
  { id: 9, description: "HDFC Reward Scam", input: "http://hdfc-bank-rewards.online/claim", expectedRisk: "high", minScore: 75, expectedRuleSnippet: "Impersonation" },
  { id: 10, description: "ICICI PAN Card Phish", input: "https://icici-pan-update.site/login", expectedRisk: "high", minScore: 75, expectedRuleSnippet: "Impersonation" },
  { id: 11, description: "PhonePe Cashback Fake", input: "https://phonepe-reward-cash.buzz/claim", expectedRisk: "high", minScore: 75, expectedRuleSnippet: "Impersonation" },
  { id: 12, description: "BSES Electricity Lookalike", input: "http://bses-bill-clear.club/pay", expectedRisk: "high", minScore: 70, expectedRuleSnippet: "Impersonation" },

  // Technical evasion checks
  { id: 13, description: "Punycode Homoglyph Domain", input: "https://xn--sbi-8za.com/login", expectedRisk: "high", minScore: 65, expectedRuleSnippet: "Punycode" },
  { id: 14, description: "Direct IP Address Host (HTTP)", input: "http://192.168.1.100/login.php", expectedRisk: "high", minScore: 70, expectedRuleSnippet: "Direct IP" },
  { id: 15, description: "Direct IP Address Host (HTTPS)", input: "https://45.33.32.156/bank-auth", expectedRisk: "high", minScore: 60, expectedRuleSnippet: "Direct IP" },
  { id: 16, description: "Bitly URL Shortener", input: "https://bit.ly/sbi-urgent-alert", expectedRisk: "medium", minScore: 30, expectedRuleSnippet: "shortener" },
  { id: 17, description: "TinyURL Shortener", input: "https://tinyurl.com/39akd29", expectedRisk: "medium", minScore: 30, expectedRuleSnippet: "shortener" },
  { id: 18, description: "Suspicious TLD .xyz with KYC", input: "https://account-update-portal.xyz", expectedRisk: "high", minScore: 50, expectedRuleSnippet: "Suspicious low-reputation" },
  { id: 19, description: "Suspicious TLD .top", input: "https://digital-arrest-customs.top/notice", expectedRisk: "medium", minScore: 40, expectedRuleSnippet: ".top" },
  { id: 20, description: "Unencrypted HTTP Protocol", input: "http://regular-news-site.org/article", expectedRisk: "medium", minScore: 25, expectedRuleSnippet: "Unencrypted HTTP" },
  { id: 21, description: "'@' Sign Authentication Masking", input: "https://google.com@evil-phishing-host.net/login", expectedRisk: "high", minScore: 60, expectedRuleSnippet: "'@' sign" },
  { id: 22, description: "Direct APK Download Link", input: "https://customer-support.net/quick-update.apk", expectedRisk: "high", minScore: 60, expectedRuleSnippet: "APK" },
  { id: 23, description: "Excessive Subdomain Depth", input: "https://sub.portal.secure.banking.evilhost.com/login", expectedRisk: "medium", minScore: 25, expectedRuleSnippet: "Excessive subdomain" },
  { id: 24, description: "Excessively Long URL (>80 chars)", input: "https://bank-notification-system.info/very/long/path/with/lots/of/parameters/designed/to/confuse/the/user/and/mask/the/phish?id=123456789", expectedRisk: "high", minScore: 50, expectedRuleSnippet: "Unusually long" },
  { id: 25, description: "Embedded URL in SMS text", input: "Your account is blocked. Visit https://sbi-kyc-verify-login.xyz now.", expectedRisk: "high", minScore: 75, expectedRuleSnippet: "Impersonation" },
  { id: 26, description: "Bare domain input without schema", input: "icici-update-pan.top", expectedRisk: "high", minScore: 70, expectedRuleSnippet: "Impersonation" },
  { id: 27, description: "Non-URL Plain Message", input: "Hello Mom, please call me when you reach home.", expectedRisk: "safe", maxScore: 0 }
];

console.log("=================================================");
console.log(`RUNNING ${testCases.length} UNIT TESTS FOR URL ANALYZER (PHASE 6)`);
console.log("=================================================\n");

let passed = 0;
let failed = 0;

for (const tc of testCases) {
  const result = analyzeURL(tc.input);
  let ok = true;
  const failureReasons: string[] = [];

  if (tc.maxScore !== undefined && result.score > tc.maxScore) {
    ok = false;
    failureReasons.push(`Score ${result.score} > max allowed ${tc.maxScore}`);
  }
  if (tc.minScore !== undefined && result.score < tc.minScore) {
    ok = false;
    failureReasons.push(`Score ${result.score} < min required ${tc.minScore}`);
  }
  if (tc.expectedRuleSnippet && !result.matchedRules.some(r => r.toLowerCase().includes(tc.expectedRuleSnippet!.toLowerCase()))) {
    ok = false;
    failureReasons.push(`Missing expected rule snippet "${tc.expectedRuleSnippet}"`);
  }

  if (ok) {
    passed++;
    console.log(`[PASS] Test #${tc.id.toString().padStart(2, '0')}: ${tc.description} (Score: ${result.score})`);
  } else {
    failed++;
    console.error(`[FAIL] Test #${tc.id.toString().padStart(2, '0')}: ${tc.description}`);
    console.error(`       Input: "${tc.input}"`);
    console.error(`       Score: ${result.score}, Rules: ${JSON.stringify(result.matchedRules)}`);
    console.error(`       Issues: ${failureReasons.join("; ")}`);
  }
}

console.log("\n=================================================");
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED (TOTAL: ${testCases.length})`);
console.log("=================================================");

if (failed > 0) {
  process.exit(1);
}
