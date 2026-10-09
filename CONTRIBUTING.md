# Contributing to Satark

Thank you for your interest in contributing to Satark (सतर्क) — AI-Powered Cyber Threat & Scam Intelligence Partner.

## Code of Conduct

Please be respectful, collaborative, and mindful of security best practices.

## Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/SANJAY-U-BHARADWAJ/SATARK-CYBERSECURITY-PARTNER.git
   cd SATARK-CYBERSECURITY-PARTNER
   npm install
   ```

2. **Environment Setup**
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Provide your Google Gemini API key:
     ```env
     GEMINI_API_KEY=your_key_here
     ```

3. **Running the Development Server**
   ```bash
   npm run dev
   ```

4. **Testing & Quality Assurance**
   Before submitting any PR or commit, ensure all 62 unit & parity tests pass:
   ```bash
   npm test
   ```
   Verify TypeScript strict compilation:
   ```bash
   npx tsc --noEmit
   ```

## Contribution Guidelines

- **Privacy First**: Any new feature touching user input must integrate with `src/lib/privacyShield.ts`.
- **Probabilistic Verdicts**: Never hardcode deterministic claim language like "100% scam" or "guaranteed safe". Use probabilistic labels such as "Likely Scam" or "Looks Safe, But Verify".
- **Repository Size Limit**: Keep PR additions minimal and strictly below the 10 MB total repository footprint.
- **Commit Messages**: Follow standard conventional commits (`feat:`, `fix:`, `docs:`, `test:`, `perf:`).
