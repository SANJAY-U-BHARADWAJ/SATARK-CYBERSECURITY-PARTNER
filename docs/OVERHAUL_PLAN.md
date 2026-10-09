# Satark Overhaul Plan (GSD Methodology)

## Phase 1: Premium Frontend & Design System (Architect & Code Mode)
- **Goal**: Eliminate "AI-default" aesthetics. Implement a Vercel/Linear-inspired premium dark mode with deep true-blacks, ultra-subtle borders, and high-contrast typography.
- **Tasks**:
  - Overhaul `src/app/globals.css` with a refined OKLCH palette (true black background, stark white foreground, subtle glass borders).
  - Add Emil Kowalski-inspired micro-animations (Framer Motion spring physics for hover states, layout transitions, and staggered list animations).
  - Redesign `Header.tsx`, `page.tsx`, and `InputSection.tsx` to feature smooth glowing accents and premium visual hierarchy.
  - Implement a dynamic animated background (subtle mesh gradient or grid) to give the app a "live" feel without being distracting.

## Phase 2: Component Polish (Code Mode)
- **Goal**: Elevate the interactive elements.
- **Tasks**:
  - Upgrade `VerdictCard.tsx` and `DecisionBreakdown.tsx` with animated number counters (for the score) and progressive disclosure for the checklist.
  - Refine the `HighlightedViewer.tsx` to use glowing highlights instead of harsh background colors.

## Phase 3: Backend Refinement & Security (CodeRabbit Standards & Debug Mode)
- **Goal**: Harden the `route.ts` API and improve error resilience.
- **Tasks**:
  - Audit `route.ts` for security and edge cases.
  - Improve the rate limiter to use a more robust header-based check and document its edge-ephemeral nature.
  - Enhance the Gemini prompt for even more structured and less "bot-like" output.
  - Implement strict fallback mechanisms.

## Phase 4: Ralph Loop Verification
- **Goal**: Ensure 100% functionality and parity with original specs.
- **Tasks**:
  - Run `npm test` and build checks.
  - Verify offline fallback mode manually via tests or forced flags.
  - Fix any regressions found during the build phase.
