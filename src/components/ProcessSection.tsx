import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Download, 
  Search, 
  FileText, 
  Scissors, 
  Sparkles, 
  Volume2, 
  Palette, 
  Rocket, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Pause, 
  Heart, 
  Zap, 
  Eye,
  Sliders,
  Check,
  Youtube,
  Twitter,
  Linkedin,
  Instagram,
  Briefcase,
  Clock,
  Brain
} from "lucide-react";

interface StageTool {
  name: string;
  role: string;
  initials: string;
  badgeColor: string;
  iconType?: string;
}

interface WorkflowStep {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  time: string;
  icon: React.ComponentType<any>;
  shortDesc: string;
  description: string;
  checklist: string[];
  youtubeId: string;
  tools: StageTool[];
}

interface WorkflowCardProps {
  key?: string | number;
  step: WorkflowStep;
  idx: number;
  isActive: boolean;
  isPlaying: boolean;
  onClick: () => void;
}

function WorkflowCard({ step, idx, isActive, isPlaying, onClick }: WorkflowCardProps) {
  const IconComponent = step.icon;
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: idx * 0.08, 
        ease: [0.22, 0.61, 0.36, 1] 
      }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-2xl flex flex-col justify-between p-5 min-h-[160px] cursor-pointer select-none overflow-hidden group transition-all duration-[220ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
        isActive 
          ? "bg-[#110F1C]/90 border-[#7C6FBE]/50 shadow-[0_12px_30px_rgba(124,111,159,0.12)] scale-[1.03] z-20" 
          : "bg-[#0A090D]/80 border-white/[0.04] hover:border-white/[0.12] z-10"
      }`}
      style={{
        boxShadow: isActive 
          ? "0 12px 30px rgba(124, 111, 159, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15)" 
          : "inset 0 1px 0 rgba(255, 255, 255, 0.05)"
      }}
    >
      {/* Spotlight Effect inside Card */}
      {isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(circle 80px at ${coords.x}px ${coords.y}px, rgba(184, 174, 207, 0.08), transparent 80%)`
          }}
        />
      )}

      {/* Small Glowing Accent Dot in active corner */}
      {isActive && (
        <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#B8AECF] shadow-[0_0_8px_#B8AECF] animate-pulse z-10" />
      )}

      {/* Card Content */}
      <div className="relative z-10 space-y-3">
        {/* Step Number Badge & Icon Row */}
        <div className="flex justify-between items-center">
          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border transition-colors duration-200 ${
            isActive 
              ? "bg-[#1F1A3D] text-[#B8AECF] border-[#7C6FBE]/35" 
              : "bg-white/[0.02] text-neutral-500 border-white/[0.02]"
          }`}>
            {step.id}
          </span>
          <IconComponent className={`w-5 h-5 transition-all duration-300 ${
            isActive 
              ? "text-white scale-110" 
              : "text-white/60 group-hover:text-white"
          }`} />
        </div>

        {/* Title */}
        <h4 className={`text-xs font-mono font-bold tracking-wider uppercase transition-colors duration-200 line-clamp-2 leading-tight ${
          isActive 
            ? "text-white" 
            : "text-neutral-400 group-hover:text-neutral-200"
        }`}>
          {step.title}
        </h4>
      </div>

      {/* Duration Badge / Text Row */}
      <div className="relative z-10 pt-2 border-t border-white/[0.03]">
        {isActive ? (
          <div className="inline-flex items-center text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#1F1A3D]/60 text-[#B8AECF] border border-[#7C6FBE]/20">
            {step.time}
          </div>
        ) : (
          <span className="text-[10px] font-mono text-neutral-500 font-medium">
            {step.time}
          </span>
        )}
      </div>

      {/* Auto-Play Progress Bar at bottom of active card (hardware-accelerated, zero-lag CSS transform) */}
      {isActive && isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/[0.03] overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#7C6FBE] to-[#B8AECF] origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ ease: "linear", duration: 7 }}
          />
        </div>
      )}
    </motion.div>
  );
}

function ToolBadge({ tool }: { tool: StageTool }) {
  // Sound Design custom icons for PT, RX, Soundly, Boom, Waves, Fairlight
  if (tool.initials === "Pt") {
    return (
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[10px] font-mono border shadow-sm ${tool.badgeColor}`}>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 10v4M6 6v12M9 3v18M12 7v10M15 5v14M18 8v8M21 11v2" />
        </svg>
      </div>
    );
  }
  
  if (tool.initials === "Rx") {
    return (
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[10px] font-mono border shadow-sm ${tool.badgeColor}`}>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" strokeDasharray="4 2" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      </div>
    );
  }

  if (tool.initials === "Bl") {
    return (
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[10px] font-mono border shadow-sm ${tool.badgeColor}`}>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 12v-4M8 14v-8M12 18v-14M16 16v-10M20 12v-4" />
        </svg>
      </div>
    );
  }

  if (tool.initials === "Wv") {
    return (
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[10px] font-mono border shadow-sm ${tool.badgeColor}`}>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 12c3-8 5-8 8 0s5 8 8 0s5-8 8 0s5-8 8 0" />
        </svg>
      </div>
    );
  }

  if (tool.name.includes("Fairlight")) {
    return (
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[10px] font-mono border shadow-sm ${tool.badgeColor}`}>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4v16M4 12h16" />
        </svg>
      </div>
    );
  }

  // Default clean text initials
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs font-mono border shadow-sm ${tool.badgeColor}`}>
      {tool.initials}
    </div>
  );
}

export default function ProcessSection() {
  const [activeStepIdx, setActiveStepIdx] = useState(3); // Default is Step 04: Rough Cut (index 3)
  const [isPlaying, setIsPlaying] = useState(true);
  const [wordIdx, setWordIdx] = useState(0);

  const words = ["FEELINGS", "EMOTIONS", "STORY", "CONNECTION"];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setWordIdx((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const workflowSteps: WorkflowStep[] = [
    {
      id: "01",
      num: "01",
      title: "Import & Organize",
      subtitle: "STG 01: SOURCE INGEST",
      time: "1–2 Hours",
      icon: Download,
      shortDesc: "Collect and organize raw assets.",
      description: "Sifting and sorting raw footage to build a rock-solid media pool. This is where organization prevents chaotic timelines and speeds up editing.",
      checklist: [
        "Uncut footage sorting",
        "Audio/Video synchronization",
        "Proxy file generation",
        "Sub-clip categorization",
        "Metadata tagging"
      ],
      youtubeId: "T-dJKvPi4pc",
      tools: [
        { name: "PluralEyes", role: "Audio & Video Sync", initials: "Pe", badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/25" },
        { name: "Kyno", role: "Media Management", initials: "Ky", badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/25" },
        { name: "Silverstack", role: "DIT Backup & Log", initials: "Ss", badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/25" },
        { name: "EditReady", role: "High-Speed Transcode", initials: "Er", badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25" },
        { name: "Adobe Bridge", role: "Asset Cataloging", initials: "Br", badgeColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/25" },
        { name: "DropBox Replay", role: "Assembly Uploads", initials: "Dr", badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/25" }
      ]
    },
    {
      id: "02",
      num: "02",
      title: "Research & Planning",
      subtitle: "STG 02: STORY BRAINSTORM",
      time: "2–4 Hours",
      icon: Search,
      shortDesc: "Analyze references.",
      description: "Studying target audience psychology and mapping out reference points to prepare a narrative layout that keeps attention throughout.",
      checklist: [
        "Competitor pacing audits",
        "Soundscape reference mapping",
        "Dynamic hook brainstorming",
        "Visual style boards",
        "Narrative skeleton draft"
      ],
      youtubeId: "S2pbyD6XnWY",
      tools: [
        { name: "Milanote", role: "Visual Storyboarding", initials: "Mn", badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/25" },
        { name: "Miro", role: "Collaborative Brainstorm", initials: "Mi", badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/25" },
        { name: "YouTube", role: "Reference Sourcing", initials: "Yt", badgeColor: "bg-red-500/10 text-red-400 border-red-500/25" },
        { name: "Notion", role: "Narrative Outlining", initials: "No", badgeColor: "bg-neutral-200/10 text-neutral-205 border-neutral-200/25" },
        { name: "Airtable", role: "Asset & Link Tracking", initials: "At", badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25" },
        { name: "ChatGPT", role: "Script/Concept Ideation", initials: "Gp", badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" }
      ]
    },
    {
      id: "03",
      num: "03",
      title: "Story Structure",
      subtitle: "STG 03: CONTENT BLUEPRINT",
      time: "3–5 Hours",
      icon: FileText,
      shortDesc: "Rewrite script & beats.",
      description: "Formulating the narrative arc. Arranging structural story beats to maximize viewer retention right from the opening second.",
      checklist: [
        "3-second curiosity hook",
        "Narrative conflict setup",
        "Pacing variance planning",
        "Retentive retention loop design",
        "Climax timing adjustments"
      ],
      youtubeId: "uB24Xp_SjRk",
      tools: [
        { name: "WriterDuet", role: "Collaborative Scripting", initials: "Wd", badgeColor: "bg-pink-500/10 text-pink-400 border-pink-500/25" },
        { name: "Final Draft", role: "Screenplay Layouts", initials: "Fd", badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" },
        { name: "Scrivener", role: "Beat & Draft Structuring", initials: "Sv", badgeColor: "bg-violet-500/10 text-violet-400 border-violet-500/25" },
        { name: "Google Docs", role: "Narrative Feedback", initials: "Gd", badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/25" },
        { name: "Notion", role: "Story Arc Blueprint", initials: "No", badgeColor: "bg-neutral-200/10 text-neutral-205 border-neutral-200/25" },
        { name: "MindNode", role: "Visual Story Mapping", initials: "Mn", badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/25" }
      ]
    },
    {
      id: "04",
      num: "04",
      title: "Rough Cut",
      subtitle: "STG 04: NARRATIVE RHYTHM",
      time: "6–10 Hours",
      icon: Scissors,
      shortDesc: "Story pacing & flow.",
      description: "The critical foundation of the video. This is where we carve out the emotional flow and set a narrative rhythm before adding any polish.",
      checklist: [
        "Scene selection & trimming",
        "Dialogue pacing & pauses removal",
        "Micro-timing cutdowns",
        "Story tension scaling",
        "Pattern interrupt layout"
      ],
      youtubeId: "zL6v3Zg098Y",
      tools: [
        { name: "Adobe Premiere", role: "Core Timeline Assembly", initials: "Pr", badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/25" },
        { name: "DaVinci Resolve", role: "Scene Assembly", initials: "Dr", badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/25" },
        { name: "Avid Composer", role: "Industry Standard Cut", initials: "Mc", badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25" },
        { name: "PluralEyes", role: "Multi-cam Audio Sync", initials: "Pe", badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/25" },
        { name: "Frame.io", role: "Rough Cut Review", initials: "Fi", badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/25" },
        { name: "QuickTime", role: "Timeline Screening", initials: "Qt", badgeColor: "bg-neutral-400/10 text-neutral-300 border-neutral-400/25" }
      ]
    },
    {
      id: "05",
      num: "05",
      title: "Motion Graphics",
      subtitle: "STG 05: KINETIC VISUALS",
      time: "8–16 Hours",
      icon: Sparkles,
      shortDesc: "Text animations.",
      description: "Injecting high-energy visual aids. Animating typography and implementing custom kinetic shapes to reinforce key concepts and metrics.",
      checklist: [
        "Kinetic title animation",
        "Accent shape overlays",
        "Spotlight telestration",
        "3D tracking callouts",
        "Frame-by-frame asset masking"
      ],
      youtubeId: "P6e0V01yN24",
      tools: [
        { name: "After Effects", role: "Typography & VFX", initials: "Ae", badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/25" },
        { name: "Cinema 4D", role: "3D Visual Assets", initials: "C4", badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/25" },
        { name: "Illustrator", role: "Vector Graphics Import", initials: "Ai", badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/25" },
        { name: "Photoshop", role: "Matte Paint & Assets", initials: "Ps", badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/25" },
        { name: "Mocha Pro", role: "Planar Track & Mask", initials: "Mo", badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/25" },
        { name: "Trapcode", role: "Advanced VFX Particles", initials: "Tc", badgeColor: "bg-red-500/10 text-red-400 border-red-500/25" }
      ]
    },
    {
      id: "06",
      num: "06",
      title: "Sound Design",
      subtitle: "STG 06: SOUND DESIGN",
      time: "4–8 Hours",
      icon: Volume2,
      shortDesc: "Music, SFX & voice.",
      description: "Crafting immersive audio that elevates emotion, builds tension, and brings your story to life. Every sound is designed with purpose and precision.",
      checklist: [
        "Multi-layered environmental Foley",
        "Dialogue editing & noise cleanup",
        "Sound design & effects integration",
        "Dynamic range & loudness balance",
        "Music placement & transition design",
        "Final mix & audio polish"
      ],
      youtubeId: "EWeo7lZ3_1M",
      tools: [
        { name: "Pro Tools", role: "Audio Editing & Mixing", initials: "Pt", badgeColor: "bg-violet-500/15 text-[#B8AECF] border-[#7C6FBE]/30", iconType: "wave" },
        { name: "iZotope RX", role: "Noise Reduction", initials: "Rx", badgeColor: "bg-sky-500/15 text-sky-400 border-sky-500/20", iconType: "circles" },
        { name: "Soundly", role: "Sound Library", initials: "S", badgeColor: "bg-neutral-200/15 text-white border-white/20", iconType: "letter" },
        { name: "Boom Library", role: "Cinematic Sounds", initials: "Bl", badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/20", iconType: "bars" },
        { name: "Waves", role: "Mixing & Mastering", initials: "Wv", badgeColor: "bg-teal-500/15 text-teal-400 border-teal-500/20", iconType: "sine" },
        { name: "DaVinci Fairlight", role: "Audio Post Production", initials: "Fi", badgeColor: "bg-red-500/15 text-red-400 border-red-500/20", iconType: "color" }
      ]
    },
    {
      id: "07",
      num: "07",
      title: "Color & Finish",
      subtitle: "STG 07: KODAK REVELATION",
      time: "2–4 Hours",
      icon: Palette,
      shortDesc: "Color grading & polish.",
      description: "Applying high-end color grading to establish a unified mood. Removing technical imperfections for a seamless, luxurious render.",
      checklist: [
        "Dynamic range color correction",
        "Cinematic LUT mapping",
        "Skin tone optimization",
        "Vignettes & light leaks",
        "Noise reduction & sharpening"
      ],
      youtubeId: "1v0Bntt0450",
      tools: [
        { name: "DaVinci Resolve", role: "Advanced Color Grade", initials: "Dr", badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/25" },
        { name: "Lattice", role: "Custom LUT Calibration", initials: "Lt", badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/25" },
        { name: "Tangent Panels", role: "Tactile Hardware Grade", initials: "Tp", badgeColor: "bg-neutral-200/10 text-neutral-200 border-neutral-200/25" },
        { name: "Dehancer Pro", role: "Film Emulation & Grain", initials: "Dh", badgeColor: "bg-red-500/10 text-red-400 border-red-500/25" },
        { name: "OmniScope", role: "Real-time Signal Monitor", initials: "Os", badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/25" },
        { name: "Calibrite", role: "Precision Display Profiling", initials: "Cb", badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/25" }
      ]
    },
    {
      id: "08",
      num: "08",
      title: "Export & Delivery",
      subtitle: "STG 08: PLATFORM INGEST",
      time: "1 Hour",
      icon: Rocket,
      shortDesc: "Final rendering.",
      description: "Optimizing video files for various platform algorithms to ensure crisp playback quality and seamless user experiences on all screens.",
      checklist: [
        "H.264/H.265 multi-pass export",
        "Audio loudness normalization",
        "Multi-platform aspect sizing",
        "Timestamp / chapters mapping",
        "Frame.io collaborative revision"
      ],
      youtubeId: "tV2y50B94j4",
      tools: [
        { name: "Media Encoder", role: "High-Speed Batch Export", initials: "Me", badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" },
        { name: "Frame.io", role: "Final Review & Approvals", initials: "Fi", badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/25" },
        { name: "Handbrake", role: "Advanced Compression", initials: "Hb", badgeColor: "bg-red-500/10 text-red-400 border-red-500/25" },
        { name: "Vimeo Pro", role: "Premium Secure Screening", initials: "Vi", badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/25" },
        { name: "WeTransfer", role: "Master Files Delivery", initials: "Wt", badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/25" },
        { name: "ExifTool", role: "Metadata Preservation", initials: "Et", badgeColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/25" }
      ]
    }
  ];

  // Autoplay countdown effect (highly optimized, zero-lag single timeout)
  React.useEffect(() => {
    if (!isPlaying) return;

    const stepDuration = 7000; // 7 seconds per step
    const timer = setTimeout(() => {
      setActiveStepIdx((current) => (current + 1) % workflowSteps.length);
    }, stepDuration);

    return () => clearTimeout(timer);
  }, [isPlaying, activeStepIdx, workflowSteps.length]);

  const handleStepClick = (idx: number) => {
    setActiveStepIdx(idx);
  };

  const activeStep = workflowSteps[activeStepIdx];

  return (
    <section 
      id="process" 
      className="relative py-20 bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden border-t border-[var(--border-color)]"
    >
      {/* Absolute ambient lights (muted and dark, aligned with website cozy glow) */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[var(--accent-color)]/3 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--accent-hover)]/3 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-16 relative z-10">
        
        {/* Hero Header */}
        <div className="flex flex-col space-y-4 mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-[var(--accent-bg-trans)] border border-[var(--accent-color)]/15 px-3.5 py-1 rounded-full text-[10px] font-mono tracking-widest text-[var(--accent-hover)] font-bold uppercase mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-hover)] animate-pulse" />
            <span>The Craft Behind Every Edit</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase text-[var(--text-primary)] leading-none">
            THE EDITING PROCESS
          </h2>
          <div className="relative w-[200px] mx-auto mt-1.5 mb-3">
            <div className="h-[3.5px] rounded-full" style={{ background: "var(--cozy-line)" }} />
            <div className="absolute inset-0 h-[3.5px] rounded-full opacity-60" style={{ background: "var(--cozy-line)", filter: "blur(6px)" }} />
          </div>
          <p className="text-xs sm:text-sm md:text-base text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed font-light">
            A creative workflow focused on clarity, emotion, and viewer retention.
          </p>
        </div>

        {/* Horizontal Interactive Timeline Controls */}
        <div className="flex items-center justify-between mb-6 select-none">
          <span className="text-[10px] font-mono text-[var(--text-secondary)] font-bold uppercase tracking-widest bg-[var(--accent-bg-trans)] px-3 py-1 rounded-md border border-[var(--border-color)]">
            WORKFLOW PIPELINE
          </span>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent-hover)]/30 px-3.5 py-2 rounded-full text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 cursor-pointer shadow-lg active:scale-95"
            title={isPlaying ? "Pause Autoplay" : "Start Autoplay"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-[var(--accent-hover)] fill-current animate-pulse" />
            ) : (
              <Play className="w-3.5 h-3.5 text-[var(--text-secondary)] fill-current" />
            )}
            <span className="font-bold tracking-wider">
              {isPlaying ? 'AUTOPLAY: ACTIVE' : 'AUTOPLAY: PAUSED'}
            </span>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-emerald-400' : 'bg-red-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            </span>
          </button>
        </div>

        {/* Premium Floating Card Navigation */}
        <div className="mb-14 relative">
          {/* Scrollable Container for Mobile & Fixed-Height grid layout for Desktop */}
          <div className="overflow-x-auto pb-6 pt-2 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
            <div className="flex gap-4 xl:gap-5 px-1 min-w-max lg:min-w-0 lg:grid lg:grid-cols-8 lg:w-full">
              {workflowSteps.map((step, idx) => {
                const isActive = idx === activeStepIdx;
                return (
                  <WorkflowCard
                    key={step.id}
                    step={step}
                    idx={idx}
                    isActive={isActive}
                    isPlaying={isPlaying}
                    onClick={() => handleStepClick(idx)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Detail Panel + Tools Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
          {/* Main Stage Card wrapping step details, deliverables, and tools */}
          <div className="lg:col-span-12 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--border-color)] p-6 sm:p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5)] min-h-[400px]">
            {/* Soft decorative accent glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[var(--accent-color)]/5 rounded-full filter blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[var(--accent-hover)]/3 rounded-full filter blur-3xl pointer-events-none" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex flex-col justify-between h-full w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch h-full">
                  
                  {/* Left sub-column: Text Info + Integrated Tools */}
                  <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b border-white/[0.04]">
                        <span className="text-[9px] font-mono tracking-[0.15em] text-[#B8AECF] bg-[#1F1A3D]/40 border border-[#7C6FBE]/30 px-3 py-1 rounded-md uppercase font-black">
                          {activeStep.subtitle}
                        </span>
                        <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-white/[0.08] text-[10px] font-mono font-bold text-neutral-400 bg-white/[0.02] shadow-sm">
                          <Clock className="w-3.5 h-3.5 text-[#B8AECF] animate-pulse" />
                          <span>{activeStep.time}</span>
                        </span>
                      </div>
  
                      <div className="space-y-4">
                        <h3 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-black uppercase tracking-tight text-white leading-none">
                          {activeStep.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-xl">
                          {activeStep.description}
                        </p>
                      </div>
  
                      {/* Integrated Tools List: Positioned Left Side, Bottom of Text */}
                      <div className="space-y-4 pt-6 border-t border-white/[0.04]">
                        <div className="flex items-center space-x-2">
                          <svg className="w-3.5 h-3.5 text-[#B8AECF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M3 10v4M6 6v12M9 3v18M12 7v10M15 5v14M18 8v8M21 11v2" />
                          </svg>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                            TOOLS IN USE FOR THIS STAGE
                          </span>
                        </div>
  
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {activeStep.tools.map((tool, idx) => {
                            return (
                              <motion.div
                                key={idx}
                                whileHover={{ y: -2, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="bg-[#0A090D]/40 hover:bg-[#0A090D]/85 border border-white/[0.04] hover:border-[#7C6FBE]/20 p-3 rounded-2xl flex items-center space-x-3 transition-all duration-300 group/tool shadow-md"
                              >
                                <ToolBadge tool={tool} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-neutral-200 group-hover/tool:text-white transition-colors truncate">
                                      {tool.name}
                                    </h4>
                                  </div>
                                  <p className="text-[9px] text-neutral-400/80 group-hover/tool:text-neutral-300 transition-colors truncate mt-0.5 font-light">
                                    {tool.role}
                                  </p>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
  
                    </div>
                  </div>
  
                  {/* Right sub-column: Deliverable checklist */}
                  <div className="md:col-span-5 bg-[#0C0B12]/40 p-6 sm:p-7 rounded-3xl border border-white/[0.04] flex flex-col justify-between space-y-6 relative overflow-hidden shadow-xl">
                    {/* Tiny visual line detail on left border of checklist */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#7C6FBE]/40 to-transparent" />
                    
                    <div className="space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.04]">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-[#B8AECF] animate-pulse" />
                          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                            STAGE GOALS
                          </span>
                        </div>
                      </div>
                      
                      <ul className="space-y-3.5">
                        {activeStep.checklist.map((item, index) => (
                          <motion.li 
                            key={index} 
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="text-xs text-neutral-300 flex items-center space-x-3 group/item"
                          >
                            <div className="w-5 h-5 rounded-full bg-[#1F1A3D]/40 border border-[#7C6FBE]/30 flex items-center justify-center text-[#B8AECF] shrink-0 shadow-sm transition-all group-hover/item:border-[#7C6FBE] group-hover/item:bg-[#1F1A3D]/80">
                              <Check className="w-3 h-3 text-[#B8AECF] stroke-[3.5]" />
                            </div>
                            <span className="truncate group-hover/item:text-white transition-colors font-normal">
                              {item}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
  
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
 
        {/* Cinematic Transformation Section */}
        <div className="bg-[#0C0B10]/95 border border-white/[0.04] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden mb-12 max-w-5xl mx-auto">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#7C6F9F]/5 rounded-full filter blur-[100px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Context Left */}
            <div className="lg:col-span-5 space-y-5 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-1.5 bg-[#1F1A3D]/40 border border-[#7C6FBE]/20 px-3 py-1 rounded-full text-[8.5px] font-mono tracking-[0.12em] text-[#B8AECF] font-bold uppercase w-fit">
                  <span>THE PHILOSOPHY & BLUEPRINT</span>
                </div>
                
                {/* Master editorial statement */}
                <div className="font-display tracking-tight text-white space-y-1">
                  <h4 className="text-2xl sm:text-3xl font-black leading-tight">
                    "I <span className="relative inline-block"><span className="line-through decoration-rose-500/80 decoration-[3px]">don't edit pixels</span></span>.
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-2 text-2xl sm:text-3xl font-black">
                    <span>I craft</span>
                    <span className="text-[#B8AECF] drop-shadow-[0_0_15px_rgba(184,174,207,0.35)] underline decoration-2 underline-offset-4 uppercase">
                      <AnimatePresence mode="wait">
                        <motion.span
                           key={words[wordIdx]}
                           initial={{ y: 12, opacity: 0 }}
                           animate={{ y: 0, opacity: 1 }}
                           exit={{ y: -12, opacity: 0 }}
                           transition={{ duration: 0.25, ease: "easeOut" }}
                           className="inline-block"
                        >
                          {words[wordIdx]}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  </div>
                  <p className="text-lg sm:text-xl italic font-extralight text-neutral-400">
                    that people feel."
                  </p>
                </div>

                {/* The Prince Principle Card */}
                <motion.div 
                  whileHover={{ y: -1 }}
                  className="p-4 bg-[#0A090D]/50 border border-white/[0.03] hover:border-[#7C6FBE]/25 rounded-2xl space-y-1.5 cursor-default transition-all duration-300 max-w-xs"
                >
                  <span className="text-[7.5px] font-mono tracking-wider text-neutral-400 uppercase">THE PRINCE PRINCIPLE</span>
                  <div className="h-[1px] w-full bg-[#7C6FBE]/15" />
                  <p className="text-[11px] text-neutral-300 leading-relaxed italic font-light">
                    "Great editing isn't about adding more. It's about keeping what matters and removing what doesn't."
                  </p>
                </motion.div>
              </div>

              {/* Follow Me Social Links block */}
              <div className="pt-6 border-t border-white/[0.04] space-y-3.5 w-full max-w-sm sm:max-w-md">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8AECF] animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest text-[#B8AECF] font-extrabold uppercase">
                    FOLLOW ME / LET'S CONNECT
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Youtube, url: "https://www.youtube.com/@Gillaxediting", label: "YouTube", color: "hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 text-neutral-400" },
                    { icon: Briefcase, url: "https://ytjobs.co/talent/profile/442016?r=947", label: "YT Jobs", color: "hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 text-neutral-400" },
                    { icon: Instagram, url: "https://www.instagram.com/gillaxediting/", label: "Instagram", color: "hover:bg-pink-500/10 hover:text-pink-400 hover:border-pink-500/30 text-neutral-400" },
                    { icon: Twitter, url: "https://x.com/Gillaxediting", label: "Twitter", color: "hover:bg-sky-500/10 hover:text-sky-400 hover:border-sky-500/30 text-neutral-400" },
                    { icon: Linkedin, url: "https://www.linkedin.com/in/prince-igl-7279b1322/", label: "LinkedIn", color: "hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30 text-neutral-400" }
                  ].map((social, idx) => {
                    const IconComp = social.icon;
                    return (
                      <motion.a
                        key={idx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-12 h-12 rounded-xl bg-[#121015]/90 border border-white/[0.06] flex items-center justify-center transition-all duration-300 shadow-md ${social.color}`}
                        title={social.label}
                      >
                        <IconComp className="w-5 h-5" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Premium Comparison Cards Right */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Raw Capture Card */}
              <div className="bg-[#121015]/90 border border-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.01)] rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-900/60">
                    <span className="text-[10px] font-mono font-black text-neutral-300 uppercase tracking-wider">RAW CAPTURE</span>
                    <span className="text-[8px] font-mono text-red-400 font-black tracking-widest uppercase bg-red-500/5 px-2 py-0.5 rounded border border-red-500/10">LOG PROFILE</span>
                  </div>
                  
                  <ul className="space-y-2 pt-3">
                    {[
                      "Flat voice noise",
                      "Unclear Narration",
                      "Zero pacing",
                      "Less Emotion and connection"
                    ].map((text, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-[11px] text-neutral-450">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)] shrink-0" />
                        <span className="font-light">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-2.5 border-t border-neutral-900/60 flex justify-between items-center mt-4">
                  <span className="text-[8px] font-mono text-neutral-500 font-black tracking-wider uppercase">RETENTION RATE</span>
                  <span className="text-[11px] font-mono font-black text-red-400 bg-red-500/5 px-1.5 py-0.5 rounded border border-red-500/10">~8% - 15%</span>
                </div>
              </div>

              {/* Final Export Card */}
              <div className="bg-[#13111C]/90 border border-[#7C6FBE]/20 shadow-[0_0_20px_rgba(184,174,207,0.01)] rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-900/60">
                    <span className="text-[10px] font-mono font-black text-neutral-300 uppercase tracking-wider">FINAL EXPORT</span>
                    <span className="text-[8px] font-mono text-[#B8AECF] font-black tracking-widest uppercase bg-[#1F1A3D]/40 px-2 py-0.5 rounded border border-[#7C6FBE]/20">4K RENDERING</span>
                  </div>
                  
                  <ul className="space-y-2 pt-3">
                    {[
                      "Clear voice Loud",
                      "Dynamic, attention-locked pacing",
                      "Smooth Optical Flow stabilizers",
                      "High emotion & deep connection"
                    ].map((text, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-[11px] text-neutral-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B8AECF] shadow-[0_0_6px_rgba(184,174,207,0.6)] shrink-0" />
                        <span className="font-light">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-2.5 border-t border-neutral-900/60 flex justify-between items-center mt-4">
                  <span className="text-[8px] font-mono text-neutral-500 font-black tracking-wider uppercase">RETENTION RATE</span>
                  <span className="text-[11px] font-mono font-black text-[#B8AECF] bg-[#1F1A3D]/40 px-1.5 py-0.5 rounded border border-[#7C6FBE]/20">~65% - 85%</span>
                </div>
              </div>

            </div>

          </div>
        </div>



      </div>
    </section>
  );
}
