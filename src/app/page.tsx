"use client";

import React, { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toPng } from "html-to-image";
import { Shield, RotateCcw, ArrowUp } from "lucide-react";

import { Language, InputMode, ThreatAnalysis } from "@/lib/types";
import { analyzeThreatAsync } from "@/lib/detector-engine";
import { ModelCardModal } from "@/components/ModelCardModal";
import { QuizModal } from "@/components/QuizModal";

// Cyber Futuristic Overthetop.ae Components
import { CyberMatrixCanvas } from "@/components/cyber/CyberMatrixCanvas";
import { CyberCursor } from "@/components/cyber/CyberCursor";
import { CyberPreloader } from "@/components/cyber/CyberPreloader";
import { CyberHero } from "@/components/cyber/CyberHero";
import { CyberStatsVortex } from "@/components/cyber/CyberStatsVortex";
import { CyberModulesHorizontal } from "@/components/cyber/CyberModulesHorizontal";
import { CyberCommandCenter } from "@/components/cyber/CyberCommandCenter";
import { Header } from "@/components/Header";

import { CyberAssistant } from "@/components/cyber/CyberAssistant";
import { CyberComplaint } from "@/components/cyber/CyberComplaint";
import { CyberEmergency } from "@/components/cyber/CyberEmergency";
import { CyberGovtPortals } from "@/components/cyber/CyberGovtPortals";
import { CyberScore } from "@/components/cyber/CyberScore";
import { CyberScamPlaybook } from "@/components/cyber/CyberScamPlaybook";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { currentLanguage, setLanguage: setGlobalLanguage, t } = useLanguage();

  // Preloader State
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);

  // App Core State
  const [inputMode, setInputMode] = useState<InputMode>("sms");
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<ThreatAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals & History
  const [isModelCardOpen, setIsModelCardOpen] = useState<boolean>(false);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [scanHistory, setScanHistory] = useState<ThreatAnalysis[]>([]);

  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis Smooth Scroll & Sync with GSAP Ticker
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    (window as any).__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // Load Scan History from local storage
    try {
      const savedHistory = localStorage.getItem("satark-history");
      if (savedHistory) {
        setScanHistory(JSON.parse(savedHistory));
      }
    } catch {
      // Storage unavailable
    }

    // Wipe Google Translate Cookies
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  // Compute 3D WebGL Vortex State
  const canvasStatus = isLoading
    ? "scanning"
    : analysis
    ? analysis.riskLevel === "danger" || analysis.riskScore >= 60
      ? "danger"
      : analysis.riskLevel === "safe" || analysis.riskScore < 30
      ? "safe"
      : "idle"
    : "idle";

  // Core Threat Analysis Dispatcher (Preserving 100% of existing logic)
  const handleAnalyze = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      setErrorMessage("Please enter a message, URL, or upload a screenshot to inspect.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await analyzeThreatAsync(trimmed, inputMode, currentLanguage);
      setAnalysis(result);

      // Save to local scan history (up to 10 items)
      setScanHistory((prev) => {
        const updated = [result, ...prev.filter((item) => item.inputText !== result.inputText)].slice(0, 10);
        try {
          localStorage.setItem("satark-history", JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });

      // Smooth scroll to verdict card
      setTimeout(() => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo("#satark-verdict-card", { offset: -80, duration: 1.2 });
        } else {
          const el = document.getElementById("satark-verdict-card");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (e: any) {
      setErrorMessage(e.message || "Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setScanHistory([]);
    try {
      localStorage.removeItem("satark-history");
    } catch {
      // ignore
    }
  };

  const handleShareWhatsApp = () => {
    if (!analysis) return;
    const msg = `🚨 *Satark Threat Check*: ${analysis.scamType}\n\n*Verdict*: ${analysis.explanation} (${analysis.riskScore}/100 Risk Score)\n\nStay alert! Report online financial frauds to 1930 or cybercrime.gov.in`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const handleDownloadCard = async () => {
    const cardEl = document.getElementById("satark-verdict-card");
    if (!cardEl) return;

    try {
      const dataUrl = await toPng(cardEl, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `satark-threat-report-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Card capture failed", e);
    }
  };

  const handleScrollToCommandCenter = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo("#scam-checker", { offset: -40, duration: 1.5 });
    } else {
      document.getElementById("scam-checker")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectModule = (mode: InputMode, samplePayload?: string) => {
    setInputMode(mode);
    if (samplePayload) {
      setInputText(samplePayload);
    }
    handleScrollToCommandCenter();
  };

  return (
    <div className="relative min-h-screen bg-[#040508] text-foreground font-sans selection:bg-[#00f0ff]/30 selection:text-[#00f0ff] overflow-x-hidden">
      
      {/* Top Navbar */}
      <Header />

      {/* 0-100% Cyber Preloader Screen */}
      {!isPreloaderDone && (
        <CyberPreloader onComplete={() => setIsPreloaderDone(true)} />
      )}

      {/* Layer 1: Fixed 3D WebGL Background Canvas */}
      <CyberMatrixCanvas status={canvasStatus} riskScore={analysis?.riskScore || 0} />

      {/* Custom Interactive Magnetic Cyber Cursor */}
      <CyberCursor />

      {/* Layer 2: Smooth-Scrolled DOM Overlay */}
      <div className="relative z-10 flex flex-col w-full">
        {/* Signature overthetop.ae Spaced Kinetic Typography Hero */}
        <CyberHero
          onOpenTransparency={() => setIsModelCardOpen(true)}
          onOpenQuiz={() => setIsQuizOpen(true)}
          onScrollToCommandCenter={handleScrollToCommandCenter}
        />

        {/* Live Telemetry & Threat Stats Vortex Section */}
        <CyberStatsVortex />

        {/* Scroll-Pinned Horizontal Department / Module Cards */}
        <CyberModulesHorizontal onSelectModule={handleSelectModule} />

        {/* VIEW 3: Interactive Cyber Command Center (Main App Logic) */}
        <CyberCommandCenter
          inputText={inputText}
          setInputText={setInputText}
          inputMode={inputMode}
          setInputMode={setInputMode}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          analysis={analysis}
          setAnalysis={setAnalysis}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          scanHistory={scanHistory}
          onClearHistory={handleClearHistory}
        />

        {/* VIEW 2: Multilingual AI Assistant */}
        <CyberAssistant />

        {/* VIEW 4: 5-Step AI Complaint & FIR Generator */}
        <CyberComplaint />

        {/* VIEW 5: Emergency Help Hub */}
        <CyberEmergency />

        {/* VIEW 6: Govt Portals Directory */}
        <CyberGovtPortals />

        {/* VIEW 8: Scam Playbook */}
        <CyberScamPlaybook />

        {/* VIEW 9: Cyber Safety Score */}
        <CyberScore />

        {/* High-Tech Futuristic Footer */}
        <footer className="relative z-20 border-t border-neutral-900 bg-[#040508]/90 backdrop-blur-xl py-12 px-6 mt-24">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-space font-bold text-white text-sm">
                  SATARK
                </span>
                <span className="text-[10px] text-neutral-500">
                  SATARK AI // CYBERSECURITY & DIGITAL SAFETY PARTNER
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-center">
              <div>
                EMERGENCY CYBER HELPLINE:{" "}
                <a
                  href="tel:1930"
                  className="text-[#ff0055] font-bold hover:underline"
                >
                  DIAL 1930
                </a>
              </div>
              <span>//</span>
              <div>
                NATIONAL PORTAL:{" "}
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00f0ff] hover:underline"
                >
                  cybercrime.gov.in
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (lenisRef.current) {
                  lenisRef.current.scrollTo(0, { duration: 1.5 });
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-[#00f0ff] hover:border-[#00f0ff]/40 transition-all cursor-pointer"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <ModelCardModal
        isOpen={isModelCardOpen}
        onClose={() => setIsModelCardOpen(false)}
      />
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />
    </div>
  );
}
