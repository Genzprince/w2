import { motion } from "motion/react";

const LOGOS = [
  { name: "TRIGGER INSAAN", subtitle: "25M+ CREATOR", featured: true },
  { name: "LAZY ASSASSIN", subtitle: "1M+ CREATOR", featured: true },
  { name: "CREATIVE PANCHAYAT", subtitle: "CREATIVE AGENCY", featured: true },
  { name: "GTA ASSASSIN GUIDES", subtitle: "100K+ CREATOR", featured: true },
  { name: "LAZY PLAYZ", subtitle: "300K+ CREATOR", featured: true },
  { name: "LIVE INSAAN", subtitle: "11M+ CREATOR", featured: true },
  { name: "CELEBRITY HONOR", subtitle: "1.5M+ CHANNEL" },
  { name: "ARRCHETA AGARWAL", subtitle: "YOUTUBE CREATOR" },
  { name: "PENTASOFT PROFESSIONAL", subtitle: "COMPANY" },
  { name: "BASKETBALLGODS.NET", subtitle: "COMPANY" },
  { name: "TECH-iELA", subtitle: "10m+ CREATOR" },
  { name: "GENZ PRINCE", subtitle: "CONTENT CREATOR" },
  { name: "DIEABLO", subtitle: "CONTENT CREATOR" },
  { name: "SYMPHONIQ", subtitle: "MUSIC / RECORD LABEL" },
];

export default function ClientLogosBar() {
  const scrollList = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <div className="w-full py-3 md:py-4 border-t border-b border-[var(--border-color)] overflow-hidden relative select-none">

      {/* Edge fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />

      {/* Label */}
      <div className="flex justify-center mb-3">
        <span className="text-[9px] font-mono tracking-[0.3em] text-[var(--text-secondary)] uppercase">
          TRUSTED BY CREATORS & BRANDS WORLDWIDE
        </span>
      </div>

      {/* Scrolling track */}
      <div className="flex overflow-hidden w-full">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 100, repeat: Infinity }}
          className="flex items-center whitespace-nowrap shrink-0"
        >
          {scrollList.map((logo, idx) => (
            <div key={idx} className="inline-flex items-center">
              <div className="inline-flex flex-col items-start px-8 md:px-12 group cursor-default">
                {logo.featured ? (
                  <>
                    <span className="font-display text-xs md:text-sm font-black tracking-widest text-[var(--text-primary)] uppercase opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                      {logo.name}
                    </span>
                    <span className="text-[8px] font-mono tracking-[0.2em] text-[var(--text-secondary)] uppercase mt-0.5 opacity-50">
                      {logo.subtitle}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-display text-xs md:text-sm font-black tracking-widest text-[var(--text-primary)] uppercase opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                      {logo.name}
                    </span>
                    <span className="text-[8px] font-mono tracking-[0.2em] text-[var(--text-secondary)] uppercase mt-0.5 opacity-50">
                      {logo.subtitle}
                    </span>
                  </>
                )}
              </div>
              {/* Divider */}
              <span className="text-[var(--border-color)] text-lg font-thin select-none">·</span>
            </div>
          ))}
        </motion.div>
      </div>

    </div>
  );
}
