import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { text, routes } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
    Analyze this voice command: "${text}"
    
    Available routes: ${routes.join(', ')}
    
    Return only the exact route name that best matches the user's intent.
    If no match, return "null".
    
    Examples:
    - "go to dashboard" → "dashboard"
    - "farmer login" → "farmer"
    - "show products" → "products"
    - "random text" → "null"
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim().toLowerCase();
    
    return NextResponse.json({ 
      route: response === 'null' ? null : response 
    });
  } catch (error) {
    return NextResponse.json({ route: null });
  }
}