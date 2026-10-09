import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 60;

/**
 * Handles incoming POST requests for the Cyber Assistant chat interface.
 * Validates message history and communicates with the Gemini model to provide
 * context-aware, localized cyber safety advice.
 *
 * @param {NextRequest} req - The incoming request containing the chat history and user language preference.
 * @returns {Promise<NextResponse>} JSON response containing the AI's reply or an error status.
 */
export async function POST(req: NextRequest) {
  try {
    const { messages, language = "English" } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are Satark, a friendly, sharp AI Cybersecurity Partner. NEVER write long paragraphs or essays. Reply in a short, crisp, professional texting style (maximum 2 to 4 short sentences or 3 short bullet points per reply). Ask one simple follow-up question if needed. Do NOT use ### headers or --- dividers. ALWAYS reply in the exact language currently selected by the user. CRITICAL: You MUST write your entire response, explanation, and action steps in ${language} using simple, everyday words that any citizen can understand.`;

    const models = ["gemini-3.8-flash", "gemini-3.7-flash", "gemini-3.6-flash"];

    // Map OpenAI style messages to Gemini format.
    const contents = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    let replyText = null;
    let lastError = null;

    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.5,
          },
        });
        replyText = response.text;
        break; // Success! Break out of the fallback loop
      } catch (e) {
        // Fallback on model failure
        lastError = e;
      }
    }

    if (!replyText) {
      throw lastError || new Error("All fallback models failed.");
    }

    return NextResponse.json({ reply: replyText });
  } catch {
    // Silently capture API error
    return NextResponse.json(
      { error: "API_ERROR", message: "Failed to communicate with AI." },
      { status: 500 },
    );
  }
}
