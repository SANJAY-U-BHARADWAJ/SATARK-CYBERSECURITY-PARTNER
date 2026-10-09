import { maskSensitiveData } from "@/lib/privacyShield";

describe("maskSensitiveData (PII & Privacy Shield)", () => {
  it("masks 16-digit credit and debit card numbers", () => {
    const input = "My card number is 4532 8910 2341 8920";
    const result = maskSensitiveData(input);
    expect(result.maskedText).toContain("[MASKED_ACCOUNT]");
    expect(result.maskedText).not.toContain("4532 8910 2341 8920");
    expect(result.count).toBeGreaterThan(0);
  });

  it("masks 12-digit Aadhaar identity numbers", () => {
    const input = "Here is my aadhaar: 5432 1234 9876";
    const result = maskSensitiveData(input);
    expect(result.maskedText).toContain("[MASKED_AADHAAR]");
    expect(result.maskedText).not.toContain("5432 1234 9876");
  });

  it("masks phone numbers and email addresses", () => {
    const input = "Call me at +91 9876543210 or email test@gmail.com";
    const result = maskSensitiveData(input);
    expect(result.maskedText).toContain("[MASKED_PHONE]");
    expect(result.maskedText).toContain("[MASKED_EMAIL]");
  });

  it("masks OTP numbers securely", () => {
    const input = "Your login OTP is 482910";
    const result = maskSensitiveData(input);
    expect(result.maskedText).toContain("[MASKED_OTP]");
    expect(result.maskedText).not.toContain("482910");
  });
});
