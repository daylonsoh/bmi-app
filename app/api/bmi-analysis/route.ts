import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Gemini API key not configured' }), 
      { status: 500 }
    );
  }

  try {
    const { currentBMI, trend } = await request.json();
    
    console.log('Received request:', { currentBMI, trend });

    const prompt = `
      As a health expert, provide 5 specific, actionable tips for someone with:
      - Current BMI: ${currentBMI}
      - BMI Trend: ${trend}
      - Target BMI Range: 19-25

      The tips should be practical and focused on helping them ${
        currentBMI < 19 ? 'gain weight healthily' : 
        currentBMI > 25 ? 'lose weight safely' : 
        'maintain their healthy weight'
      }.

      Format each tip as a concise, actionable item.
      Focus on sustainable lifestyle changes, not crash diets or extreme measures.
    `;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let tipsText = response.text();
    
    // If no numbered list is detected, format the response
    if (!tipsText.match(/^\d\./m)) {
      tipsText = tipsText.split('\n').map((line, i) => `${i + 1}. ${line.trim()}`).join('\n');
    }
    
    const tips = tipsText.split('\n')
      .filter(tip => tip.trim() && tip.match(/^\d+\./)) // Only keep numbered lines
      .map(tip => tip.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 5);

    console.log('Generated tips:', tips); // Debug log

    return new Response(JSON.stringify({ tips }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('BMI Analysis API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to generate recommendations' 
      }), 
      { status: 500 }
    );
  }
} 