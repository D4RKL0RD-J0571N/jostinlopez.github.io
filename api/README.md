# /api/ — Vercel Serverless Functions

This directory contains Vercel serverless API routes for the portfolio backend.

## Conventions (per `.antigravity/rules.md §API Routes`)

1. **One function per file** — each `.js` file exports a single `default async function handler(req, res)`
2. **HTTP method validation** — every route must check `req.method` and return `405` for unsupported methods
3. **Cache headers** — set `Cache-Control` on every successful response
4. **Error format** — always return `{ error: string }` on failure
5. **Auth tokens** — access via `process.env` only, never `import.meta.env`
6. **Webhook security** — verify `x-hub-signature-256` before processing webhook payloads

## Planned Routes

| Route | Method | Task ID | Status |
|---|---|---|---|
| `/api/github-repos` | GET | GS-001 | TODO |
| `/api/sync-projects` | POST | GS-002 | TODO |
| `/api/webhook` | POST | GS-005 | TODO |

## Environment Variables Required

| Variable | Scope | Description |
|---|---|---|
| `GITHUB_TOKEN` | Server only | GitHub PAT for API access |
| `VITE_GITHUB_USERNAME` | Client safe | GitHub username for public API calls |
| `WEBHOOK_SECRET` | Server only | HMAC secret for webhook verification |
| `VERCEL_DEPLOY_HOOK_URL` | Server only | Vercel deploy hook for auto-redeploy |

## Local Development

Vercel serverless functions can be tested locally with:

```bash
npx vercel dev
```

This will serve both the Vite frontend and the `/api/` routes.
