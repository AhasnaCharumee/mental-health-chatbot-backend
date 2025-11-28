import { Request, Response } from "express";
import { askOpenAI } from "../services/openai.service";
import { detectLanguage } from "../services/languageDetect";
import { successResponse, errorResponse } from "../utils/response";

export const handleChat = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json(errorResponse("Missing 'message' in body"));
    }

    // Language detect
    const lang = detectLanguage(message);

    // Construct system prompt dynamically based on language
    const systemPrompt = `You are a supportive, empathetic mental health assistant. Answer concisely and kindly. If the user expresses distress, suggest professional help resources and a breathing exercise. Respond in ${lang}.`;

    // Call OpenAI service
    const reply = await askOpenAI(systemPrompt, message);

    // Return response JSON
    return res.json(successResponse({ reply, language: lang }));
  } catch (err: any) {
    console.error("chat error:", err?.response?.data ?? err);
    return res.status(500).json(errorResponse("Internal server error"));
  }
};
