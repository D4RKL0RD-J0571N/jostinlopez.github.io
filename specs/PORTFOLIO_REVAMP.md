# PORTFOLIO_REVAMP.md — Portfolio Overhaul & High-Impact Showcase Spec
**Status:** `IN PROGRESS`  
**Owner:** Opus 4.6 (@architect / @sync)  
**Priority:** P0  
**Depends on:** Nothing

---

## Context

The personal portfolio at `jostinlopez.github.io` currently has solid infrastructure (Vite, React 19, Tailwind, Framer Motion, i18n, CMS with GitHub sync), but lacks high-impact real-world content:
1. Flagship projects like **ReconcileAI** (3-Way Supply Chain Inventory Reconciliation & Goods Receipt Auditor) are missing.
2. Unity & Game Systems architecture projects (Pure C# domain, SDD, custom editor tooling, ELMS) are understated or use broken 0-byte placeholders.
3. The Hero and About sections use generic titles and an avatar pointing to a broken `/avatar.jpg` falling back to `placehold.co`.
4. The Gallery section (`Gallery.jsx`) contains dummy placeholder cards ("Cyberpunk Character", "Game UI Mockup") with a disclaimer that weakens credibility.
5. The Timeline lists non-technical survival roles alongside engineering studies without highlighting core technical milestones.

The goal is to transform the site into a high-impact, professional technical showcase highlighting three distinct pillars:
- **Game Architecture & Engine Systems** (C#, Unity, ECS/Domain-Infrastructure, Editor Tooling)
- **Operations Automation & AI Backend** (Python, ReconcileAI, Human-in-the-Loop CRM Orchestrator, Local LLMs)
- **Modern Web Architecture** (React 19, TypeScript, Next.js, Data-Driven CMS)

---

## Architecture & Data Flow

```
[src/data/projects.json] (Validated with projects.schema.json & Zod)
   ├── Category: "Operations & Backend" (ReconcileAI, Enterprise AI CRM, Local AI Companion)
   ├── Category: "Game Systems & Architecture" (Unity SDD Architecture, ELMS, Visual Novel Engine)
   └── Category: "Web Architecture & Tools" (NebulaView, ResourceManager, Portfolio CMS)

[Components]
   ├── Hero.jsx (Positioning across the 3 pillars, refined copy in ES/EN)
   ├── About.jsx (Avatar fallback, core engineering competencies, stats)
   ├── Projects.jsx (Filter by pillar, engineering metrics, architecture modal)
   ├── TechnicalShowcase.jsx (Replaces fake Gallery with interactive diagrams & engine demos)
   └── Timeline.jsx (Reframed as Technical & Systems Engineering Milestones)
```

---

## Tasks

### Phase 1 — Data Registry & High-Impact Projects (P0)

#### [PR-001] · ReconcileAI Integration & Project Registry Overhaul
**File(s):**
- `src/data/projects.json` (modify)
- `src/config/projects.schema.json` (modify if category enums need alignment)
- `src/locales/en/common.json` (modify)
- `src/locales/es/common.json` (modify)
- `src/utils/validation.js` (modify to support valid asset paths / relative URLs)
- `src/utils/validation.test.js` (update tests)

**Acceptance Criteria:**
- [ ] Add `reconcile-ai` as the #1 flagship enterprise operations project with real metrics (100% curve validation, self-healing Excel VBA, 10s copy-paste strip, zero-install portable distro).
- [ ] Elevate `crm-orchestrator`, `nebula-view`, `unity-sdd-framework` / `3d-learning`, `elms`, and `resourcemanager`.
- [ ] Ensure all project tags, categories, descriptions and links are accurate and pass schema validation.
- [ ] Zero ESLint errors and `npx vitest run` passes.

---

### Phase 2 — Identity, Positioning & Hero/About Revamp (P1)

#### [PR-002] · Hero & About Identity Refactoring
**File(s):**
- `src/components/Hero.jsx` (modify)
- `src/components/About.jsx` (modify)
- `src/locales/en/common.json` (modify)
- `src/locales/es/common.json` (modify)
- `public/assets/` (add SVG vector portrait / fallback avatar so no external broken link occurs)

**Acceptance Criteria:**
- [ ] Hero titles rotate: "Systems & Game Architect", "Backend & Operations Automation", "Full-Stack Web Engineer".
- [ ] Subtitle and copy convey authoritative engineering mastery.
- [ ] Avatar in About renders a clean vector / fallback avatar without broken images.
- [ ] Core competencies align with the 3 pillars.

---

### Phase 3 — Technical Showcase & Timeline Reframing (P2)

#### [PR-003] · Replace Fake Gallery with Technical Systems Showcase
**File(s):**
- `src/components/Gallery.jsx` or `TechnicalShowcase.jsx` (modify/replace)
- `src/data/gallery.json` or `showcase.json` (modify)
- `src/locales/en/common.json` (modify)
- `src/locales/es/common.json` (modify)

**Acceptance Criteria:**
- [ ] Replace fake placeholder cards with real technical artifacts:
  - ReconcileAI 3-Way Reconciliation Pipeline (Architecture diagram / interactive dataflow)
  - Enterprise CRM Human-in-the-Loop Protocol (WebSocket state machine)
  - Unity Spec-Driven Architecture (Domain vs Infrastructure separation)
  - ELMS Procedural Echo-Location & Shader System
- [ ] Remove the disclaimer "Obras visuales y experimentos. Se poblará con activos reales."

#### [PR-004] · Reframe Timeline as Engineering Milestones
**File(s):**
- `src/data/timeline.json` (modify)
- `src/locales/en/common.json` (modify)
- `src/locales/es/common.json` (modify)

**Acceptance Criteria:**
- [ ] Reframe experience into software & systems engineering milestones.
- [ ] Highlight business value, scaling, and autonomous tooling creation.

---

## Completion Criteria
1. Tasks PR-001 through PR-004 are `DONE`.
2. `npm run build` exits 0.
3. `npm run lint` exits 0.
4. `npx vitest run` passes 100%.
5. Logged in `audit/CHANGELOG.md` and active task in `ACTIVE.md`.
