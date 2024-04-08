import OpenAI from "openai";
import { configs, isConfigName } from "../../config";
import { MODELS } from "../../ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt, config } = await req.json();

  if (!isConfigName(config)) {
    throw new Error("Invalid config provided");
  }

  const conf = configs[config];

  if (!config || !conf) {
    throw new Error("No config provided");
  }

  const realisticImageDescription = await openai.chat.completions.create({
    model: MODELS.LANGUAGE,
    messages: [
      {
        role: "system",
        content: conf.imageGeneration.detailedPromptGeneration.systemPrompt,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  console.log("ALL DESC", realisticImageDescription);
  console.log("ALL CHOICES", realisticImageDescription.choices);
  console.log(
    "these from inputs system prompt:",
    conf.imageGeneration.detailedPromptGeneration.systemPrompt,
    "user prompt",
    prompt
  );

  const imagePrompt =
    realisticImageDescription.choices[
      realisticImageDescription.choices.length - 1
    ].message.content;

  if (!imagePrompt) {
    throw new Error("Failed to generate image prompt");
  }

  console.log("IMAGE PROMPT GENERATED", imagePrompt, "FROM INPUT", prompt);

  const response = await openai.images.generate({
    model: MODELS.IMAGE,
    prompt: imagePrompt,
    size: "1024x1024",
    style: "natural",
    quality: "standard",
  });

  const url = response.data.find((d) => d.url)?.url;

  if (!url) {
    throw new Error("Failed to generate image");
  }

  return Response.json({
    url,
  });
}
