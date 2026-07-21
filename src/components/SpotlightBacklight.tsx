import { useEffect, useRef, useState } from "react";

export default function SpotlightBacklight() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const ambRef = useRef<HTMLDivElement>(null);

  const targetMouse = useRef({ x: typeof window !== "undefined" ? window.innerWidth / 2 : 0, y: typeof window !== "undefined" ? window.innerHeight / 2 : 0 });
  const spotPos = useRef({ x: typeof window !== "undefined" ? window.innerWidth / 2 : 0, y: typeof window !== "undefined" ? window.innerHeight / 2 : 0 });
  const ambPos = useRef({ x: typeof window !== "undefined" ? window.innerWidth / 2 : 0, y: typeof window !== "undefined" ? window.innerHeight / 2 : 0 });

  const targetOpacity = useRef(0);
  const currentOpacity = useRef(0);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device
    const checkTouch = () => {
      const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsTouch(touch);
    };
    checkTouch();

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current = { x: e.clientX, y: e.clientY };
      targetOpacity.current = 1; // Fade in once the mouse starts moving
    };

    const handleMouseLeave = () => {
      targetOpacity.current = 0; // Fade out when cursor leaves window
    };

    const handleMouseEnter = () => {
      targetOpacity.current = 1;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    let animationFrameId: number;

    const updatePosition = () => {
      // Lerp for Spotlight
      const dx1 = targetMouse.current.x - spotPos.current.x;
      const dy1 = targetMouse.current.y - spotPos.current.y;
      spotPos.current.x += dx1 * 0.12; // Quick feedback
      spotPos.current.y += dy1 * 0.12;

      // Lerp for Ambient Glow (slower, lags slightly behind to create depth)
      const dx2 = targetMouse.current.x - ambPos.current.x;
      const dy2 = targetMouse.current.y - ambPos.current.y;
      ambPos.current.x += dx2 * 0.035; // Lags behind
      ambPos.current.y += dy2 * 0.035;

      // Lerp opacity for smooth fade in/out transitions
      const dOpacity = targetOpacity.current - currentOpacity.current;
      currentOpacity.current += dOpacity * 0.1;

      // Directly update DOM style for high performance (keeps solid 60fps)
      if (spotRef.current) {
        spotRef.current.style.transform = `translate3d(${spotPos.current.x - 350}px, ${spotPos.current.y - 350}px, 0)`;
      }
      if (ambRef.current) {
        ambRef.current.style.transform = `translate3d(${ambPos.current.x - 600}px, ${ambPos.current.y - 600}px, 0)`;
      }
      if (containerRef.current) {
        containerRef.current.style.opacity = currentOpacity.current.toString();
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    // Start the animation loop
    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Completely disable/hide on touch devices as requested
  if (isTouch) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[1] select-none overflow-hidden transition-opacity duration-500"
      style={{ opacity: 0 }}
    >
      {/* 1. Primary Spotlight (500–700px size, soft white, 8-18% opacity, fast reaction) */}
      <div
        ref={spotRef}
        className="absolute w-[700px] h-[700px] rounded-full will-change-transform mix-blend-screen"
        style={{
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.13) 0%, rgba(255, 255, 255, 0.04) 45%, rgba(255, 255, 255, 0) 70%)",
          left: 0,
          top: 0,
          transform: "translate3d(-1000px, -1000px, 0)",
        }}
      />

      {/* 2. Secondary Ambient Glow (900-1200px size, 3-5% opacity, slower lagging reaction) */}
      <div
        ref={ambRef}
        className="absolute w-[1200px] h-[1200px] rounded-full will-change-transform mix-blend-screen"
        style={{
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.035) 0%, rgba(255, 255, 255, 0.01) 50%, rgba(255, 255, 255, 0) 80%)",
          left: 0,
          top: 0,
          transform: "translate3d(-2000px, -2000px, 0)",
        }}
      />
    </div>
  );
}
