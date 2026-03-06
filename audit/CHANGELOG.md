# CHANGELOG.md — Audit Log
**Project:** `jostinlopez.github.io`  
**Format:** Append-only. Never edit or delete existing entries.

> Every significant change, fix, or architectural decision made by Opus 4.6
> must be logged here. Use the format below.

---

## Log Format

```
### [DATE] [TIME] — [TASK-ID] [Short title]
**Role:** [AUDITOR | IMPLEMENTER | MIGRATOR | etc.]
**Files changed:** list of files
**What:** What was done
**Why:** Why it was necessary
**Trade-offs:** Any alternatives considered and rejected
**Risks:** Any known risks introduced
```

---

<!-- Entries will be appended below by the agent -->

### 2026-03-05 23:50 — ARCH-001 Governance file restructure
**Role:** ARCHITECT
**Files changed:** migration/audit/* → audit/, migration/tasks/* → tasks/, migration/GITHUB_SYNC.md → specs/, migration/_TEMPLATE.md → specs/
**What:** Moved all governance files from non-canonical `migration/` directory to their canonical locations (`audit/`, `tasks/`, `specs/`) per `AGENTS.md §Governance Files Reference`. Deleted empty `migration/` directory.
**Why:** Misaligned audit trail — rules referenced `audit/CHANGELOG.md` and `tasks/BACKLOG.md` at project root but files lived under `migration/`. No agent or human reviewer would find them at the expected paths.
**Trade-offs:** None — this was pure housekeeping with zero code impact.
**Risks:** None.

---

### 2026-03-05 23:52 — M-001 Remove GitHub Pages base path
**Role:** MIGRATOR
**Files changed:** `vite.config.js`
**What:** Removed `base: '/jostinlopez.github.io/'` from Vite config.
**Why:** Vercel serves from root — the GH Pages base path caused all asset URLs to be prefixed with `/jostinlopez.github.io/assets/` which would 404 on Vercel.
**Trade-offs:** GitHub Pages deployment will break if reverted without restoring the base path. This is intentional — Vercel is the new deployment target.
**Risks:** None. Build verified: `npm run build` exits 0, `dist/index.html` asset paths confirmed as `/assets/...`.

---

### 2026-03-05 23:52 — M-002 Add vercel.json with SPA rewrite
**Role:** MIGRATOR
**Files changed:** `vercel.json` (created)
**What:** Created `vercel.json` with a catch-all rewrite rule `"source": "/(.*)"` → `"destination": "/index.html"`.
**Why:** Without this, direct URL navigation to any client-side route (e.g. `/projects`) returns 404 on Vercel. The rewrite ensures all routes serve `index.html` and let React handle routing.
**Trade-offs:** None.
**Risks:** None — this is Vercel's recommended SPA config.

---

### 2026-03-05 23:53 — M-003 Disable GitHub Actions deploy workflow
**Role:** MIGRATOR
**Files changed:** `.github/workflows/deploy.yml`
**What:** Added `if: false` to the `deploy` job. Added header comment noting the workflow is disabled. CI workflow (`ci.yml`) is unaffected and still runs lint/build/test.
**Why:** The deploy job pushes to `gh-pages` branch, which conflicts with Vercel auto-deploy from `main`. Keeping the file (vs. deleting) preserves reference material if a rollback is ever needed.
**Trade-offs:** Alternative was to delete the file entirely — kept it with `if: false` for auditability.
**Risks:** None.

---

### 2026-03-05 23:53 — Migration cleanup: OG URL update
**Role:** MIGRATOR
**Files changed:** `index.html`
**What:** Updated `og:url` meta tag from `https://D4RKL0RD-J0571N.github.io/jostinlopez.github.io/` to `https://jostinlopez.vercel.app/`.
**Why:** OG URL must match the canonical deployment URL. Using placeholder until real Vercel domain is confirmed.
**Trade-offs:** ⚠️ **ACTION REQUIRED**: Update this URL once the actual Vercel domain/custom domain is confirmed.
**Risks:** Low — placeholder is functionally correct for Vercel's default subdomain.