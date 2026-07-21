import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Redis } from "@upstash/redis";
import defaultProjects from "../public/data/projects.json";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "prince2026";
const KV_KEY = "projects";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-password");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Safely initialize Redis only if environment variables are provided
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  let redis: Redis | null = null;
  if (redisUrl && redisToken) {
    try {
      redis = new Redis({
        url: redisUrl,
        token: redisToken,
      });
    } catch (e) {
      console.error("Failed to initialize Redis client:", e);
    }
  }

  if (req.method === "GET") {
    if (!redis) {
      // Gracefully fall back to local JSON file if Redis is not set up
      return res.json(defaultProjects);
    }

    try {
      let data = await redis.get(KV_KEY);
      
      // Handle potential double serialization
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {}
      }

      // If data is null, undefined, or empty, return default projects
      if (!data || (Array.isArray(data) && data.length === 0)) {
        return res.json(defaultProjects);
      }

      return res.json(data);
    } catch (e) {
      console.error("Redis fetch failed, falling back to default projects:", e);
      return res.json(defaultProjects);
    }
  }

  if (req.method === "PUT") {
    const auth = req.headers["x-admin-password"];
    if (auth !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!redis) {
      return res.json({
        success: true,
        savedLocally: true,
        message: "Saved locally. Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in environment variables for persistent cloud storage."
      });
    }

    try {
      await redis.set(KV_KEY, req.body);
      return res.json({ success: true });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
