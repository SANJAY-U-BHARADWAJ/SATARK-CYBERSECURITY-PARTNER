"use client";

import React from "react";
import { Landmark, ExternalLink, ShieldCheck, FileText, Search } from "lucide-react";
import { soundEngine } from "@/utils/SoundEngine";

export function CyberGovtPortals() {
  const portals = [
    { name: "National Cyber Crime Reporting Portal", url: "https://cybercrime.gov.in", icon: <ShieldCheck className="w-5 h-5" />, desc: "Report cyber crimes online" },
    { name: "Sanchar Saathi", url: "https://sancharsaathi.gov.in", icon: <Search className="w-5 h-5" />, desc: "Track and block lost/stolen phones" },
    { name: "CERT-In", url: "https://www.cert-in.org.in/", icon: <Landmark className="w-5 h-5" />, desc: "Indian Computer Emergency Response Team" },
    { name: "RBI Kehta Hai", url: "https://rbikehtahai.rbi.org.in/", icon: <FileText className="w-5 h-5" />, desc: "Financial awareness by RBI" }
  ];

  return (
    <section id="cyber-govt-portals" className="relative z-20 py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="space-y-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-300 uppercase tracking-widest mx-auto">
            <Landmark className="w-3 h-3" /> Official Government Resources
          </div>
          <h2 className="font-space font-black text-3xl sm:text-4xl text-white uppercase tracking-wider">
            GOVT PORTALS DIRECTORY
          </h2>
          <p className="font-sans text-neutral-400 max-w-2xl mx-auto">
            Direct access to official Indian government portals for reporting crimes, tracking devices, and staying informed about digital safety regulations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {portals.map((portal, idx) => (
            <a
              key={idx}
              href={portal.url}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => soundEngine.playHover()}
              onClick={() => soundEngine.playClick()}
              className="group p-6 rounded-2xl bg-black/40 border border-neutral-800 hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/5 backdrop-blur-md transition-all flex flex-col gap-4 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-700 group-hover:border-[#00f0ff]/50 flex items-center justify-center text-neutral-400 group-hover:text-[#00f0ff] transition-all">
                {portal.icon}
              </div>
              <div>
                <h3 className="font-space font-bold text-white text-sm uppercase group-hover:text-[#00f0ff] transition-colors">{portal.name}</h3>
                <p className="font-mono text-[10px] text-neutral-500 mt-2">{portal.desc}</p>
              </div>
              <div className="mt-auto pt-4 flex items-center gap-2 font-mono text-[10px] text-[#00f0ff] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Access Portal <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
