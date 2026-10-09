"use client";

import React, { useRef } from "react";
import { AlertTriangle, TrendingUp, ShieldAlert, Key, Shield, HelpCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function CyberScamPlaybook() {
  const { t } = useLanguage();
  return (
    <section id="scam-playbook" className="relative z-20 py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 pb-6 border-b border-[#00f0ff]/20">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffb800]/10 border border-[#ffb800]/30 text-[10px] font-mono text-[#ffb800]">
              <AlertTriangle className="w-3 h-3" />
              <span>{t("playbook.badge")}</span>
            </div>
            <h2 className="font-space font-black text-3xl sm:text-5xl text-white tracking-tight">
              {t("playbook.title")}
            </h2>
          </div>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: FEAR */}
          <div className="cyber-hud-card p-6 rounded-3xl border border-[#ff0055]/30 bg-black/40 hover:bg-[#ff0055]/10 hover:border-[#ff0055] transition-all flex flex-col gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-[#ff0055]/20 flex items-center justify-center text-[#ff0055] group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-space font-bold text-xl text-white uppercase">{t("playbook.card1.title")}</h3>
              <p className="mt-2 text-sm font-sans text-neutral-400">
                {t("playbook.card1.desc")}
              </p>
            </div>
          </div>

          {/* Card 2: GREED */}
          <div className="cyber-hud-card p-6 rounded-3xl border border-[#00ff88]/30 bg-black/40 hover:bg-[#00ff88]/10 hover:border-[#00ff88] transition-all flex flex-col gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-[#00ff88]/20 flex items-center justify-center text-[#00ff88] group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-space font-bold text-xl text-white uppercase">{t("playbook.card2.title")}</h3>
              <p className="mt-2 text-sm font-sans text-neutral-400">
                {t("playbook.card2.desc")}
              </p>
            </div>
          </div>

          {/* Card 3: AUTHORITY */}
          <div className="cyber-hud-card p-6 rounded-3xl border border-[#7000ff]/30 bg-black/40 hover:bg-[#7000ff]/10 hover:border-[#7000ff] transition-all flex flex-col gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-[#7000ff]/20 flex items-center justify-center text-[#7000ff] group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-space font-bold text-xl text-white uppercase">{t("playbook.card3.title")}</h3>
              <p className="mt-2 text-sm font-sans text-neutral-400">
                {t("playbook.card3.desc")}
              </p>
            </div>
          </div>

          {/* Card 4: CURIOSITY */}
          <div className="cyber-hud-card p-6 rounded-3xl border border-[#00f0ff]/30 bg-black/40 hover:bg-[#00f0ff]/10 hover:border-[#00f0ff] transition-all flex flex-col gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff] group-hover:scale-110 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-space font-bold text-xl text-white uppercase">{t("playbook.card4.title")}</h3>
              <p className="mt-2 text-sm font-sans text-neutral-400">
                {t("playbook.card4.desc")}
              </p>
            </div>
          </div>

        </div>

        {/* Highlight Panel */}
        <div className="p-8 sm:p-12 rounded-3xl border-2 border-[#00f0ff] bg-gradient-to-br from-[#00f0ff]/10 to-black relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#00f0ff]/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#7000ff]/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="w-20 h-20 rounded-full bg-black border-2 border-[#00f0ff] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,240,255,0.4)]">
            <Shield className="w-10 h-10 text-[#00f0ff]" />
          </div>
          
          <h3 className="font-space font-black text-2xl sm:text-4xl text-white tracking-tight uppercase">
            {t("playbook.why1")} <span className="block text-[#00f0ff] mt-2">{t("playbook.why2")}</span>
          </h3>
          
          <p className="mt-6 text-sm sm:text-base font-sans text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            {t("playbook.whydesc")}
          </p>
        </div>

      </div>
    </section>
  );
}
