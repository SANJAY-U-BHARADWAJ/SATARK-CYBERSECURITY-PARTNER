# Satark: Product Specification

## Project Overview
- **Product Name**: Satark
- **Hackathon Track**: Track 3 (AI-Powered Cybersecurity & Digital Safety)
- **Expected Outcome**: A functional prototype that analyzes a digital threat (text, URL, or image) and provides actionable recommendations to the user.

## Non-Goals
- No user accounts or authentication.
- No storing of user messages or submitted data server-side (privacy-first).
- No automated reporting API integrations (will only provide external link-outs).
- No medical, legal, or financial advice/claims.

## Risks
- **Model Latency**: Relying on Gemini for 50% of the scoring weight may introduce latency. 
- **Offline Unavailability**: While there is an offline fallback, the quality of explanation and detection relies heavily on Gemini.
- **False Positives/Negatives**: The ensemble may incorrectly flag legitimate messages (e.g., bank OTPs) or miss novel zero-day phishing formats.
- **Masking Failures**: Client-side regex for PII masking might miss non-standard Indian phone number formats or obfuscated account numbers.

---

## Feature Specifications

### Tier 1 (Must Haves)

#### 1. Multi-modal Input
- **User Story**: As a user, I want to submit text messages, URLs, or screenshots so that I can check various forms of potential scams.
- **Acceptance Criteria**: UI contains a text area for messages/URLs and an image upload/paste target for screenshots.
- **Edge Cases**: Unsupported image formats, extremely long text messages, corrupted files.

#### 2. Tri-Detector Ensemble Scoring
- **User Story**: As a user, I want an accurate threat assessment backed by multiple layers of security so I can trust the result.
- **Acceptance Criteria**: The system combines scores from three engines: Rules (0.25), Custom TF-IDF+LogReg Model (0.25), and Gemini (0.50). 
- **Floor Rule**: If Rules score >= 85, the final output score is forced to be >= 80 regardless of ML/Gemini.
- **Edge Cases**: Custom model fails to load, rules engine hits an infinite loop on edge-case regex.

#### 3. Scam-type Label & Multilingual Explanation
- **User Story**: As a user, I want to know exactly what kind of scam it is and understand the threat in English, Hindi, or Hinglish.
- **Acceptance Criteria**: Output clearly states the scam category (e.g., "Electricity Bill Scam", "KYC Fraud"). Provides an easy-to-understand explanation generated in the user's selected language.
- **Edge Cases**: Unrecognized scam type defaults to "Generic Phishing". Language fallback to English if translation fails.

#### 4. 10-Minute Action Checklist
- **User Story**: As a victim, I want immediate, actionable steps to secure my accounts within the critical first 10 minutes.
- **Acceptance Criteria**: Displays a bulleted, per-scam-type checklist of immediate actions (e.g., "Freeze card", "Do not click link").
- **Edge Cases**: User submits a safe message—checklist should not appear or should just say "No action needed."

#### 5. Suspicious Phrase Highlighting
- **User Story**: As a user, I want to see exactly which parts of the message are dangerous so I can learn what red flags look like.
- **Acceptance Criteria**: The UI visually highlights specific words/phrases (extracted from ML TF-IDF features/Gemini rationale) directly in the input text.
- **Edge Cases**: The highlight indices mismatch the original text due to sanitization, causing broken rendering.

#### 6. One-Tap Demo Samples
- **User Story**: As a judge or new user, I want to test the app instantly without finding a real scam message myself.
- **Acceptance Criteria**: UI includes 6-8 clickable chips with pre-loaded demo scams (e.g., "FedEx Package", "Jio KYC"). Clicking one immediately populates the input and runs the scan.
- **Edge Cases**: Rapid clicking of multiple demo chips triggers race conditions in the UI state.

#### 7. Report Link Buttons
- **User Story**: As a user, I want official avenues to report the scam to authorities.
- **Acceptance Criteria**: The results page includes static buttons linking to `cybercrime.gov.in` and dialing `1930`. 
- **Edge Cases**: Device does not support `tel:` links (e.g., desktop browser).

#### 8. Offline Fallback
- **User Story**: As a user with a poor internet connection, I want a basic safety check even if the AI backend is unreachable.
- **Acceptance Criteria**: If the Gemini API call times out or fails, the app falls back to the local Rules + TF-IDF model and displays a degraded but functional result.
- **Edge Cases**: API hangs indefinitely instead of failing—must implement a strict client-side timeout.

---

### Tier 2 (Should Haves)

#### 1. Client-Side Privacy Shield
- **User Story**: As a privacy-conscious user, I want my personal data (phone numbers, OTPs) stripped before the message is sent to any external AI.
- **Acceptance Criteria**: Client-side logic masks numbers, emails, and OTPs (e.g., `[MASKED_PHONE]`). UI clearly displays a "What was masked" note to build trust.
- **Edge Cases**: Over-masking (masking legitimate amounts or dates that aren't PII), under-masking due to spaces (e.g., `9 8 7 6 5...`).

#### 2. "Detectors Disagree" Uncertainty State
- **User Story**: As a user, I want to know if the system is unsure, so I can exercise extra caution rather than relying on a false sense of security.
- **Acceptance Criteria**: If the variance between the three detectors is high (e.g., Rules=10, Gemini=90), display a "Needs Human Judgement" or "Uncertain" warning UI.
- **Edge Cases**: Two models score exactly 50; uncertainty state triggers too frequently.

#### 3. Shareable PNG Result Card + WhatsApp Share
- **User Story**: As a user, I want to warn my family and friends by sharing the analysis easily on WhatsApp.
- **Acceptance Criteria**: A button to generate a clean, branded PNG of the result and a "Share on WhatsApp" deep link.
- **Edge Cases**: Image generation fails on older browsers, WhatsApp is not installed on the user's device.

#### 4. Local Scan History
- **User Story**: As a returning user, I want to see my past scans so I can refer back to the advice.
- **Acceptance Criteria**: Scans are saved to `localStorage` and displayed in a history tab. Includes a "Clear All" button for privacy.
- **Edge Cases**: `localStorage` quota exceeded, or user is in Incognito mode where storage is ephemeral.

#### 5. Spot the Scam Quiz
- **User Story**: As a user, I want to educate myself on identifying scams through an interactive game.
- **Acceptance Criteria**: A 5-question mini-quiz with immediate feedback on right/wrong answers based on common Indian scam vectors.
- **Edge Cases**: User refreshes mid-quiz—state is lost unless persisted.

#### 6. Model Card & Transparency Page
- **User Story**: As a hackathon judge or technical user, I want to understand how the ML models were trained and their limitations.
- **Acceptance Criteria**: A dedicated page detailing the dataset, precision/recall metrics, TF-IDF architecture, and fairness considerations.
- **Edge Cases**: None (static content).

---

### Tier 3 (Stretch Goals)

#### 1. Read-Aloud / Voice Input
- **User Story**: As a visually impaired or low-literacy user, I want to speak to the app and have the results read back to me.
- **Acceptance Criteria**: Microphone button for speech-to-text input. Speaker button to use Web Speech API to read the explanation aloud.
- **Edge Cases**: Browser microphone permissions denied; TTS engine doesn't support Indian accents/Hinglish well.

#### 2. Progressive Web App (PWA)
- **User Story**: As a mobile user, I want to install the app on my home screen for quick access without going to the browser.
- **Acceptance Criteria**: App contains a valid `manifest.json`, service worker, and meets PWA installability criteria.
- **Edge Cases**: iOS Safari limitations with PWA caching and install prompts.

#### 3. Marathi Language Support
- **User Story**: As a local user in Maharashtra, I want to read explanations in my native language.
- **Acceptance Criteria**: Add Marathi as an explicit language toggle for the Gemini explanation generation.
- **Edge Cases**: Gemini hallucinations or poor grammar in Marathi translation.
