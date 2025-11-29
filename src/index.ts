import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import chatbotRoutes from "./routes/chatbot.routes";

const app = express();

app.use(cors({
  origin: "*",
}));
// Ensure Express explicitly responds to OPTIONS preflight for all routes
app.options('*', cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use("/api/chatbot", chatbotRoutes);

app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Mental Health Chatbot API" });
});

// ❌ DO NOT LISTEN TO A PORT ON VERCEL
// Vercel handles the server automatically.

export default app;
