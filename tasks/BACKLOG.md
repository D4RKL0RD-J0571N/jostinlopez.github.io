# BACKLOG.md — Task Registry
**Project:** `jostinlopez.github.io`  
**Managed by:** Opus 4.6 (@IMPLEMENTER / @MIGRATOR / @SYNCER)

> Update this file as tasks change status. Never delete rows — change status only.
> Format: `TODO` → `IN PROGRESS` → `DONE` | `BLOCKED: reason` | `DEFERRED: reason`

---

## Phase 0 — Audit

| ID | Task | Status | Spec |
|---|---|---|---|
| A-001 | Initial full codebase audit | `TODO` | `CLAUDE.md §4` |
| A-002 | Lint audit + report | `TODO` | `CLAUDE.md §4.2` |
| A-003 | Build audit | `TODO` | `CLAUDE.md §4.2` |
| A-004 | Schema validation audit | `TODO` | `CLAUDE.md §4.2` |
| A-005 | Dependency security audit | `TODO` | `CLAUDE.md §4.5` |

---

## Phase 1 — Vercel Migration (P0/P1)

| ID | Task | Priority | Status | Spec |
|---|---|---|---|---|
| M-001 | Remove GH Pages base path from vite.config.js | P0 | `DONE` | `specs/MIGRATION.md#M-001` |
| M-002 | Add vercel.json with SPA rewrite rule | P0 | `DONE` | `specs/MIGRATION.md#M-002` |
| M-003 | Disable GitHub Actions deploy workflow | P1 | `DONE` | `specs/MIGRATION.md#M-003` |
| M-004 | Add .env.example with Vercel env vars | P1 | `DONE` | `specs/MIGRATION.md#M-004` |
| M-005 | Create /api/ directory and stub README | P2 | `DONE` | `specs/MIGRATION.md#M-005` |

---

## Phase 2 — GitHub Sync Backend (P2)

| ID | Task | Priority | Status | Spec |
|---|---|---|---|---|
| GS-001 | Create /api/github-repos.js | P2 | `DONE` | `specs/GITHUB_SYNC.md#GS-001` |
| GS-002 | Create /api/sync-projects.js | P2 | `DONE` | `specs/GITHUB_SYNC.md#GS-002` |

---

## Phase 3 — GitHub Sync Frontend (P3)

| ID | Task | Priority | Status | Spec |
|---|---|---|---|---|
| GS-003 | Create useGitHubSync hook | P3 | `DONE` | `specs/GITHUB_SYNC.md#GS-003` |
| GS-004 | Create GitHubSyncPanel component | P3 | `TODO` | `specs/GITHUB_SYNC.md#GS-004` |
| GS-005 | GitHub Webhook auto-redeploy | P3 | `TODO` | `specs/GITHUB_SYNC.md#GS-005` |

---

## Deferred / Future

| ID | Task | Reason |
|---|---|---|
| F-001 | Vercel Analytics integration | Nice to have, no spec yet |
| F-002 | Speed Insights integration | Nice to have, no spec yet |
| F-003 | Edge caching improvements | After GS-001 is validated in production |