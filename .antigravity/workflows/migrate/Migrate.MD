# Migration Workflow
# Trigger: /migrate in Cascade
# Role: MIGRATOR
# Spec: specs/MIGRATION.md

You are now in MIGRATOR mode. Work through the Vercel migration tasks in priority order.
Do not skip P0 tasks to reach P1/P2. Gate each P0 step with a build check.

---

## Pre-flight Check

Before starting, verify:
1. Read `specs/MIGRATION.md` in full
2. Check `tasks/BACKLOG.md` — identify which migration tasks are still `TODO`
3. Announce: `[IMPLEMENTING: M-00X] Starting from task [X]`

---

## P0 Gate — Must complete and verify before anything else

### M-001 — Remove GitHub Pages base path

1. Open `vite.config.js`
2. Remove the `base: '/jostinlopez.github.io/'` line (or set `base: '/'`)
3. Run `npm run build`
4. Inspect `dist/index.html` — confirm asset `src` attributes start with `/assets/`
5. Mark M-001 `DONE` in `tasks/BACKLOG.md`
6. Log to `audit/CHANGELOG.md`:
   `### [DATE] — M-001 Removed GitHub Pages base path from vite.config.js`

### M-002 — Add vercel.json

1. Create `vercel.json` at project root with:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
2. Verify it is valid JSON
3. Mark M-002 `DONE` in `tasks/BACKLOG.md`
4. Log to `audit/CHANGELOG.md`

**→ Run `npm run build` again. Confirm it passes. Only then proceed to P1.**

---

## P1 Tasks

### M-003 — Disable GitHub Actions deploy workflow

1. Find the deploy workflow file in `.github/workflows/`
2. Add `if: false` to the deploy job, OR remove the deploy job entirely
3. Preserve any CI lint/test jobs
4. Commit with message: `ci(migration): disable gh-pages deploy job`
5. Log to `audit/CHANGELOG.md`

### M-004 — Create .env.example

Create `.env.example` at project root:
```
# GitHub API (server-side only)
GITHUB_TOKEN=your_github_pat_here

# Safe for frontend bundle
VITE_GITHUB_USERNAME=D4RKL0RD-J0571N

# Webhook (server-side only)  
WEBHOOK_SECRET=your_webhook_secret_here
VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...
```
Confirm `.env.local` is in `.gitignore`.
Log to `audit/CHANGELOG.md`.

---

## P2 Tasks

### M-005 — Create api/ directory

1. Create `api/` at project root
2. Create `api/README.md` documenting route conventions (reference `.windsurf/rules/01-code-standards.md §api_routes`)
3. Log to `audit/CHANGELOG.md`

---

## Completion

When all tasks are done, output:

```
[DONE: MIGRATION]
## Migration Complete — [DATE]
- M-001: ✅ vite.config.js base path removed
- M-002: ✅ vercel.json created
- M-003: ✅ GH Actions deploy disabled  
- M-004: ✅ .env.example created
- M-005: ✅ api/ directory created

Next: Connect repo to Vercel dashboard, then run /sync
```

Create an ADR in `audit/DECISIONS.md` documenting the hosting platform decision.