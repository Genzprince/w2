import { db } from "./index.ts";
import { projects } from "./schema.ts";
import { asc } from "drizzle-orm";
import { PORTFOLIO_PROJECTS } from "../types.ts";

export async function getProjects() {
  try {
    const list = await db.select().from(projects).orderBy(asc(projects.displayOrder));
    
    // Auto-seed if database is empty
    if (list.length === 0) {
      console.log("No projects found in database. Seeding default projects...");
      const valuesToInsert = PORTFOLIO_PROJECTS.map((p, idx) => ({
        id: p.id,
        title: p.title,
        client: p.client,
        featured: p.featured || false,
        isRecent: p.isRecent || false,
        category: p.category,
        description: p.description,
        duration: p.duration,
        result: p.result,
        role: p.role,
        challenge: p.challenge,
        solution: p.solution,
        skills: p.skills,
        youtubeLink: p.youtubeLink,
        youtubeEmbed: p.youtubeEmbed || "",
        instagramLink: p.instagramLink || "",
        videoUrl: p.videoUrl || "",
        thumbnail: p.thumbnail,
        platform: p.platform,
        year: p.year,
        pinned: p.pinned || false,
        projectDate: p.projectDate || "",
        displayOrder: idx,
      }));

      await db.insert(projects).values(valuesToInsert);
      console.log("Successfully seeded default projects!");
      return valuesToInsert;
    }

    return list;
  } catch (error) {
    console.error("Database fetch failed in getProjects:", error);
    throw new Error("Failed to load projects from the database", { cause: error });
  }
}

export async function saveProjects(newProjectsList: any[]) {
  try {
    await db.transaction(async (tx) => {
      // 1. Delete all existing projects
      await tx.delete(projects);

      // 2. Insert new projects with correct displayOrder
      if (newProjectsList.length > 0) {
        const valuesToInsert = newProjectsList.map((p, idx) => ({
          id: p.id,
          title: p.title,
          client: p.client,
          featured: p.featured || false,
          isRecent: p.isRecent || false,
          category: p.category,
          description: p.description,
          duration: p.duration,
          result: p.result,
          role: p.role,
          challenge: p.challenge,
          solution: p.solution,
          skills: p.skills,
          youtubeLink: p.youtubeLink,
          youtubeEmbed: p.youtubeEmbed || "",
          instagramLink: p.instagramLink || "",
          videoUrl: p.videoUrl || "",
          thumbnail: p.thumbnail,
          platform: p.platform,
          year: p.year,
          pinned: p.pinned || false,
          projectDate: p.projectDate || "",
          displayOrder: idx,
        }));

        await tx.insert(projects).values(valuesToInsert);
      }
    });
    console.log("Projects updated in database successfully!");
    return { success: true };
  } catch (error) {
    console.error("Database save failed in saveProjects:", error);
    throw new Error("Failed to save projects to the database", { cause: error });
  }
}
