// lib/genkit.ts
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/googleai";

// Check if Gemini API key is available
const hasGeminiKey = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);

export const ai = genkit({
  plugins: hasGeminiKey ? [
    googleAI(), // ✅ model plugin
  ] : [],
});
