import { APIRoute } from "astro";
import { OpenAI } from "openai";
import { Message } from "../../../../actionbar/src";

export const POST: APIRoute = async (Astro) => {
  const json = await Astro.request.json();
  const messages = Message.array().parse(json.messages);
  const openai = new OpenAI();
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });
  const message = Message.parse(response.choices[0]?.message);
  return new Response(JSON.stringify(message));
};
