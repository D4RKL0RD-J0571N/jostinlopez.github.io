<!--
  WINDSURF RULE CONFIGURATION
  File: .windsurf/rules/00-core.md
  Activation: Always On
  Description: Core project identity and SpecKit governance loop
-->

# Portfolio Project — Core Context

<project_identity>
- Repo: D4RKL0RD-J0571N/jostinlopez.github.io (Portfolio V2.5)
- Stack: React 18, Vite, TailwindCSS, Framer Motion, i18next (EN + ES)
- Migrating FROM: GitHub Pages TO: Vercel
- Governance: SpecKit v1 — all work is spec-driven and logged
- Primary agent: Claude Opus 4.6
</project_identity>

<critical_known_issues>
- vite.config.js has a hardcoded `base: '/jostinlopez.github.io/'` — must be removed for Vercel
- No vercel.json exists — SPA direct URLs will 404
- GitHub Actions deploy workflow must be disabled once Vercel is connected
- GitHub tokens must NEVER appear in src/ — only in api/ via process.env
</critical_known_issues>

<speckit_loop>
Before touching any file, follow this sequence:
1. READ the relevant spec in specs/
2. PLAN — update tasks/ACTIVE.md with what you're doing
3. BUILD — smallest meaningful increment
4. CHECK — self-review against .windsurf/rules/01-code-standards.md
5. LOG — append to audit/CHANGELOG.md

No undocumented changes. No spec = no code.
</speckit_loop>

<governance_files>
- AGENTS.md → role definitions and activation (@audit, @migrate, @sync, @fix)
- specs/MIGRATION.md → Vercel migration tasks M-001 to M-005
- specs/GITHUB_SYNC.md → GitHub Sync tasks GS-001 to GS-005
- tasks/BACKLOG.md → full task registry with priorities and status
- tasks/ACTIVE.md → current in-flight work (update as you go)
- audit/CHANGELOG.md → append-only change log (update when done)
- audit/DECISIONS.md → Architectural Decision Records
</governance_files>

<response_format>
Open every response with a status tag:
[AUDIT] | [IMPLEMENTING: task-id] | [BLOCKED: reason] | [REVIEW NEEDED] | [DONE: task-id]

Cite specs when making decisions: (specs/MIGRATION.md § M-001)
Surface trade-offs before choosing — never silently pick one path.
</response_format>