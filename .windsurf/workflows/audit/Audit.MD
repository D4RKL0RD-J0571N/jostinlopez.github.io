# Audit Workflow
# Trigger: /audit in Cascade
# Role: AUDITOR (read-only)

You are now in AUDITOR mode. Your role is read-only analysis. Do not modify any files.

Begin the full project audit and produce a structured report. Work through each section below sequentially.

---

## Step 1 — Configuration Audit

Check each item and mark ✅ / ⚠️ / ❌:

- `vite.config.js` — is the `base:` path removed or set to `/`?
- `vercel.json` — does it exist with a SPA catch-all rewrite rule?
- `.github/workflows/` — is the deploy job disabled or removed?
- `package.json` — are critical dependencies pinned (no `^` on Vite, React)?
- `.gitignore` — does it include `.env.local` and `dist/`?
- `.env.example` — does it exist with all four required variables?

## Step 2 — Code Quality Audit

- Run: `npm run lint` → report all errors and warnings
- Run: `npm run build` → confirm zero errors
- Validate `src/data/projects.json` against `src/config/projects.schema.json`
- List any design token keys used in components that are missing from `src/config/design-tokens.json`

## Step 3 — Test Coverage Audit

- List all files in `e2e/`
- List all Vitest unit test files
- Identify components and hooks with no test coverage
- Flag any `test.skip` or `xit` calls with their location

## Step 4 — Security Audit

- Run: `npm audit` → report HIGH and CRITICAL only
- Check every file in `src/` for any string matching `ghp_`, `Bearer `, `token`, `secret` (secrets check)
- Confirm `api/` directory exists (if migration is done) with no hardcoded credentials

## Step 5 — Accessibility Audit

- Identify interactive elements (buttons, links, inputs) missing `aria-label` or visible text
- Confirm focus trap is implemented in modal components
- Flag any `<img>` missing `alt` attributes

---

## Output Format

Produce the report in this exact structure:

```
## Audit Report — [TODAY'S DATE]

### ✅ Passing ([n] items)
- item
- item

### ⚠️ Warnings ([n] items)  
- item — [recommended action]

### ❌ Blocking Issues ([n] items)
- issue — [required action before implementation can proceed]

### Recommended Next Task
Based on this audit, the next task to address is: [task-id from tasks/BACKLOG.md]
```

After producing the report, update `audit/CHANGELOG.md` with a one-line entry:
`### [DATE] — A-001 Initial audit complete — [n] blocking, [n] warnings`