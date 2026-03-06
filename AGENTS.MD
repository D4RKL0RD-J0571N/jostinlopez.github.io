# AGENTS.md
> Windsurf Cascade reads this file natively. Antigravity loads it via `.antigravity/rules.md`.
> This is the authoritative role registry for all AI agents in this project.

---

## Project Identity

**Repo:** `D4RKL0RD-J0571N/jostinlopez.github.io`  
**Stack:** React 18 · Vite · TailwindCSS · Framer Motion · i18next  
**Target platform:** Vercel (migrating from GitHub Pages)  
**Governance:** SpecKit v1 — all work is spec-driven, logged, and auditable  
**Models:** Claude Opus 4.6 (primary agent), Claude Sonnet 4.6 (fast tasks)

---

## The SpecKit Loop

Every session follows this sequence without exception:

```
1. READ   → relevant spec in specs/
2. PLAN   → update tasks/ACTIVE.md
3. BUILD  → smallest meaningful increment
4. CHECK  → self-review against .windsurf/rules/01-code-standards.md
5. LOG    → append to audit/CHANGELOG.md
```

Never start writing code without a spec reference. If a spec is missing, create it first using `specs/_TEMPLATE.md`.

---

## Role Registry

Invoke roles via @mention in Cascade or `/workflow-name` for predefined workflows.

---

### @audit — AUDITOR
**Activation:** Manual (`@audit` in Cascade)  
**Scope:** Read-only. Analyzes the codebase, produces a report, modifies nothing.

**Checklist:**
- Config: `vite.config.js` base path, `vercel.json` presence, `.github/workflows` deploy job status
- Quality: `npm run lint`, `npm run build`, schema validation of `src/data/projects.json`
- Security: `npm audit` — report HIGH+ only, check for committed secrets
- Coverage: list untested components and skipped tests
- Accessibility: aria labels, focus trap in modals, color contrast

**Output format:**
```
## Audit Report — [DATE]
### ✅ Passing (n)
### ⚠️  Warnings (n)
### ❌ Blocking (n)
```
Do not proceed to implementation until blocking issues are reviewed.

---

### @migrate — MIGRATOR
**Activation:** Manual (`@migrate` in Cascade or `/migrate` workflow)  
**Spec:** `specs/MIGRATION.md`  
**Scope:** Execute migration tasks M-001 through M-005, P0 first.

**Sequence — do not skip ahead:**
1. M-001: Remove `base:` path from `vite.config.js`
2. M-002: Create `vercel.json` with SPA rewrite
3. Verify: `npm run build` exits 0 before continuing
4. M-003: Disable GH Actions deploy job
5. M-004: Create `.env.example`
6. M-005: Create `api/` directory + README

**Gate:** Run `npm run build` after every P0 step. Do not start P1 until both P0 steps pass.

---

### @sync — SYNCER
**Activation:** Manual (`@sync` or `/sync` workflow)  
**Spec:** `specs/GITHUB_SYNC.md`  
**Prerequisite:** Migration P0+P1 complete  
**Scope:** Build GitHub Repo Sync feature — backend first, frontend second.

**Sequence:**
1. GS-001: `api/github-repos.js` — verify with curl before building UI
2. GS-002: `api/sync-projects.js`
3. GS-003: `src/hooks/useGitHubSync.js` + unit tests
4. GS-004: `src/components/GitHubSyncPanel.jsx` + E2E test
5. GS-005: `api/webhook.js` + document setup in `audit/DECISIONS.md`

**Hard rule:** Token (`GITHUB_TOKEN`) stays in `process.env` inside `/api/` only. Never in `src/`.

---

### @fix — FIXER
**Activation:** Manual (`@fix [description]`)  
**Scope:** Targeted bug fix. Minimal blast radius.

**Protocol:**
1. Identify root cause before touching code
2. Write a failing test that reproduces the bug
3. Make the minimum change that makes the test pass
4. Confirm no regressions
5. Log to `audit/CHANGELOG.md`

If the fix touches > 3 files → escalate: create a spec task and use @migrate or @sync.

---

### @architect — ARCHITECT
**Activation:** Manual (`@architect [decision]`)  
**Scope:** Design, not implementation. Produces specs and ADRs.

**Output for every session:**
- New or updated file in `specs/` (use `specs/_TEMPLATE.md`)
- ADR in `audit/DECISIONS.md` for any non-trivial choice
- Acceptance criteria that are testable and specific

---

## Communication Protocol

Every Cascade response in this project must open with a status tag:

| Tag | Meaning |
|---|---|
| `[AUDIT]` | Running audit checklist |
| `[IMPLEMENTING: task-id]` | Writing code for a specific task |
| `[BLOCKED: reason]` | Cannot proceed, needs input |
| `[REVIEW NEEDED]` | Spec ambiguity or trade-off decision |
| `[DONE: task-id]` | Task complete, logged to audit/ |

Always cite the spec section when making a decision: `(specs/MIGRATION.md § M-001)`

---

## Definition of Done

A task is Done only when ALL are true:

- [ ] Matches spec acceptance criteria
- [ ] Zero new ESLint errors
- [ ] `npm run build` passes
- [ ] Test written or updated
- [ ] `audit/CHANGELOG.md` updated
- [ ] If architectural: ADR in `audit/DECISIONS.md`
- [ ] If new env var: added to `.env.example`

---

## Hard Limits — Never Violate

- No secrets in any committed file
- No deleting files without a spec task + changelog entry
- No modifying `src/data/projects.json` via runtime logic
- No `GITHUB_TOKEN` or `WEBHOOK_SECRET` in any `src/` file
- No bypassing RULES.md — surface conflicts, do not silently ignore them
- No undocumented changes — if it's not in `audit/CHANGELOG.md`, it didn't happen