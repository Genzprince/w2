import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Redis } from "@upstash/redis";
import defaultProjects from "../public/data/projects.json";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "prince2026";
const KV_KEY = "projects";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  if (req.method === "GET") {
    try {
      const data = await redis.get(KV_KEY);
      return res.json(data ?? defaultProjects);
    } catch {
      return res.json(defaultProjects);
    }
  }

  if (req.method === "PUT") {
    const auth = req.headers["x-admin-password"];
    if (auth !== ADMIN_PASSWORD) return res.status(401).json({ error: "Unauthorized" });
    try {
      await redis.set(KV_KEY, JSON.stringify(req.body));
      return res.json({ success: true });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
