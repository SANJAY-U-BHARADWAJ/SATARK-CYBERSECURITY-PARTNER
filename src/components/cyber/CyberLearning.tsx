"use client";

import React from "react";
import { BookOpen, Target, BrainCircuit, PlayCircle } from "lucide-react";
import { soundEngine } from "@/utils/SoundEngine";

interface CyberLearningProps {
  onOpenQuiz: () => void;
}

export function CyberLearning({ onOpenQuiz }: CyberLearningProps) {
  return (
    <section id="cyber-learning" className="relative z-20 py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row gap-8 items-stretch">
        <div className="w-full md:w-1/2 cyber-hud-card p-10 rounded-3xl bg-[#7000ff]/5 border border-[#7000ff]/20 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7000ff]/10 border border-[#7000ff]/30 text-[10px] font-mono text-[#7000ff] uppercase tracking-widest mb-6">
              <BrainCircuit className="w-3 h-3" /> Cyber IQ Training
            </div>
            <h2 className="font-space font-black text-4xl text-white uppercase mb-4">
              INTERACTIVE LEARNING CENTER
            </h2>
            <p className="font-sans text-neutral-400">
              Master the art of digital self-defense. Train your neural pathways to spot modern phishing, deepfakes, and social engineering attacks before they happen.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            <button
              onClick={() => {
                soundEngine.playSuccess();
                onOpenQuiz();
              }}
              onMouseEnter={() => soundEngine.playHover()}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#7000ff] to-[#00f0ff] text-white font-space font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(112,0,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Target className="w-5 h-5" /> Start Simulation
            </button>
            <p className="text-center font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
              5-Minute Interactive Scam Defense Quiz
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 grid grid-rows-2 gap-4">
          <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-[#00f0ff]/50 transition-all flex flex-col justify-center cursor-pointer group" onMouseEnter={() => soundEngine.playHover()}>
            <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-[#00f0ff] mb-4 transition-colors">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-space font-bold text-lg text-white">Fake vs Real Matrix</h3>
            <p className="font-sans text-xs text-neutral-400 mt-2">Compare real bank SMS formats against sophisticated phishing clones.</p>
          </div>
          
          <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-[#ff0055]/50 transition-all flex flex-col justify-center cursor-pointer group" onMouseEnter={() => soundEngine.playHover()}>
            <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-[#ff0055] mb-4 transition-colors">
              <PlayCircle className="w-6 h-6" />
            </div>
            <h3 className="font-space font-bold text-lg text-white">Deepfake Detection Lab</h3>
            <p className="font-sans text-xs text-neutral-400 mt-2">Learn to spot AI-generated voices and videos used in modern extortion.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
