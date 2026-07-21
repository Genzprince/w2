import { pgTable, text, boolean, integer, jsonb } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  client: text("client").notNull(),
  featured: boolean("featured").default(false),
  isRecent: boolean("is_recent").default(false),
  category: text("category").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  result: text("result").notNull(),
  role: text("role").notNull(),
  challenge: text("challenge").notNull(),
  solution: text("solution").notNull(),
  skills: jsonb("skills").notNull(), // jsonb array of strings
  youtubeLink: text("youtube_link").notNull(),
  youtubeEmbed: text("youtube_embed"),
  instagramLink: text("instagram_link"),
  videoUrl: text("video_url"),
  thumbnail: text("thumbnail").notNull(),
  platform: text("platform").notNull(),
  year: text("year").notNull(),
  pinned: boolean("pinned").default(false),
  projectDate: text("project_date"),
  displayOrder: integer("display_order").notNull().default(0),
});
