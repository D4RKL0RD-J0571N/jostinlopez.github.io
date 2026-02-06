# The Modern Web Engineering Playbook: Design & Quality Standards

This document summarizes the core architectural, design, and accessibility patterns established during the J0571N Portfolio project. These standards can be applied to any high-performance React/Vite application.

---

## 1. Data Integrity & "Schema-First" Architecture

**The Problem**: Reading JSON or LocalStorage data is risky and can lead to runtime crashes ("undefined is not a function").
**The Solution**: Always validate data at the "border" of the application using Zod.

- **Pattern**: Create a central `validation.js` with schemas for every entity.
- **Implementation**: Before saving to LocalStorage or state, run `schema.safeParse()`.
- **Benefit**: Provides clear, descriptive errors during development and prevents corrupt data from breaking the UI.

## 2. Accessibility (A11y) as a Functional Requirement

**The Standards**:
- **Semantic Actions**: Never use `onClick` on a `div` or `span`. Use `<button>` for actions and `<a>` for navigation.
- **Form UX**: 
  - Wrap inputs in `<form>` to enable "Press Enter to Submit".
  - Use `htmlFor` on labels and `id` on inputs.
  - Implement `isSubmitting` states to disable buttons and prevent double-clicks.
  - Add `autoComplete` and `spellCheck={false}` where appropriate.
- **Focus Management**: 
  - Use `:focus-visible` with a high-contrast `box-shadow` instead of default browser outlines.
  - Ensure reordering or complex menus support **Keyboard Navigation** (Arrow keys).

## 3. High-Performance Motion & CSS

**The Standards**:
- **Standardized Durations**: Interaction animations (hover, click, toggle) should be **≤ 200ms**.
- **Natural Physics**: Entrance animations should scale from `0.95` or `0.85`, never from `0` (which feels robotic).
- **Reduced Motion**: Respect system preferences using `@media (prefers-reduced-motion: reduce)`.
- **Fluid Typography**: Use `clamp()` for headings to ensure they scale perfectly between mobile and desktop without ad-hoc media queries.
  - *Example*: `font-size: clamp(2rem, 5vw, 4rem);`
- **Render Quality**: Apply `-webkit-font-smoothing: antialiased` globally.

## 4. Build Optimization & Bundle Hygiene

**The Standards**:
- **Manual Chunking**: Use Vite/Rollup `manualChunks` to separate heavy libraries (e.g., `framer-motion`, `lucide-react`) from the main logic. This improves caching and LCP.
- **Asset Pipeline**: Prefer `.webp` formats and implement `srcset` for responsive images.
- **Asset Smoothing**: Use `text-rendering: optimizeLegibility`.

## 5. Automated Quality Assurance

**The Standards**:
- **Linting**: Keep `eslint` strict. Customize rules to treat unused variables as errors but white-list patterns like `motion` or `_`.
- **Unit Testing (Vitest)**: Test logic, especially data transformation and validation schemas.
- **E2E Testing (Playwright)**: Test "Golden Paths" (e.g., Form Submission, CMS Editing).
- **CI Gating**: Use GitHub Actions to block merging if Lint, Test, or Build fails.

## 6. Developer Experience (DX) & Documentation

**The Standards**:
- **Cords/Context**: Use a central `Context` to manage complex global state, but keep it validated by schemas.
- **Playbooks**: Maintain a `docs/UI-Guidelines.md` for team onboarding.
- **Clear Feedback**: Implement a global `Toast` or `Notification` system for async success/error feedback.

---

### Implementation Checklist for Future Projects:
1. [ ] Set up `eslint` with strict rules.
2. [ ] Define Zod schemas for all data models.
3. [ ] Create a global CSS design system (Focus, Motion, Fluid Type).
4. [ ] Build a `LayoutManager` or `CMS` using accessible keyboard patterns.
5. [ ] Configure `ci.yml` for automated gating.
