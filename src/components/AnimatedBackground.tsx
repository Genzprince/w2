import React from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none">
      
      {/* 1. DRIFTING GRADIENT LIGHT BLOOMS */}
      {/* Top Left Orb */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[5%] left-[5%] w-72 h-72 md:w-96 md:h-96 rounded-full bg-[var(--accent-color)]/10 filter blur-[120px] mix-blend-screen dark:mix-blend-normal"
      />

      {/* Mid Right Orb */}
      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 80, -40, 0],
          scale: [1, 0.85, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[35%] right-[2%] w-80 h-80 md:w-[480px] md:h-[480px] rounded-full bg-[var(--text-secondary)]/10 filter blur-[150px] mix-blend-screen dark:mix-blend-normal"
      />

      {/* Lower Mid Left Orb */}
      <motion.div
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -40, 50, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[65%] left-[-5%] w-72 h-72 md:w-[400px] md:h-[400px] rounded-full bg-[var(--accent-color)]/8 filter blur-[130px]"
      />

      {/* Bottom Right Orb */}
      <motion.div
        animate={{
          x: [0, -50, 20, 0],
          y: [0, 30, -60, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[5%] right-[5%] w-80 h-80 md:w-[450px] md:h-[450px] rounded-full bg-[var(--text-secondary)]/8 filter blur-[140px]"
      />

      {/* 2. DYNAMIC GEOMETRIC SHAPES (BOXES, CURVED BOXES, CIRCLES) */}
      
      {/* Section 1: Hero-About Area */}
      {/* Floating Curved Box / Organic Blob (Top Right) */}
      <motion.div
        style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.05, 0.95, 1],
          y: [0, -25, 0],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[8%] right-[10%] w-24 h-24 md:w-36 md:h-36 border border-[var(--border-color)] bg-[var(--accent-bg-trans)] opacity-20"
      />

      {/* Floating Wireframe Square (Top Left) */}
      <motion.div
        animate={{
          rotate: [45, 405],
          y: [0, 20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[18%] left-[8%] w-12 h-12 md:w-16 md:h-16 border-2 border-dashed border-[var(--border-color)] rounded-lg opacity-15"
      />

      {/* Rotating Star (Pulsing Sparkle) */}
      <motion.div
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.15, 0.45, 0.15],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[15%] left-[25%] text-[var(--accent-color)]"
      >
        <Sparkles className="w-5 h-5" />
      </motion.div>


      {/* Section 2: Portfolio / Process Area */}
      {/* Large Wireframe Circle (Middle) */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[38%] left-[12%] w-48 h-48 md:w-72 md:h-72 rounded-full border border-dotted border-[var(--border-color)] opacity-20"
      />

      {/* Floating Morphing Curved Box (Middle Right) */}
      <motion.div
        style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
        animate={{
          rotate: [360, 0],
          y: [0, 30, 0],
          scale: [0.9, 1.05, 0.9],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[45%] right-[8%] w-28 h-28 md:w-44 md:h-44 border border-[var(--border-color)] bg-[var(--accent-bg-trans)] opacity-25"
      />

      {/* Delicate Double Squares (Middle-Left) */}
      <motion.div
        animate={{
          rotate: [0, 90],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[52%] left-[22%] w-10 h-10 border border-[var(--border-color)] opacity-15"
      />
      <motion.div
        animate={{
          rotate: [45, -45],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[52%] left-[22%] w-10 h-10 border border-[var(--border-color)] opacity-10"
      />


      {/* Section 3: Testimonials / Skills Area */}
      {/* Rotating Star (Middle Left) */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.5, 0.1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute top-[68%] right-[25%] text-[var(--accent-color)]"
      >
        <Sparkles className="w-6 h-6" />
      </motion.div>

      {/* Rounded-Curve Box (Bottom-Left) */}
      <motion.div
        style={{ borderRadius: "40% 60% 50% 50% / 50% 60% 40% 50%" }}
        animate={{
          rotate: [0, -360],
          x: [0, 15, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[75%] left-[5%] w-20 h-20 md:w-32 md:h-32 border border-[var(--border-color)] bg-[var(--accent-bg-trans)] opacity-20"
      />

      {/* Concentric Circle Wireframe (Bottom-Right) */}
      <div className="absolute top-[82%] right-[12%] flex items-center justify-center opacity-15">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 rounded-full border border-[var(--border-color)] flex items-center justify-center"
        >
          <div className="w-12 h-12 rounded-full border border-dashed border-[var(--border-color)] flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[var(--accent-color)]/30" />
          </div>
        </motion.div>
      </div>


      {/* Section 4: Contact Brief Area */}
      {/* Floating Solid Pill-Box */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [-15, 15, -15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[8%] left-[15%] w-24 h-10 border border-[var(--border-color)] rounded-full bg-[var(--accent-bg-trans)] opacity-15"
      />

      {/* Big Geometric Box Accent at the very bottom right */}
      <motion.div
        animate={{
          rotate: [45, 225],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[4%] right-[8%] w-16 h-16 md:w-24 md:h-24 border border-[var(--border-color)] rounded-2xl opacity-20"
      />

      {/* Twinkle coordinates */}
      <div className="absolute top-[28%] left-[45%] w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-ping opacity-30" />
      <div className="absolute top-[62%] right-[38%] w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-ping opacity-25" />
      <div className="absolute top-[88%] left-[30%] w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-ping opacity-35" />

    </div>
  );
}
