import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, X, Sparkles, Eye, Award, Zap, ExternalLink, Volume2, VolumeX, RotateCcw, Maximize, Subtitles } from "lucide-react";

export default function ShowreelBanner() {
  const [isPlayingFull, setIsPlayingFull] = useState(false);
  const showreelVideoId = "xeoAIGh7EK8";

  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCcOn, setIsCcOn] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [durationTime, setDurationTime] = useState("00:00");
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    if (isPlayingFull) {
      if (!(window as any).YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
    }
  }, [isPlayingFull]);

  useEffect(() => {
    let intervalId: any;

    if (isPlayingFull) {
      document.body.style.overflow = "hidden";

      const initPlayer = () => {
        if (playerRef.current) return;

        playerRef.current = new (window as any).YT.Player("showreel-yt-player", {
          videoId: showreelVideoId,
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

              // Explicitly unload captions to ensure it is disabled by default
              try {
                if (typeof event.target.unloadModule === "function") {
                  event.target.unloadModule("captions");
                }
              } catch (e) {
                console.log("Error unloading captions onReady:", e);
              }
              
              // Start polling progress
              intervalId = setInterval(() => {
                if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
                  try {
                    const current = playerRef.current.getCurrentTime() || 0;
                    const duration = playerRef.current.getDuration() || 1;
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
              // YT.PlayerState: PLAYING = 1, PAUSED = 2, ENDED = 0
              if (event.data === 1) {
                setIsPlaying(true);
                try {
                  if (typeof event.target.unloadModule === "function") {
                    event.target.unloadModule("captions");
                  }
                } catch (e) {
                  console.log("Error turning off captions on PLAYING:", e);
                }
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                // Loop
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
        };
      }
    } else {
      document.body.style.overflow = "";
      setIsPlaying(false);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.log("Error destroying player:", e);
        }
        playerRef.current = null;
      }
    }
  }, [isPlayingFull]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsPlayingFull(false);
    };

    if (isPlayingFull) window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlayingFull]);

  const togglePlay = () => {
    if (playerRef.current && typeof playerRef.current.getPlayerState === "function") {
      const state = playerRef.current.getPlayerState();
      if (state === 1) { // Playing
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (playerRef.current && typeof playerRef.current.isMuted === "function") {
      const nextMuted = !isMuted;
      if (nextMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume * 100);
      }
      setIsMuted(nextMuted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (playerRef.current && typeof playerRef.current.setVolume === "function") {
      playerRef.current.setVolume(val * 100);
      if (val === 0) {
        playerRef.current.mute();
        setIsMuted(true);
      } else {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setProgress(val);
    if (playerRef.current && typeof playerRef.current.getDuration === "function") {
      const duration = playerRef.current.getDuration() || 1;
      const targetTime = (val / 100) * duration;
      playerRef.current.seekTo(targetTime, true);
    }
  };

  const handleRestart = () => {
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(0, true);
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const handleFullscreen = () => {
    const wrapper = document.getElementById("showreel-player-wrapper");
    if (wrapper) {
      if (wrapper.requestFullscreen) {
        wrapper.requestFullscreen();
      }
    }
  };

  const toggleCc = () => {
    if (playerRef.current) {
      const nextCc = !isCcOn;
      try {
        if (nextCc) {
          if (typeof playerRef.current.loadModule === "function") {
            playerRef.current.loadModule("captions");
          }
          if (typeof playerRef.current.setOption === "function") {
            playerRef.current.setOption("captions", "track", { languageCode: "en" });
          }
        } else {
          if (typeof playerRef.current.unloadModule === "function") {
            playerRef.current.unloadModule("captions");
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
    <div className="w-full bg-[var(--bg-primary)] overflow-hidden relative font-sans">

      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.012)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-16 py-12 md:py-16 relative z-10">

        <div className="relative rounded-3xl overflow-hidden border border-neutral-900 bg-neutral-950/80 shadow-2xl">

          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/70 to-transparent z-10" />

          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            <div className="absolute inset-6 border border-white/[0.015] rounded-2xl pointer-events-none">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/5" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/5" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/5" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/5" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none opacity-10">
                <div className="w-3 h-[1px] bg-white/30 absolute" />
                <div className="h-3 w-[1px] bg-white/30 absolute" />
              </div>
            </div>
          </div>

          <div className="relative z-20 p-6 sm:p-10 md:p-14 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[440px]">

            <div className="lg:col-span-7 space-y-6">

              <div className="inline-flex items-center space-x-2 bg-neutral-900 border border-neutral-800 px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest text-neutral-400 font-bold uppercase">
                <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
                <span>EXPERIENCE & Skill Level</span>
              </div>

              <div className="space-y-3">
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black uppercase tracking-tight text-white leading-[1.08]">
                  PRINCE CREATIVE <br className="hidden sm:inline" />
                  <span className="inline-block relative px-4 py-1 leading-normal">
                    {/* Orbiting border via rotating conic-gradient */}
                    <span
                      className="absolute inset-0 rounded-lg p-[1.5px] pointer-events-none"
                      style={{ background: "conic-gradient(from var(--orbit-angle, 0deg), transparent 60%, white 75%, transparent 90%)", animation: "orbit-border 3s linear infinite", borderRadius: "8px" }}
                    >
                      <span className="block w-full h-full rounded-lg" style={{ background: "#0a0a0a" }} />
                    </span>
                    <span
                      className="relative bg-clip-text text-transparent"
                      style={{ backgroundImage: "linear-gradient(90deg, #737373 0%, #ffffff 50%, #737373 100%)" }}
                    >
                      SHOWREEL 2026
                    </span>
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-lg leading-relaxed">
                 A collection of client projects and personal work, showcasing my editing style, creative process, and technical skills.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 border-y border-neutral-900/60 py-5 max-w-md">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-neutral-500">
                    <Eye className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="text-[9px] font-mono uppercase font-bold tracking-wider leading-none">Combine Views</span>
                  </div>
                  <p className="text-xl font-display font-black text-white">35M+</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-neutral-500">
                    <Zap className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="text-[9px] font-mono uppercase font-bold tracking-wider leading-none">AVG. RETENTION</span>
                  </div>
                  <p className="text-xl font-display font-black text-white">82%</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-neutral-500">
                    <Award className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="text-[9px] font-mono uppercase font-bold tracking-wider leading-none">Hours Edited</span>
                  </div>
                  <p className="text-xl font-display font-black text-white">500+</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <motion.button
                  onClick={() => setIsPlayingFull(true)}
                  whileHover={{ y: -4, scale: 1.04, boxShadow: "0 12px 32px -6px rgba(255,255,255,0.25)" }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="relative inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-neutral-400 via-neutral-200 to-white hover:from-white hover:via-white hover:to-white text-neutral-950 font-mono text-[11px] font-black tracking-widest uppercase py-4 px-8 rounded-xl shadow-lg cursor-pointer overflow-hidden group"
                >
                  {/* Glass shimmer sweep */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none" />
                  <Play className="w-4 h-4 fill-current relative z-10" />
                  <span className="relative z-10">PLAY SHOWREEL</span>
                </motion.button>
              </div>

            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <motion.div
                whileHover={{ y: -4, scale: 1.015, boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.5)" }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                className="relative group overflow-hidden w-full max-w-sm bg-neutral-950 border border-neutral-900 p-8 rounded-2xl space-y-5 cursor-pointer transition-all duration-200"
              >
                {/* Orbiting border effect — same as SHOWREEL 2026 */}
                <span
                  className="absolute inset-0 rounded-2xl p-[1.5px] pointer-events-none z-0"
                  style={{ background: "conic-gradient(from var(--orbit-angle, 0deg), transparent 60%, white 75%, transparent 90%)", animation: "orbit-border 3s linear infinite", borderRadius: "16px" }}
                >
                  <span className="block w-full h-full rounded-2xl" style={{ background: "#030303" }} />
                </span>

                <div className="absolute inset-0 bg-neutral-900/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10 space-y-5">
                  <span className="text-[9px] font-mono tracking-widest text-neutral-500 font-black block uppercase">
                    EDIT SPECIFICATIONS
                  </span>

                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[12px] font-bold text-white">
                        <span>Editing Style</span>
                        <span className="text-neutral-300 font-mono">High Retention</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-light leading-relaxed">Fast pacing • Seamless cuts • Motion-driven transitions • Visual storytelling • Rhythm-based editing</p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[12px] font-bold text-white">
                        <span>Motion Graphics</span>
                        <span className="text-neutral-300 font-mono">Premium Animation</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-light leading-relaxed">Kinetic typography • UI animations • 2D motion design • Tracking • Clean compositing</p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[12px] font-bold text-white">
                        <span>Sound Design</span>
                        <span className="text-neutral-300 font-mono">100% Custom</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-light leading-relaxed">Layered ambience • Custom risers • Impact hits • Precision SFX • Clean audio mix</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-900/60 flex justify-between items-center">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase">SOFTWARE USED</span>
                    <span className="text-[9px] font-mono text-white bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800">PREMIERE & AE</span>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>

        </div>

      </div>

      <AnimatePresence>
        {isPlayingFull && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsPlayingFull(false)}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8 cursor-pointer"
            style={{ backdropFilter: "blur(20px) saturate(1.2)", background: "rgba(0,0,0,0.85)" }}
          >
            <div className="absolute top-6 right-6 flex items-center space-x-3 z-50">
              <button
                onClick={(e) => { e.stopPropagation(); setIsPlayingFull(false); }}
                className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                title="Close Showreel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <motion.div
              initial={{ scale: 0.75, opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ scale: 0.75, opacity: 0, y: 40, filter: "blur(12px)" }}
              transition={{ type: "spring", damping: 22, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl bg-[#121314] rounded-2xl border border-white/10 overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.12)] p-4 md:p-5 relative cursor-default space-y-4"
            >
              {/* Screen Video player */}
              <div id="showreel-player-wrapper" className="w-full aspect-video bg-black rounded-xl overflow-hidden relative group">
                <div id="showreel-yt-player" className="w-full h-full pointer-events-none" />

                {/* Overlays */}
                <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-20" />
                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-20" />

                {/* Cover overlay click to toggle play */}
                <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay} />

                {/* Play button overlay when paused */}
                {!isPlaying && (
                  <div
                    onClick={togglePlay}
                    className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer z-25"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                      <Play className="w-6 h-6 fill-current ml-1 text-black" />
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Custom Controller Panel */}
              <div className="bg-[#1E2023]/90 border border-white/5 rounded-xl p-4 space-y-3.5 text-white shadow-xl">
                {/* Progress bar and time stamps */}
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

                {/* Lower control buttons: Play, Restart, Mute/Unmute, Volume Slider, Fullscreen */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2 md:space-x-4">
                    <button
                      onClick={togglePlay}
                      className="p-1.5 md:p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all cursor-pointer"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current text-white" />}
                    </button>

                    <button
                      onClick={handleRestart}
                      className="p-1.5 md:p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-all cursor-pointer"
                      title="Restart Video"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={toggleMute}
                      className={`p-1.5 md:p-2 rounded-lg transition-all cursor-pointer ${isMuted ? "bg-amber-500/20 text-amber-300 border border-amber-500/20 hover:bg-amber-500/30" : "bg-white/10 hover:bg-white/20 text-white"}`}
                      title={isMuted ? "Unmute Audio" : "Mute Audio"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    {/* Volume Slider */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 accent-[var(--accent-color)] h-1 bg-white/15 rounded-full appearance-none cursor-pointer hover:bg-white/20 transition-all"
                        title="Volume"
                      />
                    </div>

                    <span className="text-[9px] font-mono text-white/40 tracking-wider hidden sm:inline">
                      {isMuted ? "AUDIO MUTED (CLICK TO UNMUTE)" : "AUDIO MONITOR ACTIVE"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 md:space-x-3">
                    {/* CC Toggle Button */}
                    <button
                      onClick={toggleCc}
                      className={`p-1.5 md:p-2 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${isCcOn ? "bg-amber-500/20 text-amber-300 border border-amber-500/20 hover:bg-amber-500/30" : "bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"}`}
                      title={isCcOn ? "Disable Closed Captions" : "Enable Closed Captions"}
                    >
                      <Subtitles className="w-4 h-4" />
                      <span className="text-[9px] font-mono font-bold tracking-wider uppercase">
                        {isCcOn ? "CC ON BY YOUTUBE" : "CC OFF BY YOUTUBE"}
                      </span>
                    </button>

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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
