"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Phone, ExternalLink, ShieldAlert, XCircle, AlertOctagon, Key, EyeOff } from "lucide-react";
import { uiAudio } from "@/utils/audio";
import { Header } from "@/components/Header";
import { Language } from "@/lib/types";

const EMERGENCIES = [
  {
    id: "money-lost",
    title: "I Lost Money to a Scam",
    icon: <AlertOctagon className="w-6 h-6 text-red-500" />,
    steps: [
      "Call the National Cyber Crime Helpline immediately at 1930.",
      "File a complaint at cybercrime.gov.in.",
      "Call your bank's emergency number to freeze your account/card.",
      "Do NOT trust anyone online claiming they can recover your money for a fee (Recovery Scammers)."
    ]
  },
  {
    id: "otp-shared",
    title: "I Shared an OTP or Password",
    icon: <Key className="w-6 h-6 text-orange-500" />,
    steps: [
      "Immediately change the password for the compromised account.",
      "Enable Two-Factor Authentication (2FA) if you haven't already.",
      "If it was a banking OTP, call your bank immediately to block the account.",
      "Check your account settings for any unauthorized devices or recovery emails."
    ]
  },
  {
    id: "clicked-link",
    title: "I Clicked a Suspicious Link",
    icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
    steps: [
      "Close the website immediately. Do not enter any details.",
      "Disconnect your device from the internet (turn off Wi-Fi/Mobile Data) if it downloaded a file.",
      "Run a full anti-virus scan on your device.",
      "Clear your browser cache and cookies."
    ]
  },
  {
    id: "digital-arrest",
    title: "I'm on a Fake Police/CBI Call",
    icon: <EyeOff className="w-6 h-6 text-purple-500" />,
    steps: [
      "HANG UP IMMEDIATELY. Real police do not interrogate via Skype or WhatsApp video.",
      "Do not transfer any 'security deposit' to RBI or 'safe accounts'.",
      "Block the number. They will try to call back and threaten you.",
      "Report the incident to 1930."
    ]
  }
];

export default function IncidentPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("satark-theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = `${savedTheme} ${document.documentElement.className.replace(/dark|light/g, "").trim()}`;
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("satark-theme", nextTheme);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(nextTheme);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <Link 
            href="/" 
            onMouseEnter={() => uiAudio.playHover()}
            onClick={() => uiAudio.playClick()}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Scanner
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 md:p-8 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/20 blur-3xl rounded-full"></div>
            <div className="flex items-start gap-4">
              <ShieldAlert className="w-10 h-10 text-red-500 shrink-0 mt-1 animate-pulse" />
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3 text-red-500">
                  Emergency Incident Guide
                </h1>
                <p className="text-lg text-foreground/80 max-w-2xl font-medium">
                  If you believe you have been compromised or scammed, TIME IS CRITICAL. Follow the instructions below immediately.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          {EMERGENCIES.map((emergency, index) => (
            <motion.div
              key={emergency.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-surface-2 border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-surface-1 flex items-center justify-center border border-border">
                  {emergency.icon}
                </div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">{emergency.title}</h2>
              </div>
              
              <div className="bg-surface-1 rounded-xl p-5 border border-border/50">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Immediate Actions</h3>
                <ul className="space-y-3">
                  {emergency.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <span className="text-sm md:text-base font-medium leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-2xl p-6 md:p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Official Helpline & Resources</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="tel:1930"
              onMouseEnter={() => uiAudio.playHover()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all w-full sm:w-auto justify-center"
            >
              <Phone className="w-5 h-5" />
              Call 1930
            </a>
            <a 
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => uiAudio.playHover()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-2 border border-border hover:border-primary/50 font-bold transition-all w-full sm:w-auto justify-center"
            >
              <ExternalLink className="w-5 h-5" />
              cybercrime.gov.in
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
