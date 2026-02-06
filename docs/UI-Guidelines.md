# Web Interface Guidelines & Compliance Checklist

This project follows strict engineering standards for UX, accessibility, and performance.

## 1. Interactivity & Forms
- [ ] **Focus Management**: Clickable input labels (`htmlFor`) and prefix icons must focus the input.
- [ ] **Form Semantics**: All inputs belong in a `<form>` to allow submission via Enter key.
- [ ] **Async Feedback**: Buttons must be `disabled` while submitting; use `aria-busy="true"` and/or a spinner.
- [ ] **Input Sanitization**: Use correct `type` (email, url) and set `autoComplete`/`spellCheck`.

```jsx
// Example
<form onSubmit={handle}>
  <label htmlFor="email">Email</label>
  <div className="icon-wrapper" onClick={() => inputRef.current.focus()}>
    <Mail size={16} />
  </div>
  <input id="email" ref={inputRef} autoComplete="email" spellCheck={false} />
</form>
```

## 2. Keyboard & Accessibility
- [ ] **Semantic Elements**: Use `<button>` or `<a>`, not `<div>` or `<span>` for UI actions.
- [ ] **Focus Styles**: Use `box-shadow` for focus rings, not default outlines.
- [ ] **ARIA**: Icon-only buttons must have `aria-label`.
- [ ] **List Navigation**: Managers (Layout, Projects) should support Arrow Keys.

## 3. Motion Rules
- [ ] **Quick Response**: Interaction animations (hover, click) should be ≤ 200ms.
- [ ] **Natural Scale**: Initial scale should be `0.8` or `0.9`, never `0`.
- [ ] **Respect User Prefs**: Use `@media (prefers-reduced-motion: reduce)`.
- [ ] **Theme Switch**: Disable transitions temporarily when switching themes to avoid "color-blending" artifacts.

## 4. Typography & Layout
- [ ] **Smoothing**: Global `-webkit-font-smoothing: antialiased`.
- [ ] **Fluid Scaling**: Use `clamp()` for key headings.
- [ ] **Touch Hygiene**: Use `@media (hover: hover)` to prevent hover stickiness on touch screens.
- [ ] **Reading**: `text-rendering: optimizeLegibility`.

## 5. Performance
- [ ] **Asset Pipeline**: Recommend `.webp` and `srcset` for images.
- [ ] **Optimization**: Avoid heavy `blur()` filters which can lag mobile browsers.

## 6. Stability (Zod)
- [ ] **Schema Protection**: Every JSON source must be validated by a Zod schema before consumption.
