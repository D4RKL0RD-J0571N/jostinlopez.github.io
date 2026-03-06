# GitHub Sync Workflow
# Trigger: /sync in Cascade
# Role: SYNCER
# Spec: specs/GITHUB_SYNC.md
# Prerequisite: Migration P0 + P1 complete, api/ directory exists

You are now in SYNCER mode. Build the GitHub Repo Sync feature.
Backend first — do not touch frontend until GS-001 is curl-validated.

---

## Pre-flight Check

1. Confirm `api/` directory exists (M-005 done)
2. Confirm `vercel.json` exists (M-002 done)
3. Confirm `GITHUB_TOKEN` is documented in `.env.example`
4. Read `specs/GITHUB_SYNC.md` in full
5. Announce: `[IMPLEMENTING: GS-001] Starting GitHub Sync backend`

---

## Backend Phase (P2)

### GS-001 — Create api/github-repos.js

```js
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  
  const username = process.env.VITE_GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;
  
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=50`,
      { headers: { Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28' } }
    );
    
    if (!response.ok) return res.status(response.status).json({ error: 'GitHub API failed' });
    
    const repos = await response.json();
    const mapped = repos
      .filter(r => !r.fork && !r.private)
      .map(repo => ({
        id: repo.name,
        title: repo.name.replace(/-/g, ' '),
        description: repo.description || '',
        repoUrl: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
        topics: repo.topics,
        updatedAt: repo.updated_at,
      }));
    
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.status(200).json(mapped);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

**Validate:** After deploying to Vercel, run:
`curl https://[your-vercel-url]/api/github-repos`
Confirm valid JSON array before proceeding.

Log to `audit/CHANGELOG.md`, mark GS-001 `DONE` in `tasks/BACKLOG.md`.

### GS-002 — Create api/sync-projects.js

Implement POST handler that:
- Validates incoming project payload against `src/config/projects.schema.json`
- Returns `400` with field-level errors on invalid payload
- Returns merged JSON (existing projects + new) on success
- Does NOT write to filesystem (Vercel functions are stateless)

Log and mark done.

---

## Frontend Phase (P3)

Only begin after GS-001 is curl-validated in production.

### GS-003 — Create src/hooks/useGitHubSync.js

Interface:
```js
const { githubRepos, unsynced, loading, error, fetchRepos } = useGitHubSync(existingProjects);
```
- fetch is NOT auto on mount — triggered explicitly by fetchRepos()
- unsynced = repos with no matching id in existingProjects
- Write Vitest unit tests alongside the hook

### GS-004 — Create src/components/GitHubSyncPanel.jsx

Placement: tab inside CMS editor (Ctrl+Shift+E)
Required UI states: Idle | Loading | Error | All synced | Has unsynced repos

Import mapping (repo → project draft):
- id: repo.name
- title: repo.name.replace(/-/g, ' ')
- description: repo.description ?? ''
- repoUrl: repo.html_url
- tags: repo.topics (display max 5, show "+N more")
- tech: language + known-tech topics
- featured: stars > 5
- Leave blank: liveUrl, images, highlights, status

Must be fully keyboard-navigable. Write Playwright E2E test.

### GS-005 — Create api/webhook.js (optional)

If implementing:
1. Verify x-hub-signature-256 with crypto.createHmac
2. Trigger VERCEL_DEPLOY_HOOK_URL on valid push event
3. Document GitHub webhook setup in `audit/DECISIONS.md`
If deferring: add a note in `audit/DECISIONS.md` explaining why.

---

## Completion

```
[DONE: GITHUB-SYNC]
## GitHub Sync Complete — [DATE]
- GS-001: ✅ /api/github-repos curl-validated
- GS-002: ✅ /api/sync-projects implemented
- GS-003: ✅ useGitHubSync hook + unit tests
- GS-004: ✅ GitHubSyncPanel + E2E test
- GS-005: ✅ Done / ⏸ Deferred: [reason]
```