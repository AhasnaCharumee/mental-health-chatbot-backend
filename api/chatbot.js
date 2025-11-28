import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { message } = req.body;

  try {
   const response = await axios.post(
  "https://api.openai.com/v1/chat/completions",
  {
    model: "gpt-4o-mini",  // fix this model name to a valid one like "gpt-4o-mini" or "gpt-3.5-turbo"
    messages: [
      { role: "system", content: "You are a mental health assistant." },
      { role: "user", content: message }
    ],
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    }
  }
);


    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
