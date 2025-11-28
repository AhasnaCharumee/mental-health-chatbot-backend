export interface ChatRequest {
  message: string;
  userId?: string;
}

export interface ChatResponse {
  reply: string;
  language: "Sinhala" | "Tamil" | "English";
}
