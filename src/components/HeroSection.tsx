import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, ArrowRight, Video, FileText, Activity, Music, Sparkles, Tv } from "lucide-react";

interface HeroSectionProps {
  onExplorePortfolio: () => void;
  onStartProject: () => void;
}

const STEPS = [
  { id: "raw", label: "RAW FOOTAGE", desc: "Flat colors, slow pacing, noisy atmospheric background", icon: Video, color: "#66788E" },
  { id: "story", label: "STORY STRUCTURE", desc: "The spine of the narrative, organized chapters", icon: FileText, color: "#524331" },
  { id: "edit", label: "EDIT & PACING", desc: "Surgical cuts, pattern interrupts, and retention beats", icon: Activity, color: "#66788E" },
  { id: "motion", label: "MOTION GRAPHICS", desc: "Kinetic titles, callouts, and tracking elements", icon: Sparkles, color: "#B1BCC9" },
  { id: "sound", label: "SOUND DESIGN", desc: "Bespoke Foley, music beats, and ambient ducking", icon: Music, color: "#524331" },
  { id: "final", label: "FINAL FILM", desc: "Mastered color grading, fully compiled cinematic story", icon: Tv, color: "#66788E" }
];

const LOOP_SEQUENCE = [
  { a: "Telling", b: "Stories" },
  { a: "Telling", b: "Emotions" },
  { a: "Telling", b: "Experiences" },
  { a: "Telling", b: "Feelings" }
];

export default function HeroSection({ onExplorePortfolio, onStartProject }: HeroSectionProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [loopIdx, setLoopIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIdx((prev) => (prev + 1) % STEPS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loopTimer = setInterval(() => {
      setLoopIdx((prev) => (prev + 1) % LOOP_SEQUENCE.length);
    }, 3200);
    return () => clearInterval(loopTimer);
  }, []);

  const currentStep = STEPS[currentStepIdx];

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col justify-center items-center px-3 sm:px-6 md:px-12 xl:px-16 py-16 md:py-24 overflow-hidden bg-[var(--bg-primary)] transition-colors duration-500">
      
      {/* Ambient cozy purple-grey bloom */}
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(180,165,210,0.06) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="absolute bottom-[15%] left-[5%] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(177,188,201,0.05) 0%, transparent 70%)", filter: "blur(50px)" }} />
      
      {/* Abstract floating shape 1 */}
      <motion.div 
        className="absolute top-[15%] right-[15%] w-12 h-12 rounded-full border border-[var(--border-color)]"
        animate={{ y: [0, -15, 0], rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Abstract floating shape 2 */}
      <motion.div 
        className="absolute bottom-[20%] left-[8%] w-16 h-16 rounded-xl border border-[var(--border-color)]"
        animate={{ y: [0, 20, 0], rotate: -180 }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        
        {/* Left Side: Headlines */}
        <div className="lg:col-span-7 flex flex-col space-y-8 text-left">
          
          {/* Tagline/Identifier */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative inline-flex items-center space-x-2 bg-[var(--accent-bg-trans)] border border-transparent px-3 py-1.5 rounded-full w-fit transition-all duration-500"
          >
            {/* Orbiting border */}
            <span
              className="absolute inset-0 rounded-full p-[1.5px] pointer-events-none"
              style={{ background: "conic-gradient(from var(--orbit-angle, 0deg), transparent 60%, white 75%, transparent 90%)", animation: "orbit-border 4s linear infinite", borderRadius: "9999px" }}
            >
              <span className="block w-full h-full rounded-full" style={{ background: "var(--bg-primary)" }} />
            </span>
            <span className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse relative z-10" />
            <span className="text-xs font-mono tracking-widest text-[var(--text-primary)] font-medium relative z-10">
              PRINCE • Video Editor 
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.18] text-[var(--text-primary)] transition-colors duration-500">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="inline-block"
            >
              Editing Isn't About{" "}
            </motion.span>{" "}
            <span className="relative inline-block mx-1">
              <motion.span
                className="inline-block text-gray-900 dark:text-white font-extrabold transition-colors duration-500"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Cutting Videos.
              </motion.span>
              <motion.span
                className="absolute left-[15%] right-[15%] top-[54%] h-[3.5px] bg-red-500 dark:bg-red-400 origin-left rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>{" "}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="inline-block"
            >
              It's About{" "}
            </motion.span>{" "}
            <span className="relative inline-flex items-center italic font-normal font-serif mx-1 select-none">
              <span className="inline-block bg-gradient-to-r from-[var(--text-secondary)] via-[var(--accent-color)] to-[var(--text-secondary)] bg-clip-text text-transparent pb-1">
                Telling
              </span>
              <span className="inline-block w-[0.25em]" />
              <span className="inline-block relative">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={LOOP_SEQUENCE[loopIdx].b}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="inline-block bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent-color)] to-[var(--text-secondary)] bg-clip-text text-transparent pb-1"
                  >
                    {LOOP_SEQUENCE[loopIdx].b}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>{" "}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.8 }}
              className="inline-block"
            >
              
            </motion.span>
          </h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-[var(--text-primary)] dark:opacity-80 opacity-95 font-normal leading-relaxed max-w-2xl transition-colors duration-500"
          >
            Hello, I'm <strong className="text-[var(--text-primary)] font-semibold">Prince</strong>-founder of Gillax Creative. I transform raw footage into cinematic stories through storytelling, psychology, precise pacing, and immersive sound design.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <button
              onClick={onExplorePortfolio}
              data-cursor="view"
              data-cursor-text="Explore"
              className="group relative inline-flex items-center space-x-2 bg-[var(--accent-color)] text-[var(--logo-text)] px-6 py-3.5 rounded-full text-sm font-medium tracking-wide shadow-md hover:bg-[var(--accent-hover)] transition-all duration-150"
            >
              <span>View Portfolio</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onStartProject}
              data-cursor="hover"
              className="inline-flex items-center space-x-2 border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] px-6 py-3.5 rounded-full text-sm font-medium tracking-wide hover:border-[var(--accent-color)] hover:bg-[var(--accent-bg-trans)] transition-all duration-150"
            >
              <span>Start a Project</span>
            </button>
          </motion.div>

        </div>

        {/* Right Side: Floating Cinematic Monitor */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex justify-center items-center"
        >
          {/* Monitor Frame */}
          <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-2xl p-3 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] shadow-2xl border border-white/50 flex flex-col justify-between transition-colors duration-500"
            style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.5), 0 0 8px rgba(255,255,255,0.2)" }}
          >
            
            {/* Monitor Bezel Header */}
            <div className="flex justify-between items-center px-2 py-1 border-b border-[var(--border-color)] pb-2">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-color)]/30 transition-colors" />
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-color)]/15 transition-colors" />
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-color)]/10 transition-colors" />
              </div>
              <span className="text-[10px] font-mono tracking-wider text-[var(--text-secondary)] transition-colors">PRINCE_EDITING.MP4</span>
              <span className="text-[10px] font-mono text-[var(--accent-color)] flex items-center space-x-1 transition-colors">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1" />
                <span>ONLINE</span>
              </span>
            </div>

            {/* Monitor Screen Core */}
            <div className="relative flex-1 my-3 bg-[var(--bg-primary)]/85 rounded-lg overflow-hidden flex flex-col justify-between p-4 text-[var(--text-primary)] border border-[var(--border-color)] shadow-inner">
              
              {/* Scanlines layer */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-10" />
              
              {/* Active Step Showcase */}
              <div className="relative flex-1 flex flex-col justify-center items-center text-center px-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep.id}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="flex flex-col items-center space-y-3"
                  >
                    {/* Render Icon with Brand Color Background */}
                    <div className="p-3.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--accent-color)] transition-all">
                      <currentStep.icon className="w-6 h-6 text-[var(--accent-color)]" />
                    </div>

                    {/* Step Name */}
                    <span className="text-[10px] font-mono tracking-widest text-[var(--text-secondary)] uppercase bg-[var(--bg-secondary)] px-2.5 py-0.5 rounded-full border border-[var(--border-color)]">
                      STAGE 0{currentStepIdx + 1}
                    </span>

                    {/* Stage Title */}
                    <h3 className="font-display text-xl font-bold tracking-tight text-[var(--text-primary)] uppercase">
                      {currentStep.label}
                    </h3>

                    {/* Stage description */}
                    <p className="text-xs text-[var(--text-secondary)] dark:opacity-80 opacity-95 font-normal dark:font-light max-w-xs leading-relaxed">
                      {currentStep.desc}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Real-time Timeline Visualization at bottom of Monitor */}
              <div className="border-t border-[var(--border-color)] pt-3 space-y-1">
                <div className="flex justify-between items-center text-[8px] font-mono text-[var(--text-secondary)]/70">
                  <span>CLIP_SEQUENCE_0{currentStepIdx + 1}</span>
                  <span className="text-[var(--text-primary)] dark:opacity-80 opacity-95">00:0{currentStepIdx}:12 / 00:10:00</span>
                </div>
                
                {/* Audio Waves and Clip track bars representation */}
                <div className="grid grid-cols-12 gap-1 h-3.5">
                  {STEPS.map((step, idx) => (
                    <div 
                      key={step.id} 
                      className={`h-full rounded-xs transition-all duration-700 cursor-pointer ${
                        idx === currentStepIdx 
                          ? "col-span-4 clip-bar-active"
                          : idx < currentStepIdx 
                            ? "bg-[#7C6F9F]/60 col-span-1 transition-all duration-700" 
                            : "bg-[var(--text-secondary)]/10 col-span-1 transition-all duration-700"
                      }`}
                      onClick={() => setCurrentStepIdx(idx)}
                    >
                      {idx === currentStepIdx && (
                        <span
                          key={currentStepIdx}
                          className="block h-full rounded-xs clip-bar-fill"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>



            {/* Floating Reflection overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
          </div>
        </motion.div>

      </div>

      {/* Elegant Bottom Section Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 flex flex-col items-center space-y-1 font-mono text-[10px] text-[var(--text-secondary)] tracking-widest cursor-pointer transition-colors"
        onClick={onExplorePortfolio}
      >
        <span>SCROLL TO ENTER</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-[var(--accent-color)] to-transparent animate-bounce mt-1" />
      </motion.div>
    </section>
  );
}
