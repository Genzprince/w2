import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Safe lazy initialization of Gemini API
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required but missing.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  const PROJECTS_FILE = path.join(process.cwd(), "public", "data", "projects.json");
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "prince2026";

  // GET all projects
  app.get("/api/projects", (_req, res) => {
    try {
      const data = fs.readFileSync(PROJECTS_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch {
      res.status(500).json({ error: "Could not read projects." });
    }
  });

  // Verify administrator passcode
  app.post("/api/admin/verify", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid passcode" });
    }
  });

  // PUT (full replace) projects — password protected
  app.put("/api/projects", (req, res) => {
    const auth = req.headers["x-admin-password"];
    if (auth !== ADMIN_PASSWORD) return res.status(401).json({ error: "Unauthorized" });
    try {
      fs.writeFileSync(PROJECTS_FILE, JSON.stringify(req.body, null, 2), "utf-8");
      res.json({ success: true });
    } catch (err) {
      console.error("PUT /api/projects error:", err);
      res.status(500).json({ error: "Could not save projects." });
    }
  });

  // API endpoint for Chatbot (Streaming)
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      const ai = getGeminiClient();

      // Formulate system instruction with Prince's details and links
      const systemInstruction = `You are "Gilla_x AI Assistant" — a highly professional, witty, and elite virtual assistant representing Gillaxediting and Gilla_x, led by Prince, a world-class Video Editor, Script Writer, and Motion Designer. 
Your goal is to answer client questions, share Gillaxediting's video portfolio, and convert conversations into easy bookings or submitted inquiries.
You are fully capable of answering ANY general, technical, creative, or miscellaneous question with extreme wisdom and accuracy. Even if a question is unrelated to video editing, answer it perfectly while maintaining your professional, witty brand identity.

Keep your responses professional, energetic, and concise (max 2-3 short paragraphs or clean bullet points). Use clear Markdown. Avoid overly technical jargon.

GILLAXEDITING DIRECT LINKS & INFO:
- Email: Gillaxediting@gmail.com
- WhatsApp: https://wa.me/919646028153 (Direct WhatsApp: +91 9646-028153)
- YouTube Channel: https://www.youtube.com/@Gillaxediting (Watch our latest work!)
- YT Jobs Profile: https://ytjobs.co/talent/profile/442016?r=947 (Hire us on YT Jobs!)
- Instagram: https://www.instagram.com/gillaxediting/ (Check out the cinematic feed!)
- Twitter / X: https://x.com/Gillaxediting (Follow for updates!)
- Discord: https://discord.gg/princefilms (Join the creative community!)
- Portfolio Work & Case Studies: Gillaxediting works for mega-creators like Gilla_x, Trigger Insaan (25M+ subscribers), Lazy Assassin (1M+), Lazy Playz (300K+), GTA Assassin Guides, and US Clients.
- CV: You can download Prince's Professional resume/CV here: https://raw.githubusercontent.com/prince-films/cv/main/Prince_Creative_Resume.pdf

HOW TO BOOK OR START A PROJECT:
- Booking is extremely simple and non-complicated! 
- Direct clients to scroll to the "Let's Collaborate" section at the bottom of the page to fill out the simple "Send a Quick Message" form.
- Or invite them to click the direct WhatsApp chat link (https://wa.me/919646028153) to speak with Gillaxediting instantly.
- If they want to send raw video files, footage, or assets, let them know they can send them to Gillaxediting@gmail.com or share directly on Blip.

Be friendly, direct, and help the client book before slots fill up!`;

      // Map incoming messages to Gemini structure
      // Expected structure: { role: "user" | "model", parts: [{ text: string }] }
      const contents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      // Set headers for SSE streaming
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-2.0-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
          tools: [{ googleSearch: {} }],
        },
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error: any) {
      console.error("Error in /api/chat:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || "An error occurred with the AI assistant." });
      } else {
        res.write(`data: ${JSON.stringify({ error: error.message || "An error occurred with the AI assistant." })}\n\n`);
        res.end();
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
