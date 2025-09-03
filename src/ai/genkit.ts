// lib/genkit.ts
require('dotenv').config();
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/googleai";

// Check if Gemini API key is available
const apiKey = process.env.GEMINI_API_KEY;
const hasGeminiKey = !!apiKey;

export const ai = genkit({
  plugins: hasGeminiKey ? [
    googleAI(), // ✅ model plugin
  ] : [],
});
