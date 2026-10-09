/**
 * Analyzes and sanitizes a given text input to mask sensitive Personally Identifiable Information (PII)
 * before it is transmitted to external APIs or displayed in the UI.
 * 
 * Supports masking of Indian formats (e.g., Aadhaar, 10-digit mobile numbers), bank cards, OTPs,
 * Email addresses, and UPI IDs.
 * 
 * @param {string} input - The raw text containing potential sensitive data.
 * @returns {{ maskedText: string, count: number, items: string[] }} An object containing the masked text, total items redacted, and a list of redacted item types.
 */
export function maskSensitiveData(input: string): { maskedText: string; count: number; items: string[] } {
  let masked = input;
  const items: string[] = [];

  // 1. Bank Card Numbers (16 digits formatted: 4532 8910 2341 8920) - Run first to prevent 12-digit partial matching
  const card16Regex = /\b\d{4}[\s-]\d{4}[\s-]\d{4}[\s-]\d{4}\b/g;
  masked = masked.replace(card16Regex, (match) => {
    const cleanNum = match.replace(/[\s-]/g, "");
    items.push(`Card sequence: ${cleanNum.slice(0, 4)}••••`);
    return "[MASKED_ACCOUNT]";
  });

  // 2. Aadhaar-like 12-digit identity numbers (3 groups of 4 digits: 5432 1234 9876)
  const aadhaarRegex = /\b[2-9]\d{3}[\s-]\d{4}[\s-]\d{4}\b/g;
  masked = masked.replace(aadhaarRegex, (match) => {
    const clean = match.replace(/[\s-]/g, "");
    items.push(`Aadhaar Identity Number: ••••••••${clean.slice(8)}`);
    return "[MASKED_AADHAAR]";
  });

  // 3. Indian Phone numbers (+91 formats, 5-5 split, 10 continuous digits)
  const phoneRegex = /(?:\+?91[\s-]?)?[6-9](?:[\s-]?\d){9}\b/g;
  masked = masked.replace(phoneRegex, (match) => {
    const cleanNum = match.replace(/[\s-]/g, "");
    const prefix = cleanNum.startsWith("+91") ? "+91 " : "";
    const coreNum = cleanNum.replace("+91", "");
    items.push(`Phone number: ${prefix}${coreNum.slice(0, 3)}••••••`);
    return "[MASKED_PHONE]";
  });

  // 4. Emails
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  masked = masked.replace(emailRegex, (match) => {
    const [user, domain] = match.split('@');
    items.push(`Email address: ${user.slice(0, 2)}***@${domain}`);
    return "[MASKED_EMAIL]";
  });

  // 5. OTP / PIN mentions (supporting Unicode Devanagari like पासवर्ड)
  const otpRegex = /(?:^|\s|\b)(OTP|code|PIN|पासवर्ड)\s*(is|:|-)?\s*(\d{4,6})\b/gi;
  masked = masked.replace(otpRegex, (match, prefix, separator, digits) => {
    items.push(`Security OTP: ${digits}`);
    const pre = match.startsWith(" ") ? " " : "";
    return `${pre}${prefix} ${separator || ":"} [MASKED_OTP]`;
  });

  // 6. Generic unspaced 12-16 digit account sequences
  const rawDigitsRegex = /\b\d{12,16}\b/g;
  masked = masked.replace(rawDigitsRegex, (match) => {
    items.push(`Account number: ${match.slice(0, 4)}••••`);
    return "[MASKED_ACCOUNT]";
  });

  // 7. UPI IDs
  const upiRegex = /[a-zA-Z0-9._-]+@(okhdfcbank|okaxis|okicici|oksbi|paytm|ybl|ibl|axl|upi)/gi;
  masked = masked.replace(upiRegex, (match) => {
    items.push(`UPI Virtual Payment Address: ${match}`);
    return "[MASKED_UPI]";
  });

  return {
    maskedText: masked,
    count: items.length,
    items,
  };
}
