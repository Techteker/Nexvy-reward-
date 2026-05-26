import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

export const aiService = {
  async generateQuiz(category: string, count: number = 5): Promise<QuizQuestion[]> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate a quiz about ${category} with ${count} multiple choice questions. Return as JSON array of objects with 'question', 'options' (array of 4 strings), and 'correct' (index of correct option 0-3).`,
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
                correct: { type: Type.INTEGER }
              },
              required: ["question", "options", "correct"]
            }
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from AI");
      const data = JSON.parse(text);
      return data.map((q: any, i: number) => ({
        ...q,
        id: i + 1
      }));
    } catch (e) {
      console.error("AI quiz generation failed:", e);
      // Fallback questions
      return [
        {
          id: 1,
          question: `What is the most characteristic feature of ${category}?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: 0
        }
      ];
    }
  }
};
