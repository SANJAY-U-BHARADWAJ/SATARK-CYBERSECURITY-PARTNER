import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 60;

/**
 * Basic regex sanitization helper to strip dangerous tags like <script> or <iframe>
 * before processing the input.
 * @param {string} input - The raw string input.
 * @returns {string} Sanitized string.
 */
function sanitizeInput(input: string): string {
  if (!input) return "";
  return input.replace(/<\/?(?:script|iframe|object|embed|applet)[^>]*>/gi, "");
}

// 1. Zod input validation schema
const RequestSchema = z
  .object({
    maskedText: z
      .string()
      .max(10000, "Text exceeds maximum character limit of 10,000")
      .default(""),
    imageBase64: z.string().optional(),
    imageMimeType: z
      .enum(["image/jpeg", "image/png", "image/webp", "image/gif"])
      .optional(),
    language: z.string().default("English"), // Changed to general language string
  })
  .refine(
    (data) =>
      data.maskedText.trim().length > 0 ||
      (!!data.imageBase64 && !!data.imageMimeType),
    {
      message: "Either maskedText or valid imageBase64 must be provided",
    },
  );

// 2. Structured output schema for Gemini response
const GeminiResponseSchema = z.object({
  scamType: z.string(),
  riskScore: z.number().min(0).max(100),
  redFlags: z.array(z.string()),
  explanation: z.string(),
  nextSteps: z.array(z.string()),
});

// 3. Simple in-memory Sliding Window Rate Limiter
const ipRequestHistory = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const timestamps = ipRequestHistory.get(ip) || [];
  const validTimestamps = timestamps.filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestHistory.set(ip, validTimestamps);
    return { allowed: false, remaining: 0 };
  }

  validTimestamps.push(now);
  ipRequestHistory.set(ip, validTimestamps);

  if (Math.random() < 0.05) {
    for (const [key, times] of ipRequestHistory.entries()) {
      const valid = times.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (valid.length === 0) ipRequestHistory.delete(key);
      else ipRequestHistory.set(key, valid);
    }
  }

  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - validTimestamps.length,
  };
}

/**
 * Handles incoming POST requests for threat analysis.
 * Implements IP-based rate limiting, input validation via Zod, and interacts
 * with the Google Gemini API to return a structured cyber threat assessment.
 *
 * @param {NextRequest} req - The Next.js incoming request object containing maskedText or image.
 * @returns {Promise<NextResponse>} JSON response containing the threat analysis or error details.
 */
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const limitCheck = checkRateLimit(ip);

  if (!limitCheck.allowed) {
    return NextResponse.json(
      {
        error: "RATE_LIMITED",
        message: "Too many requests. Please wait a minute.",
      },
      { status: 429 },
    );
  }

  let bodyJson: unknown;
  try {
    bodyJson = await req.json();
  } catch {
    return NextResponse.json(
      { error: "INVALID_INPUT", message: "Malformed JSON request body." },
      { status: 400 },
    );
  }

  const parseResult = RequestSchema.safeParse(bodyJson);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: "INVALID_INPUT",
        message: parseResult.error.issues.map((i) => i.message).join(", "),
      },
      { status: 400 },
    );
  }

  const { maskedText: rawMaskedText, imageBase64, imageMimeType, language } = parseResult.data;
  const maskedText = sanitizeInput(rawMaskedText);

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
    const ai = new GoogleGenAI({ apiKey });
    const models = ["gemini-3.5-flash", "gemini-3.0-flash", "gemini-2.5-flash"];

    const systemInstruction = `You are Satark, an expert Indian digital safety & cybersecurity threat evaluator.
Analyze the communication for social engineering, digital arrest extortion, electricity bill scams, fake KYC, UPI refund fraud, UPI payment requests, Telegram investment/task scams, fake/phishing websites, or fake lottery tricks.
Determine a risk score (0=safe, 100=extreme danger).
Return valid structured JSON. Do not provide financial, legal or medical advice. Use probabilistic phrasing (likely scam / looks safe, but verify).
CRITICAL: You MUST write your entire response, explanation, and action steps in ${language} using simple, everyday words that any citizen can understand. Do not use technical jargon.
Ensure the JSON format is exactly: { "scamType": string, "riskScore": number, "redFlags": string[], "explanation": string, "nextSteps": string[] }`;

    const parts = [];

    if (maskedText) {
      parts.push({
        text: `Message content to evaluate:\n"""\n${maskedText}\n"""`,
      });
    }

    if (imageBase64 && imageMimeType) {
      parts.push({ text: "Please analyze this screenshot for scams." });
      parts.push({
        inlineData: {
          data: imageBase64,
          mimeType: imageMimeType,
        },
      });
    }

    let rawResponseText = null;
    let lastError = null;

    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ role: "user", parts }],
          config: {
            systemInstruction,
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        });
        rawResponseText = response.text;
        break; // Success! Break out of the fallback loop
      } catch (e) {
        // Fallback on model failure
        lastError = e;
      }
    }

    if (!rawResponseText) {
      throw lastError || new Error("All fallback models failed.");
    }

    rawResponseText = rawResponseText.trim();
    if (rawResponseText.startsWith("```json")) {
      rawResponseText = rawResponseText.substring(7);
      if (rawResponseText.endsWith("```")) {
        rawResponseText = rawResponseText.slice(0, -3);
      }
    }

    const parsedData = JSON.parse(rawResponseText.trim());
    const validated = GeminiResponseSchema.parse(parsedData);

    return NextResponse.json(validated);
  } catch {
    // Silently capture API error
    return NextResponse.json(
      { error: "API_ERROR", message: "Failed to analyze with AI." },
      { status: 500 },
    );
  }
}
