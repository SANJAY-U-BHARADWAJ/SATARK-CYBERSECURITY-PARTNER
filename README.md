# SATARK – AI Cyber Safety Platform

## Description
Satark is an intelligent, zero-trust 4-in-1 AI cybersecurity system built specifically for India. It acts as an AI Cyber Safety Platform to identify suspicious activity across text, URLs, and screenshots, offering a Multilingual threat reasoning engine, and an interactive 5-Step FIR Drafter to assist users in filing official cybercrime complaints instantly.

## Tech Stack
- Next.js 16 (App Router)
- TypeScript (Strict Mode)
- Tailwind CSS
- GSAP & Lenis (Smooth Scrolling & Animations)
- OmniRoute Gemini 3.8/3.7 Flash API (AI Threat Evaluation)

## Features List
- **4-in-1 Scam Checker**: Analyzes SMS messages, URLs, deep-link APKs, and screenshot images using an offline deterministic rules engine combined with a live Gemini AI evaluation.
- **Multilingual Support**: Supports real-time translation of threat explanations into 10+ Indian languages (Hindi, Tamil, Telugu, Kannada, Bengali, etc.).
- **5-Step FIR Drafter**: Automatically extracts threat metadata and generates a structured cybercrime complaint format suitable for uploading to Indian Cybercrime Portals.
- **Zero-Trust Privacy Shield**: Scrubbing of Personal Identifiable Information (Aadhaar, PAN, Credit Cards, OTPs, and UPI VPAs) locally before transmission.
- **10-Minute Emergency Protocol**: Actionable safety checklists provided immediately upon threat detection.

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

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Project Structure
- `src/components/` - React UI components (Core modules, Dashboard, FIR Drafter).
- `src/app/api/` - Serverless Edge functions (Gemini AI integration, Chatbot API).
- `src/lib/` - Offline ML logic, URL heuristic analysis, and PII Privacy Shield.
- `src/app/` - Next.js page layouts and global state architecture.
