import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { messages, language = "English" } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are Satark, a friendly, sharp AI Cybersecurity Partner. NEVER write long paragraphs or essays. Reply in a short, crisp, professional texting style (maximum 2 to 4 short sentences or 3 short bullet points per reply). Ask one simple follow-up question if needed. Do NOT use ### headers or --- dividers. ALWAYS reply in the exact language currently selected by the user. CRITICAL: You MUST write your entire response, explanation, and action steps in ${language} using simple, everyday words that any citizen can understand.`;

    const models = ["gemini-3.8-flash", "gemini-3.7-flash", "gemini-3.6-flash"];
    
    // Map OpenAI style messages to Gemini format.
    const contents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
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
            temperature: 0.5
          }
        });
        replyText = response.text;
        break; // Success! Break out of the fallback loop
      } catch (e) {
        console.warn(`Model ${model} failed, falling back...`, e);
        lastError = e;
      }
    }

    if (!replyText) {
      throw lastError || new Error("All fallback models failed.");
    }
    
    return NextResponse.json({ reply: replyText });
  } catch (err: unknown) {
    console.error("API Error in Chat:", err);
    return NextResponse.json(
      { error: "API_ERROR", message: "Failed to communicate with AI." },
      { status: 500 }
    );
  }
}
