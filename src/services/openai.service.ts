import axios from "axios";

export async function askOpenAI(systemPrompt: string, userMessage: string): Promise<string> {
  const url = "https://api.openai.com/v1/responses";

  try {
    const response = await axios.post(
      url,
      {
        model: "gpt-4o-mini",
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("OpenAI response data:", JSON.stringify(response.data, null, 2));

    // Extract the assistant's reply text from nested output array
    const output = response.data.output;
    if (output && output.length > 0 && output[0].content && output[0].content.length > 0) {
      const text = output[0].content[0].text;
      if (typeof text === "string") {
        return text;
      }
    }

    return "Sorry, I could not get a response.";
  } catch (error: any) {
    console.error("OpenAI API error:", error.response?.data || error.message || error);
    return "Sorry, there was an error processing your request.";
  }
}
