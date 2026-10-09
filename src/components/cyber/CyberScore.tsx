"use client";

import React, { useState } from "react";
import {
  Shield,
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { soundEngine } from "@/utils/SoundEngine";
import { useLanguage } from "@/context/LanguageContext";

/**
 * CyberScore Component
 *
 * Provides an interactive UI for evaluating password strength and generating highly secure passwords.
 * Computes strength dynamically across 5 validation rules and estimates crack time.
 *
 * @returns {JSX.Element} The rendered password strength evaluating interface.
 */
export function CyberScore() {
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const rules = [
    {
      id: "length",
      text: "At least 12 characters",
      check: (p: string) => p.length >= 12,
    },
    {
      id: "upper",
      text: "Uppercase letter",
      check: (p: string) => /[A-Z]/.test(p),
    },
    {
      id: "lower",
      text: "Lowercase letter",
      check: (p: string) => /[a-z]/.test(p),
    },
    { id: "number", text: "Number", check: (p: string) => /[0-9]/.test(p) },
    {
      id: "symbol",
      text: "Special symbol",
      check: (p: string) => /[^A-Za-z0-9]/.test(p),
    },
  ];

  const score = (() => {
    let s = 0;
    if (password.length > 0) s += 10;
    if (password.length >= 8) s += 15;
    if (password.length >= 12) s += 25;
    if (/[A-Z]/.test(password)) s += 10;
    if (/[a-z]/.test(password)) s += 10;
    if (/[0-9]/.test(password)) s += 15;
    if (/[^A-Za-z0-9]/.test(password)) s += 15;
    return s;
  })();

  const { color, crackTime } = (() => {
    if (score < 40) {
      return {
        color: "text-[#ff0055]",
        crackTime: score === 0 ? "Instantly" : "A few seconds",
      };
    } else if (score < 70) {
      return { color: "text-[#ffb800]", crackTime: "5 Hours" };
    } else if (score < 90) {
      return { color: "text-[#00f0ff]", crackTime: "300 Years" };
    } else {
      return { color: "text-[#00ff88]", crackTime: "40,000+ Years" };
    }
  })();

  const generatePassword = () => {
    soundEngine.playClick();
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let newPass = "";
    for (let i = 0; i < 16; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPass);
  };

  return (
    <section
      id="cyber-score"
      className="relative z-20 py-24 px-4 sm:px-6 max-w-5xl mx-auto w-full"
    >
      <div className="cyber-hud-card p-8 rounded-3xl bg-black/50 backdrop-blur-xl border border-[#00f0ff]/30 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
        {/* Privacy Badge */}
        <div className="absolute top-0 left-0 w-full bg-[#00ff88]/10 border-b border-[#00ff88]/20 py-2 px-6 flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 text-[#00ff88]" />
          <span className="font-mono text-xs font-bold tracking-wider text-[#00ff88] uppercase">
            {t("score.private")}
          </span>
        </div>

        <div className="w-full md:w-1/3 flex flex-col items-center justify-center relative mt-10 md:mt-0">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-neutral-900"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray="502"
              strokeDashoffset={502 - (502 * score) / 100}
              className={`${color.replace("text", "text")} drop-shadow-[0_0_15px_currentColor] transition-all duration-300 ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              className={`text-5xl font-mono font-black ${color} glow-cyan transition-colors`}
            >
              {score}%
            </span>
            <span className="text-[10px] font-space font-bold uppercase tracking-widest text-white mt-1">
              Strength
            </span>
          </div>
        </div>

        <div className="w-full md:w-2/3 space-y-6 mt-6 md:mt-0">
          <div>
            <h2 className="font-space font-black text-3xl text-white uppercase flex items-center gap-3">
              <Shield className="w-6 h-6 text-[#00f0ff]" /> {t("score.title")}
            </h2>
            <p className="font-mono text-[#00f0ff] mt-2 text-sm bg-[#00f0ff]/10 inline-block px-3 py-1 rounded">
              {t("score.crack")} <span className="font-bold">{crackTime}</span>
            </p>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type your password..."
              className="w-full bg-black/60 border border-neutral-700 focus:border-[#00f0ff] rounded-xl px-4 py-4 text-white font-mono outline-none transition-all pr-12"
            />
            <button
              onClick={() => {
                soundEngine.playClick();
                setShowPassword(!showPassword);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rules.map((rule) => {
              const isMet = rule.check(password);
              return (
                <div
                  key={rule.id}
                  className="flex items-center gap-2 font-mono text-xs"
                >
                  {isMet ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-neutral-600" />
                  )}
                  <span className={isMet ? "text-white" : "text-neutral-500"}>
                    {rule.text}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={generatePassword}
            className="w-full py-4 rounded-xl border border-[#00f0ff] text-[#00f0ff] font-space font-bold uppercase tracking-widest hover:bg-[#00f0ff] hover:text-black hover:shadow-[0_0_20px_#00f0ff] transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            <RefreshCw className="w-4 h-4" />{" "}
            {t("score.generate") || "Generate Secure Password"}
          </button>
        </div>
      </div>
    </section>
  );
}
