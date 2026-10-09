"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STATS = [
  { val: "99.8%", label: "Scam Detection Accuracy", color: "#00f0ff" },
  { val: "4-in-1", label: "AI Protection Tools", color: "#7000ff" },
  { val: "< 2 Sec", label: "Fast AI Explanation", color: "#ff0055" },
  { val: "10", label: "Languages Supported", color: "#00ff88" },
  { val: "1930", label: "National Helpline", color: "#ffb800" },
  { val: "100%", label: "Free Citizen Safety", color: "#ff00ff" },
];

export function CyberStatsVortex() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [ringState, setRingState] = React.useState([
    { rx: 320, ry: 120 },
    { rx: 460, ry: 180 },
    { rx: 600, ry: 240 },
  ]);
  const ringsRef = useRef(ringState);

  useEffect(() => {
    const handleResize = () => {
      const ww = window.innerWidth;
      // Outermost ring rx should be at most (width - item_width) / 2
      const maxRx = Math.max(120, Math.min(600, (ww - 220) / 2));
      const maxRy = Math.max(80, Math.min(240, maxRx * 0.4));

      const newRings = [
        { rx: maxRx * 0.53, ry: maxRy * 0.53 },
        { rx: maxRx * 0.76, ry: maxRy * 0.76 },
        { rx: maxRx, ry: maxRy },
      ];
      ringsRef.current = newRings;
      setRingState(newRings);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (containerRef.current) {
      const proxy = { angleOffset: 0 };

      gsap.to(proxy, {
        angleOffset: 360, // Full rotation across the scroll view
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      const updatePositions = () => {
        itemsRef.current.forEach((item, idx) => {
          if (!item) return;

          const ringIdx = Math.floor(idx / 2);
          const itemIdx = idx % 2;
          const ring = ringsRef.current[ringIdx];

          const baseAngle = itemIdx * 180 + ringIdx * 45;
          const currentAngleDeg = baseAngle + proxy.angleOffset;
          const currentAngleRad = currentAngleDeg * (Math.PI / 180);

          const x = ring.rx * Math.cos(currentAngleRad);
          const y = ring.ry * Math.sin(currentAngleRad);

          const isFront = y > 0;
          const depth = y / ring.ry;

          const scale = isFront ? 1 + depth * 0.15 : 0.75 + (1 + depth) * 0.25;

          const opacity = isFront ? 1 : 0.45 + (1 + depth) * 0.55;
          const blur = isFront ? 0 : Math.max(0, -depth * 3);
          const zIndex = isFront ? 20 : 10;

          gsap.set(item, {
            x: x,
            y: y,
            scale: scale,
            opacity: opacity,
            filter: `blur(${blur}px)`,
            zIndex: zIndex,
          });
        });
        requestAnimationFrame(updatePositions);
      };

      const frameId = requestAnimationFrame(updatePositions);
      return () => cancelAnimationFrame(frameId);
    }
  }, []);

  return (
    <section
      id="overview"
      ref={containerRef}
      className="relative w-full h-screen bg-[#040508] overflow-hidden"
    >
      <div className="absolute top-0 w-full h-screen flex items-center justify-center pointer-events-none">
        {/* Header */}
        <div className="absolute top-24 text-center space-y-4 z-30 pointer-events-none w-full px-4">
          <h2 className="font-space font-light text-2xl sm:text-4xl md:text-5xl tracking-[0.2em] text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Let the protection speak.
          </h2>
          <div className="w-12 h-[1px] bg-white/30 mx-auto"></div>
        </div>

        {/* Background Ellipses (Orbit Tracks) */}
        {ringState.map((r, i) => (
          <div
            key={`track-${i}`}
            className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/[0.08]"
            style={{ width: r.rx * 2, height: r.ry * 2 }}
          />
        ))}

        {/* Orbiting Stat Nodes */}
        {STATS.map((stat, idx) => (
          <div
            key={idx}
            ref={(el) => {
              itemsRef.current[idx] = el;
            }}
            className="absolute top-[55%] left-1/2 -mt-[50px] -ml-[100px] w-[200px] h-[100px] flex items-center justify-center pointer-events-none transform-gpu"
          >
            <div
              className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10"
              style={{ boxShadow: `0 0 20px ${stat.color}15` }}
            >
              <div
                className="w-[80px] h-[80px] rounded-full border-4 flex items-center justify-center shrink-0 shadow-lg"
                style={{
                  borderColor: stat.color,
                  boxShadow: `0 0 15px ${stat.color}40, inset 0 0 15px ${stat.color}40`,
                }}
              >
                <div className="w-full h-full rounded-full border border-white/10 flex items-center justify-center bg-black/60">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: stat.color,
                      boxShadow: `0 0 10px ${stat.color}`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-space font-bold text-3xl sm:text-4xl text-white tracking-tight">
                  {stat.val}
                </span>
                <span
                  className="font-mono text-[10px] sm:text-xs uppercase tracking-widest mt-1 font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
