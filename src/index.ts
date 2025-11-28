import dotenv from 'dotenv';
dotenv.config();
import cors from "cors";

import express, { Request, Response, NextFunction } from "express";
import chatbotRoutes from "./routes/chatbot.routes";

const app = express();

app.use(cors());  // <<< මේක දාන්න, cors enable වෙනවා
app.use(express.json());

// Explicit CORS headers and preflight handling (helps on some serverless platforms)
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = process.env.CORS_ORIGIN || "*";
  res.header("Access-Control-Allow-Origin", origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    return res.sendStatus(204);
  }
  next();
});

// Routes
app.use("/api/chatbot", chatbotRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.json({ ok: true, message: "Mental Health Chatbot API" });
});

const port = process.env.PORT || 3000;

if (require.main === module) {
  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('Process terminated');
    });
  });
}

export default app;
