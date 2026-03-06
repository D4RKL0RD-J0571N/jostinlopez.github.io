import { useState } from "react";

const PHASES = [
  {
    id: "phase1",
    label: "Phase 1",
    title: "Vercel Migration",
    subtitle: "Drop GitHub Pages, go live on Vercel",
    color: "#00D4FF",
    icon: "🚀",
    steps: [
      {
        id: "p1-1",
        title: "Fix vite.config.js — remove GitHub Pages base path",
        priority: "CRITICAL",
        detail: "GitHub Pages required a base path matching your repo name (e.g. /jostinlopez.github.io/). Vercel serves from root — leave it out or Vercel will 404 all assets.",
        code: `// vite.config.js — BEFORE (GitHub Pages)
export default defineConfig({
  base: '/jostinlopez.github.io/',   // ← DELETE THIS
  plugins: [react()],
});

// vite.config.js — AFTER (Vercel)
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist' },         // ← Vercel expects dist/
});`,
      },
      {
        id: "p1-2",
        title: "Add vercel.json for SPA routing",
        priority: "CRITICAL",
        detail: "Without this, any direct URL like /projects/nebula will return 404 because Vercel doesn't know to redirect to index.html. This is the #1 issue React SPAs hit on Vercel.",
        code: `// vercel.json — add to project root
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`,
      },
      {
        id: "p1-3",
        title: "Delete / disable the GitHub Actions deploy workflow",
        priority: "HIGH",
        detail: "Your .github/workflows/ has a gh-pages deploy action. Once you connect Vercel, it builds on every push automatically. Keep the workflow file but comment out the deploy steps to avoid conflicts — or delete it entirely.",
        code: `# .github/workflows/deploy.yml
# Option A: Delete the file entirely
# Option B: Comment out the deploy job:

# deploy:
#   runs-on: ubuntu-latest
#   steps:
#     - uses: actions/checkout@v3
#     - run: npm ci && npm run build
#     - uses: peaceiris/actions-gh-pages@v3  # ← Remove`,
      },
      {
        id: "p1-4",
        title: "Connect repo to Vercel",
        priority: "HIGH",
        detail: "Go to vercel.com → New Project → Import Git Repository → select D4RKL0RD-J0571N/jostinlopez.github.io. Vercel auto-detects Vite. Set Build Command: npm run build, Output Directory: dist.",
        code: `# Vercel auto-detects these — verify in dashboard:
Build Command:    npm run build
Output Directory: dist
Install Command:  npm install
Node.js Version:  18.x  (match your local)`,
      },
      {
        id: "p1-5",
        title: "Set up environment variables on Vercel",
        priority: "MEDIUM",
        detail: "You'll add a GITHUB_TOKEN for the repo sync feature (Phase 3). Add it now in Vercel → Settings → Environment Variables so it's ready.",
        code: `# In Vercel Dashboard → Settings → Environment Variables:
GITHUB_TOKEN=ghp_xxxxxxxxxxxx     # GitHub PAT (repo:read scope)
VITE_GITHUB_USERNAME=D4RKL0RD-J0571N

# In your .env.local (never commit this):
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxx`,
      },
    ],
  },
  {
    id: "phase2",
    label: "Phase 2",
    title: "Vercel API Routes",
    subtitle: "Unlock server-side features with Vercel Serverless Functions",
    color: "#A78BFA",
    icon: "⚡",
    steps: [
      {
        id: "p2-1",
        title: "Create api/ folder — Vercel serverless entry point",
        priority: "HIGH",
        detail: "Vercel automatically turns any file in /api into a serverless function. This lets you proxy GitHub API calls without exposing your token on the frontend, and enables webhook handling.",
        code: `# New folder structure:
portfolio/
├── api/
│   ├── github-repos.js      ← GET /api/github-repos
│   ├── sync-projects.js     ← POST /api/sync-projects
│   └── webhook.js           ← POST /api/webhook (GitHub push events)
├── src/
└── vercel.json`,
      },
      {
        id: "p2-2",
        title: "Create /api/github-repos.js — fetch your public repos",
        priority: "HIGH",
        detail: "This endpoint calls GitHub's REST API server-side, so your token never reaches the browser. Returns repos formatted to match your projects.json schema.",
        code: `// api/github-repos.js
export default async function handler(req, res) {
  const username = process.env.VITE_GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  const response = await fetch(
    \`https://api.github.com/users/\${username}/repos?sort=updated&per_page=50\`,
    { headers: { Authorization: \`Bearer \${token}\`, 'X-GitHub-Api-Version': '2022-11-28' } }
  );

  if (!response.ok) return res.status(response.status).json({ error: 'GitHub API failed' });

  const repos = await response.json();

  // Map to your projects.json shape
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

  res.setHeader('Cache-Control', 's-maxage=300');  // Cache 5min on CDN
  res.status(200).json(mapped);
}`,
      },
    ],
  },
  {
    id: "phase3",
    label: "Phase 3",
    title: "GitHub Repo Sync",
    subtitle: "Auto-import repos into your portfolio projects",
    color: "#34D399",
    icon: "🔄",
    steps: [
      {
        id: "p3-1",
        title: "Add useGitHubSync hook",
        priority: "HIGH",
        detail: "This hook fetches your live GitHub repos and compares them against projects.json. It surfaces new repos you haven't added yet and lets you one-click import them into the CMS editor.",
        code: `// src/hooks/useGitHubSync.js
import { useState, useEffect } from 'react';

export function useGitHubSync(existingProjects) {
  const [githubRepos, setGithubRepos] = useState([]);
  const [unsynced, setUnsynced] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRepos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/github-repos');
      const repos = await res.json();
      setGithubRepos(repos);

      // Find repos not yet in projects.json
      const existingIds = new Set(existingProjects.map(p => p.id));
      setUnsynced(repos.filter(r => !existingIds.has(r.id)));
    } finally {
      setLoading(false);
    }
  };

  return { githubRepos, unsynced, loading, fetchRepos };
}`,
      },
      {
        id: "p3-2",
        title: "Add GitHubSyncPanel component to CMS editor",
        priority: "HIGH",
        detail: "A UI panel inside your Ctrl+Shift+E editor that shows unsynced repos. Each card has a quick-import button that pre-fills the project form with data from GitHub, so you only fill in the gaps (screenshots, highlights, etc.).",
        code: `// src/components/GitHubSyncPanel.jsx
import { useGitHubSync } from '../hooks/useGitHubSync';

export function GitHubSyncPanel({ existingProjects, onImport }) {
  const { unsynced, loading, fetchRepos } = useGitHubSync(existingProjects);

  return (
    <div className="sync-panel">
      <div className="sync-header">
        <h3>GitHub Sync</h3>
        <button onClick={fetchRepos} disabled={loading}>
          {loading ? 'Fetching...' : '↻ Refresh from GitHub'}
        </button>
      </div>

      {unsynced.length === 0 && !loading && (
        <p className="sync-empty">All repos are synced ✓</p>
      )}

      {unsynced.map(repo => (
        <div key={repo.id} className="repo-card">
          <div className="repo-info">
            <strong>{repo.title}</strong>
            <span className="repo-lang">{repo.language}</span>
            <p>{repo.description}</p>
          </div>
          <button onClick={() => onImport(repo)} className="import-btn">
            + Import
          </button>
        </div>
      ))}
    </div>
  );
}`,
      },
      {
        id: "p3-3",
        title: "GitHub Webhook for auto-sync on push",
        priority: "MEDIUM",
        detail: "Optional but powerful: set up a GitHub webhook that pings your Vercel function on every repo push. The function can trigger a Vercel redeploy via deploy hook, so your portfolio always shows the latest repos without manual effort.",
        code: `// api/webhook.js — receives GitHub push events
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Verify GitHub signature
  const sig = req.headers['x-hub-signature-256'];
  const body = JSON.stringify(req.body);
  const expected = 'sha256=' + crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(body).digest('hex');

  if (sig !== expected) return res.status(401).json({ error: 'Invalid signature' });

  // Trigger Vercel redeploy
  await fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' });

  res.status(200).json({ ok: true });
}

// In GitHub: Settings → Webhooks → Add webhook
// Payload URL: https://your-domain.vercel.app/api/webhook
// Content type: application/json
// Events: Just the push event`,
      },
      {
        id: "p3-4",
        title: "GitHub Topics as project tags",
        priority: "LOW",
        detail: "Your repos have GitHub topics (like 'react', 'typescript', etc.). Map them automatically to your projects.json tags array on import — zero manual tagging for most projects.",
        code: `// In your import handler (extends p3-2):
function repoToProject(repo) {
  return {
    id: repo.id,
    title: repo.title,
    description: repo.description,
    repoUrl: repo.repoUrl,
    tags: repo.topics,            // ← GitHub topics become tags
    tech: inferTechStack(repo),   // ← language + topics → tech array
    stars: repo.stars,
    featured: repo.stars > 5,     // ← auto-feature popular repos
    // You fill in manually:
    // liveUrl, images, highlights, status
  };
}

function inferTechStack(repo) {
  const stack = [];
  if (repo.language) stack.push(repo.language);
  const techTopics = ['react', 'vue', 'typescript', 'python', 'nodejs', 'tailwind'];
  return [...stack, ...repo.topics.filter(t => techTopics.includes(t))];
}`,
      },
    ],
  },
  {
    id: "phase4",
    label: "Phase 4",
    title: "Polish & Extras",
    subtitle: "Nice-to-haves that leverage Vercel's platform",
    color: "#FB923C",
    icon: "✨",
    steps: [
      {
        id: "p4-1",
        title: "Preview deployments for every branch",
        priority: "LOW",
        detail: "Vercel automatically deploys every branch and PR to a unique URL (e.g. portfolio-git-feature-branch.vercel.app). Test new features live before merging to main.",
        code: `# Zero config — this works automatically once Vercel is connected.
# Each push to any branch → new preview URL
# Push to main → updates production URL`,
      },
      {
        id: "p4-2",
        title: "Vercel Analytics + Speed Insights",
        priority: "LOW",
        detail: "Free on Vercel's hobby tier. Add two script tags to index.html and get real visitor data + Core Web Vitals. Better than nothing for a portfolio.",
        code: `// index.html — add before </body>
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
<script defer src="/_vercel/speed-insights/script.js"></script>

// OR install via npm:
// npm install @vercel/analytics @vercel/speed-insights
// Then in main.jsx:
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
inject();
injectSpeedInsights();`,
      },
      {
        id: "p4-3",
        title: "Cache GitHub API responses at the edge",
        priority: "LOW",
        detail: "Add Cache-Control headers in your API routes so Vercel's CDN caches GitHub responses. Cuts load time and avoids hitting GitHub's 60 req/hour unauthenticated limit.",
        code: `// Already included in /api/github-repos.js (Phase 2):
res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
// s-maxage=300 → CDN caches for 5 minutes
// stale-while-revalidate → serve stale while fetching fresh in background`,
      },
    ],
  },
];

const PRIORITY_COLORS = {
  CRITICAL: { bg: "#FF4444", text: "#fff" },
  HIGH: { bg: "#FF8C00", text: "#fff" },
  MEDIUM: { bg: "#A78BFA", text: "#fff" },
  LOW: { bg: "#4B5563", text: "#9CA3AF" },
};

export default function MigrationPlan() {
  const [activePhase, setActivePhase] = useState("phase1");
  const [expandedStep, setExpandedStep] = useState(null);
  const [completed, setCompleted] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);

  const phase = PHASES.find((p) => p.id === activePhase);
  const totalSteps = PHASES.flatMap((p) => p.steps).length;
  const completedCount = completed.size;

  function toggleComplete(id) {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function copyCode(id, code) {
    navigator.clipboard.writeText(code.trim());
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  }

  return (
    <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", background: "#0A0A0F", minHeight: "100vh", color: "#E2E8F0" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1E2A3A", padding: "28px 32px", background: "linear-gradient(135deg, #0D1117 0%, #0A0A1A 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00D4FF", boxShadow: "0 0 12px #00D4FF" }} />
          <span style={{ fontSize: 11, letterSpacing: 3, color: "#4A6785", textTransform: "uppercase" }}>Portfolio Migration Playbook</span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: "#F0F6FF", letterSpacing: -0.5 }}>
          GitHub Pages → Vercel + GitHub Sync
        </h1>
        <p style={{ margin: "8px 0 0", color: "#64748B", fontSize: 13 }}>
          jostinlopez.github.io · React 18 + Vite + TailwindCSS
        </p>
        {/* Progress */}
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 4, background: "#1E2A3A", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${(completedCount / totalSteps) * 100}%`, height: "100%", background: "linear-gradient(90deg, #00D4FF, #A78BFA)", transition: "width 0.4s ease", borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 12, color: "#4A6785", whiteSpace: "nowrap" }}>
            {completedCount}/{totalSteps} steps
          </span>
        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 140px)" }}>
        {/* Sidebar */}
        <div style={{ width: 200, borderRight: "1px solid #1E2A3A", padding: "24px 0", flexShrink: 0, overflowY: "auto" }}>
          {PHASES.map((p) => {
            const phaseCompleted = p.steps.filter((s) => completed.has(s.id)).length;
            const isActive = activePhase === p.id;
            return (
              <button
                key={p.id}
                onClick={() => { setActivePhase(p.id); setExpandedStep(null); }}
                style={{
                  width: "100%", textAlign: "left", padding: "14px 20px",
                  background: isActive ? "#0D1A2A" : "transparent",
                  border: "none", borderLeft: isActive ? `3px solid ${p.color}` : "3px solid transparent",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 4 }}>{p.icon}</div>
                <div style={{ fontSize: 11, color: p.color, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{p.label}</div>
                <div style={{ fontSize: 12, color: isActive ? "#E2E8F0" : "#64748B", fontWeight: 600, lineHeight: 1.3 }}>{p.title}</div>
                <div style={{ marginTop: 6, fontSize: 11, color: "#4A6785" }}>{phaseCompleted}/{p.steps.length} done</div>
              </button>
            );
          })}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 28 }}>{phase.icon}</span>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: phase.color }}>{phase.title}</h2>
            </div>
            <p style={{ margin: 0, color: "#64748B", fontSize: 13 }}>{phase.subtitle}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {phase.steps.map((step) => {
              const isExpanded = expandedStep === step.id;
              const isDone = completed.has(step.id);
              const pc = PRIORITY_COLORS[step.priority];

              return (
                <div
                  key={step.id}
                  style={{
                    border: `1px solid ${isDone ? "#1A3A2A" : "#1E2A3A"}`,
                    borderRadius: 8,
                    background: isDone ? "#0A1A12" : "#0D1117",
                    overflow: "hidden",
                    transition: "all 0.2s",
                    opacity: isDone ? 0.7 : 1,
                  }}
                >
                  {/* Step header */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}
                    onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleComplete(step.id); }}
                      style={{
                        width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                        border: `2px solid ${isDone ? "#34D399" : "#2D3748"}`,
                        background: isDone ? "#34D399" : "transparent",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: 11, fontWeight: 700,
                      }}
                    >
                      {isDone ? "✓" : ""}
                    </button>

                    <span
                      style={{
                        fontSize: 10, letterSpacing: 1, textTransform: "uppercase",
                        padding: "2px 7px", borderRadius: 3,
                        background: pc.bg, color: pc.text, flexShrink: 0,
                      }}
                    >
                      {step.priority}
                    </span>

                    <span style={{ fontSize: 13, fontWeight: 600, color: isDone ? "#4A6785" : "#CBD5E1", flex: 1, textDecoration: isDone ? "line-through" : "none" }}>
                      {step.title}
                    </span>

                    <span style={{ color: "#4A6785", fontSize: 12, transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
                  </div>

                  {/* Expanded */}
                  {isExpanded && (
                    <div style={{ borderTop: "1px solid #1E2A3A", padding: "16px 16px 16px 48px" }}>
                      <p style={{ margin: "0 0 14px", color: "#94A3B8", fontSize: 13, lineHeight: 1.7 }}>
                        {step.detail}
                      </p>
                      <div style={{ position: "relative" }}>
                        <pre style={{
                          background: "#060810", border: "1px solid #1E2A3A", borderRadius: 6,
                          padding: "14px 16px", fontSize: 11.5, lineHeight: 1.7,
                          color: "#7DD3FC", overflowX: "auto", margin: 0,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}>
                          {step.code.trim()}
                        </pre>
                        <button
                          onClick={() => copyCode(step.id, step.code)}
                          style={{
                            position: "absolute", top: 8, right: 8,
                            background: copiedId === step.id ? "#1A3A2A" : "#0D1A2A",
                            border: `1px solid ${copiedId === step.id ? "#34D399" : "#2D3748"}`,
                            borderRadius: 4, color: copiedId === step.id ? "#34D399" : "#4A6785",
                            padding: "3px 10px", fontSize: 10, cursor: "pointer", letterSpacing: 0.5,
                          }}
                        >
                          {copiedId === step.id ? "COPIED" : "COPY"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}