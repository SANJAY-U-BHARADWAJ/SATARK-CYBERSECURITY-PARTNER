import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Devanagari, Space_Grotesk, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Satark | AI Scam & Phishing Threat Intelligence",
  description:
    "Instant, privacy-first threat analysis for digital scams in India. Checks messages, URLs, and screenshots with tri-detector verification, Hindi/English explanations, and immediate 10-minute action checklists.",
  keywords: ["cybersecurity", "phishing detection", "scam alert", "AI cyber threat", "India cyber safety", "Satark", "hack2skill"],
  openGraph: {
    title: "Satark | AI Scam & Phishing Threat Intelligence",
    description: "Instant, privacy-first threat analysis for digital scams in India. Tri-detector verification and cyber safety guidance.",
    url: "https://satark.app",
    siteName: "Satark",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Satark | AI Scam & Phishing Threat Intelligence",
    description: "Instant, privacy-first threat analysis for digital scams in India.",
  },
  other: {
    google: "notranslate",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      translate="no"
      className={`notranslate ${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${syne.variable} ${notoSansDevanagari.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary transition-colors duration-200">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
