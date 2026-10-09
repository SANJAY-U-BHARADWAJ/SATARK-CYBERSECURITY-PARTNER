"use client";

import React from "react";
import { PhoneCall, AlertTriangle, Shield, ExternalLink, MessageCircle } from "lucide-react";
import { soundEngine } from "@/utils/SoundEngine";

export function CyberEmergency() {
  const emergencyContacts = [
    { number: "1930", title: "National Cybercrime Helpline", desc: "For immediate financial fraud reporting", color: "text-[#ff0055]", bg: "bg-[#ff0055]/10", border: "border-[#ff0055]/30" },
    { number: "112", title: "National Emergency", desc: "For physical threats and emergencies", color: "text-[#ffb800]", bg: "bg-[#ffb800]/10", border: "border-[#ffb800]/30" },
    { number: "155260", title: "Citizen Financial Cyber Fraud", desc: "Alternative number for reporting", color: "text-[#00f0ff]", bg: "bg-[#00f0ff]/10", border: "border-[#00f0ff]/30" },
  ];

  return (
    <section id="cyber-emergency" className="relative z-20 py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff0055]/10 border border-[#ff0055]/30 text-[10px] font-mono text-[#ff0055] uppercase tracking-widest">
            <AlertTriangle className="w-3 h-3" /> Critical Response
          </div>
          <h2 className="font-space font-black text-4xl sm:text-5xl text-white uppercase leading-tight">
            EMERGENCY <br/><span className="text-[#ff0055]">HELP HUB</span>
          </h2>
          <p className="font-sans text-neutral-400">
            If you have lost money to a cyber fraud, every second counts. Contact the authorities immediately to block transactions and trace the perpetrators.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                soundEngine.playAlert();
                window.location.href = "tel:1930";
              }}
              onMouseEnter={() => soundEngine.playHover()}
              className="px-6 py-4 rounded-xl bg-[#ff0055] hover:bg-[#ff0055]/90 text-white font-space font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,0,85,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-5 h-5" /> Dial 1930 Now
            </button>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => soundEngine.playHover()}
              className="px-6 py-4 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-white text-white font-space font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="w-5 h-5" /> Cybercrime Portal <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="w-full md:w-1/2 grid gap-4">
          {emergencyContacts.map((contact, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border ${contact.border} ${contact.bg} backdrop-blur-md flex items-center gap-6 group hover:scale-[1.02] transition-transform`}>
              <div className={`w-16 h-16 rounded-full border ${contact.border} flex items-center justify-center ${contact.color} shrink-0`}>
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <div className={`font-space font-black text-2xl sm:text-3xl ${contact.color}`}>{contact.number}</div>
                <div className="font-sans font-bold text-white text-sm sm:text-base mt-1">{contact.title}</div>
                <div className="font-mono text-[10px] sm:text-xs text-neutral-400 mt-1 uppercase tracking-wider">{contact.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
