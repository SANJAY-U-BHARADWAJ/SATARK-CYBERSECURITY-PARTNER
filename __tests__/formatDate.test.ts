import { analyzeURL } from "@/lib/urlAnalyzer";

describe("analyzeURL security analyzer", () => {
  it("flags high risk for known phishing keywords and suspicious TLDs", () => {
    const result = analyzeURL("http://sbi-kyc-update.xyz/login");
    expect(result.score).toBeGreaterThan(30);
    expect(result.matchedRules.length).toBeGreaterThan(0);
  });

  it("whitelists legitimate banking domains", () => {
    const result = analyzeURL("https://onlinesbi.sbi");
    expect(result.score).toBeLessThanOrEqual(5);
    expect(result.isSafeWhitelisted).toBe(true);
  });

  it("handles empty or benign text safely", () => {
    const result = analyzeURL("");
    expect(result.score).toBe(0);
    expect(result.matchedRules).toEqual([]);
  });
});
