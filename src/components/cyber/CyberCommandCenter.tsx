"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Shield,
  MessageSquare,
  Link2,
  Image as ImageIcon,
  Upload,
  ArrowRight,
  Sparkles,
  Lock,
  X,
  FileText,
  AlertCircle,
  RotateCcw,
  Terminal,
  History,
  Trash2,
  ChevronDown,
  Radar,
  CheckCircle2,
  CreditCard,
  Globe,
  Search,
  Lock as LockIcon,
  AlertTriangle
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { InputMode, SampleMessage, Language, ThreatAnalysis } from "@/lib/types";

import { soundEngine } from "@/utils/SoundEngine";

const TABS = [
  { id: "upi", icon: CreditCard, labelKey: "tab.upi" },
  { id: "sms", icon: MessageSquare, labelKey: "tab.sms" },
  { id: "url", icon: Link2, labelKey: "tab.url" },
  { id: "screenshot", icon: ImageIcon, labelKey: "tab.screenshot" },
];

const TAB_DATA: Record<string, { headerKey: string; buttons: (Omit<SampleMessage, 'title'> & { titleKey: string })[] }> = {
  upi: {
    headerKey: "tab.upi.header",
    buttons: [
      { id: "u1", titleKey: 'btn.u1', titleHi: '', category: "upi", riskBadge: "danger", text: "Scan this QR code and enter your UPI PIN to receive ₹5,000 refund from OLX buyer.", type: "upi" },
      { id: "u2", titleKey: 'btn.u2', titleHi: '', category: "upi", riskBadge: "danger", text: "lucky-draw-winner@ybl", type: "upi" },
      { id: "u3", titleKey: 'btn.u3', titleHi: '', category: "upi", riskBadge: "danger", text: "Please send ₹1 to verify your account, we will refund ₹10,000 immediately.", type: "upi" },
      { id: "u4", titleKey: 'btn.u4', titleHi: '', category: "upi", riskBadge: "safe", text: "Dear Customer, ₹5,000.00 has been credited to your A/c ending 1234 on 15-Oct. Info: UPI/Transfer.", type: "upi" },
    ]
  },
  sms: {
    headerKey: "tab.sms.header",
    buttons: [
      { id: "s1", titleKey: 'btn.s1', titleHi: '', category: "sms", riskBadge: "danger", text: "Your electricity bill is unpaid. Power will be disconnected tonight at 9:30 PM. Call electricity officer immediately: 9876543210", type: "sms" },
      { id: "s2", titleKey: 'btn.s2', titleHi: '', category: "sms", riskBadge: "danger", text: "Dear Customer, your SBI account will be blocked today. Please complete your KYC immediately by clicking here: http://sbi-kyc-update.top", type: "sms" },
      { id: "s3", titleKey: 'btn.s3', titleHi: '', category: "sms", riskBadge: "danger", text: "Congratulations! You have been selected for a part-time job. Earn ₹5000 daily by liking YouTube videos. Pay ₹1000 registration fee to start.", type: "sms" },
      { id: "s4", titleKey: 'btn.s4', titleHi: '', category: "sms", riskBadge: "danger", text: "CBI POLICE NOTICE: An arrest warrant has been issued in your name for money laundering via FedEx package. Join urgent Skype video call immediately for digital verification.", type: "sms" },
    ]
  },
  url: {
    headerKey: "tab.url.header",
    buttons: [
      { id: "l1", titleKey: 'btn.l1', titleHi: '', category: "url", riskBadge: "danger", text: "https://sbi-pan-update.xyz/login.php", type: "url" },
      { id: "l2", titleKey: 'btn.l2', titleHi: '', category: "url", riskBadge: "danger", text: "http://bit.ly/claim-prize-8821", type: "url" },
      { id: "l3", titleKey: 'btn.l3', titleHi: '', category: "url", riskBadge: "danger", text: "https://pm-yojana-free-laptops.com/apply", type: "url" },
      { id: "l4", titleKey: 'btn.l4', titleHi: '', category: "url", riskBadge: "safe", text: "https://rbi.org.in", type: "url" },
    ]
  },
  screenshot: {
    headerKey: "tab.screenshot.header",
    buttons: []
  }
};

interface CyberCommandCenterProps {
  inputText: string;
  setInputText: (text: string) => void;
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  analysis: ThreatAnalysis | null;
  setAnalysis: (val: ThreatAnalysis | null) => void;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
  scanHistory: ThreatAnalysis[];
  onClearHistory: () => void;
}

const TERMINAL_SCAN_STEPS = [
  "INSPECTING PAYLOAD TOKENS & PATTERNS...",
  "APPLYING CLIENT-SIDE PRIVACY MASKING (OTP/PII)...",
  "DISPATCHING TO OMNIROUTE ZERO-TRUST GATEWAY...",
  "RUNNING GEMINI 3.7 FLASH REASONING & HEURISTICS...",
  "CORRELATING WITH KNOWN INDIAN FRAUD VECTORS...",
  "SYNTHESIZING EMERGENCY 10-MIN ACTION PROTOCOLS...",
];

export function CyberCommandCenter({
  inputText,
  setInputText,
  inputMode,
  setInputMode,
  onAnalyze,
  isLoading,
  analysis,
  setAnalysis,
  errorMessage,
  setErrorMessage,
  scanHistory,
  onClearHistory,
}: CyberCommandCenterProps) {
  const { t } = useLanguage();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  
  // Tab 1 specific state
  const [upiId, setUpiId] = useState("");
  const [upiDesc, setUpiDesc] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setScanStepIndex(0);
      interval = setInterval(() => {
        setScanStepIndex((prev) => (prev + 1) % TERMINAL_SCAN_STEPS.length);
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Sync UPI inputs to main inputText
  useEffect(() => {
    if (inputMode === "upi") {
      const combined = `UPI ID/Phone: ${upiId}\nDetails: ${upiDesc}`;
      setInputText(combined.trim());
    }
  }, [upiId, upiDesc, inputMode, setInputText]);

  const handleSelectSample = (sample: any) => {
    soundEngine.playClick();
    setInputMode(sample.type);
    
    if (sample.type === "upi") {
      if (sample.text.includes("UPI PIN") || sample.text.includes("verify") || sample.text.includes("Dear Customer")) {
        setUpiDesc(sample.text);
        setUpiId("");
      } else {
        setUpiId(sample.text);
        setUpiDesc("");
      }
    } else {
      setInputText(sample.text);
    }
    
    setErrorMessage(null);
    setUploadedImageName(null);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload an image file (PNG, JPG, WebP).");
      return;
    }
    setUploadedImageName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const b64 = (e.target?.result as string).split(",")[1];
      setInputText(`[IMAGE_BASE64:${file.type}:${b64}]`);
    };
    reader.readAsDataURL(file);
    setErrorMessage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (!isLoading) {
        soundEngine.playSuccess();
        onAnalyze();
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -3; 
    const rotateY = ((x - centerX) / centerX) * 3;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    cardRef.current.style.transition = 'transform 0.5s ease-out';
  };
  
  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transition = 'none';
  };

  const tabData = TAB_DATA[inputMode];

  return (
    <section
      id="scam-checker"
      className="relative z-20 pointer-events-auto py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#00f0ff]/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[10px] font-mono text-[#00f0ff]">
            <Terminal className="w-3 h-3" />
            <span>AI TRI-DETECTOR ENGINE</span>
          </div>
          <h2 className="font-space font-black text-3xl sm:text-5xl text-white tracking-tight">
            4-IN-1 SCAM CHECKER
          </h2>
          <p className="font-sans text-neutral-400 text-xs sm:text-sm max-w-xl">
            Detect sophisticated social engineering attacks in less than 2 seconds.
          </p>
        </div>
      </div>

      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        className="cyber-hud-card rounded-3xl p-6 sm:p-9 space-y-8 relative overflow-hidden group hover:shadow-[0_0_50px_rgba(0,240,255,0.15)] transition-shadow duration-500 will-change-transform"
      >
        {isLoading && (
          <div className="absolute left-0 top-0 w-full h-[2px] bg-[#00f0ff] shadow-[0_0_20px_4px_#00f0ff] animate-[scan_2s_ease-in-out_infinite] z-50 pointer-events-none" />
        )}

        {/* Input Mode Tabs */}
        <div className="flex flex-wrap items-center gap-3 border-b border-neutral-800 pb-5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = inputMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setInputMode(tab.id as InputMode);
                  setInputText("");
                  setUpiId("");
                  setUpiDesc("");
                  setUploadedImageName(null);
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-space font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#00f0ff] text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t(tab.labelKey)}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Header */}
        <div className="font-space font-bold text-lg text-[#00f0ff]">
          {t(tabData?.headerKey || "")}
        </div>

        {/* Dynamic Input Body Based on Active Tab */}
        <div className="space-y-4">
          
          {/* TAB 01: UPI */}
          {inputMode === "upi" && (
            <div className="flex flex-col gap-4 relative">
              <input
                id="upi-id-input"
                aria-label="Suspicious UPI ID or Sender Phone Number"
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("tab.upi.placeholder1") || "📱 Suspicious UPI ID or Sender Phone Number"}
                className="w-full rounded-2xl bg-black/60 border border-neutral-800 focus:border-[#00f0ff] px-5 py-4 text-sm font-sans text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#00f0ff] transition-all"
              />
              <textarea
                id="upi-desc-input"
                aria-label="Payment message description or transfer request context"
                value={upiDesc}
                onChange={(e) => setUpiDesc(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
                placeholder="Paste Payment Message or Describe What They Asked You to Do (Example: Someone on OLX asked me to enter my UPI PIN to receive ₹5,000...)"
                className="w-full rounded-2xl bg-black/60 border border-neutral-800 focus:border-[#00f0ff] p-5 text-sm font-sans text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#00f0ff] resize-y transition-all"
              />
            </div>
          )}

          {/* TAB 02: SMS */}
          {inputMode === "sms" && (
            <div className="relative">
              <textarea
                id="sms-text-input"
                aria-label="Suspicious message or SMS content for scam analysis"
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                onKeyDown={handleKeyDown}
                rows={5}
                placeholder={t("tab.sms.placeholder") || "💬 Suspicious Message Text"}
                className="w-full rounded-2xl bg-black/60 border border-neutral-800 focus:border-[#00f0ff] p-5 text-sm font-sans text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#00f0ff] resize-y transition-all"
              />
            </div>
          )}

          {/* TAB 03: URL */}
          {inputMode === "url" && (
            <div className="flex flex-col gap-3">
              <div className="relative flex items-center">
                <div className="absolute left-5 flex items-center justify-center text-neutral-400">
                  <Globe className="w-5 h-5" />
                </div>
                <input
                  id="url-text-input"
                  aria-label="Suspicious website link or phishing URL"
                  type="text"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={t("tab.url.placeholder") || "🔗 Suspicious Website URL / Link (e.g., https://...)"}
                  className="w-full rounded-full bg-black/60 border border-neutral-800 focus:border-[#00f0ff] pl-14 pr-5 py-4 text-sm font-sans text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#00f0ff] transition-all"
                />
              </div>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-neutral-500 pl-4">
                <div className="flex items-center gap-1.5"><LockIcon className="w-3 h-3 text-[#00ff88]" /> SSL Lock Check</div>
                <div className="w-1 h-1 rounded-full bg-neutral-700"></div>
                <div className="flex items-center gap-1.5"><Search className="w-3 h-3 text-[#00f0ff]" /> Domain Extension Check</div>
                <div className="w-1 h-1 rounded-full bg-neutral-700"></div>
                <div className="flex items-center gap-1.5"><AlertTriangle className="w-3 h-3 text-[#ffb800]" /> Fake Brand Check</div>
              </div>
            </div>
          )}

          {/* TAB 04: SCREENSHOT */}
          {inputMode === "screenshot" && (
            <div className="space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleFileDrop}
                onClick={() => {
                  soundEngine.playClick();
                  fileInputRef.current?.click();
                }}
                className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  dragActive
                    ? "border-[#00f0ff] bg-[#00f0ff]/10"
                    : "border-neutral-800 bg-black/40 hover:bg-neutral-900/50 hover:border-[#00f0ff]/50"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-space font-bold text-white">
                    {uploadedImageName ? (
                      <span className="text-[#00f0ff]">{t("tab.screenshot.attached")}: {uploadedImageName}</span>
                    ) : (
                      <span>{t("tab.screenshot.placeholder") || "🖼️ Upload Screenshot of Message, Receipt, or Notice"}</span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 font-sans">
                    Supports PNG, JPG, WebP. Real Multimodal Screenshot Analysis (Vision + OCR).
                  </p>
                </div>
              </div>

              {uploadedImageName && inputText.startsWith("[IMAGE_BASE64") && (
                <div className="flex flex-col gap-3">
                  <div className="w-full h-40 rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center bg-black">
                    <img 
                      src={`data:${inputText.split(":")[1]};base64,${inputText.split(":")[2].slice(0, -1)}`} 
                      alt="Preview" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#00f0ff]" />
                      <span className="font-mono text-xs text-white">{uploadedImageName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setUploadedImageName(null);
                        setInputText("");
                      }}
                      className="text-neutral-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Removed absolute positioning for shortcut, moving it above button */}
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-[#ff0055]/15 border border-[#ff0055]/40 flex items-center gap-3 text-xs sm:text-sm text-[#ff0055] font-mono"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isLoading && (
          <div className="p-4 rounded-xl bg-neutral-950/90 border border-[#00f0ff]/30 font-mono text-xs space-y-2">
            <div className="flex items-center gap-2 text-[#00f0ff]">
              <Radar className="w-4 h-4 animate-spin text-[#00f0ff]" />
              <span className="font-bold">LIVE THREAT SCAN STREAM</span>
            </div>
            <div className="text-neutral-300">
              {`> ${TERMINAL_SCAN_STEPS[scanStepIndex]}`}
            </div>
            <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00f0ff] to-[#ff0055] animate-pulse" />
            </div>
          </div>
        )}

        {/* Tab Specific Quick Test Buttons */}
        {tabData?.buttons && tabData.buttons.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-neutral-300 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>{t("tab.oneTapExamples") || "ONE-TAP TEST EXAMPLES:"}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {tabData.buttons.map((sample) => {
                const isDanger = sample.riskBadge === "danger";
                const isSafe = sample.riskBadge === "safe";

                return (
                  <button
                    key={sample.id}
                    type="button"
                    onMouseEnter={() => soundEngine.playHover()}
                    onClick={() => handleSelectSample(sample)}
                    className="px-3.5 py-2 rounded-xl text-xs font-mono bg-neutral-900/80 hover:bg-[#00f0ff]/10 border border-neutral-800 hover:border-[#00f0ff]/50 text-neutral-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isDanger ? "bg-[#ff0055] shadow-[0_0_8px_#ff0055]" : 
                        isSafe ? "bg-[#00ff88] shadow-[0_0_8px_#00ff88]" : 
                        "bg-[#ffb800] shadow-[0_0_8px_#ffb800]"
                      }`}
                    />
                    <span>{t(sample.titleKey)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-800">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Lock className="w-4 h-4 text-[#00ff88] shrink-0" />
            <span>NUMBERS & OTPS MASKED LOCALLY</span>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-1.5 w-full sm:w-auto">
            {inputMode !== "screenshot" && (
              <div className="font-mono text-[10px] text-neutral-500 hidden sm:block">
                PRESS CTRL + ENTER TO SCAN
              </div>
            )}
            <button
              id="run-security-check-btn"
              aria-label={inputMode === "screenshot" ? "Analyze screenshot with Gemini AI" : "Run security threat analysis"}
              type="button"
              disabled={isLoading || (inputMode !== "screenshot" && inputText.length === 0)}
              onMouseEnter={() => soundEngine.playHover()}
              onClick={() => {
                soundEngine.playSuccess();
                onAnalyze();
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#00f0ff] via-[#7000ff] to-[#00f0ff] text-black font-space font-bold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_40px_rgba(0,240,255,0.7)] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>ANALYZING THREAT...</span>
                </>
              ) : (
                <>
                  <span>{inputMode === "screenshot" ? "ANALYZE SCREENSHOT WITH AI" : "RUN SECURITY CHECK"}</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {analysis && (
        <div id="satark-verdict-card" className="space-y-6 scroll-mt-24 mt-12 bg-neutral-900/50 p-6 rounded-3xl border border-neutral-800">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#00f0ff] uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>SCAN RESULT</span>
            </div>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setAnalysis(null);
                setInputText("");
                setUpiId("");
                setUpiDesc("");
                setUploadedImageName(null);
              }}
              className="text-xs font-mono text-neutral-400 hover:text-[#00f0ff] flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
          </div>

          <div className={`p-6 rounded-2xl border ${
            analysis.riskLevel === "danger" ? "bg-[#ff0055]/10 border-[#ff0055]/30 text-[#ff0055]" : 
            analysis.riskLevel === "safe" ? "bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]" : 
            "bg-[#ffb800]/10 border-[#ffb800]/30 text-[#ffb800]"
          } flex flex-col md:flex-row items-center gap-6`}>
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="opacity-20" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" 
                  strokeDasharray={`${251.2}`} 
                  strokeDashoffset={251.2 - (251.2 * analysis.riskScore) / 100}
                  className="transition-all duration-1000 ease-out" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-space font-black text-2xl leading-none">{analysis.riskScore}%</span>
                <span className="text-[9px] font-mono opacity-80 mt-1">RISK</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl sm:text-2xl font-black font-space tracking-tight uppercase">
                {analysis.riskLevel === "danger" ? "🚨 DANGER: THIS IS A SCAM" : 
                 analysis.riskLevel === "safe" ? "✅ SAFE: LOOKS GENUINE" : 
                 "⚠️ CAUTION: SUSPICIOUS"}
              </h3>
              <p className="mt-2 text-sm opacity-90 font-mono">
                {analysis.scamType}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-black/40 border border-neutral-800 space-y-3">
            <h4 className="text-white font-space font-bold text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#ffb800]" />
              Why is this a fraud?
            </h4>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-sans whitespace-pre-wrap">
              {typeof analysis.explanation === 'string' ? analysis.explanation : (analysis.explanation as any)?.en || "Explanation not available."}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/40 border border-neutral-800 space-y-4">
            <h4 className="text-white font-space font-bold text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#00ff88]" />
              What should you do now?
            </h4>
            <ul className="space-y-3">
              {(Array.isArray(analysis.nextSteps) ? analysis.nextSteps : ((analysis.nextSteps as any)?.en || [])).map((step: string, idx: number) => (
                <li key={idx} className="flex gap-3 text-neutral-300 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center shrink-0 font-mono text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {scanHistory.length > 0 && (
        <div className="pt-6 border-t border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setShowHistoryDrawer(!showHistoryDrawer);
              }}
              className="flex items-center gap-2 font-mono text-xs text-neutral-300 hover:text-[#00f0ff] transition-colors cursor-pointer"
            >
              <History className="w-4 h-4 text-[#00f0ff]" />
              <span>RECENT LOCAL AUDITS ({scanHistory.length})</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  showHistoryDrawer ? "rotate-180" : ""
                }`}
              />
            </button>

            {showHistoryDrawer && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onClearHistory();
                }}
                className="font-mono text-xs text-[#ff0055] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>CLEAR HISTORY</span>
              </button>
            )}
          </div>

          {showHistoryDrawer && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {scanHistory.map((item) => (
                <div
                  key={item.id}
                  className="cyber-hud-card p-4 rounded-xl border border-neutral-800/50 transition-all cursor-default space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        item.riskLevel === "danger"
                          ? "bg-[#ff0055]/20 text-[#ff0055]"
                          : item.riskLevel === "safe"
                          ? "bg-[#00ff88]/20 text-[#00ff88]"
                          : "bg-[#ffb800]/20 text-[#ffb800]"
                      }`}
                    >
                      {item.riskScore}/100 RISK
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {item.timestamp}
                    </span>
                  </div>
                  <div className="font-space font-bold text-xs text-white truncate">
                    {typeof item.scamType === 'string' ? item.scamType : (item.scamType as any)?.en || 'Threat Analysis'}
                  </div>
                  <div className="text-[11px] font-sans text-neutral-400 line-clamp-2">
                    {item.inputText.startsWith("[IMAGE_BASE64") ? "Screenshot Scan" : item.inputText}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
