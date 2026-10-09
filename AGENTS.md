<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Satark: Project Rules
- **Stack**: Next.js App Router, TypeScript, Tailwind CSS. No separate backend server.
- **Secrets**: Never commit secrets. `.env.local` is in `.gitignore`. Gemini key is server-side only.
- **Repo Size**: Must stay strictly under 10 MB (excluding node_modules and .next). No huge datasets or uncompressed media.
- **Git Branch**: Exactly one branch only (`main`). Never create other branches.
- **Metrics Integrity**: Never state a metric or accuracy figure not produced by an in-repo script. If unmeasured, state "not measured".
- **Development**: Make small, surgical, reviewable changes. State assumptions before writing code.
- **Safety & Privacy**: Never ask for or store passwords, OTPs, or card numbers. Reporting is external link buttons only. User messages are never saved server-side. Client privacy shield masks PII before API calls.
- **Verdict Language**: Use probabilistic labels ("likely scam" / "looks safe, but verify"); never claim absolute certainty.
