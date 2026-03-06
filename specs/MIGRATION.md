# MIGRATION.md — Vercel Migration Spec
**Status:** `READY`  
**Owner:** Opus 4.6 (@MIGRATOR)  
**Priority:** P0 → P1 → P2  
**Depends on:** Nothing (execute first)

---

## Context

The portfolio is currently hosted on GitHub Pages, which requires:
- A hardcoded `base` path in `vite.config.js` matching the repo name
- A GitHub Actions workflow to deploy the `dist/` folder to the `gh-pages` branch
- No support for server-side functionality (API routes, webhooks)

Migrating to Vercel enables:
- Automatic deploys on every `main` push (zero config)
- Serverless API routes via `/api/` folder (required for GitHub Sync)
- Preview deployments on every branch/PR
- Edge caching, analytics, and Speed Insights

---

## Tasks

### P0 — CRITICAL (site will break without these)

#### M-001 · Remove GitHub Pages base path from vite.config.js
**File:** `vite.config.js`  
**Change:** Remove or replace the `base: '/jostinlopez.github.io/'` option  
**Verify:** `npm run build` produces `dist/index.html` with asset paths starting at `/`  

```js
// BEFORE
export default defineConfig({
  base: '/jostinlopez.github.io/',
  plugins: [react()],
});

// AFTER
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist' },
});
```

**Acceptance Criteria:**
- [ ] `vite.config.js` contains no `base:` property, OR `base: '/'`
- [ ] `npm run build` exits 0
- [ ] `dist/index.html` asset `src` attributes start with `/assets/`, not `/jostinlopez.github.io/assets/`

---

#### M-002 · Add vercel.json with SPA rewrite rule
**File:** `vercel.json` (create at project root)  
**Change:** Add catch-all rewrite to support client-side routing  

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Acceptance Criteria:**
- [ ] `vercel.json` exists at project root
- [ ] File is valid JSON
- [ ] Rewrites array contains the catch-all rule above
- [ ] E2E test confirms direct navigation to a deep route (e.g. `/projects`) returns 200

---

### P1 — HIGH (required before Vercel is the canonical host)

#### M-003 · Disable GitHub Actions deploy workflow
**File:** `.github/workflows/deploy.yml` (or similar)  
**Change:** Add `if: false` to the deploy job, or delete the file  

```yaml
# Option A — Disable the deploy job while preserving CI:
deploy:
  if: false   # Disabled: Vercel handles deployment
  runs-on: ubuntu-latest
  ...

# Option B — Keep only the lint/test CI job, remove deploy job entirely
```

**Acceptance Criteria:**
- [ ] No GitHub Actions job deploys to `gh-pages` branch
- [ ] CI job (lint + test) still runs on push if it exists

---

#### M-004 · Add .env.example with all required Vercel env vars
**File:** `.env.example` (create if missing)  

```bash
# GitHub API (server-side only — never use VITE_ prefix for tokens)
GITHUB_TOKEN=your_github_pat_here

# GitHub username (safe for frontend)
VITE_GITHUB_USERNAME=D4RKL0RD-J0571N

# Webhook (server-side only)
WEBHOOK_SECRET=your_webhook_secret_here
VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...
```

**Acceptance Criteria:**
- [ ] `.env.example` exists at project root
- [ ] All four variables are present with placeholder values
- [ ] `.env.local` is confirmed in `.gitignore`

---

### P2 — MEDIUM (quality of life for ongoing development)

#### M-005 · Create /api/ directory and stub index
**File:** `api/README.md` (create)  
**Change:** Document the API route conventions and list planned routes  

**Acceptance Criteria:**
- [ ] `api/` directory exists at project root
- [ ] `api/README.md` documents route conventions per `RULES.md §3`

---

## Completion Criteria

Migration is **complete** when:
1. All P0 and P1 tasks are `DONE`
2. `npm run build` succeeds locally
3. A Vercel project is connected to the repo (documented in `audit/DECISIONS.md`)
4. The live Vercel URL renders the portfolio correctly
5. Direct URL navigation (e.g. `/projects`) works without 404