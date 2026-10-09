"use client";

import React from "react";
import {
  CreditCard,
  MessageSquareWarning,
  GlobeLock,
  ScanEye,
  ArrowRight,
  ShieldAlert,
  PhoneCall,
  EyeOff,
  UserX,
  FileWarning
} from "lucide-react";
import { InputMode } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { soundEngine } from "@/utils/SoundEngine";

interface CyberModulesProps {
  onSelectModule: (mode: InputMode, samplePayload?: string) => void;
}

export function CyberModulesHorizontal({ onSelectModule }: CyberModulesProps) {
  const { t } = useLanguage();
  return (
    <section id="cyber-modules" className="relative w-full py-32 overflow-hidden bg-[#000000]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col gap-40">
        
        {/* GROUP 1: OUR 4 SAFETY TOOLS */}
        <div className="flex flex-col lg:flex-row gap-16 relative">
          
          {/* Sticky Left Column */}
          <div className="lg:w-1/3 relative">
            <div className="sticky top-40 h-fit">
              {/* SATARK WATERMARK */}
              <div className="absolute -left-24 -top-24 font-space font-black text-[8rem] text-white/[0.03] select-none pointer-events-none transform -rotate-90 origin-bottom-left whitespace-nowrap">
                SATARK
              </div>
              <h2 className="font-space font-bold text-4xl sm:text-5xl text-white uppercase leading-tight mb-4">
                {t("modules.title").split(" ").slice(0, -1).join(" ")} <br/> {t("modules.title").split(" ").slice(-1)}
              </h2>
              <p className="font-sans text-neutral-400 text-sm leading-relaxed max-w-sm">
                {t("modules.desc")}
              </p>
            </div>
          </div>

          {/* Right Scrolling 2-Column Cards */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="group cyber-hud-card p-8 rounded-3xl border border-[#00f0ff]/20 bg-black/50 hover:bg-[#00f0ff]/5 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] transition-all duration-300 flex flex-col justify-between min-h-[320px]">
              <div>
                <CreditCard className="w-8 h-8 text-[#00f0ff] mb-6" />
                <h3 className="font-space font-bold text-xl text-white mb-2">{t("tool1.title")}</h3>
                <p className="font-sans text-xs text-neutral-400">{t("tool1.desc")}</p>
              </div>
              <button aria-label={t("tool1.title")} onClick={() => { soundEngine.playClick(); onSelectModule("sms"); }} className="w-12 h-12 mt-6 rounded-full border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] group-hover:bg-[#00f0ff] group-hover:text-black transition-all">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="group cyber-hud-card p-8 rounded-3xl border border-[#ffb800]/20 bg-black/50 hover:bg-[#ffb800]/5 hover:shadow-[0_0_30px_rgba(255,184,0,0.15)] transition-all duration-300 flex flex-col justify-between min-h-[320px]">
              <div>
                <MessageSquareWarning className="w-8 h-8 text-[#ffb800] mb-6" />
                <h3 className="font-space font-bold text-xl text-white mb-2">{t("tool2.title")}</h3>
                <p className="font-sans text-xs text-neutral-400">{t("tool2.desc")}</p>
              </div>
              <button aria-label={t("tool2.title")} onClick={() => { soundEngine.playClick(); onSelectModule("sms"); }} className="w-12 h-12 mt-6 rounded-full border border-[#ffb800]/40 flex items-center justify-center text-[#ffb800] group-hover:bg-[#ffb800] group-hover:text-black transition-all">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="group cyber-hud-card p-8 rounded-3xl border border-[#ff0055]/20 bg-black/50 hover:bg-[#ff0055]/5 hover:shadow-[0_0_30px_rgba(255,0,85,0.15)] transition-all duration-300 flex flex-col justify-between min-h-[320px]">
              <div>
                <GlobeLock className="w-8 h-8 text-[#ff0055] mb-6" />
                <h3 className="font-space font-bold text-xl text-white mb-2">{t("tool3.title")}</h3>
                <p className="font-sans text-xs text-neutral-400">{t("tool3.desc")}</p>
              </div>
              <button aria-label={t("tool3.title")} onClick={() => { soundEngine.playClick(); onSelectModule("url"); }} className="w-12 h-12 mt-6 rounded-full border border-[#ff0055]/40 flex items-center justify-center text-[#ff0055] group-hover:bg-[#ff0055] group-hover:text-black transition-all">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="group cyber-hud-card p-8 rounded-3xl border border-[#7000ff]/20 bg-black/50 hover:bg-[#7000ff]/5 hover:shadow-[0_0_30px_rgba(112,0,255,0.15)] transition-all duration-300 flex flex-col justify-between min-h-[320px]">
              <div>
                <ScanEye className="w-8 h-8 text-[#7000ff] mb-6" />
                <h3 className="font-space font-bold text-xl text-white mb-2">{t("tool4.title")}</h3>
                <p className="font-sans text-xs text-neutral-400">{t("tool4.desc")}</p>
              </div>
              <button aria-label={t("tool4.title")} onClick={() => { soundEngine.playClick(); onSelectModule("screenshot"); }} className="w-12 h-12 mt-6 rounded-full border border-[#7000ff]/40 flex items-center justify-center text-[#7000ff] group-hover:bg-[#7000ff] group-hover:text-black transition-all">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>

        {/* GROUP 2: CYBER SAFETY GUIDE */}
        <div className="flex flex-col lg:flex-row gap-16 relative">
          
          {/* Sticky Left Column */}
          <div className="lg:w-1/3 relative">
            <div className="sticky top-40 h-fit">
              {/* SATARK WATERMARK */}
              <div className="absolute -left-24 -top-24 font-space font-black text-[8rem] text-white/[0.03] select-none pointer-events-none transform -rotate-90 origin-bottom-left whitespace-nowrap">
                SATARK
              </div>
              <h2 className="font-space font-bold text-4xl sm:text-5xl text-white uppercase leading-tight mb-4">
                {t("guide.title").split(" ").slice(0, 2).join(" ")} <br/> {t("guide.title").split(" ").slice(2).join(" ")}
              </h2>
              <p className="font-sans text-neutral-400 text-sm leading-relaxed max-w-sm">
                {t("guide.desc")}
              </p>
            </div>
          </div>

          {/* Right Scrolling 2-Column Cards */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="p-8 rounded-3xl border border-white/10 bg-black hover:border-white/30 transition-all duration-300">
              <ShieldAlert className="w-6 h-6 text-white mb-4" />
              <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider mb-2">{t("guide.card1.title")}</h3>
              <p className="font-sans text-xs text-neutral-500">{t("guide.card1.desc")}</p>
            </div>

            <div className="p-8 rounded-3xl border border-white/10 bg-black hover:border-white/30 transition-all duration-300">
              <UserX className="w-6 h-6 text-white mb-4" />
              <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider mb-2">{t("guide.card2.title")}</h3>
              <p className="font-sans text-xs text-neutral-500">{t("guide.card2.desc")}</p>
            </div>

            <div className="p-8 rounded-3xl border border-white/10 bg-black hover:border-white/30 transition-all duration-300">
              <EyeOff className="w-6 h-6 text-white mb-4" />
              <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider mb-2">{t("guide.card3.title")}</h3>
              <p className="font-sans text-xs text-neutral-500">{t("guide.card3.desc")}</p>
            </div>

            <div className="p-8 rounded-3xl border border-white/10 bg-black hover:border-white/30 transition-all duration-300">
              <FileWarning className="w-6 h-6 text-white mb-4" />
              <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider mb-2">{t("guide.card4.title")}</h3>
              <p className="font-sans text-xs text-neutral-500">{t("guide.card4.desc")}</p>
            </div>

            <div className="p-8 rounded-3xl border border-white/10 bg-black hover:border-white/30 transition-all duration-300">
              <MessageSquareWarning className="w-6 h-6 text-white mb-4" />
              <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider mb-2">{t("guide.card5.title")}</h3>
              <p className="font-sans text-xs text-neutral-500">{t("guide.card5.desc")}</p>
            </div>

            <div className="p-8 rounded-3xl border border-[#ff0055]/30 bg-[#ff0055]/5 hover:bg-[#ff0055]/10 transition-all duration-300 relative overflow-hidden">
              <PhoneCall className="w-6 h-6 text-[#ff0055] mb-4" />
              <h3 className="font-sans font-bold text-sm text-[#ff0055] uppercase tracking-wider mb-2">{t("guide.card6.title")}</h3>
              <p className="font-sans text-xs text-neutral-400">{t("guide.card6.desc")}</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
