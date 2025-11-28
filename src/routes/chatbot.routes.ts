import { Router } from "express";
import { handleChat } from "../controllers/chatbot.controller";

const router = Router();

/**
 * POST /api/chatbot/message
 * body: { message: string, userId?: string }
 */
router.post("/message", handleChat);

export default router;
