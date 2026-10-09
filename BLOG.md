# Building Satark: How I used Gemini AI to Protect India from Digital Fraud

*By Sanjay U Bharadwaj (17, BE CSE in AI & ML, Sapthagiri NPS University)*

---

India's digital payment ecosystem is booming. From UPI transactions at a roadside tea stall to online banking, the convenience is unparalleled. But with this rapid digitization comes a dark side: a massive surge in cyber extortion, digital arrest scams, and phishing attacks. 

As a 17-year-old engineering student pursuing my BE in CSE with a specialization in AI & ML at Sapthagiri NPS University, I realized that my parents and grandparents were extremely vulnerable to these sophisticated attacks. I wanted to build something that didn't just flash a generic "Warning" sign, but actually explained the threat in simple terms and told them exactly what to do next.

That’s why I built **Satark (सतर्क)** for the Hack2Skill PromptWars X Error Zero challenge (Track 3: AI-Powered Cybersecurity & Digital Safety).

## What is Satark?

Satark is a privacy-first cybersecurity scanner and AI assistant designed specifically for the Indian demographic. It analyzes suspicious SMS messages, WhatsApp scams, phishing URLs, and extortion notices, and provides an immediate 10-minute relief checklist.

The core philosophy behind Satark is **Zero-Trust Privacy**. People are scared to copy-paste their messages into AI tools because they contain personal information. Satark solves this.

## The Architecture: How I Used Gemini AI

To make Satark highly accurate, I didn't rely on just one detection method. I built a three-tier weighted ensemble engine:

1.  **Deterministic Rules Engine (25% Weight):** Checks for basic threats like Punycode domains, brand lookalikes, and known malicious IP hosts.
2.  **Machine Learning Inference (25% Weight):** A TF-IDF + Logistic Regression engine running entirely in the browser using TypeScript. I actually wrote a mathematical parity test in my CI/CD pipeline to prove that my TypeScript inference matches my Python scikit-learn training environment with `< 1e-6` divergence!
3.  **Google Gemini AI (50% Weight):** The brain of the operation. I heavily leveraged the `@google/genai` SDK using `gemini-3.8-flash`.

### The Gemini Advantage
Using Gemini allowed me to go beyond simple text matching. Gemini understands the *context* of social engineering. If a message says "Your electricity will be disconnected at 9:30 PM, call this number," Gemini instantly recognizes the urgency tactic typical of power bill scams. 

I implemented a **resilient model fallback chain** (`gemini-3.8-flash` -> `3.7-flash` -> `3.6-flash`) in my Vercel Edge functions. This guarantees high availability so the service never goes down when someone is panicking and needs immediate help.

## The Secret Weapon: Client-Side Privacy Shield

The biggest technical challenge was ensuring privacy. If a user pastes a scam message that includes their Aadhaar number or Bank OTP, sending that to an external API (even Google's) is a bad security practice. 

To fix this, I engineered a **Client-Side Privacy Shield**. Before any data leaves the user's browser, a strict Regex algorithm scrubs the text. It identifies Phone numbers (`+91`), 12-digit Aadhaar formats, 16-digit card numbers, OTPs, and UPI VPAs, and replaces them with `[MASKED_*]` tokens. 

Gemini still perfectly understands the context of the scam, but the user's PII (Personal Identifiable Information) never leaves their device. 

## Accessibility: Tech for Everyone

A cybersecurity tool is useless if the victim can't understand it. That's why Satark doesn't use technical jargon. 

Through highly structured prompting with Gemini, I forced the AI to output explanations in simple, everyday language. Furthermore, I localized the entire platform into **10 regional Indian languages** (Hindi, Kannada, Tamil, Telugu, Bengali, etc.). Whether you speak English or Marathi, Satark can guide you through the crisis.

## Looking Forward

Building Satark for Hack2Skill PromptWars has been an incredible journey. Combining traditional ML, strict deterministic rules, and the advanced reasoning capabilities of Google's Gemini AI has shown me the true power of AI for social good.

You can check out the live project here: [https://satarkcybersathi.vercel.app](https://satarkcybersathi.vercel.app)
And the open-source code here: [https://github.com/SANJAY-U-BHARADWAJ/SATARK-CYBERSECURITY-PARTNER](https://github.com/SANJAY-U-BHARADWAJ/SATARK-CYBERSECURITY-PARTNER)

Stay Safe, Stay Satark!
