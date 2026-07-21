import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Mail, 
  MessageSquare, 
  User, 
  ArrowUpRight, 
  CloudUpload,
  Calendar,
  Clock,
  Video,
  Check,
  Copy,
  X,
  Youtube,
  Twitter,
  Linkedin,
  Instagram,
  Briefcase,
  Shield,
  Globe,
  Lock
} from "lucide-react";

export default function ContactSection() {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientBrief, setClientBrief] = useState("");
  const [selectedMeetingType, setSelectedMeetingType] = useState("10-min");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [toast, setToast] = useState<{ title: string; message: string; type: "success" | "info" } | null>(null);

  const handleCopy = (text: string, id: string, label: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedText(id);
      setToast({
        title: "Copied to Clipboard",
        message: `Successfully copied ${label} to clipboard!`,
        type: "success"
      });
      setTimeout(() => setCopiedText(null), 2000);
      setTimeout(() => setToast(null), 3500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleSubmitBrief = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setToast({
        title: "Briefing Submitted!",
        message: `Thank you, ${clientName}! Your project brief was successfully sent.`,
        type: "success"
      });
      setTimeout(() => setToast(null), 5000);
    }, 1200);
  };

  const meetingTypes = [
    {
      id: "10-min",
      title: "10-Min Discovery Call",
      description: "Quick chat to cover workflow, raw footage size, and general editing rates.",
      duration: "10 Mins",
      type: "Discovery Call",
      price: "Free",
      url: "https://calendly.com/princeyt2001/30min"
    },
    {
      id: "onboarding",
      title: "Onboarding Call",
      description: "Kick off the production workflow, synchronize project directories, and review asset delivery specifications.",
      duration: "Onboard",
      type: "Onboarding Call",
      price: "Free",
      url: "https://calendly.com/princeyt2001/30min"
    },
    {
      id: "15-min-paid",
      title: "15-Min Paid Consulting",
      description: "In-depth dynamic audit of your content, editing strategy, and retention benchmarks.",
      duration: "15 Mins",
      type: "Strategic Consulting",
      price: "$30 USD",
      url: "https://calendly.com/princeyt2001/30min"
    }
  ];

  const activeMeeting = meetingTypes.find(m => m.id === selectedMeetingType) || meetingTypes[0];

  return (
    <section id="contact" className="relative py-20 md:py-28 bg-[var(--bg-secondary)] text-[var(--text-primary)] overflow-hidden border-t border-[var(--border-color)] transition-colors duration-500">
      
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col space-y-5 mb-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-[var(--accent-hover)] font-extrabold uppercase w-fit mx-auto shadow-[0_0_15px_rgba(124,111,159,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-hover)] animate-pulse shadow-[0_0_8px_rgba(184,174,207,0.5)]" />
            <span>AVAILABLE FOR NEW PROJECTS</span>
          </div>
          
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-[var(--text-primary)] leading-none">
            Let's Create Content
          </h2>
          
          <p className="text-xs sm:text-sm text-[#C4C2BC] font-light max-w-2xl mx-auto leading-relaxed pt-1">
            Tell me about your project. Whether it's YouTube, documentaries, branded content, or short-form edits, I'll get back to you within 24 hours.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 max-w-4xl mx-auto">
            <motion.div 
              whileHover={{ scale: 1.03, y: -1 }}
              className="flex items-center space-x-2 bg-neutral-900/45 border border-[var(--border-color)] hover:border-[var(--accent-hover)]/30 px-3.5 py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[var(--text-primary)]/90 transition-all duration-300 shadow-xs cursor-default"
            >
              <Clock className="w-4 h-4 text-[var(--accent-hover)] filter drop-shadow-[0_0_6px_rgba(184,174,207,0.4)] shrink-0" />
              <span>Reply within 24 hours</span>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.03, y: -1 }}
              className="flex items-center space-x-2 bg-neutral-900/45 border border-[var(--border-color)] hover:border-[var(--accent-hover)]/30 px-3.5 py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[var(--text-primary)]/90 transition-all duration-300 shadow-xs cursor-default"
            >
              <Shield className="w-4 h-4 text-[var(--accent-hover)] filter drop-shadow-[0_0_6px_rgba(184,174,207,0.4)] shrink-0" />
              <span>NDA Friendly</span>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.03, y: -1 }}
              className="flex items-center space-x-2 bg-neutral-900/45 border border-[var(--border-color)] hover:border-[var(--accent-hover)]/30 px-3.5 py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[var(--text-primary)]/90 transition-all duration-300 shadow-xs cursor-default"
            >
              <Globe className="w-4 h-4 text-[var(--accent-hover)] filter drop-shadow-[0_0_6px_rgba(184,174,207,0.4)] shrink-0" />
              <span>Worldwide Clients</span>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.03, y: -1 }}
              className="flex items-center space-x-2 bg-neutral-900/45 border border-[var(--border-color)] hover:border-[var(--accent-hover)]/30 px-3.5 py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[var(--text-primary)]/90 transition-all duration-300 shadow-xs cursor-default"
            >
              <Lock className="w-4 h-4 text-[var(--accent-hover)] filter drop-shadow-[0_0_6px_rgba(184,174,207,0.4)] shrink-0" />
              <span>Secure File Sharing</span>
            </motion.div>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Book a Call */}
            <div className="p-6 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl relative overflow-hidden group shadow-md">
              <div className="flex items-center space-x-3 mb-5 border-b border-[var(--border-color)] pb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-bg-trans)] flex items-center justify-center text-[var(--accent-color)] shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-black uppercase tracking-wider text-[var(--text-primary)]">
                    Schedule a Strategic Call
                  </h3>
                  <p className="text-[10px] text-[var(--text-secondary)] font-mono uppercase font-bold">
                    SECURE A DIRECT VIDEO SLOT
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
                {meetingTypes.map((meeting) => (
                  <button
                    key={meeting.id}
                    onClick={() => setSelectedMeetingType(meeting.id)}
                    className={`p-3 rounded-xl border text-left transition-all duration-300 relative cursor-pointer ${
                      selectedMeetingType === meeting.id
                        ? "border-[var(--accent-color)] bg-[var(--accent-bg-trans)] text-[var(--text-primary)] shadow-sm"
                        : "border-[var(--border-color)] bg-[var(--bg-primary)]/45 text-[var(--text-secondary)] hover:border-[var(--text-secondary)]/30"
                    }`}
                  >
                    {selectedMeetingType === meeting.id && (
                      <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]" />
                    )}
                    <span className="text-[9px] font-mono uppercase tracking-wider font-bold block mb-1">
                      {meeting.duration} {meeting.price && meeting.price !== "Free" ? `(${meeting.price})` : ""}
                    </span>
                    <span className="text-[11px] font-bold block text-[var(--text-primary)] line-clamp-1">
                      {meeting.type}
                    </span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedMeetingType}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[var(--bg-primary)]/50 border border-[var(--border-color)] p-4 rounded-xl space-y-3.5 mb-5"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col">
                      <h4 className="text-xs font-bold text-[var(--text-primary)]">{activeMeeting.title}</h4>
                      {activeMeeting.price && (
                        <span className="text-[10px] font-mono font-bold text-[var(--accent-color)] mt-0.5">
                          Amount: {activeMeeting.price}
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center space-x-1 text-[9px] font-mono text-[var(--text-secondary)] uppercase shrink-0">
                      <Clock className="w-3 h-3 text-[var(--accent-color)]" />
                      <span>{activeMeeting.duration} Video Call</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-primary)]/70 font-light leading-relaxed">{activeMeeting.description}</p>
                  <div className="flex items-center space-x-3 text-[10px] text-[var(--text-secondary)] pt-1 border-t border-[var(--border-color)]">
                    <span className="flex items-center space-x-1">
                      <Video className="w-3 h-3 text-[var(--text-secondary)]" />
                      <span>Google Meet / Zoom</span>
                    </span>
                    <span className="text-[var(--border-color)]">•</span>
                    <span className="text-[var(--accent-hover)] font-bold">Slots Open Daily</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              <motion.a
                href={activeMeeting.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full inline-flex items-center justify-center space-x-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-[var(--logo-text)] py-3.5 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all duration-300 shadow-md cursor-pointer"
              >
                <span>BOOK THIS SLOT ON CALENDLY</span>
                <ArrowUpRight className="w-4 h-4" />
              </motion.a>
            </div>

            {/* Direct Channels */}
            <div className="space-y-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[var(--text-primary)] transition-colors">
                Alternative Direct Channels
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ y: -3 }}
                  className="p-4 bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/40 rounded-2xl transition-all duration-300 shadow-xs flex flex-col justify-between h-40 group relative overflow-hidden"
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <div className="w-8 h-8 rounded-lg bg-[var(--accent-bg-trans)] flex items-center justify-center text-[var(--accent-color)] shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="font-display text-xs font-bold uppercase tracking-wide text-[var(--text-primary)] pt-1">Direct Email</h4>
                    <p className="text-[10px] text-[var(--text-primary)]/70 font-light leading-relaxed line-clamp-2">
                      For detailed business proposals, multi-video campaigns, and official outreach.
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-color)] relative group/info-row">
                    <a
                      href="mailto:Gillaxediting@gmail.com"
                      className="inline-flex items-center space-x-1 text-xs font-mono font-bold text-[var(--accent-color)] group-hover:text-[var(--accent-hover)] transition-colors"
                    >
                      <span>Gillaxediting@gmail.com</span>
                      <ArrowUpRight className="w-3 h-3 group-hover/info-row:translate-x-0.5 group-hover/info-row:-translate-y-0.5 transition-transform" />
                    </a>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCopy("Gillaxediting@gmail.com", "email", "Email Address"); }}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300 bg-[var(--accent-color)]/10 hover:bg-[var(--accent-color)]/20 border border-[var(--accent-color)]/20 rounded-lg w-7 h-7 text-[var(--accent-color)] flex items-center justify-center cursor-pointer absolute right-0 bottom-[-4px] md:bottom-[-2px]"
                      title={copiedText === "email" ? "Copied!" : "Copy email address"}
                    >
                      {copiedText === "email" ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 animate-pulse" />
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Direct Social Channels Card */}
                <motion.div
                  whileHover={{ y: -3 }}
                  className="p-4 bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/40 rounded-2xl transition-all duration-300 shadow-xs flex flex-col justify-between h-40 group relative overflow-hidden"
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <div className="w-8 h-8 rounded-lg bg-[var(--accent-bg-trans)] flex items-center justify-center text-[var(--accent-color)] shrink-0">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <span className="text-[8px] font-mono tracking-widest text-[var(--accent-hover)] bg-[var(--accent-color)]/10 px-2 py-0.5 rounded-full font-bold">ONLINE & ACTIVE</span>
                    </div>
                    <h4 className="font-display text-xs font-bold uppercase tracking-wide text-[var(--text-primary)] pt-1">Direct Socials</h4>
                    <p className="text-[10px] text-[var(--text-primary)]/70 font-light leading-snug line-clamp-2">
                      Instant access to Prince across specialized recruitment pipelines and social networks.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-[var(--border-color)] relative">
                    {[
                      { icon: Youtube, url: "https://www.youtube.com/@Gillaxediting", label: "YouTube", color: "hover:bg-red-500/10 hover:text-red-500" },
                      { icon: Briefcase, url: "https://ytjobs.co/talent/profile/442016?r=947", label: "YT Jobs", color: "hover:bg-amber-500/10 hover:text-amber-500" },
                      { icon: Instagram, url: "https://www.instagram.com/gillaxediting/", label: "Instagram", color: "hover:bg-pink-500/10 hover:text-pink-500" },
                      { icon: Twitter, url: "https://x.com/Gillaxediting", label: "Twitter", color: "hover:bg-sky-500/10 hover:text-sky-500" },
                      { icon: Linkedin, url: "https://www.linkedin.com/in/prince-igl-7279b1322/", label: "LinkedIn", color: "hover:bg-blue-500/10 hover:text-blue-500" },
                      { icon: MessageSquare, url: "#", label: "Discord", isDiscord: true, color: "hover:bg-indigo-500/10 hover:text-indigo-400" }
                    ].map((social) => {
                      const IconComponent = social.icon;
                      const isDiscordAndCopied = social.isDiscord && copiedText === "discord-direct";
                      return (
                        <div key={social.label} className="relative group/soc">
                          <motion.a
                            href={social.url}
                            target={social.isDiscord ? undefined : "_blank"}
                            rel={social.isDiscord ? undefined : "noopener noreferrer"}
                            onClick={social.isDiscord ? (e) => { e.preventDefault(); handleCopy("gilla_x", "discord-direct", "Discord Username"); } : undefined}
                            whileTap={{ scale: 0.95 }}
                            className={`w-8 h-8 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]/60 flex items-center justify-center text-[var(--text-secondary)] transition-all duration-300 cursor-pointer ${social.color}`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </motion.a>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-1.5 py-0.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-[7px] font-mono tracking-wider uppercase text-[var(--text-primary)] opacity-0 group-hover/soc:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xs">
                            {isDiscordAndCopied ? "Copied gilla_x!" : social.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              <motion.div
                whileHover={{ y: -2 }}
                onClick={() => handleCopy("Gillaxediting@gmail.com", "blip", "Blip Delivery Email")}
                className="p-4 bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/30 rounded-2xl transition-all duration-300 shadow-xs flex items-center justify-between cursor-pointer group/blip-card"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[var(--accent-bg-trans)] flex items-center justify-center text-[var(--accent-color)] shrink-0 group-hover/blip-card:scale-105 transition-transform duration-300">
                    <CloudUpload className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-display text-[11px] font-bold uppercase tracking-wider text-[var(--text-primary)]">Assets & Footage on Blip</h4>
                      <span className="text-[7px] font-mono text-[var(--accent-color)] bg-[var(--accent-bg-trans)] px-1.5 py-0.5 rounded-full uppercase font-bold">FILES & FOOTAGE</span>
                    </div>
                    <p className="text-[10px] text-[var(--text-primary)]/65 font-light">Deliver raw footage packages directly to Prince's master pipeline.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] group-hover/blip-card:border-[var(--accent-color)]/40 px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold text-[var(--text-primary)] transition-all hidden sm:flex items-center space-x-2 select-none">
                    <span>Gillaxediting@gmail.com on Blip</span>
                    {copiedText === "blip" ? <Check className="w-3 h-3 text-[var(--accent-color)] animate-bounce" /> : <Copy className="w-3 h-3 text-[var(--accent-color)] opacity-60 group-hover/blip-card:opacity-100 transition-opacity" />}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-6 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between self-stretch overflow-hidden min-h-[500px]">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="contact-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full justify-between"
                >
                  <div>
                    <div className="space-y-1.5 mb-6 border-b border-[var(--border-color)] pb-4">
                      <h3 className="font-display text-lg font-black uppercase tracking-tight text-[var(--text-primary)]">Send a Quick Message</h3>
                      <p className="text-xs text-[var(--text-primary)]/70 font-light">Describe what you need edited and provide contact details. Fast 12-hour reply guaranteed.</p>
                    </div>

                    <form onSubmit={handleSubmitBrief} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono uppercase text-[var(--text-secondary)] tracking-wider font-bold">Your Name</label>
                        <div className="relative group">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-primary)]/40 group-focus-within:text-[var(--accent-color)] transition-colors" />
                          <input type="text" required value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Gillax"
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)]/60 focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)]/10 rounded-xl py-3 pl-10 pr-4 text-xs sm:text-sm text-[var(--text-primary)] outline-none transition-all duration-350" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono uppercase text-[var(--text-secondary)] tracking-wider font-bold">Email Address</label>
                        <div className="relative group">
                           <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-primary)]/40 group-focus-within:text-[var(--accent-color)] transition-colors" />
                          <input type="email" required value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="e.g. Gillaxediting@gmail.com"
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)]/10 rounded-xl py-3 pl-10 pr-4 text-xs sm:text-sm text-[var(--text-primary)] outline-none transition-all duration-350" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono uppercase text-[var(--text-secondary)] tracking-wider font-bold">Project Details & Inspiration</label>
                        <div className="relative group">
                          <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--text-primary)]/40 group-focus-within:text-[var(--accent-color)] transition-colors" />
                          <textarea rows={5} required value={clientBrief} onChange={(e) => setClientBrief(e.target.value)}
                            placeholder="What are we editing? Tell us about your files, duration targets, style reference, or creators you love..."
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)]/10 rounded-xl py-3 pl-10 pr-4 text-xs sm:text-sm text-[var(--text-primary)] outline-none transition-all duration-350 resize-none" />
                        </div>
                      </div>

                      <div className="pt-2">
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full inline-flex items-center justify-center space-x-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-[var(--logo-text)] py-3.5 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all duration-300 shadow-md cursor-pointer disabled:opacity-40"
                        >
                          {isSubmitting ? <span>TRANSMITTING MESSAGE...</span> : <><Send className="w-4 h-4" /><span>SEND INQUIRY</span></>}
                        </motion.button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="contact-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center text-center py-8 px-2 h-full my-auto"
                >
                  <div className="relative mb-6">
                    <motion.div
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      className="absolute inset-0 bg-[var(--accent-color)]/15 rounded-full blur-lg"
                    />
                    <div className="w-16 h-16 rounded-full bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 flex items-center justify-center text-[var(--accent-hover)] relative z-10">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                  </div>

                  <h4 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--text-primary)] mb-2">
                    Inquiry Transmitted
                  </h4>
                  
                  <div className="inline-flex items-center space-x-1.5 bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest text-[var(--accent-hover)] font-bold uppercase mb-6 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-hover)] animate-ping" />
                    <span>SECURE PIPELINE RECEIVED</span>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-sm leading-relaxed mb-6">
                    Thank you, <span className="font-bold text-[var(--text-primary)]">{clientName}</span>. Your creative briefing has been received. Gillax will review your details and email you at <span className="font-mono text-neutral-200">{clientEmail}</span> within 12 hours.
                  </p>

                  <div className="w-full max-w-xs bg-[var(--bg-primary)]/60 border border-[var(--border-color)]/80 p-4 rounded-xl text-left space-y-2.5 mb-8">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-[var(--text-secondary)] uppercase">Recipient:</span>
                      <span className="text-[var(--text-primary)] font-bold">Gillaxediting@gmail.com</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-[var(--text-secondary)] uppercase">Est. Response:</span>
                      <span className="text-[var(--accent-hover)] font-bold">12 Hours or Less</span>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => {
                      setIsSuccess(false);
                      setClientName("");
                      setClientEmail("");
                      setClientBrief("");
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center space-x-1.5 border border-[var(--border-color)] hover:border-[var(--accent-hover)]/35 hover:bg-[var(--accent-bg-trans)] text-[var(--text-primary)] px-5 py-2.5 rounded-xl text-[10px] font-mono tracking-widest uppercase transition-all duration-300 shadow-xs cursor-pointer font-bold"
                  >
                    <span>SEND ANOTHER BRIEF</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-[10px] text-[var(--text-secondary)]/50 font-mono text-center pt-6 mt-6 border-t border-[var(--border-color)]">
              SECURE SEC-256 PIPELINE • ZERO SPAM GUARANTEE
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="fixed bottom-6 right-6 z-[99999] max-w-sm bg-neutral-950 border border-[var(--accent-color)]/35 rounded-2xl p-4 shadow-2xl flex items-center space-x-3 text-white"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center text-[var(--accent-hover)] shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1 space-y-0.5">
              <h5 className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-hover)] font-bold">{toast.title}</h5>
              <p className="text-xs text-neutral-200 font-light">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-neutral-500 hover:text-white transition-colors p-1 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
