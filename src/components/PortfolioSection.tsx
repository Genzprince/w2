import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Pin, Lock, Unlock, Save } from "lucide-react";
import { Project } from "../types";
import { useProjects } from "../hooks/useProjects";
import ProjectCaseStudy from "./ProjectCaseStudy";
import ShowreelBanner from "./ShowreelBanner";

function getAutoplayEmbedUrl(embedUrl: string | undefined): string {
  if (!embedUrl) return "";
  const matches = embedUrl.match(/\/embed\/([^?#]+)/);
  const videoId = matches ? matches[1] : "";
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${videoId}&playsinline=1&rel=0&start=0&cc_load_policy=0`;
  }
  return `${embedUrl}?autoplay=1&mute=1&controls=0&playsinline=1&start=0&cc_load_policy=0`;
}

function getInstagramEmbedUrl(link: string | undefined): string {
  if (!link) return "";
  const baseUrl = link.split('?')[0];
  const normalized = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalized}embed/`;
}

export default function PortfolioSection() {
  const { projects: PORTFOLIO_PROJECTS, loading, refetch } = useProjects();
  const [activeFormat, setActiveFormat] = useState<"long" | "short">("long");
  const [selectedCategory, setSelectedCategory] = useState<string>("Recent Work");
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  
  // Case Study modal state
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);

  // Admin Access and Edit States
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return sessionStorage.getItem("portfolio_is_admin") === "true";
    } catch {
      return false;
    }
  });
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  const [localProjects, setLocalProjects] = useState<Project[]>([]);

  // Sync and initialize isRecent fields when projects finish loading
  useEffect(() => {
    if (PORTFOLIO_PROJECTS && PORTFOLIO_PROJECTS.length > 0) {
      const initialized = PORTFOLIO_PROJECTS.map((p) => {
        if (p.isRecent !== undefined) {
          return p;
        }
        // Fallback default showcased projects if not defined in database
        const defaultRecents = [
          "pay-with-meta-glasses",
          "no-magic-pill",
          "bolt-motivation",
          "inside-the-unknown",
          "debate-highlights"
        ];
        return {
          ...p,
          isRecent: defaultRecents.includes(p.id)
        };
      });
      setLocalProjects(initialized);
    }
  }, [PORTFOLIO_PROJECTS]);

  // Keep admin status persisted for the session
  useEffect(() => {
    try {
      sessionStorage.setItem("portfolio_is_admin", isAdmin ? "true" : "false");
    } catch (e) {
      console.error(e);
    }
  }, [isAdmin]);

  const toggleRecent = (id: string) => {
    if (!isAdmin) return; // Only Admin can toggle pins!
    setLocalProjects((prev) => {
      const updated = prev.map((p) => {
        if (p.id === id) {
          return { ...p, isRecent: !p.isRecent };
        }
        return p;
      });
      setHasUnsavedChanges(true);
      return updated;
    });
  };

  // Dynamic filter categories based on active format, with "Recent Work" as the very first tab
  const LONG_CATEGORIES = ["Recent Work", "All", "Commercial", "Gaming", "Events", "Documentary", "Commentary"];
  const SHORT_CATEGORIES = ["Recent Work", "All", "Commercial", "Gaming", "Events", "Motion Graphics", "Mystery"];
  
  const currentCategories = activeFormat === "long" ? LONG_CATEGORIES : SHORT_CATEGORIES;

  // Split projects based on duration (starts with 00: for short form, e.g. 00:45)
  const sortedProjects = [...localProjects].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const longFormProjects = sortedProjects.filter(p => !p.duration.startsWith("00:") && p.featured !== false);
  const shortFormProjects = sortedProjects.filter(p => p.duration.startsWith("00:") && p.featured !== false);

  const activeProjects = activeFormat === "long" ? longFormProjects : shortFormProjects;

  const filteredProjects = selectedCategory === "Recent Work"
    ? activeProjects.filter(p => p.isRecent)
    : selectedCategory === "All"
    ? activeProjects
    : activeProjects.filter(p => {
        const catLower = selectedCategory.toLowerCase();
        
        // Special robust handling for "Events"
        if (catLower === "events") {
          return (
            (p.category && p.category.toLowerCase().includes("event")) ||
            p.skills.some(k => k.toLowerCase().includes("event") || k.toLowerCase().includes("festival") || k.toLowerCase().includes("campaign"))
          );
        }
        
        return (
          (p.category && p.category.toLowerCase().includes(catLower)) ||
          p.skills.some(k => k.toLowerCase().includes(catLower))
        );
      });

  const handleOpenCaseStudy = (project: Project) => {
    setActiveProject(project);
    setIsCaseStudyOpen(true);
  };

  // Stagger Container Animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  // Card slide from bottom to top smoothly
  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 26
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: {
        duration: 0.12
      }
    }
  };

  return (
    <section id="portfolio" className="relative py-2 md:py-5 bg-[var(--bg-primary)] px-3 sm:px-6 md:px-12 xl:px-16 border-t border-[var(--border-color)] overflow-hidden transition-colors duration-500">
      
      <div className="w-full max-w-[1440px] mx-auto z-10 relative">
        
        {/* High-impact cinematic showreel banner */}
        <div className="mb-6 md:mb-8">
          <ShowreelBanner />
        </div>
        
        {/* Section Header - Centered as requested */}
        <div className="mb-12 text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
          <div className="inline-flex items-center gap-3">
            <div className="inline-flex items-center space-x-2 bg-[var(--accent-bg-trans)] border border-[var(--accent-color)]/20 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-[var(--accent-color)] font-bold uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-pulse" />
              <span>PORTFOLIO SHOWCASE</span>
            </div>
            
            <button
              onClick={() => {
                if (isAdmin) {
                  setIsAdmin(false);
                  setHasUnsavedChanges(false);
                  if (PORTFOLIO_PROJECTS) {
                    setLocalProjects(PORTFOLIO_PROJECTS.map(p => ({
                      ...p,
                      isRecent: p.isRecent ?? [
                        "pay-with-meta-glasses",
                        "no-magic-pill",
                        "bolt-motivation",
                        "inside-the-unknown",
                        "debate-highlights"
                      ].includes(p.id)
                    })));
                  }
                } else {
                  setShowAdminModal(true);
                }
              }}
              className={`p-1.5 rounded-full border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                isAdmin
                  ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/60 hover:scale-105"
                  : "bg-neutral-900/40 text-neutral-500 border-neutral-800 hover:text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800/60 hover:scale-105"
              }`}
              title={isAdmin ? "Exit Editor Mode" : "Admin Login"}
            >
              {isAdmin ? (
                <Unlock className="w-3.5 h-3.5" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
            </button>

            {isAdmin && (
              <a
                href="/admin"
                className="inline-flex items-center space-x-1.5 bg-[#7C6F9F] text-black px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase hover:bg-[#8A7BB3] hover:scale-103 transition-all duration-300 shadow-md font-black"
                title="Open Portfolio Manager Dashboard"
              >
                <span>PORTFOLIO MANAGER ⚙️</span>
              </a>
            )}
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">
            Featured Projects
          </h2>
          <div className="relative w-[200px] mx-auto mt-1.5 mb-3">
            <div className="h-[3.5px] rounded-full" style={{ background: "var(--cozy-line)" }} />
            <div className="absolute inset-0 h-[3.5px] rounded-full opacity-60" style={{ background: "var(--cozy-line)", filter: "blur(6px)" }} />
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
            A collection of high-impact edits built for creators, brands, and millions of viewers. Every frame is designed to engage, retain, and convert.
          </p>
        </div>

        {/* Unified Format Selector - High-Fidelity Segmented Control */}
        <div className="flex justify-center mb-10">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-full p-1.5 flex space-x-1 relative shadow-lg">
            <button
              onClick={() => {
                setActiveFormat("long");
                setSelectedCategory("Recent Work");
              }}
              className={`relative z-10 px-6 sm:px-8 py-3 rounded-full text-xs font-mono tracking-widest font-bold uppercase transition-colors duration-150 cursor-pointer ${
                activeFormat === "long" ? "text-black dark:text-black" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {activeFormat === "long" && (
                <motion.div
                  layoutId="activeFormatBg"
                  className="absolute inset-0 bg-[var(--accent-color)] rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 550, damping: 28 }}
                />
              )}
              LONG FORM VIDEOS
            </button>
            <button
              onClick={() => {
                setActiveFormat("short");
                setSelectedCategory("Recent Work");
              }}
              className={`relative z-10 px-6 sm:px-8 py-3 rounded-full text-xs font-mono tracking-widest font-bold uppercase transition-colors duration-150 cursor-pointer ${
                activeFormat === "short" ? "text-black dark:text-black" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {activeFormat === "short" && (
                <motion.div
                  layoutId="activeFormatBg"
                  className="absolute inset-0 bg-[var(--accent-color)] rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 550, damping: 28 }}
                />
              )}
              SHORT FORM SHORTS
            </button>
          </div>
        </div>

        {/* Dynamic Category Filters - Centered as well */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12 pb-4 border-b border-[var(--border-color)] transition-colors">
          {currentCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-5 py-2.5 rounded-full text-xs font-mono tracking-wider font-semibold transition-colors duration-200 cursor-pointer border ${
                  isActive
                    ? "text-black border-transparent font-bold shadow-md"
                    : "bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--accent-bg-trans)] hover:text-[var(--text-primary)]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryBg"
                    className="absolute inset-0 bg-[var(--accent-color)] rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 550, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{cat.toUpperCase()}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="text-[var(--text-secondary)] font-mono text-xs tracking-widest animate-pulse">LOADING PROJECTS...</span>
          </div>
        ) : (
        <div className="min-h-[400px] sm:min-h-[485px] transition-all duration-300 relative">
          <AnimatePresence mode="popLayout">
          <motion.div
            layout
            key={activeFormat + "-" + selectedCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`grid ${
              activeFormat === "short" && filteredProjects.length > 0
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto gap-4" 
                : filteredProjects.length > 0
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "grid-cols-1 w-full"
            }`}
          >
            {filteredProjects.length === 0 ? (
              <div className="col-span-full py-16 px-6 text-center border border-dashed border-[var(--border-color)] rounded-2xl bg-[var(--card-bg)]/20 backdrop-blur-sm max-w-lg mx-auto flex flex-col items-center justify-center space-y-5">
                <div className="bg-neutral-800/40 p-3.5 rounded-full border border-neutral-700/50 shadow-inner">
                  <Pin className="w-6 h-6 text-[var(--accent-color)] animate-bounce" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-display font-bold text-[var(--text-primary)] uppercase tracking-wider">No videos in Recent Work</h3>
                  <p className="text-xs text-neutral-400 font-light max-w-sm leading-relaxed">
                    Pin your favorite videos from other categories (like <span className="text-[var(--accent-color)] font-medium">All</span>) using the pin button in the top-right of the card to showcase them here!
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="px-5 py-2.5 rounded-xl text-[11px] font-mono tracking-widest font-bold bg-[var(--accent-color)] text-black hover:bg-[var(--accent-hover)] transition-all duration-300 shadow-md cursor-pointer uppercase"
                >
                  Browse All Videos
                </button>
              </div>
            ) : (
              filteredProjects.map((project) => {
                const isHovered = hoveredProjectId === project.id;
                const isShort = activeFormat === "short";
                
                return (
                  <motion.div
                    key={project.id}
                    variants={cardVariants}
                    whileHover={{ y: -8, scale: 1.025, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                    transition={{ type: "spring", stiffness: 450, damping: 18 }}
                    onMouseEnter={() => setHoveredProjectId(project.id)}
                    onMouseLeave={() => setHoveredProjectId(null)}
                    onClick={() => handleOpenCaseStudy(project)}
                    data-cursor="view"
                    data-cursor-text="CASE STUDY"
                    className="group bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden hover:border-[var(--accent-color)]/60 transition-colors duration-150 cursor-pointer flex flex-col justify-between relative"
                  >
                    
                    {/* Card Visual Stage - Completely clean of text/overlays for video screen */}
                    <div 
                      className={`relative overflow-hidden flex flex-col justify-between p-3 sm:p-5 transition-all duration-200 w-full ${
                      isShort ? "aspect-[9/14]" : "h-56"
                    }`}
                    style={{ 
                      background: "linear-gradient(135deg, #0d0e11, #18191e)"
                    }}
                  >
                    {project.youtubeEmbed ? (
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                        <iframe
                          className={`w-full h-full object-cover pointer-events-none ${
                            isShort ? "scale-100" : "scale-[1.35]"
                          }`}
                          src={getAutoplayEmbedUrl(project.youtubeEmbed)}
                          title={project.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                      </div>
                    ) : project.instagramLink ? (
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                        <iframe
                          className={`w-full h-full object-cover pointer-events-none ${
                            isShort ? "scale-100" : "scale-[1.15]"
                          }`}
                          src={getInstagramEmbedUrl(project.instagramLink)}
                          title={project.title}
                          frameBorder="0"
                          scrolling="no"
                          allowTransparency
                        />
                        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                      </div>
                    ) : project.videoUrl ? (
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                        <video
                          className="w-full h-full object-cover"
                          src={project.videoUrl}
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                      </div>
                    ) : project.thumbnail ? (
                      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-colors duration-300" />
                      </div>
                    ) : null}
                    
                    {/* Subtle grid line style */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
                    
                    {/* Hover reflection glint */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Visual indicator if pinned */}
                    {project.pinned && (
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-black/75 border border-amber-500/40 text-amber-400 p-1.5 rounded-full backdrop-blur-md shadow-md" title="Pinned to Top">
                        <Pin className="w-3.5 h-3.5 fill-amber-400 rotate-45" />
                      </div>
                    )}

                    {/* Floating Pin/Unpin Toggle Button - ONLY VISIBLE TO LOGGED IN ADMIN */}
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRecent(project.id);
                        }}
                        className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full border backdrop-blur-md transition-all duration-300 shadow-md ${
                          project.isRecent
                            ? "bg-[var(--accent-color)] text-black border-[var(--accent-color)] scale-105"
                            : "bg-black/55 text-neutral-300 border-neutral-700/60 hover:bg-black/85 hover:text-white hover:scale-105"
                        }`}
                        title={project.isRecent ? "Remove from Recent Work" : "Pin to Recent Work"}
                      >
                        <Pin className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 ${project.isRecent ? "fill-black rotate-45 text-black" : "group-hover:rotate-12"}`} />
                      </button>
                    )}
                  </div>

                  {/* Card Content Footer */}
                  <div className={`flex-1 flex flex-col justify-between bg-[var(--bg-secondary)] border-t border-[var(--border-color)] transition-all duration-500 ${
                    isShort ? "p-3.5 sm:p-4.5 space-y-2 sm:space-y-2.5" : "p-4 sm:p-6 space-y-2.5 sm:space-y-3.5"
                  }`}>
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono tracking-widest text-[var(--accent-color)] uppercase font-bold bg-[var(--accent-bg-trans)] border border-[var(--accent-color)]/10 px-2 py-0.5 rounded-md">
                          {project.category}
                        </span>
                        {project.result && (
                          <div className="flex items-center gap-1 bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase tracking-wider">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                            {project.result}
                          </div>
                        )}
                      </div>
                      
                      <h3 className={`font-display font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors duration-300 uppercase leading-snug ${
                        isShort ? "text-sm sm:text-base line-clamp-1" : "text-lg"
                      }`}>
                        {project.title}
                      </h3>
                      
                      <p className={`text-[var(--text-primary)] dark:opacity-80 opacity-95 leading-relaxed font-normal ${
                        isShort ? "text-[11px] sm:text-xs line-clamp-2" : "text-xs line-clamp-2"
                      }`}>
                        {project.description}
                      </p>
                    </div>

                    {/* Structural pill tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-[var(--border-color)] items-center">
                      <div className="flex flex-wrap gap-1">
                        {project.skills.slice(0, 3).map((skill, sIdx) => (
                          <span 
                            key={sIdx} 
                            className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-md px-2 py-0.5 text-[9px] font-mono text-[var(--text-secondary)] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-[var(--accent-color)] font-bold ml-auto flex items-center whitespace-nowrap group-hover:underline">
                        View Project →
                      </span>
                    </div>
                  </div>

                </motion.div>
              );
            })
          )}
          </motion.div>
        </AnimatePresence>
        </div>
        )}
      </div>

      {/* Elegant Admin Passcode Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
            >
              {/* Visual gradient top border */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--accent-color)] to-amber-500" />
              
              <h3 className="text-base font-display font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[var(--accent-color)]" />
                Editor Access Mode
              </h3>
              <p className="text-xs text-neutral-400 font-light mb-5 leading-relaxed">
                Only the portfolio owner can customize which videos appear in <span className="text-[var(--accent-color)] font-medium">Recent Work</span>.
              </p>
              
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const res = await fetch("/api/admin/verify", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ password: adminPassword })
                    });
                    if (res.ok) {
                      setIsAdmin(true);
                      setShowAdminModal(false);
                      try {
                        sessionStorage.setItem("portfolio_admin_passcode", adminPassword);
                      } catch (err) {
                        console.error(err);
                      }
                      setAdminPassword("");
                      setAdminError("");
                    } else {
                      setAdminError("Invalid administrator passcode.");
                    }
                  } catch (err) {
                    console.error("Auth error, using fallback:", err);
                    if (adminPassword === "prince2026") {
                      setIsAdmin(true);
                      setShowAdminModal(false);
                      try {
                        sessionStorage.setItem("portfolio_admin_passcode", adminPassword);
                      } catch (e) {
                        console.error(e);
                      }
                      setAdminPassword("");
                      setAdminError("");
                    } else {
                      setAdminError("Invalid administrator passcode.");
                    }
                  }
                }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block">
                    Admin Passcode
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setAdminError("");
                    }}
                    placeholder="••••••••"
                    autoFocus
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[var(--accent-color)] transition-colors text-center tracking-widest font-mono"
                  />
                  {adminError && (
                    <p className="text-[10px] text-red-500 font-mono mt-1 text-center">
                      {adminError}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminModal(false);
                      setAdminPassword("");
                      setAdminError("");
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl text-xs font-mono tracking-wider font-bold border border-neutral-800 hover:bg-neutral-800 text-neutral-400 transition-colors uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 rounded-xl text-xs font-mono tracking-wider font-bold bg-[var(--accent-color)] text-black hover:bg-[var(--accent-hover)] transition-colors uppercase cursor-pointer"
                  >
                    Unlock
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Unsaved Changes Bar for Admin */}
      <AnimatePresence>
        {isAdmin && hasUnsavedChanges && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-950 border border-emerald-500/30 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center gap-4 shadow-2xl backdrop-blur-md max-w-lg w-[calc(100%-2rem)]"
          >
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="bg-emerald-950/80 p-2 rounded-full text-emerald-400 border border-emerald-500/20 shadow-inner">
                <Unlock className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">Unsaved Pin Changes</h4>
                <p className="text-[10px] text-neutral-400 font-light mt-0.5 leading-none">
                  {saveStatus === "success" 
                    ? "✓ Recent Work showcase saved successfully!" 
                    : saveStatus === "error" 
                    ? "❌ Failed to save. Please try again." 
                    : "You have customized the Recent Work showcase."}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto ml-auto">
              {saveStatus === "idle" && (
                <>
                  <button
                    onClick={() => {
                      if (PORTFOLIO_PROJECTS) {
                        setLocalProjects(PORTFOLIO_PROJECTS.map(p => ({
                          ...p,
                          isRecent: p.isRecent ?? [
                            "pay-with-meta-glasses",
                            "no-magic-pill",
                            "bolt-motivation",
                            "inside-the-unknown",
                            "debate-highlights"
                          ].includes(p.id)
                        })));
                      }
                      setHasUnsavedChanges(false);
                      setSaveStatus("idle");
                    }}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-[10px] font-mono tracking-widest font-bold border border-neutral-800 hover:bg-neutral-800 text-neutral-400 transition-colors uppercase cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    onClick={async () => {
                      setIsSaving(true);
                      setSaveStatus("saving");
                      const savedPasscode = sessionStorage.getItem("portfolio_admin_passcode") || "prince2026";
                      try {
                        const response = await fetch("/api/projects", {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            "x-admin-password": savedPasscode
                          },
                          body: JSON.stringify(localProjects)
                        });
                        if (response.ok) {
                          setSaveStatus("success");
                          if (refetch) {
                            await refetch();
                          }
                          setTimeout(() => {
                            setHasUnsavedChanges(false);
                            setSaveStatus("idle");
                          }, 2500);
                        } else {
                          setSaveStatus("error");
                          setTimeout(() => setSaveStatus("idle"), 3000);
                        }
                      } catch (e) {
                        console.error(e);
                        setSaveStatus("error");
                        setTimeout(() => setSaveStatus("idle"), 3000);
                      } finally {
                        setIsSaving(false);
                      }
                    }}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-[10px] font-mono tracking-widest font-bold bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50 transition-colors uppercase cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isSaving ? "Saving..." : "Save Showcase"}
                  </button>
                </>
              )}
              {saveStatus === "saving" && (
                <span className="text-[10px] font-mono text-emerald-400 animate-pulse">SAVING TO DATABASE...</span>
              )}
              {saveStatus === "success" && (
                <span className="text-[10px] font-mono text-emerald-400 font-bold">✓ SAVED!</span>
              )}
              {saveStatus === "error" && (
                <span className="text-[10px] font-mono text-red-400 font-bold">❌ FAILED</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Case Study Modal renderer */}
      <AnimatePresence>
        {isCaseStudyOpen && (
          <ProjectCaseStudy
            project={activeProject}
            isOpen={isCaseStudyOpen}
            onClose={() => setIsCaseStudyOpen(false)}
            onNavigate={(nextProj) => setActiveProject(nextProj)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
