"use client";

import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield } from "lucide-react";

interface CyberPreloaderProps {
  onComplete: () => void;
}

export function CyberPreloader({ onComplete }: CyberPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      onUpdate: () => {
        const val = Math.floor(tl.progress() * 100);
        setProgress(val);
      },
      onComplete: async () => {
        const { soundEngine } = await import("@/utils/SoundEngine");
        soundEngine.start();

        const exitTl = gsap.timeline({
          onComplete: () => {
            onCompleteRef.current();
            ScrollTrigger.refresh();
          },
        });

        exitTl.to(contentRef.current, {
          opacity: 0,
          y: -40,
          duration: 0.5,
          ease: "power3.in",
        });

        exitTl.to(
          overlayRef.current,
          {
            clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)",
            duration: 0.9,
            ease: "expo.inOut",
          },
          "-=0.2",
        );
      },
    });

    // Progress counter tween
    tl.to(
      {},
      {
        duration: 2.2,
        ease: "power2.inOut",
      },
    );

    return () => {
      tl.kill();
    };
  }, []);

  // 360-degree radial equalizer bars
  const equalizerBars = Array.from({ length: 60 });

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] bg-[#000000] text-white overflow-hidden flex items-center justify-center"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
    >
      <div
        ref={contentRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Center Circular Ring */}
        <div className="relative w-64 h-64 border-[1px] border-white/20 rounded-full flex items-center justify-center">
          {/* Radial Equalizer Bars */}
          <div className="absolute inset-0">
            {equalizerBars.map((_, i) => {
              // Deterministic pseudo-random values based on index to prevent hydration mismatch
              const pseudoRandomOpacity = ((i * 13) % 100) / 200 + 0.1; // 0.1 to 0.59
              const pseudoRandomDelay = ((i * 7) % 10) / 10 + 0.5; // 0.5 to 1.4

              return (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 w-[1px] bg-white/40 origin-bottom"
                  style={{
                    height: "20px",
                    transform: `translate(-50%, -100%) rotate(${i * 6}deg) translateY(-140px)`,
                    opacity: pseudoRandomOpacity,
                    animation: `pulse ${pseudoRandomDelay}s ease-in-out infinite alternate`,
                  }}
                />
              );
            })}
          </div>

          {/* Logo Rising Sequence */}
          <div
            className="flex flex-col items-center justify-center gap-3 animate-in slide-in-from-bottom-12 duration-1000 ease-out fill-mode-forwards opacity-0"
            style={{ animationDelay: "0.2s", opacity: 1 }}
          >
            <Shield className="w-12 h-12 text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
            <h1 className="font-space font-bold text-2xl tracking-[0.2em] text-white">
              SATARK
            </h1>
          </div>
        </div>
      </div>

      {/* Bottom Left Counter */}
      <div className="absolute bottom-8 left-12 font-sans font-light text-[7rem] leading-none text-white opacity-90">
        {progress}
      </div>

      {/* Bottom Right Loading Text */}
      <div className="absolute bottom-12 right-12 font-sans font-light text-5xl tracking-[0.3em] text-white opacity-80 uppercase">
        LOADING
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { height: 10px; opacity: 0.2; }
            100% { height: 25px; opacity: 0.8; }
          }
        `}
      </style>
    </div>
  );
}
