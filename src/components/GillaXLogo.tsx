import React from "react";

interface GillaXLogoProps {
  className?: string;
  glow?: boolean;
}

export default function GillaXLogo({ className = "w-12 h-7 scale-125", glow = true }: GillaXLogoProps) {
  return (
    <div className={`relative inline-flex items-center ${glow ? "group" : ""}`}>
      {/* Subtle outer purple glow matching the high-end creative style */}
      {glow && (
        <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg blur-md opacity-25 group-hover:opacity-50 transition duration-500 pointer-events-none" />
      )}
      <img
        src="https://plain-eeur-prod-public.komododecks.com/202607/21/TCWnNgYMKEG1wFxpEcsa/image.png"
        alt="GillaX Logo"
        referrerPolicy="no-referrer"
        className={`relative z-10 select-none object-cover object-center rounded-lg shadow-md ${className}`}
        style={{ background: "#000" }}
      />
    </div>
  );
}
