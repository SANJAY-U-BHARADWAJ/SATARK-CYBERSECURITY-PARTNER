"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Search, ShieldAlert, BookOpen, AlertOctagon, TrendingUp, Smartphone, Globe, Briefcase, CreditCard } from "lucide-react";
import { uiAudio } from "@/utils/audio";
import { Header } from "@/components/Header";

const SCAM_CATEGORIES = [
  { id: "all", label: "All Scams", icon: BookOpen },
  { id: "qr", label: "QR Scams", icon: Smartphone },
  { id: "payment", label: "UPI & Payment", icon: CreditCard },
  { id: "investment", label: "Telegram Investment", icon: TrendingUp },
  { id: "phishing", label: "Fake Websites", icon: Globe },
  { id: "job", label: "Part-time Job Scams", icon: Briefcase },
];

const SCAM_DATA = [
  {
    id: "telegram-task",
    category: "job",
    title: "Telegram Part-Time Task Scam",
    icon: "💸",
    description: "Scammers recruit victims via WhatsApp/Telegram for 'easy part-time jobs' like liking YouTube videos or reviewing hotels. They pay a small amount initially to build trust, then trick victims into 'prepaid premium tasks' where funds are locked.",
    protection: [
      "No legitimate company asks you to pay money to earn money.",
      "Ignore unsolicited job offers on WhatsApp/Telegram.",
      "Never share banking details for 'salary processing' via social media."
    ]
  },
  {
    id: "upi-refund",
    category: "payment",
    title: "UPI Refund & 'Scan to Receive' Fraud",
    icon: "💳",
    description: "Scammers pretend to have sent money to you by mistake. They send a QR code or payment request on GPay/PhonePe and ask you to enter your UPI PIN to 'receive the refund'. Entering a UPI PIN always sends money, it never receives it.",
    protection: [
      "You DO NOT need to enter a UPI PIN to receive money.",
      "Never scan unknown QR codes sent by strangers.",
      "Check your bank balance directly via the official banking app."
    ]
  },
  {
    id: "investment-crypto",
    category: "investment",
    title: "Fake Trading App & Crypto Scams",
    icon: "📈",
    description: "Victims are added to VIP WhatsApp groups with 'stock experts' showing fake massive returns. They are convinced to download unverified trading APKs or use fake websites. Once large deposits are made, the apps block withdrawals.",
    protection: [
      "Only trade through SEBI-registered brokers and official app stores.",
      "Verify the company on MCA or SEBI's official portal.",
      "Do not download trading apps from random links in chat groups."
    ]
  },
  {
    id: "digital-arrest",
    category: "all",
    title: "Digital Arrest / Fake CBI Call",
    icon: "🚓",
    description: "Scammers pose as Police, CBI, or Customs claiming your Aadhaar/phone is linked to drug trafficking or money laundering. They force you into a Skype video call ('digital arrest') and demand a security deposit to clear your name.",
    protection: [
      "Indian law enforcement never conducts 'digital arrests' over Skype.",
      "Do not panic. Hang up immediately and report to 1930.",
      "Never transfer money to 'safe RBI accounts'."
    ]
  },
  {
    id: "electricity-disconnection",
    category: "payment",
    title: "Electricity Bill Disconnection Fraud",
    icon: "⚡",
    description: "You receive an SMS warning that your power will be cut tonight because the previous month's bill wasn't updated. It includes a personal phone number to call. They ask you to download an app (like AnyDesk) and pay ₹10 to 'update' the system, stealing your card details.",
    protection: [
      "Official electricity boards never send disconnection threats from 10-digit mobile numbers.",
      "Never install AnyDesk or screen-sharing apps on instructions from unknown callers.",
      "Pay bills only through the official DISCOM app or verified platforms."
    ]
  },
  {
    id: "fake-websites",
    category: "phishing",
    title: "Fake Banking & Shopping Phishing",
    icon: "🌐",
    description: "Scammers create exact replicas of banking portals, SBI Yono, or popular e-commerce sites like Amazon/Flipkart. Links are sent via SMS (e.g., 'Your KYC is suspended, update PAN now'). They capture your login credentials and OTPs.",
    protection: [
      "Always check the URL carefully (e.g., sbi.co.in vs sbl.co.in).",
      "Do not click on links in unsolicited SMS or emails.",
      "Banks never ask for OTPs or passwords over phone or SMS links."
    ]
  }
];

export default function LibraryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredScams = SCAM_DATA.filter((scam) => {
    const matchesCategory = activeCategory === "all" || scam.category === activeCategory;
    const matchesSearch = scam.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          scam.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
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
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              Scam & Threat Library
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Knowledge is your best defense. Browse the CyberSathi AI database of common digital frauds targeting Indians today. Learn their tactics, red flags, and how to stay protected.
            </p>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for a specific scam (e.g., UPI, Telegram, Job)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-surface-2 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/70"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-10">
          {SCAM_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  uiAudio.playClick();
                  setActiveCategory(cat.id);
                }}
                onMouseEnter={() => uiAudio.playHover()}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 font-medium ${
                  activeCategory === cat.id 
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(0,212,255,0.4)]" 
                    : "bg-surface-1 border-border text-foreground hover:border-primary/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScams.map((scam, i) => (
            <motion.div
              key={scam.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="bg-surface-2 border border-border rounded-2xl p-6 hover:border-primary/50 transition-all group hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              
              <div className="text-4xl mb-4">{scam.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight group-hover:text-primary transition-colors">{scam.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                {scam.description}
              </p>
              
              <div className="mt-auto">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-500 mb-3">
                  <ShieldAlert className="w-4 h-4" /> How to Protect Yourself
                </h4>
                <ul className="space-y-2">
                  {scam.protection.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mt-1.5 shrink-0"></div>
                      <span className="leading-tight">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
          
          {filteredScams.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              <AlertOctagon className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg">No scams found matching your search criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
