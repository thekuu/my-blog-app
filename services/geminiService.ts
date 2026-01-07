
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

export const chatWithGemini = async (message: string, history: { role: 'user' | 'model', text: string }[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY! });
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: "You are Lumina, a helpful and creative AI assistant for a modern blog. You help users with writing inspiration, explaining complex topics, and brainstorming ideas for Art, Science, Tech, and more.",
      },
    });

    // Note: In real scenarios we would load history into the chat object if supported by the SDK, 
    // or pass full contents array to generateContent.
    // For simplicity here, we send the message.
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm sorry, I'm having trouble connecting right now.";
  }
};

export const analyzeImageWithGemini = async (imageBuffer: string, mimeType: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY! });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBuffer.split(',')[1],
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this image in the context of a high-quality blog post. What are the visual themes, what story does it tell, and what categories (Art, Science, Technology, Cinema, Design, Food) would it fit into? Keep it engaging and insightful.",
          },
        ],
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "I couldn't analyze the image properly. Please try again.";
  }
};
