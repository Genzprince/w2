import { motion } from "motion/react";

interface SectionSeparatorProps {
  className?: string;
  delay?: number;
}

export default function SectionSeparator({ className = "", delay = 0.1 }: SectionSeparatorProps) {
  return (
    <div className={`w-full max-w-[1440px] mx-auto px-6 md:px-12 py-3 md:py-4 flex justify-center items-center overflow-hidden select-none pointer-events-none ${className}`}>
      <div className="relative w-full flex items-center justify-center h-[2px]">
        {/* Base Faded Separator Line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.5 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent"
          style={{ transformOrigin: "center" }}
        />
      </div>
    </div>
  );
}
