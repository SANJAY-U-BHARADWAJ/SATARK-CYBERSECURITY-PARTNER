"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function CyberCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Set initial centered positioning
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const xDotTo = gsap.quickTo(dot, "x", { duration: 0.02, ease: "power3.out" });
    const yDotTo = gsap.quickTo(dot, "y", { duration: 0.02, ease: "power3.out" });
    const xRingTo = gsap.quickTo(ring, "x", { duration: 0.05, ease: "power3.out" });
    const yRingTo = gsap.quickTo(ring, "y", { duration: 0.05, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        setIsVisible(true);
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }

      xDotTo(e.clientX);
      yDotTo(e.clientY);
      xRingTo(e.clientX);
      yRingTo(e.clientY);

      // Detect hover over interactive elements
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest("[role='button']") ||
          target.closest(".cyber-hud-card") ||
          target.dataset.cursor === "pointer")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => {
      setIsVisible(false);
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <>
      {/* Central Cyan Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] transition-transform duration-75 ${
          isClicking ? "scale-50 bg-[#ff0055]" : "scale-100 bg-[#00f0ff]"
        }`}
        style={{
          boxShadow: isClicking
            ? "0 0 10px #ff0055, 0 0 20px #ff0055"
            : "0 0 10px #00f0ff, 0 0 20px #00f0ff",
        }}
      />

      {/* Trailing HUD Reticle Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9998] border transition-all duration-200 flex items-center justify-center ${
          isHovered
            ? "w-12 h-12 border-[#00f0ff] bg-[#00f0ff]/10 scale-125 backdrop-blur-[1px]"
            : "w-8 h-8 border-[#00f0ff]/50 bg-transparent scale-100"
        } ${isClicking ? "scale-90 border-[#ff0055]" : ""}`}
        style={{
          boxShadow: isHovered
            ? "0 0 25px rgba(0, 240, 255, 0.4), inset 0 0 15px rgba(0, 240, 255, 0.2)"
            : "0 0 10px rgba(0, 240, 255, 0.15)",
        }}
      >
        {/* HUD Crosshair Corner Ticks */}
        <div className="absolute -top-1 w-1.5 h-0.5 bg-[#00f0ff]" />
        <div className="absolute -bottom-1 w-1.5 h-0.5 bg-[#00f0ff]" />
        <div className="absolute -left-1 w-0.5 h-1.5 bg-[#00f0ff]" />
        <div className="absolute -right-1 w-0.5 h-1.5 bg-[#00f0ff]" />
      </div>
    </>
  );
}
