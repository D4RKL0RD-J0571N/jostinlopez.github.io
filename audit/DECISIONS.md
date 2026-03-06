# DECISIONS.md — Architectural Decision Records
**Project:** `jostinlopez.github.io`  
**Format:** ADR (Architectural Decision Record)

> Document every non-trivial technical decision here.
> ADRs are immutable once written — if a decision changes, add a new ADR that supersedes the old one.

---

## ADR Format

```
## ADR-[N] — [Title]
**Date:** YYYY-MM-DD  
**Status:** Proposed | Accepted | Superseded by ADR-[N]  
**Decider:** Opus 4.6 (@ROLE)

### Context
Why does this decision need to be made?

### Decision
What was decided?

### Consequences
What are the positive and negative outcomes?

### Alternatives Considered
What else was evaluated and why was it rejected?
```

---

<!-- ADRs will be appended below by the agent -->

## ADR-001 — Static Site Migration to Vercel
**Date:** 2026-03-06  
**Status:** Accepted  
**Decider:** Antigravity (@MIGRATOR)

### Context
The portfolio was originally hosted on GitHub Pages. This limited the project to static assets only, preventing the use of serverless functions for features like GitHub repository synchronization or secure API integrations.

### Decision
Migrate the entire hosting and deployment pipeline to Vercel. This includes:
1. Disabling GitHub Pages deployment workflows.
2. Configuring `vercel.json` for client-side routing.
3. Establishing an `api/` directory for Node.js serverless functions.

### Consequences
- **Positive:** Enables backend logic (Node.js), improved deployment speed, and automatic preview deployments.
- **Negative:** Adds dependency on Vercel platform; requires `vercel.json` maintenance for routing.

### Alternatives Considered
- **Netlify:** Similar features, but Vercel offers tighter integration with the Next.js/Vite ecosystem preferred for this stack.

---

## ADR-002 — Deferring GitHub Webhook Sync (GS-005)
**Date:** 2026-03-06  
**Status:** Accepted  
**Decider:** Antigravity (@SYNCER)

### Context
The `specs/GITHUB_SYNC.md` includes an optional step (GS-005) to implement a GitHub Webhook that triggers a Vercel redeploy when code is pushed.

### Decision
Defer the implementation of `api/webhook.js` and the corresponding GitHub configuration.

### Decision Logic
1. **Security**: Webhooks require a `VERCEL_DEPLOY_HOOK_URL` which must be generated in the Vercel dashboard. Setting this up now would require the user to perform manual steps during an automated agent session.
2. **Redundancy**: Vercel's native GitHub integration already triggers deployments on every push to the `main` branch. A custom webhook for 'redeploy' is only necessary if external data (not in the repo) changes.
3. **Complexity**: HMAC verification adds boilerplate that is unnecessary for the current MVP scope.

### Consequences
- **Positive:** Reduced code surface area and fewer secrets to manage.
- **Negative:** Site does not automatically "re-sync" if a new repo is created on GitHub without a code change (though the manual CMS sync button handles this).

### Alternatives Considered
- **Full Implementation**: Rejected due to the dependency on manual Vercel dashboard configuration.
