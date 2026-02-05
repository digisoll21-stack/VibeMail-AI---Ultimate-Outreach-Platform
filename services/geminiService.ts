
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateEmailCopy = async (prompt: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a high-converting cold email based on this prompt: "${prompt}". 
                 The context/product is: "${context}". 
                 Keep it brief, under 100 words, and focused on a single call to action. 
                 Provide a "Subject" and a "Body".`,
      config: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating email. Please try again.";
  }
};

export const analyzeLeadIntent = async (reply: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this email reply from a lead and categorize its intent. 
                 Reply: "${reply}"
                 Categories: Interested, Not Interested, Out of Office, Meeting Booked. 
                 Provide a brief 1-sentence explanation why.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Neutral";
  }
};
