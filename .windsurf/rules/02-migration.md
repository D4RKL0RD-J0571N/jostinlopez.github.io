<!--
  WINDSURF RULE CONFIGURATION
  File: .windsurf/rules/02-migration.md
  Activation: Model Decision
  Description: Apply when working on Vercel migration, vite config, routing, deployment, env vars, or GitHub Actions
-->

# Vercel Migration Context

<migration_status>
Reference: specs/MIGRATION.md
Full task registry: tasks/BACKLOG.md (filter Phase 1)
</migration_status>

<p0_tasks_critical>
M-001 — Remove GitHub Pages base path
  File: vite.config.js
  Action: Remove or replace `base: '/jostinlopez.github.io/'`
  Verify: npm run build → dist/index.html assets start with /assets/ not /jostinlopez.github.io/assets/
  
M-002 — Add vercel.json
  File: vercel.json (create at project root)
  Content: { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  Verify: E2E test confirms direct navigation to /projects returns 200

Run npm run build after EACH P0 step. Gate: do not start P1 until both P0 pass.
</p0_tasks_critical>

<p1_tasks_high>
M-003 — Disable GitHub Actions deploy workflow
  File: .github/workflows/deploy.yml (or similar)
  Action: Add `if: false` to deploy job OR delete deploy job entirely
  Keep: CI lint/test job if it exists

M-004 — Create .env.example
  Variables required:
    GITHUB_TOKEN=your_github_pat_here
    VITE_GITHUB_USERNAME=D4RKL0RD-J0571N
    WEBHOOK_SECRET=your_webhook_secret_here
    VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...
</p1_tasks_high>

<p2_tasks_medium>
M-005 — Create api/ directory
  Create: api/README.md documenting route conventions
  This prepares for GitHub Sync serverless functions
</p2_tasks_medium>

<migration_complete_when>
1. M-001 and M-002 done and verified with npm run build
2. Vercel project connected to repo (document in audit/DECISIONS.md as ADR)
3. Live Vercel URL renders portfolio
4. Direct URL navigation works without 404
5. All tasks logged in audit/CHANGELOG.md
</migration_complete_when>