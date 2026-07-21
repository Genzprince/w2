import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Edit2, Trash2, Pin, Move, Check, X, ArrowLeft, 
  Video, Link, Calendar, Clock, Sparkles, Lock, Unlock, 
  Globe, Image as ImageIcon, Tag, FolderOpen, Star, Sparkle, Settings2, Info, Eye
} from "lucide-react";
import { Project, PORTFOLIO_PROJECTS } from "../types";

const ADMIN_PASSWORD = "prince2026";

// Dynamic defaults for missing properties
const EMPTY_PROJECT: Project = {
  id: "",
  title: "",
  client: "",
  featured: true,
  isRecent: true,
  category: "YouTube",
  description: "",
  duration: "02:15",
  result: "Portfolio Work",
  role: "Video Editor & Motion Designer",
  challenge: "Craft a high-retention video edit that captures audience attention, pacing, and storytelling seamlessly from beginning to end.",
  solution: "Constructed a visual-first dynamic cut in Premiere Pro and integrated custom kinetic typography and visual effects in After Effects to optimize viewer retention.",
  skills: ["Editing", "Storytelling", "Visual Effects"],
  youtubeEmbed: "",
  youtubeLink: "",
  instagramLink: "",
  videoUrl: "",
  thumbnail: "",
  platform: "YouTube",
  year: new Date().getFullYear().toString(),
  pinned: false,
  projectDate: new Date().toISOString().slice(0, 7), // YYYY-MM
};

// Parse standard input URLs to relevant embed, link, and direct MP4 fields
const parseVideoUrl = (url: string) => {
  if (!url) return {};
  
  // YouTube Matches
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
  const ytShortsMatch = url.match(/youtube\.com\/shorts\/([^"&?\/ ]{11})/i);
  const videoId = ytMatch ? ytMatch[1] : (ytShortsMatch ? ytShortsMatch[1] : null);
  
  if (videoId) {
    return {
      youtubeLink: `https://www.youtube.com/watch?v=${videoId}`,
      youtubeEmbed: `https://www.youtube.com/embed/${videoId}`,
      videoUrl: ""
    };
  }

  // Vimeo Matches
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i);
  if (vimeoMatch) {
    const vimeoId = vimeoMatch[1];
    return {
      youtubeLink: url,
      youtubeEmbed: `https://player.vimeo.com/video/${vimeoId}`,
      videoUrl: ""
    };
  }

  // Direct MP4
  if (url.toLowerCase().endsWith(".mp4") || url.toLowerCase().includes(".mp4?")) {
    return {
      youtubeLink: "",
      youtubeEmbed: "",
      videoUrl: url
    };
  }

  // General Fallback
  return {
    youtubeLink: url,
    youtubeEmbed: "",
    videoUrl: ""
  };
};

const getYoutubeThumbnail = (url: string): string => {
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
  const ytShortsMatch = url.match(/youtube\.com\/shorts\/([^"&?\/ ]{11})/i);
  const videoId = ytMatch ? ytMatch[1] : (ytShortsMatch ? ytShortsMatch[1] : null);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return "";
};

export default function AdminPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"list" | "stats">("list");
  const [filterFeatured, setFilterFeatured] = useState<"all" | "featured" | "recent" | "pinned">("all");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Secure session authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem("portfolio_is_admin") === "true";
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`);
      }
      const data = await res.json();
      
      let finalData = data;
      const localSaved = localStorage.getItem("portfolio_projects_custom");
      
      if (JSON.stringify(data) === JSON.stringify(PORTFOLIO_PROJECTS) && localSaved) {
        try {
          finalData = JSON.parse(localSaved);
        } catch {}
      } else if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem("portfolio_projects_custom", JSON.stringify(data));
      }
      
      if (Array.isArray(finalData)) {
        setProjects(finalData);
      } else {
        setProjects(PORTFOLIO_PROJECTS);
      }
    } catch (e) {
      console.error("Failed to load projects inside AdminPanel:", e);
      const localSaved = localStorage.getItem("portfolio_projects_custom");
      if (localSaved) {
        try {
          setProjects(JSON.parse(localSaved));
        } catch {
          setProjects(PORTFOLIO_PROJECTS);
        }
      } else {
        setProjects(PORTFOLIO_PROJECTS);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveAll = async (updated: Project[]) => {
    setSaving(true);
    setSaveMsg("");
    const savedPasscode = sessionStorage.getItem("portfolio_admin_passcode") || ADMIN_PASSWORD;
    try {
      // Save locally first
      localStorage.setItem("portfolio_projects_custom", JSON.stringify(updated));
      
      const res = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-password": savedPasscode },
        body: JSON.stringify(updated),
      });
      if (res.status === 401) {
        setSaveMsg("✗ Access Denied: Incorrect passcode");
        setTimeout(() => setSaveMsg(""), 3000);
        return;
      }
      if (res.ok) {
        setSaveMsg("✓ Changes Saved Successfully");
      } else {
        setSaveMsg("✓ Saved Locally (Set Redis env vars for global cloud sync)");
      }
      setTimeout(() => setSaveMsg(""), 4000);
    } catch {
      setSaveMsg("✓ Saved Locally (Offline mode)");
      setTimeout(() => setSaveMsg(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you absolutely sure you want to delete this video from your portfolio? This action cannot be undone.")) return;
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    await saveAll(updated);
  };

  const handleSaveEdit = async (project: Project) => {
    let updated: Project[];
    if (isNew) {
      updated = [project, ...projects];
    } else {
      updated = projects.map((p) => (p.id === project.id ? project : p));
    }
    setProjects(updated);
    setEditing(null);
    setIsNew(false);
    await saveAll(updated);
  };

  const toggleStatus = async (id: string, field: "featured" | "isRecent" | "pinned") => {
    const updated = projects.map((p) => {
      if (p.id === id) {
        return { ...p, [field]: !p[field] };
      }
      return p;
    });
    setProjects(updated);
    await saveAll(updated);
  };

  // Drag and drop event handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const reordered = [...projects];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, removed);
    setProjects(reordered);
    setDraggedIndex(null);
    await saveAll(reordered);
  };

  const handleBackToWebsite = () => {
    window.location.href = "/";
  };

  // Stats computation
  const totalCount = projects.length;
  const pinnedCount = projects.filter(p => p.pinned).length;
  const featuredCount = projects.filter(p => p.featured !== false).length;
  const recentCount = projects.filter(p => p.isRecent).length;
  const longFormCount = projects.filter(p => !p.duration.startsWith("00:")).length;
  const shortFormCount = projects.filter(p => p.duration.startsWith("00:")).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] text-white flex items-center justify-center font-sans px-4 relative overflow-hidden selection:bg-[#7C6F9F]/30 selection:text-[#B8AECF]">
        {/* Cinematic ambient blur */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-[#7C6F9F]/10 rounded-full blur-[140px] opacity-75" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 24 }}
          className="relative w-full max-w-md bg-[#121316] border border-white/[0.06] rounded-2xl p-8 shadow-2xl text-center overflow-hidden"
        >
          {/* Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[3.5px]" style={{ background: "linear-gradient(to right, #7C6F9F, #B8AECF)" }} />
          
          <div className="bg-[#1C1E24] p-4.5 rounded-full w-fit mx-auto border border-white/[0.08] shadow-inner mb-6">
            <Lock className="w-8 h-8 text-[#B8AECF]" />
          </div>

          <h2 className="font-display text-2xl font-black uppercase tracking-wider text-white">
            ADMIN SECURITY CONSOLE
          </h2>
          <p className="text-[10px] font-mono tracking-widest text-[#8A919E] uppercase mt-1 mb-8">
            AUTHORIZED ACCESS ONLY • GILLAX EDITING
          </p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const res = await fetch("/api/admin/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ password: passwordInput })
                });
                if (res.ok) {
                  try {
                    sessionStorage.setItem("portfolio_is_admin", "true");
                    sessionStorage.setItem("portfolio_admin_passcode", passwordInput);
                  } catch (err) {
                    console.error(err);
                  }
                  setIsAuthenticated(true);
                  setLoginError("");
                } else {
                  setLoginError("ACCESS DENIED: INVALID PASSCODE");
                }
              } catch (err) {
                console.error("Auth error, trying fallback:", err);
                if (passwordInput === "prince2026") {
                  try {
                    sessionStorage.setItem("portfolio_is_admin", "true");
                    sessionStorage.setItem("portfolio_admin_passcode", passwordInput);
                  } catch (e) {
                    console.error(e);
                  }
                  setIsAuthenticated(true);
                  setLoginError("");
                } else {
                  setLoginError("ACCESS DENIED: INVALID PASSCODE");
                }
              }
            }}
            className="space-y-6"
          >
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-mono tracking-widest text-[#8A919E] uppercase block text-center">
                Enter Administrator Passcode
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setLoginError("");
                }}
                placeholder="••••••••"
                className="w-full bg-[#0E1013] border border-white/[0.08] rounded-xl px-4 py-3.5 text-center text-lg text-white font-mono tracking-widest placeholder-neutral-800 focus:outline-none focus:border-[#7C6F9F] transition-all duration-300"
                autoFocus
              />
              {loginError && (
                <p className="text-[10px] text-red-500 font-mono font-bold mt-2 text-center">
                  {loginError}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/";
                }}
                className="flex-1 inline-flex items-center justify-center space-x-1.5 border border-white/[0.08] hover:bg-white/[0.04] text-neutral-400 hover:text-white px-5 py-3 rounded-xl text-xs font-mono tracking-widest uppercase transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
              
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center space-x-1.5 bg-[#7C6F9F] hover:bg-[#8A7BB3] text-black px-5 py-3 rounded-xl text-xs font-mono tracking-widest font-extrabold uppercase transition-all shadow-lg shadow-[#7C6F9F]/10 hover:shadow-[#7C6F9F]/20 cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5 text-black stroke-[3px]" />
                <span>Authenticate</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  if (editing) {
    return <ProjectForm project={editing} onSave={handleSaveEdit} onCancel={() => setEditing(null)} isNew={isNew} />;
  }

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white flex flex-col font-sans selection:bg-[#7C6F9F]/30 selection:text-[#B8AECF]">
      {/* Premium Header */}
      <header className="sticky top-0 z-40 bg-[#0E0F12]/80 backdrop-blur-md border-b border-white/[0.06] py-5 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleBackToWebsite}
              className="p-2 hover:bg-white/5 border border-white/10 hover:border-white/20 rounded-xl transition-all cursor-pointer group"
              title="Return to Live Website"
            >
              <ArrowLeft className="w-4 h-4 text-[#8A919E] group-hover:text-white transition-colors" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-black text-lg sm:text-xl tracking-wider uppercase font-sans text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
                  PORTFOLIO MANAGER
                </h1>
                <div className="w-2 h-2 rounded-full bg-[#7C6F9F] animate-pulse" />
              </div>
              <p className="text-[#8A919E] text-[11px] font-mono tracking-wide mt-0.5">ADMIN COMMAND CENTER • SECURE ACCESS</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {saveMsg && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl flex items-center space-x-2"
              >
                <span>{saveMsg}</span>
              </motion.div>
            )}
            <button
              onClick={() => { setEditing({ ...EMPTY_PROJECT } as Project); setIsNew(true); }}
              className="inline-flex items-center space-x-2 bg-[#7C6F9F] hover:bg-[#8A7BB3] text-black font-extrabold px-5 py-2.5 rounded-xl text-xs tracking-widest uppercase transition-all shadow-lg hover:shadow-[#7C6F9F]/10 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-black stroke-[3px]" />
              <span>Add New Video</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-6">
        
        {/* Bento Statistics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#121316] border border-white/[0.04] p-4.5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors">
            <span className="text-[10px] font-mono tracking-widest text-[#8A919E] uppercase">Total Catalog</span>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-3xl font-black">{totalCount}</span>
              <span className="text-[10px] font-mono text-neutral-500">Videos</span>
            </div>
          </div>
          <div className="bg-[#121316] border border-white/[0.04] p-4.5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase flex items-center space-x-1">
              <Pin className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Pinned Top</span>
            </span>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-3xl font-black text-amber-400">{pinnedCount}</span>
              <span className="text-[10px] font-mono text-neutral-500">Featured Slots</span>
            </div>
          </div>
          <div className="bg-[#121316] border border-white/[0.04] p-4.5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors">
            <span className="text-[10px] font-mono tracking-widest text-[#B8AECF] uppercase flex items-center space-x-1">
              <Star className="w-3 h-3 text-[#B8AECF] fill-[#B8AECF]" />
              <span>Recent Work</span>
            </span>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-3xl font-black text-[#B8AECF]">{recentCount}</span>
              <span className="text-[10px] font-mono text-neutral-500">Live Tabs</span>
            </div>
          </div>
          <div className="bg-[#121316] border border-white/[0.04] p-4.5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors">
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">Long / Short</span>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-3xl font-black">{longFormCount}</span>
              <span className="text-sm font-light text-neutral-500">/ {shortFormCount}</span>
            </div>
          </div>
        </div>

        {/* Workspace Toolbar Tabs & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
          <div className="flex items-center space-x-1.5 bg-white/[0.03] border border-white/[0.06] p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-4.5 py-2.5 rounded-lg text-xs font-mono tracking-wider uppercase transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === "list"
                  ? "bg-[#7C6F9F] text-black font-extrabold"
                  : "text-[#8A919E] hover:text-white"
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Manage Videos</span>
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-4.5 py-2.5 rounded-lg text-xs font-mono tracking-wider uppercase transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === "stats"
                  ? "bg-[#7C6F9F] text-black font-extrabold"
                  : "text-[#8A919E] hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Format Analytics</span>
            </button>
          </div>

          {activeTab === "list" && (
            <div className="flex flex-wrap items-center gap-1.5">
              {(["all", "pinned", "featured", "recent"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterFeatured(filter)}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono tracking-wider uppercase border transition-all cursor-pointer ${
                    filterFeatured === filter
                      ? "bg-[#7C6F9F]/15 border-[#7C6F9F]/40 text-[#B8AECF] font-bold"
                      : "bg-transparent border-white/[0.05] text-[#8A919E] hover:text-white"
                  }`}
                >
                  {filter === "all" ? `All (${projects.length})` :
                   filter === "pinned" ? `Pinned (${projects.filter(p => p.pinned).length})` :
                   filter === "featured" ? `Featured (${projects.filter(p => p.featured !== false).length})` :
                   `Recent Work (${projects.filter(p => p.isRecent).length})`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab contents */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-8 h-8 rounded-full border border-[#7C6F9F] border-t-transparent animate-spin" />
            <span className="text-[#8A919E] font-mono text-xs tracking-widest animate-pulse">SYNCHRONIZING REPOSITORY DATABASE...</span>
          </div>
        ) : activeTab === "list" ? (
          <div className="flex flex-col gap-4">
            {/* Helpful Drag Warning */}
            <div className="bg-[#121316] border border-dashed border-white/10 rounded-2xl p-4.5 flex items-center gap-3">
              <Info className="w-5 h-5 text-[#B8AECF] shrink-0" />
              <p className="text-[#8A919E] text-xs leading-relaxed">
                <span className="text-white font-bold">Drag and Drop Reordering:</span> Drag any video item using the grid handle to arrange the layout flow. Order is saved instantly in real-time. Pinned to Top videos display first on your live section.
              </p>
            </div>

            {/* List Table of Projects */}
            <div className="space-y-3 relative">
              <AnimatePresence initial={false}>
                {projects
                  .filter((p) => {
                    if (filterFeatured === "pinned") return p.pinned;
                    if (filterFeatured === "featured") return p.featured !== false;
                    if (filterFeatured === "recent") return p.isRecent;
                    return true;
                  })
                  .map((project, index) => {
                    const isDragging = draggedIndex === index;
                    return (
                      <motion.div
                        key={project.id}
                        layoutId={`project-card-${project.id}`}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                        className={`bg-[#121316] border transition-all rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-grab active:cursor-grabbing ${
                          isDragging ? "opacity-30 border-dashed border-[#7C6F9F]" : "border-white/[0.04] hover:border-white/10"
                        }`}
                      >
                        {/* Drag and Thumbnail Block */}
                        <div className="flex items-center space-x-4 w-full md:w-auto min-w-0">
                          {/* Drag Handle */}
                          <div 
                            className="p-1.5 hover:bg-white/5 rounded-lg text-neutral-600 hover:text-neutral-400 cursor-grab shrink-0 transition-colors"
                            title="Drag to change display order"
                          >
                            <Move className="w-4 h-4" />
                          </div>

                          {/* Thumbnail Frame */}
                          <div className="w-24 h-14 bg-neutral-900 border border-white/[0.06] rounded-xl overflow-hidden shrink-0 relative flex items-center justify-center">
                            {project.thumbnail ? (
                              <img 
                                src={project.thumbnail} 
                                alt={project.title} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="text-center p-1">
                                <Video className="w-4 h-4 mx-auto text-neutral-600 mb-0.5" />
                                <span className="text-[7px] font-mono uppercase text-neutral-500 tracking-wider">No Image</span>
                              </div>
                            )}
                            <div className="absolute bottom-1 right-1 bg-black/80 border border-white/10 rounded px-1 text-[8px] font-mono text-neutral-300">
                              {project.duration}
                            </div>
                          </div>

                          {/* Info Column */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center flex-wrap gap-2 mb-1">
                              <h3 className="text-white font-black text-sm truncate uppercase tracking-wide">{project.title}</h3>
                              <span className="text-[9px] font-mono bg-white/[0.03] border border-white/[0.06] text-neutral-400 px-2 py-0.5 rounded-full shrink-0">
                                {project.category}
                              </span>
                              {project.platform && (
                                <span className="text-[9px] font-mono bg-white/[0.03] text-neutral-500 px-2 py-0.5 rounded-full shrink-0">
                                  {project.platform}
                                </span>
                              )}
                            </div>
                            <p className="text-[#8A919E] text-xs truncate font-medium">Client: {project.client || "Self-Production"}</p>
                            <p className="text-[9px] font-mono text-neutral-500 mt-1 uppercase flex items-center space-x-2">
                              <span>📅 {project.year || "N/A"}</span>
                              <span>•</span>
                              <span>🏷️ {(project.skills || []).slice(0, 3).join(", ") || "No tags"}</span>
                            </p>
                          </div>
                        </div>

                        {/* Badges and Inline Toggles Row */}
                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t border-white/[0.04] md:border-0">
                          {/* Pinned top indicator */}
                          <button
                            onClick={() => toggleStatus(project.id, "pinned")}
                            className={`px-3 py-1.5 rounded-xl border text-[9px] font-mono tracking-widest uppercase transition-all flex items-center space-x-1 cursor-pointer ${
                              project.pinned
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold"
                                : "bg-transparent border-white/[0.04] text-neutral-500 hover:text-amber-400 hover:border-amber-500/20"
                            }`}
                            title="Toggle Pin to Top"
                          >
                            <Pin className={`w-2.5 h-2.5 ${project.pinned ? "fill-amber-400 text-amber-400" : ""}`} />
                            <span>{project.pinned ? "Pinned" : "Pin Top"}</span>
                          </button>

                          {/* Featured Project */}
                          <button
                            onClick={() => toggleStatus(project.id, "featured")}
                            className={`px-3 py-1.5 rounded-xl border text-[9px] font-mono tracking-widest uppercase transition-all flex items-center space-x-1 cursor-pointer ${
                              project.featured !== false
                                ? "bg-blue-500/10 border-blue-500/30 text-blue-400 font-bold"
                                : "bg-transparent border-white/[0.04] text-neutral-500 hover:text-blue-400 hover:border-blue-500/20"
                            }`}
                            title="Toggle Featured Project Visibility"
                          >
                            <Star className={`w-2.5 h-2.5 ${project.featured !== false ? "fill-blue-400 text-blue-400" : ""}`} />
                            <span>{project.featured !== false ? "Featured" : "Hidden"}</span>
                          </button>

                          {/* Recent Work Tab */}
                          <button
                            onClick={() => toggleStatus(project.id, "isRecent")}
                            className={`px-3 py-1.5 rounded-xl border text-[9px] font-mono tracking-widest uppercase transition-all flex items-center space-x-1 cursor-pointer ${
                              project.isRecent
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold"
                                : "bg-transparent border-white/[0.04] text-neutral-500 hover:text-emerald-400 hover:border-emerald-500/20"
                            }`}
                            title="Toggle Recent Work Showcase"
                          >
                            <Check className="w-2.5 h-2.5 text-current" />
                            <span>{project.isRecent ? "Recent" : "Showcase"}</span>
                          </button>

                          {/* Action Controls */}
                          <div className="flex items-center space-x-1 ml-2 pl-2 border-l border-white/[0.06]">
                            <button
                              onClick={() => { setEditing(project); setIsNew(false); }}
                              className="p-2 hover:bg-white/5 border border-white/10 hover:border-white/20 rounded-xl transition-colors cursor-pointer"
                              title="Edit Video Properties"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-[#B8AECF]" />
                            </button>
                            <button
                              onClick={() => handleDelete(project.id)}
                              className="p-2 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 rounded-xl transition-colors cursor-pointer"
                              title="Delete Video"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>

              {projects.length === 0 && (
                <div className="py-20 border border-dashed border-white/10 rounded-2xl text-center flex flex-col items-center justify-center space-y-4">
                  <Video className="w-8 h-8 text-neutral-600 animate-pulse" />
                  <div>
                    <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">No Video Projects Found</h3>
                    <p className="text-xs text-neutral-500 mt-1">Get started by clicking 'Add New Video' above.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Stats Tab */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#121316] border border-white/[0.04] rounded-2xl p-6">
              <h3 className="text-sm font-black tracking-widest uppercase mb-4 flex items-center space-x-2">
                <FolderOpen className="w-4 h-4 text-[#7C6F9F]" />
                <span>Format Composition</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5 text-neutral-400">
                    <span>Long Form Videos</span>
                    <span>{longFormCount} ({totalCount ? Math.round((longFormCount/totalCount)*100) : 0}%)</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#7C6F9F] to-[#B8AECF] rounded-full" style={{ width: `${totalCount ? (longFormCount/totalCount)*100 : 0}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5 text-neutral-400">
                    <span>Short Form Shorts</span>
                    <span>{shortFormCount} ({totalCount ? Math.round((shortFormCount/totalCount)*100) : 0}%)</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" style={{ width: `${totalCount ? (shortFormCount/totalCount)*100 : 0}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#121316] border border-white/[0.04] rounded-2xl p-6">
              <h3 className="text-sm font-black tracking-widest uppercase mb-4 flex items-center space-x-2">
                <Tag className="w-4 h-4 text-[#7C6F9F]" />
                <span>Category Distribution</span>
              </h3>
              <div className="space-y-3">
                {["YouTube", "Gaming", "Documentary", "Commercial", "Motion Graphics", "Short Form", "Long Form"].map((cat) => {
                  const count = projects.filter(p => p.category === cat).length;
                  const pct = totalCount ? Math.round((count / totalCount) * 100) : 0;
                  return (
                    <div key={cat} className="flex items-center justify-between text-xs font-mono py-1.5 border-b border-white/[0.02] last:border-0">
                      <span className="text-neutral-300 font-medium">{cat}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-neutral-500">{count} items</span>
                        <span className="bg-white/5 text-neutral-300 px-2 py-0.5 rounded text-[10px] font-bold">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

interface ProjectFormProps {
  project: Project;
  onSave: (p: Project) => void;
  onCancel: () => void;
  isNew: boolean;
}

function ProjectForm({ project, onSave, onCancel, isNew }: ProjectFormProps) {
  const [form, setForm] = useState<Project>({ ...project });
  const [tagsStr, setTagsStr] = useState((project.skills || []).join(", "));
  const [videoUrlInput, setVideoUrlInput] = useState(() => {
    return project.videoUrl || project.youtubeLink || "";
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFieldChange = (field: keyof Project, value: unknown) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  // Extract metadata when user changes the Video URL input
  const handleVideoUrlChange = (val: string) => {
    setVideoUrlInput(val);
    const parsed = parseVideoUrl(val);
    setForm((f) => ({
      ...f,
      youtubeLink: parsed.youtubeLink || "",
      youtubeEmbed: parsed.youtubeEmbed || "",
      videoUrl: parsed.videoUrl || "",
    }));
  };

  // Attempt to auto extract thumbnail if it is YouTube
  const handleAutoExtractThumbnail = () => {
    const thumb = getYoutubeThumbnail(videoUrlInput);
    if (thumb) {
      handleFieldChange("thumbnail", thumb);
    } else {
      alert("Auto extraction is only available for YouTube URLs (including Shorts).");
    }
  };

  // Base64 file converter for custom uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      handleFieldChange("thumbnail", b64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.client) {
      alert("Please fill out all required fields marked with *");
      return;
    }

    // Auto calculate ID if isNew
    const finalId = form.id || form.title.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") + "-" + Math.floor(Math.random() * 1000);

    const skills = tagsStr.split(",").map((k) => k.trim()).filter(Boolean);

    // Apply smart fallback categories based on duration if Short Form
    let category = form.category;
    if (form.duration.startsWith("00:") && category !== "Short Form") {
      category = "Short Form";
    }

    // Provide default platform and year if missing
    const platform = form.platform || "YouTube";
    const year = form.year || new Date().getFullYear().toString();

    onSave({
      ...form,
      id: finalId,
      skills,
      category,
      platform,
      year,
    });
  };

  const inputCls = "w-full bg-[#121316] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#7C6F9F] transition-all placeholder-neutral-600";
  const labelCls = "block text-[10px] font-mono tracking-widest text-[#8A919E] uppercase mb-1.5 font-bold";

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-[#0E0F12]/80 backdrop-blur-md border-b border-white/[0.06] py-5 px-6 sm:px-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <button 
              onClick={onCancel}
              className="p-2 hover:bg-white/5 border border-white/10 hover:border-white/20 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#8A919E]" />
            </button>
            <div>
              <h1 className="font-black text-lg tracking-wider uppercase">
                {isNew ? "Add Video Campaign" : "Edit Video Campaign"}
              </h1>
              <p className="text-[#8A919E] text-[10px] font-mono uppercase tracking-wide mt-0.5">
                {isNew ? "Publish new masterpiece" : "Modify existing campaign attributes"}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onCancel}
            className="text-neutral-500 hover:text-white text-xs font-mono tracking-widest uppercase transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8">
        <form onSubmit={handleSubmit} className="bg-[#0E0F12] border border-white/[0.04] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          
          {/* Main Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Title */}
            <div>
              <label className={labelCls}>Video Title *</label>
              <input 
                required 
                type="text"
                placeholder="Pay with Meta Glasses"
                className={inputCls} 
                value={form.title} 
                onChange={(e) => handleFieldChange("title", e.target.value)} 
              />
            </div>

            {/* Client */}
            <div>
              <label className={labelCls}>Client Name *</label>
              <input 
                required 
                type="text"
                placeholder="Tech Creator (10M+ Audience)"
                className={inputCls} 
                value={form.client} 
                onChange={(e) => handleFieldChange("client", e.target.value)} 
              />
            </div>

            {/* Combined Video URL Input */}
            <div className="sm:col-span-2">
              <label className={labelCls}>Video URL (YouTube/Vimeo/MP4) *</label>
              <div className="relative">
                <input 
                  required 
                  type="url"
                  placeholder="Paste YouTube Link, Shorts, Vimeo, or direct MP4 URL"
                  className={`${inputCls} pr-20`}
                  value={videoUrlInput} 
                  onChange={(e) => handleVideoUrlChange(e.target.value)} 
                />
                <div className="absolute right-3.5 top-2.5 flex items-center text-[9px] font-mono bg-white/[0.03] border border-white/10 px-2 py-1 rounded text-neutral-400">
                  <Link className="w-3 h-3 mr-1" />
                  <span>RESOLVING</span>
                </div>
              </div>
              <p className="text-[10px] font-mono text-neutral-500 mt-1.5 leading-relaxed">
                Supports standard video formats. YouTube links and YouTube Shorts links automatically construct embedded components in your catalog!
              </p>
            </div>

            {/* Category */}
            <div>
              <label className={labelCls}>Category Filter *</label>
              <select 
                required 
                className={inputCls} 
                value={form.category} 
                onChange={(e) => handleFieldChange("category", e.target.value as Project["category"])}
              >
                {["YouTube", "Gaming", "Documentary", "Commercial", "Motion Graphics", "Short Form", "Long Form"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Platform */}
            <div>
              <label className={labelCls}>Platform *</label>
              <input 
                required
                type="text"
                placeholder="YouTube Shorts, Instagram, TikTok, etc."
                className={inputCls} 
                value={form.platform || ""} 
                onChange={(e) => handleFieldChange("platform", e.target.value)} 
              />
            </div>

            {/* Duration */}
            <div>
              <label className={labelCls}>Video Duration *</label>
              <input 
                required 
                type="text"
                placeholder="00:30 (Shorts) or 11:45 (Long Form)"
                className={inputCls} 
                value={form.duration} 
                onChange={(e) => handleFieldChange("duration", e.target.value)} 
              />
            </div>

            {/* Project Year */}
            <div>
              <label className={labelCls}>Completion Year *</label>
              <input 
                required
                type="text"
                placeholder="2024"
                className={inputCls} 
                value={form.year || ""} 
                onChange={(e) => handleFieldChange("year", e.target.value)} 
              />
            </div>
          </div>

          {/* Description Block */}
          <div>
            <label className={labelCls}>Project Description & Retentive Concept *</label>
            <textarea 
              required 
              rows={3} 
              placeholder="Provide a compelling explanation detailing the concept, visual storytelling hook, and editing mechanics implemented..."
              className={inputCls} 
              value={form.description} 
              onChange={(e) => handleFieldChange("description", e.target.value)} 
            />
          </div>

          {/* Custom Thumbnail Block */}
          <div className="bg-white/[0.02] border border-white/[0.04] p-5.5 rounded-2xl space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#B8AECF] flex items-center space-x-2">
              <ImageIcon className="w-4 h-4" />
              <span>Video Thumbnail Artwork</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] font-mono text-neutral-400 block mb-1">Thumbnail Image URL</label>
                  <input 
                    type="url"
                    placeholder="Enter image URL"
                    className={inputCls} 
                    value={form.thumbnail || ""} 
                    onChange={(e) => handleFieldChange("thumbnail", e.target.value)} 
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {/* YouTube Auto Button */}
                  <button
                    type="button"
                    onClick={handleAutoExtractThumbnail}
                    className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-mono tracking-wider transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <Sparkle className="w-3.5 h-3.5 text-[#7C6F9F] fill-[#7C6F9F]" />
                    <span>Auto Extract YouTube Cover</span>
                  </button>

                  {/* Upload input label */}
                  <label className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-mono tracking-wider transition-all cursor-pointer flex items-center space-x-1.5">
                    <Plus className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Upload Image File</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileUpload} 
                    />
                  </label>
                </div>
              </div>

              {/* Preview Block */}
              <div className="border border-white/10 rounded-xl overflow-hidden bg-neutral-950 flex flex-col items-center justify-center relative aspect-video p-2 text-center">
                {form.thumbnail ? (
                  <>
                    <img 
                      src={form.thumbnail} 
                      alt="Thumbnail Preview" 
                      className="w-full h-full object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => handleFieldChange("thumbnail", "")}
                      className="absolute top-3 right-3 bg-black/80 border border-white/15 p-1.5 rounded-full hover:bg-black text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <div className="space-y-1">
                    <ImageIcon className="w-6 h-6 mx-auto text-neutral-600 animate-pulse" />
                    <span className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest">No Artwork Selected</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={labelCls}>Portfolio Keywords & Tags (comma separated)</label>
            <input 
              type="text"
              placeholder="AIWorkflow, MotionGraphics, Storytelling, Pacing"
              className={inputCls} 
              value={tagsStr} 
              onChange={(e) => setTagsStr(e.target.value)} 
            />
          </div>

          {/* Status Switches Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/[0.04] pt-5">
            {/* Pinned to Top */}
            <div 
              onClick={() => handleFieldChange("pinned", !form.pinned)}
              className={`border p-4.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                form.pinned 
                  ? "bg-amber-500/5 border-amber-500/20 text-amber-400" 
                  : "bg-white/[0.02] border-white/[0.04] text-neutral-400 hover:border-white/10"
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono tracking-wider uppercase block font-bold">Pin to Top</span>
                <span className="text-[9px] text-neutral-500 block">Force top priority grid display</span>
              </div>
              <div className={`w-8 h-4 rounded-full transition-colors flex items-center px-0.5 ${form.pinned ? "bg-amber-400 justify-end" : "bg-neutral-800 justify-start"}`}>
                <div className="w-3.5 h-3.5 bg-black rounded-full shadow-inner" />
              </div>
            </div>

            {/* Featured */}
            <div 
              onClick={() => handleFieldChange("featured", form.featured === false ? true : false)}
              className={`border p-4.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                form.featured !== false 
                  ? "bg-blue-500/5 border-blue-500/20 text-blue-400" 
                  : "bg-white/[0.02] border-white/[0.04] text-neutral-400 hover:border-white/10"
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono tracking-wider uppercase block font-bold">Featured Video</span>
                <span className="text-[9px] text-neutral-500 block">Include in active gallery layout</span>
              </div>
              <div className={`w-8 h-4 rounded-full transition-colors flex items-center px-0.5 ${form.featured !== false ? "bg-blue-400 justify-end" : "bg-neutral-800 justify-start"}`}>
                <div className="w-3.5 h-3.5 bg-black rounded-full shadow-inner" />
              </div>
            </div>

            {/* Recent Work */}
            <div 
              onClick={() => handleFieldChange("isRecent", !form.isRecent)}
              className={`border p-4.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                form.isRecent 
                  ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
                  : "bg-white/[0.02] border-white/[0.04] text-neutral-400 hover:border-white/10"
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono tracking-wider uppercase block font-bold">Recent Work</span>
                <span className="text-[9px] text-neutral-500 block">Display in default curated tab</span>
              </div>
              <div className={`w-8 h-4 rounded-full transition-colors flex items-center px-0.5 ${form.isRecent ? "bg-emerald-400 justify-end" : "bg-neutral-800 justify-start"}`}>
                <div className="w-3.5 h-3.5 bg-black rounded-full shadow-inner" />
              </div>
            </div>
          </div>

          {/* Advanced Visual controls Toggle Accordion */}
          <div className="border-t border-white/[0.04] pt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors font-mono text-[10px] uppercase tracking-wider py-1 cursor-pointer"
            >
              <Settings2 className="w-3.5 h-3.5 text-[#7C6F9F]" />
              <span>{showAdvanced ? "Hide Advanced Setup Controls" : "Show Advanced Setup Controls"}</span>
            </button>

            {showAdvanced && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 border-t border-white/[0.02] pt-5"
              >
                <div>
                  <label className={labelCls}>Strong Metric Result *</label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g. 5M+ Views, 25M+ Audience, 120 Videos Edited, etc."
                    className={inputCls} 
                    value={form.result || ""} 
                    onChange={(e) => handleFieldChange("result", e.target.value)} 
                  />
                </div>
                <div>
                  <label className={labelCls}>Role / Title Credit</label>
                  <input 
                    type="text"
                    placeholder="Video Editor & Motion Designer"
                    className={inputCls} 
                    value={form.role} 
                    onChange={(e) => handleFieldChange("role", e.target.value)} 
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Instagram Reel / Showcase Link (Optional)</label>
                  <input 
                    type="url"
                    placeholder="https://www.instagram.com/reel/..."
                    className={inputCls} 
                    value={form.instagramLink || ""} 
                    onChange={(e) => handleFieldChange("instagramLink", e.target.value)} 
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3.5 pt-4.5 border-t border-white/[0.04]">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-6 py-3 border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-xl text-xs font-mono tracking-widest uppercase transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-3 bg-[#7C6F9F] hover:bg-[#8A7BB3] text-black font-extrabold rounded-xl text-xs tracking-widest uppercase transition-all shadow-lg hover:shadow-[#7C6F9F]/10 cursor-pointer"
            >
              Publish Video
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
