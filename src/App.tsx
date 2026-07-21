import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUpRight, ShieldCheck, Linkedin, Instagram, Youtube, Twitter, MessageSquare, Share2, Briefcase } from "lucide-react";
import GillaXLogo from "./components/GillaXLogo";

import LoadingScreen from "./components/LoadingScreen";
import AdminPanel from "./admin/AdminPanel";
import HeroSection from "./components/HeroSection";
import ClientLogosBar from "./components/ClientLogosBar";
import ProcessSection from "./components/ProcessSection";
import PortfolioSection from "./components/PortfolioSection";
import TestimonialsSection from "./components/TestimonialsSection";
import ContactSection from "./components/ContactSection";
import SectionSeparator from "./components/SectionSeparator";

export default function App() {
  // Always stay with dark mode only
  const theme = "dark";
  const [isLoading, setIsLoading] = useState(true);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [timeUTC, setTimeUTC] = useState("");

  // Lock scrolling while loading is active
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  // Update current scroll progress percentage
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollY = window.scrollY;
      const pct = (scrollY / (docHeight - windowHeight)) * 100;
      setScrollPercentage(pct);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync real time UTC
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeUTC(now.toISOString().replace("T", " ").slice(0, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const [logoClickCount, setLogoClickCount] = useState(0);
  const logoClickTimer = useState<ReturnType<typeof setTimeout> | null>(null);
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [shareStatus, setShareStatus] = useState("");

  const handleShare = async () => {
    const shareData = {
      title: "Gillax - Elite Video Editing & Direction Portfolio",
      text: "Check out Gillax's high-retention video editing and creative direction portfolio. Professional assets, tailored storytelling, and viral-ready content.",
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareStatus("SHARED!");
        setTimeout(() => setShareStatus(""), 2000);
      } catch (err) {
        handleCopyFallback();
      }
    } else {
      handleCopyFallback();
    }
  };

  const handleCopyFallback = () => {
    navigator.clipboard.writeText(window.location.origin);
    setShareStatus("LINK COPIED!");
    setTimeout(() => setShareStatus(""), 2000);
  };

  const handleDiscordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("gilla_x");
    setCopiedDiscord(true);
    setTimeout(() => setCopiedDiscord(false), 2000);
  };

  const handleLogoClick = () => {
    scrollToSection("hero");
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    if (logoClickTimer[0]) clearTimeout(logoClickTimer[0]);
    if (newCount >= 4) {
      setLogoClickCount(0);
      window.location.href = "/admin";
      return;
    }
    logoClickTimer[1](setTimeout(() => setLogoClickCount(0), 1500));
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Show admin panel at /admin — skip loading, ensure body can scroll
  if (window.location.pathname === "/admin") {
    document.body.style.overflow = "";
    return <AdminPanel />;
  }

  return (
    <div className="relative min-h-screen selection:bg-[var(--accent-color)] selection:text-[var(--logo-text)]">

      {/* 2. Cinematic Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Main website is mounted immediately so the browser can pre-render/paint it behind the loading overlay, preventing entering lag */}
      <div
        className={`theme-${theme} relative flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500`}
      >
          {/* Scroll Progress Line */}
          <div 
            className="fixed top-0 left-0 h-[3px] z-[1001] transition-all duration-100"
            style={{ width: `${scrollPercentage}%`, background: "var(--cozy-line)" }}
          />

          {/* ========================================== */}
          {/* STICKY GLASSMORPHIC HEADER */}
          {/* ========================================== */}
          <header className="fixed top-0 inset-x-0 h-16 md:h-20 z-50 transition-colors duration-500 bg-[var(--bg-primary)]/95 border-b border-[var(--border-color)]">
            <div className="w-full max-w-[1440px] mx-auto h-full px-3 sm:px-6 flex justify-between items-center">
              
              {/* Logo text pairing — 4 rapid clicks = admin */}
              <div 
                onClick={handleLogoClick}
                data-cursor="hover"
                className="flex items-center space-x-3.5 cursor-pointer select-none"
              >
                {/* Logo rounded black box with no glow */}
                <div className="bg-black border border-neutral-900 rounded-[14px] px-3.5 py-2 flex items-center justify-center transition-all duration-300">
                  <GillaXLogo className="w-12 h-7 scale-125" glow={false} />
                </div>
                {/* Name & Subtitle */}
                <div className="flex flex-col justify-center -space-y-0.5">
                  <span className="text-sm sm:text-base md:text-lg font-black font-sans tracking-[0.15em] text-white uppercase">
                    PRINCE
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.22em] text-neutral-500 uppercase font-semibold">
                    GILLA_X
                  </span>
                </div>
              </div>

              {/* Nav CTA Action - Always Visible for Clean Minimalist Header */}
              <div className="flex items-center">
                <button
                  onClick={() => scrollToSection("contact")}
                  data-cursor="hover"
                  className="inline-flex items-center space-x-1.5 bg-[var(--accent-color)] text-[var(--logo-text)] px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-[9px] sm:text-[10px] font-mono tracking-widest uppercase hover:bg-[var(--accent-hover)] transition-all duration-300 shadow-sm cursor-pointer"
                >
                  <span>START BRIEF</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          </header>

          {/* Mobile responsive drawer overlay removed */}

          {/* ========================================== */}
          {/* MAIN WORKSPACE COMPOSITES */}
          {/* ========================================== */}
          <main className="flex-1 mt-16 md:mt-20">
            
            {/* Hero Section */}
            <HeroSection
              onExplorePortfolio={() => scrollToSection("portfolio")}
              onStartProject={() => scrollToSection("contact")}
            />

            {/* Scrolling Clients & Collaborators Logo Bar */}
            <ClientLogosBar />

            {/* Custom Portfolio Works */}
            <PortfolioSection />

            <SectionSeparator />

            {/* Testimonials */}
            <TestimonialsSection />

            <SectionSeparator />

            {/* Interactive Process Section */}
            <ProcessSection />

            <SectionSeparator />

            {/* Contact BRIEF Spec */}
            <ContactSection />

          </main>

          {/* ========================================== */}
          {/* ARCHITECTURAL FOOTER */}
          {/* ========================================== */}
          <footer className="bg-[var(--bg-secondary)] text-[var(--text-primary)] border-t border-[var(--border-color)] py-12 px-3 sm:px-6 transition-colors duration-500">
            <div className="w-full max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              
              <div className="flex flex-col text-center md:text-left space-y-2">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <span className="font-display text-sm font-black tracking-widest text-[var(--text-primary)]">GILLAX EDITING</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[10px] font-mono text-[var(--text-secondary)] opacity-80">
                  © 2026 Gillax Editing Portfolio. Sculpted under zero grid layouts. All rights reserved.
                </p>
                
                {/* Socials Link Row */}
                <div className="flex items-center justify-center md:justify-start space-x-4 pt-1.5 relative">
                  {[
                    { icon: Youtube, url: "https://www.youtube.com/@Gillaxediting", label: "YouTube" },
                    { icon: Briefcase, url: "https://ytjobs.co/talent/profile/442016?r=947", label: "YT Jobs" },
                    { icon: Instagram, url: "https://www.instagram.com/gillaxediting/", label: "Instagram" },
                    { icon: Twitter, url: "https://x.com/Gillaxediting", label: "Twitter" },
                    { icon: Linkedin, url: "https://www.linkedin.com/in/prince-igl-7279b1322/", label: "LinkedIn" },
                    { icon: MessageSquare, url: "#", label: "Discord", isDiscord: true }
                  ].map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <div key={social.label} className="relative group/social">
                        <motion.a
                          href={social.url}
                          target={social.isDiscord ? undefined : "_blank"}
                          rel={social.isDiscord ? undefined : "noopener noreferrer"}
                          onClick={social.isDiscord ? handleDiscordClick : undefined}
                          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 flex items-center justify-center cursor-pointer"
                          aria-label={social.label}
                          whileHover={{
                            scale: [1, 1.2, 1],
                            opacity: [0.75, 1, 0.75],
                            transition: {
                              repeat: Infinity,
                              duration: 1.4,
                              ease: "easeInOut"
                            }
                          }}
                        >
                          <IconComponent className="w-4 h-4" />
                        </motion.a>
                        
                        {/* Custom visual tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-[8px] font-mono tracking-wider uppercase text-[var(--text-primary)] opacity-0 group-hover/social:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-md">
                          {social.isDiscord && copiedDiscord ? "Copied gilla_x!" : social.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Middle indicator: UTC Real-time Clock */}
              <div className="text-center font-mono text-[10px] text-[var(--text-secondary)] space-y-1">
                <span className="block tracking-widest">LIVE TIMELINE SYSTEM</span>
                <span className="text-[var(--accent-color)] font-medium">{timeUTC || "SYNCING..."}</span>
              </div>

              <div className="flex items-center space-x-6 text-[10px] font-mono text-[var(--text-secondary)] uppercase">
                <button 
                  onClick={handleShare} 
                  className="hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>{shareStatus || "Share Portfolio"}</span>
                </button>
                <span>•</span>
                <button 
                  onClick={() => scrollToSection("hero")} 
                  className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  BACK TO HERO ↑
                </button>
              </div>

            </div>
          </footer>

      </div>
    </div>
  );
}
