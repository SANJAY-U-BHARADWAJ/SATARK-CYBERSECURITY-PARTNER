"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { dict } from "@/lib/translations";

export type LanguageCode =
  "en" | "hi" | "kn" | "ta" | "te" | "mr" | "bn" | "ml" | "gu" | "pa";

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setLanguage] = useState<LanguageCode>("en");

  const t = (key: string): string => {
    if (!dict[key]) return key;
    return dict[key][currentLanguage] || dict[key]["en"] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
