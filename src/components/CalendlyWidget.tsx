import { useEffect } from "react";

declare global {
  interface Window {
    Calendly?: {
      initBadgeWidget: (options: {
        url: string;
        text: string;
        color: string;
        textColor: string;
        branding?: boolean;
      }) => void;
      destroyBadgeWidget?: () => void;
    };
  }
}

export default function CalendlyWidget() {
  useEffect(() => {
    // 1. Load Stylesheet
    const linkId = "calendly-styles";
    let link = document.getElementById(linkId) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    // 2. Load Script
    const scriptId = "calendly-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const initWidget = () => {
      if (window.Calendly) {
        // Clean up any existing badge container first to avoid duplicates
        const existingBadge = document.querySelector(".calendly-badge-widget");
        if (existingBadge) {
          existingBadge.remove();
        }

        window.Calendly.initBadgeWidget({
          url: "https://calendly.com/princeyt2001/30min",
          text: "Schedule time with me",
          color: "#a855f7", // Elegant purple color matching the dark minimalist aesthetic
          textColor: "#ffffff",
          branding: false,
        });

        // Add visual polish to Calendly badge widget to fit our layout perfectly
        const badgeElement = document.querySelector(".calendly-badge-widget") as HTMLElement | null;
        if (badgeElement) {
          badgeElement.style.fontFamily = "'Inter', sans-serif";
          badgeElement.style.fontWeight = "bold";
          badgeElement.style.borderRadius = "9999px";
          badgeElement.style.fontSize = "13px";
          badgeElement.style.boxShadow = "0 20px 40px -5px rgba(168, 85, 247, 0.4)";
          badgeElement.style.transition = "transform 0.2s ease, filter 0.2s ease";
        }
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.type = "text/javascript";
      script.async = true;
      script.onload = () => {
        initWidget();
      };
      document.body.appendChild(script);
    } else {
      // Script already loaded, direct init
      initWidget();
    }

    // Cleanup on unmount
    return () => {
      const existingBadge = document.querySelector(".calendly-badge-widget");
      if (existingBadge) {
        existingBadge.remove();
      }
    };
  }, []);

  return null;
}
