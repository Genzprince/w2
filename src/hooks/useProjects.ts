import { useState, useEffect } from "react";
import { Project, PORTFOLIO_PROJECTS } from "../types";

export function getYoutubeEmbedUrl(youtubeLink: string | undefined): string {
  if (!youtubeLink) return "";
  let videoId = "";
  
  // YouTube matches
  const ytMatch = youtubeLink.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
  const ytShortsMatch = youtubeLink.match(/youtube\.com\/shorts\/([^"&?\/ ]{11})/i);
  videoId = ytMatch ? ytMatch[1] : (ytShortsMatch ? ytShortsMatch[1] : "");

  if (!videoId) {
    if (youtubeLink.includes("watch?v=")) {
      videoId = youtubeLink.split("watch?v=")[1]?.split("&")[0] || "";
    } else if (youtubeLink.includes("youtube.com/shorts/")) {
      videoId = youtubeLink.split("youtube.com/shorts/")[1]?.split("?")[0] || "";
    } else if (youtubeLink.includes("youtu.be/")) {
      videoId = youtubeLink.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (youtubeLink.includes("youtube.com/embed/")) {
      videoId = youtubeLink.split("youtube.com/embed/")[1]?.split("?")[0] || "";
    }
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("API unavailable");
      const data = await res.json();
      
      let finalData = data;
      const localSaved = localStorage.getItem("portfolio_projects_custom");
      
      // If server returned default projects but we have custom local changes, use local changes!
      if (JSON.stringify(data) === JSON.stringify(PORTFOLIO_PROJECTS) && localSaved) {
        try {
          finalData = JSON.parse(localSaved);
        } catch {}
      } else if (Array.isArray(data) && data.length > 0) {
        // Server returned custom data, save/sync to localStorage
        localStorage.setItem("portfolio_projects_custom", JSON.stringify(data));
      }

      const mapped = finalData.map((p: any) => ({
        ...p,
        youtubeEmbed: p.youtubeEmbed || getYoutubeEmbedUrl(p.youtubeLink)
      }));
      setProjects(mapped);
    } catch {
      let fallbackData = PORTFOLIO_PROJECTS;
      const localSaved = localStorage.getItem("portfolio_projects_custom");
      if (localSaved) {
        try {
          fallbackData = JSON.parse(localSaved);
        } catch (e) {
          console.error("Failed to parse local saved projects", e);
        }
      }
      const mapped = fallbackData.map((p: any) => ({
        ...p,
        youtubeEmbed: p.youtubeEmbed || getYoutubeEmbedUrl(p.youtubeLink)
      }));
      setProjects(mapped);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  return { projects, loading, refetch: fetchProjects };
}
