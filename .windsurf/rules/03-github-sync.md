<!--
  WINDSURF RULE CONFIGURATION
  File: .windsurf/rules/03-github-sync.md
  Activation: Model Decision
  Description: Apply when working on GitHub API integration, repo sync, CMS panel, serverless functions, or webhooks
-->

# GitHub Sync Feature Context

<feature_overview>
Reference: specs/GITHUB_SYNC.md
Prerequisite: specs/MIGRATION.md P0 + P1 complete

Goal: CMS editor (Ctrl+Shift+E) gains a GitHub Sync Panel that fetches public repos,
diffs against projects.json, and surfaces unsynced repos for one-click import.
</feature_overview>

<architecture>
Browser CMS Panel
  → GET /api/github-repos (Vercel serverless)
  → GitHub REST API v2022-11-28 (authenticated server-side)
  → Returns repos mapped to projects.json importable shape

Token rule: GITHUB_TOKEN stays in process.env inside /api/ ONLY.
Never in src/, never in VITE_ variables.
</architecture>

<backend_first>
GS-001 — api/github-repos.js
  Method: GET
  Auth: process.env.GITHUB_TOKEN
  Filter: no forks (fork: true), no private repos
  Sort: updated_at descending, limit 50
  Cache: s-maxage=300, stale-while-revalidate
  Response shape:
    { id, title, description, repoUrl, stars, language, topics, updatedAt }
  
  Validate with curl before building any frontend.

GS-002 — api/sync-projects.js (optional write-back)
  Method: POST
  Purpose: Validate incoming project payload + return merged projects.json
  Note: Does NOT write to filesystem (Vercel functions are read-only at runtime)
  Returns: 400 with field errors on invalid payload, merged JSON array on success
</backend_first>

<frontend_second>
GS-003 — src/hooks/useGitHubSync.js
  Interface: { githubRepos, unsynced, loading, error, fetchRepos }
  Key: fetch is NOT auto on mount — explicitly triggered by fetchRepos()
  unsynced = repos where no existing project has a matching id field
  Requires unit tests (Vitest)

GS-004 — src/components/GitHubSyncPanel.jsx
  Placement: Tab inside existing CMS editor
  States: Idle | Loading | Error | All synced | Has unsynced repos
  Import mapping: repo → project draft
    id: repo.name
    title: repo.name.replace(/-/g, ' ')
    description: repo.description ?? ''
    repoUrl: repo.html_url
    tags: repo.topics
    tech: inferTechStack(repo)  ← language + known-tech topics
    stars: repo.stargazers_count
    featured: repo.stargazers_count > 5
    (liveUrl, images, highlights left blank for manual entry)
  Accessibility: fully keyboard-navigable
  Requires E2E test (Playwright)

GS-005 — api/webhook.js (optional)
  Verify x-hub-signature-256 before any processing
  On valid push event: POST to process.env.VERCEL_DEPLOY_HOOK_URL
  Document setup procedure in audit/DECISIONS.md
</frontend_second>

<github_sync_complete_when>
1. GS-001 curl-tested and returning valid JSON in production
2. GS-003 hook unit-tested
3. GS-004 panel E2E tested end-to-end (refresh → import one repo)
4. Token handling reviewed against .windsurf/rules/01-code-standards.md §env_vars
5. GS-005 done OR explicitly deferred with reason in audit/DECISIONS.md
</github_sync_complete_when>