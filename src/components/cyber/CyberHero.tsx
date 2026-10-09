"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";

interface CyberHeroProps {
  onOpenTransparency: () => void;
  onOpenQuiz: () => void;
  onScrollToCommandCenter: () => void;
}

import { useLanguage } from "@/context/LanguageContext";

const PILLS = ["UPI SHIELD", "LINK CHECKER", "SCAM DETECTOR", "FIR DRAFTER"];

export function CyberHero({
  onOpenTransparency,
  onOpenQuiz,
  onScrollToCommandCenter,
}: CyberHeroProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const starburstRef = useRef<HTMLSpanElement>(null);
  const corridorRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<SVGSVGElement>(null);
  const [pillIdx, setPillIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPillIdx((prev) => (prev + 1) % PILLS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Rotate Starburst on scroll
    if (starburstRef.current) {
      gsap.to(starburstRef.current, {
        rotation: 360,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    // Move corridor perspective on scroll
    if (corridorRef.current) {
      gsap.to(corridorRef.current, {
        rotateX: 45,
        scale: 0.95,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    // Rotate Circular Badge
    if (badgeRef.current) {
      gsap.to(badgeRef.current, {
        rotation: 360,
        repeat: -1,
        duration: 10,
        ease: "none",
      });
    }
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-[120vh] pt-32 pb-16 flex flex-col items-center w-full bg-black overflow-hidden perspective-[1000px]"
    >
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col z-20 relative">
        {/* LINE 1 */}
        <div className="flex items-center justify-between border-b border-white/20 pb-8 mb-8">
          <h1 className="font-space font-light text-5xl sm:text-7xl md:text-8xl tracking-tight text-white uppercase">
            {t("hero.title")} <br />{" "}
            <span className="font-bold">{t("hero.subtitle")}</span>
          </h1>
          <span
            ref={starburstRef}
            className="text-5xl sm:text-7xl md:text-8xl text-[#00f0ff] ml-6 leading-none inline-block"
          >
            ✺
          </span>
        </div>

        {/* LINE 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-white/20 pb-8 mb-16">
          <p className="font-sans text-sm text-neutral-400 leading-relaxed pr-8">
            {t("hero.desc")}
          </p>
          <div className="text-center font-space font-bold text-xl text-white uppercase tracking-widest">
            — {t("hero.throughSatark")}
          </div>
          <div className="flex justify-end">
            <div className="px-6 py-3 rounded-full border border-[#00f0ff]/50 bg-[#00f0ff]/10 text-[#00f0ff] font-mono text-sm uppercase tracking-widest min-w-[200px] text-center transition-all">
              {PILLS[pillIdx]}
            </div>
          </div>
        </div>
      </div>

      {/* 3D Perspective Corridor */}
      <div className="relative w-full max-w-[95%] h-[60vh] mx-auto z-10 perspective-[1000px]">
        <div
          ref={corridorRef}
          className="w-full h-full rounded-[32px] overflow-hidden border border-white/10 relative shadow-[0_0_50px_rgba(0,240,255,0.1)] transform-origin-bottom"
          style={{
            background: "linear-gradient(to bottom, #000 0%, #040814 100%)",
          }}
        >
          {/* Corridor grid illusion */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              transform: "perspective(500px) rotateX(60deg) scale(2.5)",
              transformOrigin: "center 80%",
            }}
          ></div>

          <div className="absolute inset-0 flex flex-col sm:flex-row items-center justify-center gap-4 z-30 px-4">
            <button
              onClick={onScrollToCommandCenter}
              className="px-8 py-4 bg-white text-black font-space font-bold uppercase tracking-widest rounded-full hover:scale-105 hover:bg-[#00f0ff] transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.4)]"
            >
              Start Protection <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenTransparency}
              className="px-6 py-4 bg-black/60 backdrop-blur-md text-[#00f0ff] border border-[#00f0ff]/40 font-mono text-xs uppercase tracking-widest rounded-full hover:bg-[#00f0ff]/20 hover:scale-105 transition-all cursor-pointer"
            >
              Model Card & Weights
            </button>
            <button
              onClick={onOpenQuiz}
              className="px-6 py-4 bg-black/60 backdrop-blur-md text-purple-300 border border-purple-500/40 font-mono text-xs uppercase tracking-widest rounded-full hover:bg-purple-500/20 hover:scale-105 transition-all cursor-pointer"
            >
              Awareness Quiz
            </button>
          </div>
        </div>

        {/* Circular Badge overlapping bottom edge */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-40 bg-black rounded-full p-2">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg
              ref={badgeRef}
              viewBox="0 0 100 100"
              className="w-full h-full animate-spin-slow absolute inset-0"
            >
              <path
                id="circlePath"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                fill="none"
              />
              <text className="font-mono text-[10px] uppercase tracking-[0.2em] fill-white">
                <textPath href="#circlePath" startOffset="0%">
                  SATARK SECURITY • PROTECTION •
                </textPath>
              </text>
            </svg>
            <div className="w-3 h-3 bg-[#00f0ff] rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
