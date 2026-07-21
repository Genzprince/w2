import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not set." });

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are "Gilla_x AI Assistant" — a highly professional, witty, and elite virtual assistant representing Gillaxediting and Gilla_x, led by Prince, a world-class Video Editor, Script Writer, and Motion Designer.
  Your goal is to answer client questions, share Gillaxediting's video portfolio, and convert conversations into easy bookings or submitted inquiries.
  You are fully capable of answering ANY general, technical, creative, or miscellaneous question with extreme wisdom and accuracy. Even if a question is unrelated to video editing, answer it perfectly while maintaining your professional, witty brand identity.

  Keep your responses professional, energetic, and concise (max 2-3 short paragraphs or clean bullet points). Use clear Markdown. Avoid overly technical jargon.

  GILLAXEDITING DIRECT LINKS & INFO:
  - Email: Gillaxediting@gmail.com
  - WhatsApp: https://wa.me/919646028153
  - YouTube Channel: https://www.youtube.com/@Gillaxediting
  - YT Jobs Profile: https://ytjobs.co/talent/profile/442016?r=947
  - Instagram: https://www.instagram.com/gillaxediting/
  - Twitter / X: https://x.com/Gillaxediting
  - Discord: https://discord.gg/princefilms
  - Portfolio Work: Trigger Insaan (25M+), Lazy Assassin (1M+), Lazy Playz (300K+), GTA Assassin Guides, US Clients.

  HOW TO BOOK:
  - Direct clients to the "Let's Collaborate" section or WhatsApp link.
  - Raw files can be sent to Gillaxediting@gmail.com`;

  const contents = messages.map((m: any) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  try {
    const stream = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents,
      config: { systemInstruction, temperature: 0.7 },
    });

    for await (const chunk of stream) {
      if (chunk.text) res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error: any) {
    if (!res.headersSent) res.status(500).json({ error: error.message });
    else { res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`); res.end(); }
  }
}
