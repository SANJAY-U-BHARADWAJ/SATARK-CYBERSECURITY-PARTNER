export interface URLAnalysis {
  score: number; // 0 - 100 risk score
  matchedRules: string[];
  isSafeWhitelisted?: boolean;
}

const LEGITIMATE_DOMAINS = [
  "onlinesbi.sbi",
  "sbi.co.in",
  "hdfcbank.com",
  "icicibank.com",
  "axisbank.com",
  "kotak.com",
  "paytm.com",
  "phonepe.com",
  "irctc.co.in",
  "indiapost.gov.in",
  "cybercrime.gov.in",
  "amazon.in",
  "flipkart.com",
  "uidai.gov.in",
  "incometax.gov.in",
];

const INDIAN_BRAND_NAMES = [
  "sbi",
  "yono",
  "hdfc",
  "icici",
  "axis",
  "kotak",
  "paytm",
  "phonepe",
  "gpay",
  "irctc",
  "indiapost",
  "bses",
  "uppcl",
  "tneb",
  "mseb",
];

const SUSPICIOUS_TLDS = [
  ".xyz",
  ".online",
  ".site",
  ".top",
  ".club",
  ".click",
  ".link",
  ".buzz",
  ".live",
  ".work",
  ".loan",
  ".zip",
  ".icu",
  ".rest",
  ".info",
  ".cfd",
  ".gq",
  ".ml",
  ".tk",
];

const URL_SHORTENERS = [
  "bit.ly",
  "tinyurl.com",
  "goo.gl",
  "ow.ly",
  "t.co",
  "is.gd",
  "buff.ly",
  "cutt.ly",
  "rb.gy",
  "shorturl.at",
];

const PHISHING_KEYWORDS = [
  "kyc",
  "verify",
  "verification",
  "refund",
  "reward",
  "update",
  "bonus",
  "claim",
  "pan",
  "aadhar",
  "aadhaar",
  "login",
  "secure",
  "free",
  "lottery",
  "winner",
  "blocked",
];

export function analyzeURL(urlOrText: string): URLAnalysis {
  const text = urlOrText.trim().toLowerCase();
  if (!text) {
    return { score: 0, matchedRules: [] };
  }

  // Extract URLs or domain candidate
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const matches = text.match(urlRegex);
  const candidates: string[] = matches ? Array.from(matches) : [];

  if (candidates.length === 0) {
    // If input looks like domain without protocol: sbi-kyc.xyz or 192.168.1.1/login
    if (
      /^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(text) ||
      /^\d{1,3}(\.\d{1,3}){3}(\/.*)?$/.test(text)
    ) {
      candidates.push(`http://${text}`);
    } else {
      return { score: 0, matchedRules: [] };
    }
  }

  let highestScore = 0;
  const allReasons: string[] = [];
  let isWhitelisted = false;

  for (const rawUrl of candidates) {
    let score = 0;
    const reasons: string[] = [];

    // Check 1: '@' character in URL (used to trick browser credential parsers)
    if (rawUrl.includes("@")) {
      score += 45;
      reasons.push(
        "URL contains '@' sign, which masks the real destination host",
      );
    }

    // Check 2: Very long URL (> 80 characters)
    if (rawUrl.length > 80) {
      score += 15;
      reasons.push(
        "Unusually long URL length (>80 characters) often used to conceal path parameters",
      );
    }

    try {
      const parsed = new URL(rawUrl);
      const domain = parsed.hostname.toLowerCase();
      const pathname = parsed.pathname.toLowerCase();

      // Safe domain whitelist check (matches root domain or exact legitimate subdomains)
      const matchedSafe = LEGITIMATE_DOMAINS.find(
        (safe) => domain === safe || domain.endsWith(`.${safe}`),
      );
      if (matchedSafe && parsed.protocol === "https:") {
        isWhitelisted = true;
        if (highestScore < 5) highestScore = 5;
        continue; // Safe domain, minimal score
      }

      // Check 3: Plain HTTP instead of secure HTTPS
      if (parsed.protocol === "http:") {
        score += 25;
        reasons.push("Unencrypted HTTP protocol used instead of HTTPS");
      }

      // Check 4: IP address host instead of registered domain
      const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
      if (ipRegex.test(domain)) {
        score += 60;
        reasons.push(
          "Direct IP address host used instead of verified registered domain",
        );
      }

      // Check 5: Punycode or non-ASCII characters (homoglyph attack)
      if (domain.startsWith("xn--") || /[^\u0000-\u007F]/.test(domain)) {
        score += 65;
        reasons.push(
          "Punycode / Homoglyph lookalike characters detected in domain",
        );
      }

      // Check 6: Suspicious TLDs
      for (const tld of SUSPICIOUS_TLDS) {
        if (domain.endsWith(tld)) {
          score += 40;
          reasons.push(`Suspicious low-reputation top-level domain (${tld})`);
          break;
        }
      }

      // Check 7: URL shorteners
      if (URL_SHORTENERS.includes(domain)) {
        score += 30;
        reasons.push("URL shortener service hides original target destination");
      }

      // Check 8: Excessive subdomains (>= 3 dot levels in host)
      const hostParts = domain.split(".");
      if (hostParts.length >= 4 && !ipRegex.test(domain)) {
        score += 25;
        reasons.push(
          "Excessive subdomain depth (potential deceptive subdomain spoofing)",
        );
      }

      // Check 9: Lookalike Indian brand name combined with hyphens or non-official domain
      const hasIndianBrand = INDIAN_BRAND_NAMES.some((brand) =>
        domain.includes(brand),
      );
      if (hasIndianBrand && !matchedSafe) {
        score += 45;
        reasons.push(
          "Impersonation of trusted Indian institution/brand in unauthorized domain",
        );
      }

      // Check 10: Phishing keywords in domain or path
      const triggeredKeywords: string[] = [];
      for (const kw of PHISHING_KEYWORDS) {
        if (domain.includes(kw) || pathname.includes(kw)) {
          triggeredKeywords.push(kw);
        }
      }
      if (triggeredKeywords.length > 0) {
        score += Math.min(35, triggeredKeywords.length * 15);
        reasons.push(
          `High-risk security keywords in URL: ${triggeredKeywords.slice(0, 3).join(", ")}`,
        );
      }

      // Check 11: Direct APK/executable download
      if (pathname.endsWith(".apk") || pathname.endsWith(".exe")) {
        score += 60;
        reasons.push(
          "Direct download link for Android package (APK) or executable file",
        );
      }
    } catch {
      score += 30;
      reasons.push("Malformed or invalid URL structure");
    }

    if (score > highestScore) {
      highestScore = score;
    }
    allReasons.push(...reasons);
  }

  const finalScore =
    isWhitelisted && highestScore < 30
      ? 5
      : Math.min(100, Math.max(0, highestScore));

  return {
    score: finalScore,
    matchedRules: Array.from(new Set(allReasons)),
    isSafeWhitelisted: isWhitelisted,
  };
}
