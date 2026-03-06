# CMS Persistence & Auth Specification (P4)
# Role: ARCHITECT / PERSISTER
# Spec: specs/CMS_PERSISTENCE.md

This phase adds security and remote persistence to the portfolio CMS by leveraging Vercel's serverless functions and the GitHub API. This eliminates the need for manual JSON file edits and ensures the CMS is protected.

---

## Technical Design

### Authentication (CP-001)
- **Mechanism**: Simple password-based gate using `CMS_ADMIN_PASSWORD` environment variable.
- **Workflow**: 
  1. User attempts to open CMS via `Ctrl+Shift+E`.
  2. If a session token isn't in `localStorage`, show an Auth Modal.
  3. UI pings `/api/auth` with the password.
  4. Backend verifies and returns a signature (HMAC of a timestamp).
  5. UI stores this as `cms_session`. All further CMS API calls must include this in the `Authorization` header.

### Remote Persistence (CP-002)
- **Mechanism**: The CMS will commit changes directly to the GitHub repository using the `GITHUB_TOKEN`.
- **Backend API**: `/api/save-content` (POST).
  - Validates session token.
  - Fetches current `sha` for `src/data/projects.json`.
  - Commits updated JSON with a message: `cms(sync): update site content from UI`.
- **Frontend Integration**: Update `ContentContext.js` or the "Persist Changes" button in the CMS editor to trigger this API.

---

## Backlog Tasks

### CP-001 — Secure the CMS Entry
- [ ] Add `CMS_ADMIN_PASSWORD` to `.env.example`
- [ ] Create `/api/auth.js` for password validation
- [ ] Create `AuthModal.jsx` component for the CMS gate
- [ ] Wrap `CMSProjectEditor.jsx` with the auth gate check

### CP-002 — Automated Git Persistence
- [ ] Create `/api/save-content.js` to commit JSON files back to GitHub
- [ ] Integrate the "Save" button with this new API
- [ ] Add loading/success feedback to the persistence UI

---

## Completion Criteria
- [ ] CMS requires a password to open.
- [ ] Clicking "Save" in the CMS updates the site on GitHub and triggers a Vercel redeploy.
- [ ] Zero manual `git commit` or JSON editing needed for content updates.
