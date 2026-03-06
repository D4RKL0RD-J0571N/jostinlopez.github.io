# ACTIVE.md — In-Flight Work
> Agent updates this file at the start and end of every session.
> Only one task block should be "In Progress" at a time.

---

## Session — 2026-03-05 23:50
**Role:** ARCHITECT → MIGRATOR
**Task:** ARCH-001, M-001, M-002, M-003
**Spec:** AGENTS.md §Governance Files Reference, specs/MIGRATION.md
**Status:** Done

### Steps
- [x] ARCH-001: Move governance files to canonical locations
- [x] M-001: Remove GH Pages base path from vite.config.js
- [x] M-002: Add vercel.json with SPA rewrite rule
- [x] M-003: Disable GitHub Actions deploy workflow
- [x] Fix OG URL in index.html (migration cleanup)
- [x] Gate: `npm run build` passes ✅
- [x] Log all changes to audit/CHANGELOG.md

### Blockers
None

## Session End — 2026-03-05 23:55
**Completed:** ARCH-001, M-001, M-002, M-003, OG URL fix
**Pending:** M-004 (.env.example), M-005 (api/ directory)
**Next:** M-004 (recommended — completes P1 migration)
**Logged:** audit/CHANGELOG.md entries: ARCH-001, M-001, M-002, M-003, OG URL cleanup

---

## Session Log Template

Copy this block at the start of each session:

```
## Session — [DATE] [TIME]
**Role:** [AUDITOR | MIGRATOR | SYNCER | FIXER | ARCHITECT]
**Task:** [task-id, e.g. M-001]
**Spec:** [specs/FILE.md §section]
**Status:** In Progress

### Steps
- [ ] Step 1
- [ ] Step 2
- [ ] Log to audit/CHANGELOG.md

### Blockers
None / [description + what's needed to unblock]

## Session End — [DATE] [TIME]
**Completed:** [what finished]
**Pending:** [what didn't finish + why]
**Next:** [recommended task-id]
**Logged:** audit/CHANGELOG.md entry: "[DATE] — [task-id] ..."
```