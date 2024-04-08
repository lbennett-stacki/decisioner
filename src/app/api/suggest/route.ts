import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { configs, isConfigName } from "../../config";
import { MODELS } from "../../ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, config } = await req.json();

  if (!isConfigName(config)) {
    throw new Error("Invalid config provided");
  }

  const conf = configs[config];

  if (!config || !conf) {
    throw new Error("No config provided");
  }

  const message = messages[messages.length - 1];

  if (!message || !message.content) {
    throw new Error("No message provided");
  }

  const prompt = message.content;

  const response = await openai.chat.completions.create({
    model: MODELS.LANGUAGE,
    stream: true,
    messages: [
      {
        role: "system",
        content: conf.suggestionGeneration.systemPrompt,
      },
      {
        role: "user",
        content: `Go. ${prompt ? ` Rough Ideas: ${prompt}` : ""}`,
      },
    ],
    max_tokens: 1000,
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
