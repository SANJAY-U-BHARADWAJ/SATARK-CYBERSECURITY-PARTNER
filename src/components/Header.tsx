"use client";

import React, { useState, useEffect } from "react";
import { Shield, PhoneCall } from "lucide-react";
import { useLanguage, LanguageCode } from "@/context/LanguageContext";
import { soundEngine } from "@/utils/SoundEngine";

interface CustomWindow extends Window {
  __lenis?: {
    scrollTo: (target: number | HTMLElement, options?: { offset?: number }) => void;
  };
}

const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
  { code: "te", label: "తెలుగు (Telugu)" },
  { code: "mr", label: "मराठी (Marathi)" },
  { code: "bn", label: "বাংলা (Bengali)" },
  { code: "ml", label: "മലയാളം (Malayalam)" },
  { code: "gu", label: "ગુજરાતી (Gujarati)" },
  { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" }
];

const SECTIONS = [
  { id: "overview", label: "nav.overview" },
  { id: "cyber-modules", label: "nav.safetyTools" },
  { id: "scam-checker", label: "nav.scamChecker" },
  { id: "cyber-assistant", label: "nav.aiAssistant" },
  { id: "cyber-complaint", label: "nav.firDrafter" },
  { id: "scam-playbook", label: "nav.scamPlaybook" },
  { id: "cyber-score", label: "nav.passwordCheck" }
];

export function Header() {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = SECTIONS[0].id;
      const triggerPoint = window.innerHeight * 0.4; // 40% down the screen

      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerPoint) {
            currentSection = section.id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    soundEngine.playClick();
    const lenis = (window as unknown as CustomWindow).__lenis;
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollTo = (id: string) => {
    soundEngine.playClick();
    const el = document.getElementById(id);
    if (el) {
      const lenis = (window as unknown as CustomWindow).__lenis;
      if (lenis) {
        lenis.scrollTo(el, { offset: -80 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/75 border-b border-white/10 text-white">
      <div className="w-full flex items-center justify-between py-4 px-6">
        
        {/* Top-Left: Logo & Brand */}
        <div 
          onClick={scrollToTop} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full border border-[#00f0ff]/50 bg-[#00f0ff]/10 flex items-center justify-center shrink-0 group-hover:bg-[#00f0ff]/30 transition-all group-hover:shadow-[0_0_15px_rgba(0,240,255,0.6)]">
            <Shield className="w-5 h-5 text-[#00f0ff]" />
          </div>
          <div className="flex flex-col">
            <span className="font-space font-bold text-lg tracking-widest leading-none text-white group-hover:text-[#00f0ff] transition-colors">
              SATARK
            </span>
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase opacity-70 mt-1">
              AI Cyber Safety Platform
            </span>
          </div>
        </div>

        {/* Center Navigation Links (ScrollSpy) */}
        <nav className="hidden xl:flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest">
          {SECTIONS.map((section) => (
            <button 
              key={section.id}
              onClick={() => scrollTo(section.id)} 
              className={`transition-all pb-1 ${
                activeSection === section.id
                  ? "text-cyan-400 font-semibold border-b-2 border-cyan-400 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {t(section.label)}
            </button>
          ))}
        </nav>

        {/* Top-Right: Controls */}
        <div className="flex items-center gap-3">

          {/* Language Selector */}
          <select 
            value={currentLanguage}
            onChange={(e) => {
              soundEngine.playClick();
              setLanguage(e.target.value as LanguageCode);
            }}
            className="bg-neutral-900 border border-white/20 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white focus:outline-none focus:border-[#00f0ff] cursor-pointer appearance-none hover:bg-neutral-800 transition-colors"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code} className="bg-black text-white">{lang.label}</option>
            ))}
          </select>

          {/* 1930 Emergency Badge */}
          <a 
            href="tel:1930" 
            className="hidden sm:flex items-center gap-2 text-[#ff0055] font-bold border border-[#ff0055]/30 px-3 py-1.5 rounded-full hover:bg-[#ff0055]/10 hover:shadow-[0_0_10px_rgba(255,0,85,0.3)] transition-all font-mono text-[10px] uppercase tracking-wider"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Helpline: 1930
          </a>
        </div>
        
      </div>
    </header>
  );
}
