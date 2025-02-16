if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

export const config = {
  geminiApiKey: process.env.GEMINI_API_KEY
}; 