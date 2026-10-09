# SATARK – AI Cyber Safety Platform

> **Challenge Theme:** AI-Powered Cybersecurity & Digital Safety  
> **Solution:** SATARK is a high-throughput, multi-agent cybersecurity intelligence platform deployed against modern financial extortion, digital arrest scams, and credential hijackers.  
> **Live Production URL:** [https://satarkcybersathi.vercel.app/](https://satarkcybersathi.vercel.app/)

## Description
Satark is an intelligent, zero-trust 4-in-1 AI cybersecurity system built specifically for India. It acts as an AI Cyber Safety Platform to identify suspicious activity across text, URLs, and screenshots, offering a Multilingual threat reasoning engine, and an interactive 5-Step FIR Drafter to assist users in filing official cybercrime complaints instantly.

## Tech Stack
- **Frontend Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Animations**: GSAP & Lenis (Smooth Scrolling)
- **AI Core**: OmniRoute Gemini 3.8/3.7 Flash API (AI Threat Evaluation)
- **Testing**: Jest unit tests and full automated parity tests

## Features
- **4-in-1 Scam Checker**: Analyzes SMS messages, URLs, deep-link APKs, and screenshot images using an offline deterministic rules engine combined with a live Gemini AI evaluation.
- **Multilingual Support**: Supports real-time translation of threat explanations into 10+ Indian languages.
- **5-Step FIR Drafter**: Automatically extracts threat metadata and generates a structured cybercrime complaint.
- **Zero-Trust Privacy Shield**: Scrubbing of Personal Identifiable Information (Aadhaar, PAN, Credit Cards, OTPs).
- **10-Minute Emergency Protocol**: Actionable safety checklists provided immediately upon threat detection.

## Security Headers Implemented
To ensure the absolute highest level of safety for our users, the following strict HTTP security headers are enforced globally via `next.config.ts`:
- `Content-Security-Policy`: Restricts scripts and styles to `self` to prevent XSS.
- `X-Frame-Options: DENY`: Defends against clickjacking.
- `X-Content-Type-Options: nosniff`: Prevents MIME-type sniffing.
- `Referrer-Policy: strict-origin-when-cross-origin`: Protects routing leaks.
- `Strict-Transport-Security`: Enforces HTTPS globally.
- Additionally, strict input sanitization runs on all Gemini edge functions to strip injection vectors like `<script>` and `<iframe>`.

## Accessibility Compliance
Designed for inclusivity (WCAG 2.1 AAA alignment):
- **Semantic DOM & ARIA Roles**: Fully structured `tablist`, `tab`, and `tabpanel` attributes.
- **Screen Reader Optimization**: `aria-label` applied to all interactive `<button>` and `<input>` elements. All decorative SVG icons utilize `aria-hidden="true"`.
- **Keyboard Navigation**: Highly optimized focus rings for non-mouse users.

## Local Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/SANJAY-U-BHARADWAJ/SATARK-CYBERSECURITY-PARTNER.git
   cd SATARK-CYBERSECURITY-PARTNER
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your GEMINI_API_KEY
   ```

4. **Run Automated Tests**
   ```bash
   npm run test
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```
