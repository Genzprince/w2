import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { X, Clock, CheckCircle, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw, Youtube, Instagram, Linkedin, Twitter, ExternalLink, Laptop, Subtitles, ChevronLeft, ChevronRight } from "lucide-react";
import { Project, PORTFOLIO_PROJECTS } from "../types";

const VIDEO_SOURCES: Record<string, string> = {
  "anatomy-of-obsession": "https://assets.mixkit.co/videos/preview/mixkit-cinematic-view-of-clouds-from-a-hilltop-41910-large.mp4",
  "porsche-poetry": "https://assets.mixkit.co/videos/preview/mixkit-driving-on-a-highway-at-night-42175-large.mp4",
  "horizon-paradox": "https://assets.mixkit.co/videos/preview/mixkit-glowing-lines-on-a-dark-abstract-background-42168-large.mp4",
  "stripe-founders": "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-person-typing-on-a-laptop-42322-large.mp4",
  "capturing-retention": "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-vertical-format-45062-large.mp4"
};

function getYoutubeId(embedUrl: string | undefined): string {
  if (!embedUrl) return "";
  const matches = embedUrl.match(/\/embed\/([^?#]+)/);
  return matches ? matches[1] : "";
}

function getDirectYoutubeUrl(embedUrl: string | undefined): string {
  if (!embedUrl) return "";
  const matches = embedUrl.match(/\/embed\/([^?#]+)/);
  const videoId = matches ? matches[1] : "";
  if (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
  return embedUrl;
}

function getToolsUsed(projectId: string, category: string): string[] {
  switch (projectId) {
    case "pay-with-meta-glasses":
      return ["Premiere Pro", "After Effects", "Midjourney AI", "Photoshop", "Topaz Video AI"];
    case "no-magic-pill":
      return ["After Effects", "Illustrator", "Premiere Pro", "Audition"];
    case "bolt-motivation":
      return ["Premiere Pro", "After Effects", "Audition", "Photoshop"];
    case "anatomy-of-obsession":
      return ["Premiere Pro", "After Effects", "DaVinci Resolve", "Audition"];
    case "porsche-poetry":
      return ["Premiere Pro", "DaVinci Resolve Studio", "After Effects", "Audition"];
    case "horizon-paradox":
      return ["Premiere Pro", "After Effects", "DaVinci Resolve", "Photoshop"];
    case "stripe-founders":
      return ["Premiere Pro", "After Effects", "Illustrator", "Audition"];
    case "capturing-retention":
      return ["Premiere Pro", "After Effects", "Photoshop"];
    case "inside-the-unknown":
      return ["Premiere Pro", "After Effects", "Audition", "Photoshop"];
    default:
      if (category.toLowerCase().includes("short") || category.toLowerCase().includes("reel")) {
        return ["Premiere Pro", "After Effects", "Photoshop"];
      }
      return ["Premiere Pro", "DaVinci Resolve", "After Effects", "Audition"];
  }
}

interface ProjectCaseStudyProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (project: Project) => void;
}

export default function ProjectCaseStudy({ project, isOpen, onClose, onNavigate }: ProjectCaseStudyProps) {
  if (!isOpen || !project) return null;

  const isShortForm = project.duration.startsWith("00:") || project.category === "Short Form";

  const currentIndex = PORTFOLIO_PROJECTS.findIndex(p => p.id === project.id);
  const nextProject = currentIndex !== -1 && currentIndex < PORTFOLIO_PROJECTS.length - 1 
    ? PORTFOLIO_PROJECTS[currentIndex + 1] 
    : PORTFOLIO_PROJECTS[0];

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem("gilla_isMuted");
    return saved !== null ? saved === "true" : false;
  });
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("gilla_volume");
    return saved !== null ? parseFloat(saved) : 0.5;
  });
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [durationTime, setDurationTime] = useState(project.duration || "00:00");

  const isYoutube = !!project.youtubeEmbed;
  const isInstagramActive = !isYoutube && !!project.instagramLink;
  const ytPlayerRef = useRef<any>(null);
  const [isCcOn, setIsCcOn] = useState(false);

  useEffect(() => {
    if (isYoutube) {
      if (!(window as any).YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
          document.head.appendChild(tag);
        }
      }
    }
  }, [isYoutube]);

  useEffect(() => {
    let intervalId: any;

    if (isYoutube && isOpen) {
      const youtubeId = getYoutubeId(project.youtubeEmbed);
      if (!youtubeId) return;

      const initPlayer = () => {
        const el = document.getElementById("case-study-yt-player");
        if (!el) {
          setTimeout(initPlayer, 50);
          return;
        }

        if (ytPlayerRef.current) {
          try {
            ytPlayerRef.current.destroy();
          } catch (e) {
            console.log("Error destroying old player:", e);
          }
          ytPlayerRef.current = null;
        }

        ytPlayerRef.current = new (window as any).YT.Player("case-study-yt-player", {
          videoId: youtubeId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            playsinline: 1,
            mute: isMuted ? 1 : 0,
            cc_load_policy: 0,
            iv_load_policy: 3,
          },
          events: {
            onReady: (event: any) => {
              event.target.setVolume(volume * 100);
              if (isMuted) {
                event.target.mute();
              } else {
                event.target.unMute();
              }

              try {
                if (typeof event.target.unloadModule === "function") {
                  event.target.unloadModule("captions");
                }
              } catch (e) {
                console.log("Error unloading captions onReady:", e);
              }

              intervalId = setInterval(() => {
                if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === "function") {
                  try {
                    const current = ytPlayerRef.current.getCurrentTime() || 0;
                    const duration = ytPlayerRef.current.getDuration() || 1;
                    setProgress((current / duration) * 100);

                    const mins = Math.floor(current / 60);
                    const secs = Math.floor(current % 60);
                    setCurrentTime(`${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`);

                    const dMins = Math.floor(duration / 60);
                    const dSecs = Math.floor(duration % 60);
                    setDurationTime(`${dMins.toString().padStart(2, "0")}:${dSecs.toString().padStart(2, "0")}`);
                  } catch (e) {
                    console.log("Error querying player state:", e);
                  }
                }
              }, 250);

              event.target.playVideo();
              setIsPlaying(true);
            },
            onStateChange: (event: any) => {
              if (event.data === 1) { // PLAYING
                setIsPlaying(true);
                try {
                  if (!isCcOn && typeof event.target.unloadModule === "function") {
                    event.target.unloadModule("captions");
                  }
                } catch (e) {
                  console.log("Error turning off captions on PLAYING:", e);
                }
              } else if (event.data === 2) { // PAUSED
                setIsPlaying(false);
              } else if (event.data === 0) { // ENDED
                event.target.seekTo(0, true);
                event.target.playVideo();
              }
            }
          }
        });
      };

      if ((window as any).YT && (window as any).YT.Player) {
        const t = setTimeout(initPlayer, 150);
        return () => {
          clearTimeout(t);
          if (intervalId) clearInterval(intervalId);
          if (ytPlayerRef.current) {
            try {
              ytPlayerRef.current.destroy();
            } catch (e) {}
            ytPlayerRef.current = null;
          }
        };
      } else {
        const checkInterval = setInterval(() => {
          if ((window as any).YT && (window as any).YT.Player) {
            clearInterval(checkInterval);
            initPlayer();
          }
        }, 100);

        return () => {
          clearInterval(checkInterval);
          if (intervalId) clearInterval(intervalId);
          if (ytPlayerRef.current) {
            try {
              ytPlayerRef.current.destroy();
            } catch (e) {}
            ytPlayerRef.current = null;
          }
        };
      }
    }
  }, [isYoutube, project.id, isOpen]);

  const videoUrl = project.videoUrl || VIDEO_SOURCES[project.id] || "https://assets.mixkit.co/videos/preview/mixkit-cinematic-view-of-clouds-from-a-hilltop-41910-large.mp4";

  const youtubeUrl = project.youtubeLink || (project.youtubeEmbed ? getDirectYoutubeUrl(project.youtubeEmbed) : undefined);
  const instagramUrl = project.instagramLink;
  const hasYoutube = !!youtubeUrl;
  const hasInstagram = !!instagramUrl;
  const hasLinkedin = !!(project as any).linkedinLink;
  const linkedinUrl = (project as any).linkedinLink || "";
  const hasTwitter = !!(project as any).twitterLink;
  const twitterUrl = (project as any).twitterLink || "";
  const projectLink = youtubeUrl || instagramUrl;

  useEffect(() => {
    // Reset video player state when project changes
    setIsPlaying(true);
    setProgress(0);
    setCurrentTime("00:00");
    
    // 100ms timeout ensures DOM is fully rendered and videoRef.current is assigned
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.muted = isMuted;
        videoRef.current.volume = volume;
        videoRef.current.load();
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((err) => {
              console.log("Auto-playback failed, trying muted fallback:", err);
              // Fallback to muted autoplay if browser blocks unmuted autoplay
              if (videoRef.current) {
                videoRef.current.muted = true;
                setIsMuted(true);
                localStorage.setItem("gilla_isMuted", "true");
                const replayPromise = videoRef.current.play();
                if (replayPromise !== undefined) {
                  replayPromise
                    .then(() => {
                      setIsPlaying(true);
                    })
                    .catch((secondErr) => {
                      console.log("Autoplay entirely blocked:", secondErr);
                      setIsPlaying(false);
                    });
                }
              } else {
                setIsPlaying(false);
              }
            });
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [project.id]);

  const togglePlay = () => {
    if (isYoutube) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.getPlayerState === "function") {
        const state = ytPlayerRef.current.getPlayerState();
        if (state === 1) { // Playing
          ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        }
      }
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.muted = isMuted;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((err) => {
              console.log("Play failed:", err);
              setIsPlaying(false);
            });
        }
      }
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    localStorage.setItem("gilla_isMuted", String(nextMuted));

    if (isYoutube) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.mute === "function") {
        if (nextMuted) {
          ytPlayerRef.current.mute();
        } else {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(volume * 100);
        }
      }
    } else if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (!nextMuted) {
        videoRef.current.volume = volume;
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    localStorage.setItem("gilla_volume", String(newVolume));
    if (newVolume > 0) {
      setIsMuted(false);
      localStorage.setItem("gilla_isMuted", "false");
      if (isYoutube) {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.unMute === "function") {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(newVolume * 100);
        }
      } else if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = newVolume;
      }
    } else {
      setIsMuted(true);
      localStorage.setItem("gilla_isMuted", "true");
      if (isYoutube) {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.mute === "function") {
          ytPlayerRef.current.mute();
        }
      } else if (videoRef.current) {
        videoRef.current.muted = true;
      }
    }
  };

  const jumpTime = (seconds: number) => {
    if (isYoutube) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === "function") {
        const current = ytPlayerRef.current.getCurrentTime() || 0;
        const duration = ytPlayerRef.current.getDuration() || 1;
        const target = Math.max(0, Math.min(duration, current + seconds));
        ytPlayerRef.current.seekTo(target, true);
        setProgress((target / duration) * 100);
      }
    } else if (videoRef.current) {
      const current = videoRef.current.currentTime || 0;
      const duration = videoRef.current.duration || 1;
      const target = Math.max(0, Math.min(duration, current + seconds));
      videoRef.current.currentTime = target;
      setProgress((target / duration) * 100);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        if (document.activeElement.getAttribute("type") !== "range") {
          return;
        }
      }

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "arrowleft":
          e.preventDefault();
          jumpTime(-10);
          break;
        case "arrowright":
          e.preventDefault();
          jumpTime(10);
          break;
        case "arrowup":
          e.preventDefault();
          handleVolumeChange(Math.min(1, volume + 0.1));
          break;
        case "arrowdown":
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 0.1));
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, isMuted, volume, isYoutube]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 1;
      setProgress((current / duration) * 100);
      
      const mins = Math.floor(current / 60);
      const secs = Math.floor(current % 60);
      setCurrentTime(`${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      const duration = videoRef.current.duration || 0;
      const mins = Math.floor(duration / 60);
      const secs = Math.floor(duration % 60);
      setDurationTime(`${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`);
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setProgress(val);

    if (isYoutube) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.getDuration === "function") {
        const duration = ytPlayerRef.current.getDuration() || 1;
        const targetTime = (val / 100) * duration;
        ytPlayerRef.current.seekTo(targetTime, true);
      }
    } else if (videoRef.current) {
      const duration = videoRef.current.duration || 1;
      videoRef.current.currentTime = (val / 100) * duration;
    }
  };

  const handleRestart = () => {
    if (isYoutube) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === "function") {
        ytPlayerRef.current.seekTo(0, true);
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      }
    } else if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((err) => console.log(err));
      setIsPlaying(true);
    }
  };

  const handleFullscreen = () => {
    const wrapper = document.getElementById("case-study-player-wrapper");
    if (wrapper) {
      if (wrapper.requestFullscreen) {
        wrapper.requestFullscreen();
      }
    } else if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const toggleCc = () => {
    if (ytPlayerRef.current) {
      const nextCc = !isCcOn;
      try {
        if (nextCc) {
          if (typeof ytPlayerRef.current.loadModule === "function") {
            ytPlayerRef.current.loadModule("captions");
          }
          if (typeof ytPlayerRef.current.setOption === "function") {
            ytPlayerRef.current.setOption("captions", "track", { languageCode: "en" });
          }
        } else {
          if (typeof ytPlayerRef.current.unloadModule === "function") {
            ytPlayerRef.current.unloadModule("captions");
          }
        }
      } catch (err) {
        console.log("Error toggling captions module:", err);
      }
      setIsCcOn(nextCc);
    } else {
      setIsCcOn(!isCcOn);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 overflow-y-auto">
      
      {/* Background overlay click-away */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className={`relative w-full ${isShortForm ? "max-w-5xl h-[90vh] max-h-[90vh] lg:overflow-hidden overflow-y-auto" : "max-w-5xl h-[92vh] max-h-[92vh] overflow-hidden"} bg-[var(--bg-primary)] rounded-2xl sm:rounded-3xl shadow-2xl text-[var(--text-primary)] z-10 flex flex-col border border-[var(--border-color)] transition-colors duration-500`}
      >
        {isShortForm ? (
          /* Split Layout where left column covers full height with direct big video, right column is scrollable with platforms and metadata */
          <div className="flex flex-col lg:flex-row h-full lg:overflow-hidden">
            
            {/* Left Column - Direct Big Video Player (9:16 Aspect Ratio) with floating controls (60% width) */}
            <div 
              className="w-full lg:w-[60%] aspect-[9/16] lg:aspect-auto h-[50vh] sm:h-[60vh] lg:h-full shrink-0 bg-black flex flex-col justify-center relative overflow-hidden group border-b lg:border-b-0 lg:border-r border-[var(--border-color)]"
            >
              {/* Screen Mask */}
              <div className="w-full h-full relative flex items-center justify-center bg-black">
                {project.youtubeEmbed ? (
                  <div id="case-study-yt-player" className="w-full h-full absolute inset-0 object-cover bg-black" />
                ) : project.instagramLink ? (
                  <iframe
                    className="w-full h-full absolute inset-0 object-cover"
                    src={`${project.instagramLink}embed/`}
                    title={project.title}
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency
                    allowFullScreen
                  />
                ) : (
                  <video
                    ref={videoRef}
                    key={project.id}
                    src={videoUrl}
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onClick={togglePlay}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                )}

                {/* Overlays */}
                <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-20" />

                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-20" />

                {/* Direct play indicator when paused */}
                {!isInstagramActive && !isPlaying && (
                  <div 
                    onClick={togglePlay}
                    className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer z-25"
                  >
                    <motion.div 
                       initial={{ scale: 0.9, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       className="w-14 h-14 rounded-full bg-white/90 text-[#1E2023] flex items-center justify-center shadow-2xl"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5 text-black" />
                    </motion.div>
                  </div>
                )}

                {/* Floating minimalist controls directly on the video */}
                {!isInstagramActive && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-3 bg-black/90 px-4 py-2 rounded-full border border-white/15 shadow-xl z-30 transition-all duration-300 opacity-90 group-hover:opacity-100">
                    <button
                      onClick={() => jumpTime(-10)}
                      className="p-1.5 hover:bg-white/15 rounded-full text-white/70 hover:text-white transition-all cursor-pointer"
                      title="Skip Back 10s"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={togglePlay}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all cursor-pointer"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    </button>

                    <button
                      onClick={() => jumpTime(10)}
                      className="p-1.5 hover:bg-white/15 rounded-full text-white/70 hover:text-white transition-all cursor-pointer"
                      title="Skip Forward 10s"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-[1px] h-4 bg-white/20" />

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={toggleMute}
                        className={`p-1.5 rounded-full transition-all cursor-pointer ${isMuted ? "text-amber-400 hover:text-amber-300" : "text-white/70 hover:text-white"}`}
                        title={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                      
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(Number(e.target.value))}
                        className="w-14 sm:w-16 h-1 accent-amber-500 bg-white/20 rounded-full appearance-none cursor-pointer"
                        title="Volume"
                      />
                    </div>
                  </div>
                )}

                {/* Interactive YouTube-like progress & scrub bar at the very bottom of the short form video */}
                {!isInstagramActive && (
                  <div className="absolute bottom-0 inset-x-0 h-1.5 hover:h-3 bg-black/40 z-40 transition-all duration-200 flex items-center group/scrub">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.1"
                      value={progress}
                      onChange={handleScrub}
                      className="w-full h-full opacity-0 cursor-pointer absolute inset-0 z-10"
                      title="Seek Video"
                    />
                    <div 
                      className="h-full bg-amber-500 relative transition-all duration-75 pointer-events-none" 
                      style={{ width: `${progress}%` }}
                    >
                      {/* Interactive handle on hover */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border border-amber-500 scale-0 group-hover/scrub:scale-100 transition-transform duration-150" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (Scrollable Pane) - Headers, stats, editorial challenge, solution, and tags (40% width) */}
            <div className="w-full lg:w-[40%] flex-1 flex flex-col min-w-0 h-auto lg:h-full lg:overflow-hidden">
              {/* Header inside scrollable view, at the top of Right Column */}
              <div className="p-6 pb-4 border-b border-[var(--border-color)] flex justify-between items-start shrink-0 bg-[var(--bg-secondary)]">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono bg-[var(--accent-bg-trans)] border border-[var(--border-color)]/50 px-2.5 py-0.5 rounded-full uppercase tracking-widest text-[var(--text-secondary)] font-bold">
                    {project.category} CASE STUDY
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight uppercase leading-tight text-[var(--text-primary)]">
                    {project.title}
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] font-mono">
                    Client: {project.client}
                  </p>
                </div>

                {/* Close Button at top of Right column */}
                <button
                  onClick={onClose}
                  className="p-2 bg-[var(--accent-bg-trans)] hover:bg-[var(--border-color)]/45 text-[var(--text-primary)] rounded-full transition-all border border-[var(--border-color)] cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main scrollable body */}
              <div className="flex-1 lg:overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-8">
                
                {/* Stats Bar (Quick Info) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[var(--accent-bg-trans)] border border-[var(--border-color)] rounded-2xl text-center">
                  <div>
                    <span className="block text-[9px] font-mono text-[var(--text-secondary)] uppercase tracking-wider mb-1">Client</span>
                    <span className="font-display text-xs sm:text-sm font-bold text-[var(--text-primary)] block truncate" title={project.client}>{project.client}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-[var(--text-secondary)] uppercase tracking-wider mb-1">Role</span>
                    <span className="font-display text-xs sm:text-sm font-bold text-[var(--text-primary)] block truncate" title={project.role}>{project.role}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-[var(--text-secondary)] uppercase tracking-wider mb-1">Duration</span>
                    <span className="font-display text-xs sm:text-sm font-bold text-[var(--text-primary)]">{project.duration}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-[var(--text-secondary)] uppercase tracking-wider mb-1">Result</span>
                    <span className="font-display text-xs sm:text-sm font-black text-emerald-400 uppercase tracking-wider">{project.result}</span>
                  </div>
                </div>

                {/* Overview Section */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest font-bold">Project Overview</span>
                  <p className="text-xs sm:text-sm text-[var(--text-primary)] dark:opacity-85 opacity-95 leading-relaxed font-normal">
                    {project.description}
                  </p>
                </div>

                {/* Editorial Challenge and Solution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[var(--border-color)] pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-mono text-amber-700 dark:text-amber-500 uppercase font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      <span>The Narrative Challenge</span>
                    </div>
                    <h3 className="font-display text-base font-bold text-[var(--text-primary)]">The Viewer Attrition Pain Point</h3>
                    <p className="text-xs sm:text-sm text-[var(--text-primary)] dark:opacity-85 opacity-95 leading-relaxed font-normal">
                      {project.challenge}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-mono text-emerald-700 dark:text-emerald-500 uppercase font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>Prince's Strategic Action</span>
                    </div>
                    <h3 className="font-display text-base font-bold text-[var(--text-primary)]">Structural Retuning</h3>
                    <p className="text-xs sm:text-sm text-[var(--text-primary)] dark:opacity-85 opacity-95 leading-relaxed font-normal">
                      {project.solution}
                    </p>
                  </div>
                </div>

                {/* Before / After Transformation */}
                <div className="space-y-2.5 pt-6 border-t border-[var(--border-color)]">
                  <span className="block text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest font-bold">
                    Before / After Transformation
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-red-950/20 border border-red-500/10 p-3.5 rounded-xl space-y-1">
                      <span className="text-[10px] font-mono text-red-400 uppercase font-bold">Before Edit</span>
                      <p className="text-xs text-neutral-400">Raw, unpaced footage with flat colors and zero retention engineering.</p>
                    </div>
                    <div className="bg-emerald-950/20 border border-emerald-500/10 p-3.5 rounded-xl space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">After Edit</span>
                      <p className="text-xs text-neutral-400">Cinematic retention flow, color-graded, with custom motion graphics and sound effects.</p>
                    </div>
                  </div>
                </div>

                {/* Applied Storytelling Tags */}
                <div className="space-y-2.5 pt-6 border-t border-[var(--border-color)]">
                  <h4 className="text-[10px] font-mono tracking-widest text-[var(--text-secondary)] uppercase font-bold">Applied Storytelling Techniques</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="bg-[var(--accent-bg-trans)] border border-[var(--border-color)] px-2.5 py-0.5 rounded-full text-xs font-mono text-[var(--text-primary)] dark:opacity-85 opacity-95 font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tools Used */}
                <div className="space-y-2.5 pt-6 border-t border-[var(--border-color)]">
                  <div className="flex items-center space-x-2">
                    <Laptop className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                    <h4 className="text-[10px] font-mono tracking-widest text-[var(--text-secondary)] uppercase font-bold">Tools & Software Stack</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {getToolsUsed(project.id, project.category).map((tool, idx) => (
                      <span 
                        key={idx} 
                        className="bg-neutral-800/40 dark:bg-neutral-900/40 border border-[var(--border-color)] px-2.5 py-0.5 rounded-full text-xs font-mono text-[var(--text-primary)] font-semibold"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Next Project Section */}
                <div className="pt-6 border-t border-[var(--border-color)] flex justify-between items-center bg-[var(--accent-bg-trans)]/50 p-4 rounded-xl">
                  <div className="space-y-0.5">
                    <span className="block text-[9px] font-mono text-[var(--text-secondary)] uppercase">NEXT PROJECT</span>
                    <span className="font-display text-xs sm:text-sm font-bold text-[var(--text-primary)] block truncate max-w-[120px] sm:max-w-[200px]">
                      {nextProject.title}
                    </span>
                  </div>
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate(nextProject)}
                      className="bg-[var(--accent-color)] text-black hover:bg-[var(--accent-hover)] transition-all duration-300 px-4 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer inline-flex items-center space-x-1 hover:scale-103"
                    >
                      <span>NEXT PROJECT →</span>
                    </button>
                  )}
                </div>

              </div>

              {/* Modal Footer inside Right column */}
              <div className="p-4 bg-[var(--bg-secondary)] border-t border-[var(--border-color)] flex justify-between items-center shrink-0">
                <div className="text-xs font-mono text-[var(--text-secondary)] flex items-center space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Production completed in {project.year}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {projectLink && (
                    <a
                      href={projectLink}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[var(--accent-color)] text-black hover:bg-[var(--accent-hover)] transition-all duration-300 px-4 py-1.5 rounded-xl text-xs font-mono tracking-wider font-bold cursor-pointer inline-flex items-center space-x-1.5 shadow-md"
                    >
                      <span>VIEW PROJECT</span>
                      <ExternalLink className="w-3 h-3 text-black" />
                    </a>
                  )}
                  <button
                    onClick={onClose}
                    className="bg-neutral-800/40 border border-[var(--border-color)] hover:bg-neutral-800/80 text-[var(--text-primary)] transition-colors duration-300 px-4 py-1.5 rounded-xl text-xs font-mono tracking-wider font-semibold cursor-pointer"
                  >
                    CLOSE
                  </button>
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* Standard layout for Long Form (without timeline/timestamps section) */
          <>
            {/* Compact Header Row */}
            <div 
              className="py-4 px-6 md:py-5 md:px-8 flex flex-row items-center justify-between relative overflow-hidden shrink-0 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]"
            >
              {/* Subtle grid overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
              
              {/* Project meta */}
              <div className="z-10 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <span className="text-[9px] font-mono bg-[var(--accent-bg-trans)] border border-[var(--border-color)] px-2.5 py-1 rounded-full uppercase tracking-widest text-[var(--text-primary)] w-fit block font-bold">
                  {project.category} CASE STUDY
                </span>
                <div className="flex flex-col">
                  <h2 className="font-display text-lg md:text-xl font-extrabold tracking-tight uppercase leading-none text-[var(--text-primary)]">
                    {project.title}
                  </h2>
                  <p className="text-[10px] md:text-xs text-[var(--text-secondary)] font-mono tracking-wide mt-1">
                    Client: {project.client}
                  </p>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                data-cursor="hover"
                className="z-10 p-2 bg-[var(--bg-primary)] hover:bg-[var(--border-color)] text-[var(--text-primary)] rounded-full transition-all duration-300 border border-[var(--border-color)] shrink-0 cursor-pointer"
                title="Close Case Study"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Scrollable Content Pane */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              <div className="space-y-8">
                {/* Cinematic Video Source Runner */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)] animate-pulse" />
                      <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-extrabold">
                        MASTER PLAYBACK RUNNER (ACTIVE SOURCE)
                      </span>
                    </div>
                    <div className="text-[9px] font-mono bg-white/5 border border-white/10 px-2.5 py-0.5 rounded text-neutral-400 font-bold uppercase tracking-wider">
                      SIZE: 1920 x 1080 [16:9] LANDSCAPE
                    </div>
                  </div>

                  <div className="bg-[#121314] rounded-2xl border border-white/10 p-4 md:p-5 shadow-[0_0_80px_rgba(255,255,255,0.08)] relative overflow-hidden">
                    <div className="w-full flex items-center justify-center bg-black rounded-xl overflow-hidden relative group border border-white/5">
                      <div id="case-study-player-wrapper" className="w-full aspect-[16/9] relative overflow-hidden">
                        {project.youtubeEmbed ? (
                          <div id="case-study-yt-player" className="w-full h-full absolute inset-0 object-contain bg-black" />
                        ) : project.instagramLink ? (
                          <iframe
                            className="w-full h-full absolute inset-0 object-contain"
                            src={`${project.instagramLink}embed/`}
                            title={project.title}
                            frameBorder="0"
                            scrolling="no"
                            allowTransparency
                            allowFullScreen
                          />
                        ) : (
                          <video
                            ref={videoRef}
                            key={project.id}
                            src={videoUrl}
                            autoPlay
                            muted={isMuted}
                            loop
                            playsInline
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onClick={togglePlay}
                            className="w-full h-full object-cover cursor-pointer"
                          />
                        )}
                      </div>

                      {!isInstagramActive && !isPlaying && (
                        <div 
                          onClick={togglePlay}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer z-20"
                        >
                          <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-16 h-16 rounded-full bg-white text-[#1E2023] flex items-center justify-center shadow-2xl"
                          >
                            <Play className="w-6 h-6 fill-current ml-1 text-black" />
                          </motion.div>
                        </div>
                      )}


                    </div>

                    {!isInstagramActive && (
                      <div className="mt-4 bg-[#1E2023]/90 border border-white/5 rounded-xl p-4 space-y-3.5 text-white shadow-xl">
                        <div className="flex items-center space-x-3">
                          <span className="text-[10px] font-mono text-white/40">{currentTime}</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.1"
                            value={progress}
                            onChange={handleScrub}
                            className="flex-1 accent-[var(--accent-color)] h-1 bg-white/15 rounded-full appearance-none cursor-pointer hover:bg-white/20 transition-all"
                          />
                          <span className="text-[10px] font-mono text-white/40">{durationTime}</span>
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center space-x-2 md:space-x-3.5">
                            <button
                              onClick={togglePlay}
                              className="p-1.5 md:p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all cursor-pointer"
                              title={isPlaying ? "Pause" : "Play"}
                            >
                              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current text-white" />}
                            </button>

                            <button
                              onClick={() => jumpTime(-10)}
                              className="p-1.5 md:p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-all cursor-pointer"
                              title="Skip Back 10s"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => jumpTime(10)}
                              className="p-1.5 md:p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-all cursor-pointer"
                              title="Skip Forward 10s"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>

                            <button
                              onClick={handleRestart}
                              className="p-1.5 md:p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-all cursor-pointer"
                              title="Restart Video"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>

                            <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-1">
                              <button
                                onClick={toggleMute}
                                className={`p-1 md:p-1.5 rounded transition-all cursor-pointer ${isMuted ? "text-amber-400 hover:text-amber-300" : "text-white/70 hover:text-white"}`}
                                title={isMuted ? "Unmute Audio" : "Mute Audio"}
                              >
                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                              </button>
                              
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={isMuted ? 0 : volume}
                                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                                className="w-16 sm:w-20 md:w-24 h-1 accent-amber-500 bg-white/20 rounded-full appearance-none cursor-pointer"
                                title="Volume"
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 md:space-x-3">
                            {isYoutube && (
                              <button
                                onClick={toggleCc}
                                className={`p-1.5 md:p-2 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${isCcOn ? "bg-amber-500/20 text-amber-300 border border-amber-500/20 hover:bg-amber-500/30" : "bg-white/10 hover:bg-white/20 text-white"}`}
                                title={isCcOn ? "Disable Closed Captions" : "Enable Closed Captions"}
                              >
                                <Subtitles className="w-4 h-4" />
                                <span className="text-[9px] font-mono font-bold tracking-wider uppercase">
                                  {isCcOn ? "CC ON" : "CC OFF"}
                                </span>
                              </button>
                            )}

                            <button
                              onClick={handleFullscreen}
                              className="p-1.5 md:p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-all cursor-pointer"
                              title="Fullscreen"
                            >
                              <Maximize className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Bar (Quick Info) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-[#121314] border border-white/10 rounded-2xl text-center shadow-lg">
                  <div className="space-y-1">
                    <span className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black">Client</span>
                    <span className="font-display text-sm md:text-base font-black text-white uppercase tracking-tight">{project.client}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black">Role</span>
                    <span className="font-display text-sm md:text-base font-black text-white uppercase tracking-tight">{project.role}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black">Duration</span>
                    <span className="font-display text-sm md:text-base font-black text-white uppercase tracking-tight">{project.duration}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black">Result</span>
                    <span className="font-display text-sm md:text-base font-black text-emerald-400 uppercase tracking-tight">{project.result}</span>
                  </div>
                </div>

                {/* Overview Section */}
                <div className="space-y-3 pt-2">
                  <span className="block text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest font-bold">
                    Project Overview
                  </span>
                  <p className="text-sm text-[var(--text-primary)] dark:opacity-85 opacity-95 leading-relaxed font-normal">
                    {project.description}
                  </p>
                </div>

                {/* Challenge and Solution editorial layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[var(--border-color)]">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-mono text-amber-700 dark:text-amber-500 uppercase font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      <span>The Narrative Challenge</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">The Viewer Attrition Pain Point</h3>
                    <p className="text-sm text-[var(--text-primary)] dark:opacity-85 opacity-95 leading-relaxed font-normal">
                      {project.challenge}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-mono text-emerald-700 dark:text-emerald-500 uppercase font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>Prince's Strategic Action</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">Structural Retuning</h3>
                    <p className="text-sm text-[var(--text-primary)] dark:opacity-85 opacity-95 leading-relaxed font-normal">
                      {project.solution}
                    </p>
                  </div>
                </div>

                {/* Before / After Transformation */}
                <div className="space-y-3 pt-6 border-t border-[var(--border-color)]">
                  <span className="block text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest font-bold">
                    Before / After Transformation
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-red-950/20 border border-red-500/10 p-4 rounded-xl space-y-1">
                      <span className="text-[10px] font-mono text-red-400 uppercase font-bold">Before Edit</span>
                      <p className="text-sm text-neutral-400">Raw, unpaced footage with flat colors and zero retention engineering.</p>
                    </div>
                    <div className="bg-emerald-950/20 border border-emerald-500/10 p-4 rounded-xl space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">After Edit</span>
                      <p className="text-sm text-neutral-400">Cinematic retention flow, color-graded, with custom motion graphics and sound effects.</p>
                    </div>
                  </div>
                </div>

                {/* Applied Storytelling Techniques tags */}
                <div className="space-y-3 pt-6 border-t border-[var(--border-color)]">
                  <h4 className="text-[10px] font-mono tracking-widest text-[var(--text-secondary)] uppercase font-bold">Applied Storytelling Techniques</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="bg-[var(--accent-bg-trans)] border border-[var(--border-color)] px-3 py-1 rounded-full text-xs font-mono text-[var(--text-primary)] dark:opacity-85 opacity-95 font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tools Used */}
                <div className="space-y-3 pt-6 border-t border-[var(--border-color)]">
                  <div className="flex items-center space-x-2">
                    <Laptop className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                    <h4 className="text-[10px] font-mono tracking-widest text-[var(--text-secondary)] uppercase font-bold">Tools & Software Stack</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getToolsUsed(project.id, project.category).map((tool, idx) => (
                      <span 
                        key={idx} 
                        className="bg-neutral-800/40 dark:bg-neutral-900/40 border border-[var(--border-color)] px-3 py-1 rounded-full text-xs font-mono text-[var(--text-primary)] font-semibold"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Next Project Section */}
                <div className="pt-6 border-t border-[var(--border-color)] flex justify-between items-center bg-[var(--accent-bg-trans)]/50 p-5 rounded-xl">
                  <div className="space-y-0.5">
                    <span className="block text-[9px] font-mono text-[var(--text-secondary)] uppercase">NEXT PROJECT</span>
                    <span className="font-display text-sm font-bold text-[var(--text-primary)] block truncate max-w-[180px] sm:max-w-[280px]">
                      {nextProject.title}
                    </span>
                  </div>
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate(nextProject)}
                      className="bg-[var(--accent-color)] text-black hover:bg-[var(--accent-hover)] transition-all duration-300 px-5 py-2.5 rounded-xl text-xs font-mono font-bold cursor-pointer inline-flex items-center space-x-1.5 hover:scale-103"
                    >
                      <span>NEXT PROJECT →</span>
                    </button>
                  )}
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-5 bg-[var(--bg-secondary)] border-t border-[var(--border-color)] flex justify-between items-center shrink-0">
                <div className="text-xs font-mono text-[var(--text-secondary)] flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Production completed in {project.year}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {projectLink && (
                    <a
                      href={projectLink}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[var(--accent-color)] text-black hover:bg-[var(--accent-hover)] transition-all duration-300 px-5 py-2 rounded-xl text-xs font-mono tracking-wider font-bold cursor-pointer inline-flex items-center space-x-2 shadow-md"
                    >
                      <span>VIEW PROJECT</span>
                      <ExternalLink className="w-3.5 h-3.5 text-black" />
                    </a>
                  )}
                  <button
                    onClick={onClose}
                    className="bg-neutral-800/40 border border-[var(--border-color)] hover:bg-neutral-800/80 text-[var(--text-primary)] transition-colors duration-300 px-5 py-2 rounded-xl text-xs font-mono tracking-wider font-semibold cursor-pointer"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
