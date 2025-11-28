import dotenv from 'dotenv';
dotenv.config();
import cors from "cors";

import express, { Request, Response } from "express";
import chatbotRoutes from "./routes/chatbot.routes";

const app = express();

app.use(cors());  // <<< මේක දාන්න, cors enable වෙනවා
app.use(express.json());

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
