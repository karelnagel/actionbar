import { APIRoute } from "astro";
import { OpenAI } from "openai";
import { Message } from "../../../../actionbar/src";
import { findClosest } from "../../../../knowledge/src/embeddings";

const system: Message = {
  role: "system",
  content:
    "You are embedded into asius.ai, website and need to help users with their questions. You can use markdown for text decoration, links and images.",
};

export const POST: APIRoute = async (Astro) => {
  const json = await Astro.request.json();
  const messages = Message.array().parse(json.messages);
  const lastMessage = messages[messages.length - 1]!;
  const data = await findClosest(lastMessage.content, 4);

  const context = data.map((x) => `${x.sourceUrl}\n\`\`\`md\n${x.text}\n\`\`\``).join("\n\n");
  const openai = new OpenAI();
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      system,
      ...messages,
      {
        role: "system",
        content: `Here is some context that was found for this question: \n${context}`,
      },
    ],
  });
  const message = Message.parse(response.choices[0]?.message);
  return new Response(JSON.stringify(message));
};
