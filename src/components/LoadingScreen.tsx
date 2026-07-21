import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const PHASES = [
  { text: "RAW FOOTAGE", color: "#524331" }, // Unified editorial color
  { text: "STORY STRUCTURE", color: "#524331" },
  { text: "KINETIC MOTION", color: "#524331" },
  { text: "SOUND MIXING", color: "#524331" },
  { text: "FINAL CINEMA", color: "#524331" }
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smoother and much faster progress bar increment for snappy instant-loading feel
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 200); // Shorter final frame pause
          return 100;
        }
        // Dynamic increments (mix of 3% to 5%)
        const increment = Math.floor(Math.random() * 3) + 3;
        return Math.min(prev + increment, 100);
      });
    }, 20);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    // Cycle phases based on progress
    const segment = 100 / PHASES.length;
    const currentPhase = Math.min(
      Math.floor(progress / segment),
      PHASES.length - 1
    );
    setPhaseIndex(currentPhase);
  }, [progress]);

  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#F8F7F3] p-6 text-[#524331]"
      exit={{
        opacity: 0,
        y: -30,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
      }}
    >
      <div className="w-full max-w-lg flex flex-col space-y-12">
        {/* Editorial Label */}
        <div className="flex justify-between items-center text-xs font-mono tracking-widest text-[#66788E] uppercase">
          <span>PRINCE • CINEMATIC PORTFOLIO</span>
          <span>EST. 2026</span>
        </div>

        {/* Phase Animation */}
        <div className="h-24 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={phaseIndex}
              initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center"
            >
              <h2
                className="font-display text-3xl md:text-4xl font-extrabold tracking-tight uppercase transition-colors duration-300"
                style={{ color: PHASES[phaseIndex].color }}
              >
                {PHASES[phaseIndex].text}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Custom Progress & Timeline representation */}
        <div className="space-y-3">
          {/* Timeline Rulers like Premiere Pro */}
          <div className="flex justify-between text-[9px] font-mono text-[#B1BCC9] px-1 select-none">
            <span>00:00:00</span>
            <span>00:00:15</span>
            <span>00:00:30</span>
            <span>00:00:45</span>
            <span className="text-[#66788E]">RENDERED</span>
          </div>

          <div className="relative h-2 w-full bg-[#B1BCC9]/20 rounded-full overflow-hidden">
            {/* Color block representing render speed */}
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#66788E] via-[#524331] to-[#B1BCC9]"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>

          <div className="flex justify-between items-center font-mono text-xs text-[#524331]/80">
            <div className="flex items-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#66788E] animate-pulse" />
              <span>Compiling Story Sequence...</span>
            </div>
            <span className="font-bold">{progress}%</span>
          </div>
        </div>

        {/* Floating aesthetics blocks */}
        <div className="grid grid-cols-5 gap-2 pt-4">
          {PHASES.map((phase, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-1">
              <div
                className={`h-1 w-full rounded-full transition-all duration-300 ${
                  idx <= phaseIndex ? "scale-100" : "bg-[#B1BCC9]/10 scale-50"
                }`}
                style={{ backgroundColor: idx <= phaseIndex ? phase.color : "" }}
              />
              <span
                className={`text-[9px] font-mono transition-opacity duration-300 ${
                  idx === phaseIndex ? "opacity-100 font-bold" : "opacity-30"
                }`}
              >
                CH.0{idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#B1BCC9] filter blur-[150px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#66788E] filter blur-[150px] opacity-10 pointer-events-none" />
    </motion.div>
  );
}
