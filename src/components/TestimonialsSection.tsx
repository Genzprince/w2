import { motion } from "motion/react";
import { ShieldCheck, Youtube, ExternalLink } from "lucide-react";

interface Client {
  id: string;
  name: string;
  creatorType: string;
  subscribers: string;
  review: string;
  extraText: string;
  rating: number;
  initials: string;
  channelUrl: string;
  platform: "youtube" | "discord";
}

const clients: Client[] = [
  {
    id: "gta-assassin",
    name: "The GTA Assassin",
    creatorType: "Gaming Creator",
    subscribers: "312K+ Subscribers",
    review: "He's professional, punctual, and a pleasure to work with.",
    extraText: "Prince consistently delivered high-retention edits with clean pacing, strong storytelling, and reliable communication. Every project was completed professionally and on time.",
    rating: 5,
    initials: "GA",
    channelUrl: "https://www.youtube.com/@TheGTAAssassin",
    platform: "youtube"
  },
  {
    id: "gta-guides",
    name: "GTA Assassin Guides",
    creatorType: "Guides Creator",
    subscribers: "73.8K+ Subscribers",
    review: "Professional, passionate, and always delivers with creativity and consistency.",
    extraText: "Prince helped edit content for our second channel with excellent attention to detail. His work was reliable, creative, and always matched the vision of the videos.",
    rating: 5,
    initials: "GG",
    channelUrl: "https://www.youtube.com",
    platform: "youtube"
  },
  {
    id: "lazy-assassin",
    name: "Lazy Assassin",
    creatorType: "YouTube Creator",
    subscribers: "1M+ Subscribers",
    review: "Reliable, creative, and a great teammate to work with.",
    extraText: "Prince managed video editing, content organization, and production support across multiple projects. His dedication and consistency made every collaboration smooth.",
    rating: 5,
    initials: "LA",
    channelUrl: "https://www.youtube.com",
    platform: "youtube"
  },
  {
    id: "trigger-insaan",
    name: "Trigger Insaan",
    creatorType: "YouTube Creator",
    subscribers: "24M+ Subscribers",
    review: "Friendly, supportive, and always bringing great energy to videos and live streams.",
    extraText: "Working with Prince was enjoyable from start to finish. His positive attitude, communication, and editing skills made every project easier and more engaging.",
    rating: 5,
    initials: "TI",
    channelUrl: "https://www.youtube.com",
    platform: "youtube"
  },
  {
    id: "james-adesida",
    name: "James Adesida",
    creatorType: "Founder • BasketballGods.net",
    subscribers: "BasketballGods.Net",
    review: "A skilled basketball editor with exceptional storytelling potential.",
    extraText: "Prince understands basketball content deeply and combines strong editing with creative storytelling. His attention to detail makes every analysis video engaging.",
    rating: 4,
    initials: "JA",
    channelUrl: "https://basketballgods.net",
    platform: "youtube"
  },
  {
    id: "jai-arora",
    name: "Jai Arora",
    creatorType: "Founder • Tech-iELA",
    subscribers: "10.5M+ Subscribers",
    review: "Talented, hardworking, and always ready to grow.",
    extraText: "Prince consistently showed professionalism and dedication throughout our collaboration. His willingness to improve and deliver quality work stands out.",
    rating: 4,
    initials: "JA",
    channelUrl: "https://www.youtube.com",
    platform: "youtube"
  },
  {
    id: "pentasoft-professional",
    name: "Pentasoft Professional",
    creatorType: "Creative Agency",
    subscribers: "Creative Agency",
    review: "Creative, reliable, and consistently delivers high-quality work.",
    extraText: "Prince strengthened our clients' online presence through video editing, design, and social media management. His creativity and professionalism exceeded expectations.",
    rating: 5,
    initials: "PP",
    channelUrl: "https://www.youtube.com",
    platform: "youtube"
  },
  {
    id: "pixel-empire",
    name: "Pixel Empire",
    creatorType: "YouTube Creator",
    subscribers: "121K+ Subscribers",
    review: "Reliable, professional, and someone I can always count on.",
    extraText: "Over several years of collaboration, Prince consistently delivered outstanding edits, scripts, and creative ideas that improved our content across multiple channels.",
    rating: 5,
    initials: "PE",
    channelUrl: "https://www.youtube.com",
    platform: "youtube"
  },
  {
    id: "dieablo",
    name: "Dieablo",
    creatorType: "Gaming Creator",
    subscribers: "2.18K+ Subscribers",
    review: "Great to work with and a super communicative teammate.",
    extraText: "Prince always delivered quality edits with excellent communication and attention to detail. Working together was smooth, efficient, and enjoyable.",
    rating: 5,
    initials: "DB",
    channelUrl: "https://www.youtube.com/@Dieablo",
    platform: "youtube"
  }
];

// Duplicate for seamless infinite loop
const loopClients = [...clients, ...clients, ...clients];

function TestimonialCard({ client }: { client: Client; key?: string }) {
  const handleClick = () => {
    window.open("https://ytjobs.co/talent/clients/442016", "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      onClick={handleClick}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="relative w-[300px] xl:w-[320px] shrink-0 flex flex-col bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] rounded-2xl p-6 transition-all duration-300 cursor-pointer group"
    >
      {/* Top: Avatar + Name + Platform */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center shrink-0">
            <span className="font-display text-xs font-black text-[var(--text-primary)] tracking-wider">
              {client.initials}
            </span>
          </div>
          <div>
            <h3 className="text-xs font-bold font-display text-[var(--text-primary)] tracking-wide leading-none mb-1">
              {client.name}
            </h3>
            <p className="text-[9px] font-mono text-[var(--text-secondary)] uppercase tracking-widest">
              {client.creatorType}
            </p>
          </div>
        </div>
        <a
          href={client.channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="w-7 h-7 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-color)]/40 transition-all shrink-0"
        >
          {client.platform === "youtube"
            ? <Youtube className="w-3 h-3" />
            : <ExternalLink className="w-3 h-3" />
          }
        </a>
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: client.rating }).map((_, i) => (
          <span 
            key={i} 
            className="text-amber-400 text-[20px] drop-shadow-[0_0_8px_rgba(251,191,36,0.85)] drop-shadow-[0_0_15px_rgba(251,191,36,0.4)] select-none brightness-110 transition-all duration-300"
          >
            ★
          </span>
        ))}
      </div>

      {/* Quote */}
      <div className="flex-1 space-y-2.5">
        <p className="text-sm font-display font-bold text-[var(--text-primary)] leading-snug">
          "{client.review}"
        </p>
        <p className="text-[11px] text-[var(--text-secondary)] font-light leading-relaxed">
          {client.extraText}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-[var(--border-color)]">
        <span className="text-[9px] font-mono text-[var(--text-secondary)] tracking-wider">
          {client.subscribers}
        </span>
        <span className="inline-flex items-center gap-1 text-[9px] font-mono text-[var(--accent-color)] bg-[var(--accent-bg-trans)] border border-[var(--accent-color)]/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold group-hover:bg-[var(--accent-color)]/25 group-hover:border-[var(--accent-color)]/40 transition-all duration-300">
          <ShieldCheck className="w-2.5 h-2.5" />
          Verify ↗
        </span>
      </div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-20 md:py-28 bg-[var(--bg-primary)] border-t border-[var(--border-color)] overflow-hidden transition-colors duration-500">
      {/* Ambient cozy bloom */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(180,165,210,0.05) 0%, transparent 65%)" }} />

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-16 relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-14">
          <div className="inline-flex items-center space-x-2 bg-[var(--accent-bg-trans)] border border-[var(--accent-color)]/20 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-[var(--accent-color)] font-bold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-pulse" />
            <span>COLLABORATION REVIEWS</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">
            What Creators Say
          </h2>
          <div className="relative w-[180px] mx-auto mt-1.5 mb-1">
            <div className="h-[3px] rounded-full" style={{ background: "var(--cozy-line)" }} />
            <div className="absolute inset-0 h-[3px] rounded-full opacity-60" style={{ background: "var(--cozy-line)", filter: "blur(6px)" }} />
          </div>
          <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed max-w-md">
            Real feedback from real creators. Proven results in pacing, retention, and cinematic execution.
          </p>

        </div>

      </div>

      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />

      {/* Infinite scroll track */}
      <div className="overflow-hidden py-4">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes infiniteScroll {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-33.333%, 0, 0); }
          }
          .animate-scroll-track {
            animation: infiniteScroll 85s linear infinite;
          }
        `}} />
        <div
          className="flex gap-5 w-max px-5 animate-scroll-track"
          style={{ 
            willChange: "transform"
          }}
        >
          {loopClients.map((client, idx) => (
            <TestimonialCard key={`${client.id}-${idx}`} client={client} />
          ))}
        </div>
      </div>



    </section>
  );
}
