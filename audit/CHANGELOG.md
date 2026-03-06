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

---

### 2026-03-06 02:03 — M-004 Add .env.example
**Role:** MIGRATOR
**Files changed:** `.env.example` (created)
**What:** Created `.env.example` with all four required env vars: `GITHUB_TOKEN`, `VITE_GITHUB_USERNAME`, `WEBHOOK_SECRET`, `VERCEL_DEPLOY_HOOK_URL`. Confirmed `*.local` in `.gitignore` covers `.env.local`.
**Why:** Documents required environment variables for any developer or deployment target. Server-side tokens use plain names; only `VITE_GITHUB_USERNAME` uses the `VITE_` prefix for safe frontend bundling.
**Trade-offs:** None.
**Risks:** None.

---

### 2026-03-06 02:03 — M-005 Create /api/ directory and stub README
**Role:** MIGRATOR
**Files changed:** `api/README.md` (created)
**What:** Created `api/` directory with `README.md` documenting route conventions, planned routes (GS-001 through GS-005), required env vars, and local dev instructions (`npx vercel dev`).
**Why:** Establishes the API surface area and conventions before any serverless function is written. Serves as onboarding doc for Phase 2.
**Trade-offs:** None.
**Risks:** None.

---

### 2026-03-06 02:15 — GS-001 Create api/github-repos.js
**Role:** SYNCER
**Files changed:** `api/github-repos.js` (created)
**What:** Implemented the GitHub repository retrieval endpoint. It fetches repositories for the configured username, filters out forks/private repos, and maps them to the project structure defined in the spec.
**Why:** Backend requirement for the GitHub Sync feature. Enables the client to see what repos aren't yet in their portfolio.
**Trade-offs:** None.
**Risks:** Depends on GitHub API availability and a valid GITHUB_TOKEN.

---

### 2026-03-06 02:20 — GS-002 Create api/sync-projects.js
**Role:** SYNCER
**Files changed:** `api/sync-projects.js` (created), `package.json` (ajv-formats added)
**What:** Implemented a stateless project validation and merge endpoint. It ensures any new project data conforms to `src/config/projects.schema.json` using Ajv.
**Why:** Backend requirement for the GitHub Sync feature. Ensures data integrity for new project imports.
**Trade-offs:** None.
**Risks:** None.

---

### 2026-03-06 02:18 — GS-003 Create src/hooks/useGitHubSync.js
**Role:** SYNCER
**Files changed:** `src/hooks/useGitHubSync.js`, `src/hooks/useGitHubSync.test.jsx` (created)
**What:** Implemented the `useGitHubSync` custom React hook and its corresponding suite of unit tests. The hook manages repository fetching from the `/api/github-repos` endpoint and automatically calculates a list of "unsynced" repositories by comparing the fetched data with the existing portfolio project list.
**Why:** First step of the frontend phase (Phase 3) for the GitHub Sync feature. Enables the UI component to manage synchronization state.
**Trade-offs:** None.
**Risks:** Depends on the backend API (GS-001) working as expected. Tests currently use mocks to decouple from the live API.
**Compliance:** Matches `specs/GITHUB_SYNC.md § GS-003` exactly.

---

### 2026-03-06 02:22 — GS-004 Create GitHubSyncPanel.jsx
**Role:** SYNCER
**Files changed:** `src/components/GitHubSyncPanel.jsx` (created), `src/components/CMSProjectEditor.jsx` (integrated), `e2e/github-sync.spec.js` (created)
**What:** Implemented the UI for GitHub repository discovery and import. Integrated it as a new tab in the CMS editor. Added a Playwright E2E test to verify the full 'Discover → Import → Edit' workflow.
**Why:** Finalizes the user-facing part of the GitHub Sync feature. Allows the user to easily keep their portfolio up to date without manual data entry.
**Trade-offs:** None.
**Risks:** UI depends on the `useGitHubSync` hook. E2E tests use API mocking for reliability in the CI environment.

---

### 2026-03-06 02:25 — GS-005 Defer Webhook implementation
**Role:** SYNCER
**Files changed:** `audit/DECISIONS.md` (ADR-002 added), `tasks/BACKLOG.md` (status update)
**What:** Formally deferred the optional GitHub Webhook feature per ADR-002.
**Why:** Requires manual Vercel/GitHub configuration (secrets) that cannot be fully automated in this session. Vercel's native Git sync already handles most redeploy needs.
**Trade-offs:** Deferring reduces immediate automation but simplifies maintenance and secret management.
**Risks:** None.

---

### 2026-03-06 03:05 — Phase 4: CMS Auth & Persistence (CP-001/002)
**Role:** PERSISTER / SYNCER
**Files changed:** `specs/CMS_PERSISTENCE.md` (created), `api/auth.js` (created), `api/save-content.js` (created), `src/components/CMSProjectEditor.jsx` (updated), `src/context/ContentContext.jsx` (updated), `src/config/projects.schema.json` (updated)
**What:** Secured the CMS with a required password gate and implemented an automated 'Push to GitHub' data persistence layer.
**Why:** Directly fulfills the user's request for security (preventing random users from accessing the CMS) and 'automatic saving' (eliminating manual JSON push steps).
**Implementation:**
- `/api/auth`: Verifies a `CMS_ADMIN_PASSWORD` (securely gatable via Vercel).
- `/api/save-content`: Commits updated JSON files back to GitHub via the `GITHUB_TOKEN`.
- **GS-006**: Curated project categories (enum: AI, Game Dev, etc.) for better discovery.
- **CMSGate**: Created a premium, locked modal in the UI to handle the login flow.
- **Sync UI**: Added a 'Push to GitHub' button in the CMS editor with loading/success states.
**Trade-offs:** Pushing to GitHub multiple times triggers Vercel builds, but for a personal portfolio, this is an acceptable trade-off versus a dedicated database. 
**Compliance:** Matches `specs/CMS_PERSISTENCE.md` completely.



