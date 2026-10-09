# Security Policy: Project Satark

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Zero-Trust Architecture & Privacy Commitments

Satark is built on zero-trust and client-first privacy principles:
1. **Client-Side Privacy Shield**: All Personally Identifiable Information (PII) including phone numbers, Aadhaar numbers, PAN cards, OTPs, credit/debit card numbers, and UPI IDs are irreversibly masked on the user's browser before payload serialization.
2. **Stateless Analysis**: Satark does not persist, log, or store user message content or analysis outputs on any server or database.
3. **No Credential Ingestion**: The system strictly refuses to request, accept, or process passwords, OTPs, or authentication tokens.
4. **Server-Side API Key Isolation**: Google Gemini API credentials are maintained exclusively in server-side runtime environments and never leaked or exposed to the client bundle.
5. **Security Headers**: Standard security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`) are enforced via `next.config.ts`.

## Reporting a Vulnerability

We take the security of Satark and our users seriously. If you identify a security vulnerability, please follow responsible disclosure guidelines:

1. **Do not create a public GitHub issue.**
2. Send an email to `sanjaybharadwaj112@gmail.com` with:
   - Description of the vulnerability
   - Steps to reproduce or proof-of-concept (PoC)
   - Potential impact
3. We will acknowledge receipt of your vulnerability report within 24 hours and provide regular updates regarding mitigation.
