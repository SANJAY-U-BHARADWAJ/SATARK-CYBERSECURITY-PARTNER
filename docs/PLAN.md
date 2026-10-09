# Satark: Implementation Plan & Architecture

## 1. Timeline & Phases
- **Phase 1-5 (Scaffolding & Design System)**: Completed.
- **Phase 6 (URL Engine & Heuristics)**: Complete `lib/urlAnalyzer.ts` + 25 Unit Tests.
- **Phase 7 (ML Classifier & Data)**: Build `ml/data/` (synthetic India scams + holdout), export `ml/model.json`, implement `lib/mlClassifier.ts`, add `scripts/check-parity.ts` wired to prebuild.
- **Phase 8 (Privacy Shield & Gemini Route)**: `lib/privacyShield.ts` tests, `app/api/analyze/route.ts` with Zod + rate-limiting + fallback, and `lib/scoring.ts` tests.
- **Phase 9 (Result Experience)**: Connect full frontend flow, sample chips, animations, fallback handling.
- **Phase 10 (Extras)**: WhatsApp share link, PNG export, local scan history, scam quiz, transparency page.
- **Phase 11 (QA & Testing)**: 20-sample validation benchmark, mock audit, offline verification, Lighthouse score check.
- **Phase 12 (Hardening)**: Security audit, size check (<10 MB), secret scanning.
- **Phase 13 (Documentation)**: Full `README.md` with Mermaid diagram, measured metrics, and honest limitations.
- **Phase 14 (Git & Release)**: Single `main` branch, clean commit history.

## 2. File Tree
```
├── docs/
│   ├── SPEC.md
│   ├── SKILLS.md
│   └── PLAN.md
├── ml/
│   ├── data/
│   │   ├── india_scams.csv
│   │   └── holdout.csv
│   ├── download_uci.py
│   ├── train.py
│   ├── model.json
│   └── README.md
├── scripts/
│   ├── check-parity.ts
│   └── run-tests.ts
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts
│   │   ├── transparency/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── InputSection.tsx
│   │   ├── VerdictCard.tsx
│   │   ├── DecisionBreakdown.tsx
│   │   ├── ActionChecklist.tsx
│   │   ├── HighlightedViewer.tsx
│   │   ├── RiskGauge.tsx
│   │   ├── QuizModal.tsx
│   │   └── SkeletonLoader.tsx
│   └── lib/
│       ├── privacyShield.ts
│       ├── urlAnalyzer.ts
│       ├── mlClassifier.ts
│       ├── scoring.ts
│       ├── detector-engine.ts
│       └── types.ts
├── AGENTS.md
├── package.json
└── README.md
```

## 3. Data Flow Diagram
```mermaid
flowchart TD
    User([User Input: Message / URL / Screenshot]) --> PrivacyShield[Client Privacy Shield\nMasks Phone, OTP, Cards, UPI]
    PrivacyShield --> ClientCheck[Client Detectors]
    ClientCheck --> URLAnalyzer[1. URL Analyzer Rules Engine\n25% Weight]
    ClientCheck --> MLInference[2. TF-IDF + Logistic Reg TS Engine\n25% Weight]
    PrivacyShield --> ServerAPI[POST /api/analyze\n(Server Route)]
    ServerAPI --> GeminiCall[3. Gemini 2.5 Flash API\nStructured JSON\n50% Weight]
    GeminiCall -. Fallback on error .-> OfflineDetector[Offline 50/50 ML+Rules Mode]
    URLAnalyzer --> Combiner[Scoring Combiner & Safety Floor Rule\nRules >= 85 -> Final >= 80]
    MLInference --> Combiner
    GeminiCall --> Combiner
    OfflineDetector --> Combiner
    Combiner --> Verdict[UI Bento Dashboard\nVerdict + Action Checklist + Highlighting]
```

## 4. 5 Riskiest Assumptions & Verification
1. **Assumption: Client ML inference matches Python scikit-learn.**
   - *Test*: `scripts/check-parity.ts` asserts probability difference `< 1e-6` across 20 distinct holdout samples. Wired to build step.
2. **Assumption: Regex Privacy Shield catches Indian PII without over-masking legitimate context.**
   - *Test*: Dedicated test suite evaluating 10-digit Indian mobiles, UPI IDs (`@okhdfcbank`, `@paytm`), 12-digit Aadhaar patterns, and OTP digits.
3. **Assumption: Floor rule prevents critical false negatives when obvious phishing URLs bypass ML/Gemini.**
   - *Test*: Test cases where Rules score >= 85 force final score >= 80 even if ML or Gemini return conservative scores.
4. **Assumption: The application runs cleanly offline when Gemini is unreachable.**
   - *Test*: Synthetic timeout/offline simulation verifying fallback to 50% Rules + 50% ML with appropriate UI banner.
5. **Assumption: Repository size stays strictly under 10 MB.**
   - *Test*: Lightweight JSON model weights (<1 MB), zero Python runtimes in build bundle, dataset < 500 KB.
