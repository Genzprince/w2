import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState<"default" | "hover" | "drag" | "view" | "play">("default");
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 750, mass: 0.12 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Use event delegation for hover states
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.("[data-cursor]");
      if (target) {
        const type = target.getAttribute("data-cursor") as any;
        const text = target.getAttribute("data-cursor-text") || "";
        setCursorType(type || "hover");
        setCursorText(text);
      } else {
        setCursorType("default");
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter, { passive: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  const cursorVariants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: "var(--accent-color)",
      border: "0px solid var(--border-color)",
    },
    hover: {
      width: 48,
      height: 48,
      backgroundColor: "var(--accent-bg-trans)",
      border: "1.5px solid var(--accent-color)",
    },
    view: {
      width: 72,
      height: 72,
      backgroundColor: "var(--accent-color)",
      border: "1px solid var(--border-color)",
    },
    drag: {
      width: 72,
      height: 72,
      backgroundColor: "var(--accent-color)",
      border: "1px solid var(--border-color)",
    },
    play: {
      width: 64,
      height: 64,
      backgroundColor: "var(--accent-hover)",
      border: "1px solid var(--border-color)",
    }
  };

  return (
    <>
      {/* Outer Follower */}
      <motion.div
        className="custom-cursor fixed pointer-events-none z-[9999] rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 overflow-hidden"
        style={{
          left: springX,
          top: springY,
        }}
        animate={cursorType}
        variants={cursorVariants}
        transition={{ type: "spring", stiffness: 600, damping: 24, mass: 0.1 }}
      >
        {/* Dynamic Cursor text labels */}
        {cursorType === "view" && (
          <span className="text-[10px] font-mono tracking-wider text-[var(--logo-text)] font-bold uppercase select-none text-center leading-tight block px-1.5">
            {cursorText || "View"}
          </span>
        )}
        {cursorType === "drag" && (
          <span className="text-[10px] font-mono tracking-wider text-[var(--logo-text)] font-bold uppercase select-none text-center leading-tight block px-1.5">
            {cursorText || "↔ Slide"}
          </span>
        )}
        {cursorType === "play" && (
          <span className="text-[10px] font-mono tracking-wider text-[var(--logo-text)] font-bold uppercase select-none text-center leading-tight block px-1.5">
            {cursorText || "Play"}
          </span>
        )}
        {cursorType === "hover" && !cursorText && (
          <div className="w-1.5 h-1.5 bg-[var(--text-primary)] rounded-full" />
        )}
      </motion.div>

      {/* Inner Dot */}
      <motion.div
        className="custom-cursor fixed w-1.5 h-1.5 bg-[var(--text-primary)] rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2"
        style={{
          left: cursorX,
          top: cursorY,
        }}
        animate={{
          scale: cursorType === "default" ? 1 : 0.2,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
