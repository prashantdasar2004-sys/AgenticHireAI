import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const response = await ai.models.generateContent({
  model: "gemini-1.5-flash",
  contents: "Tell me 3 React skills in JSON format",
});

console.log(response.text);