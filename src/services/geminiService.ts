import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the environment.");
  }
  if (!ai) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

export const geminiService = {
  generateQuiz: async (topic: string, count: number, difficulty: string, language: 'en' | 'hi' = 'en') => {
    const client = getGenAI();

    const prompt = `
      Generate a quiz about "${topic}" with ${count} multiple choice questions.
      Difficulty level: ${difficulty}.
      Language: ${language === 'hi' ? 'Hindi' : 'English'}.
    `;

    try {
      const result = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                correctAnswer: { type: Type.INTEGER }
              },
              required: ["question", "options", "correctAnswer"]
            }
          }
        }
      });

      const text = result.text;
      if (!text) throw new Error("Empty response from AI");
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
};
