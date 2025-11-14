---
name: nextjs-accessibility
description: Comprehensive accessibility audit for WCAG compliance
tools:
  - Bash
  - Read
  - Grep
---

# Next.js Accessibility Skill

Ensure WCAG 2.1 Level AA compliance for the application.

## Audit Tools:

### 1. ESLint jsx-a11y Plugin
**Run**: `npm run lint` (already configured)
- Catches common accessibility issues in JSX
- Validates ARIA attributes
- Checks semantic HTML usage

### 2. Storybook Accessibility Addon
**Run**: `npm run storybook`
- Navigate to each story
- Check "Accessibility" tab
- Identifies WCAG violations

### 3. Playwright Accessibility Tests
**Check**: Tests with `toBeAccessible()` assertions
- Automated a11y testing during E2E tests
- Uses Chromatic browser extension

### 4. Manual Code Audit
**Search for patterns**:
```bash
# Images without alt text
grep -r '<img' --include="*.tsx" src/

# Buttons without accessible names
grep -r '<button' --include="*.tsx" src/

# Form inputs without labels
grep -r '<input' --include="*.tsx" src/

# Missing heading hierarchy
grep -r '<h[1-6]' --include="*.tsx" src/

# Non-semantic divs for interactive elements
grep -r 'onClick.*<div' --include="*.tsx" src/
```

## Accessibility Checklist:

### Semantic HTML
- [ ] Proper heading hierarchy (h1 → h2 → h3, no skips)
- [ ] Semantic elements (`<nav>`, `<main>`, `<article>`, `<section>`)
- [ ] Lists use `<ul>`, `<ol>`, `<li>`
- [ ] Forms use proper `<form>`, `<fieldset>`, `<legend>`

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Logical tab order
- [ ] Visible focus indicators
- [ ] Skip links for main content
- [ ] No keyboard traps

### ARIA Attributes
- [ ] `aria-label` or `aria-labelledby` for icon buttons
- [ ] `aria-describedby` for additional context
- [ ] `aria-live` regions for dynamic content
- [ ] `role` attributes only when needed (semantic HTML preferred)
- [ ] Valid ARIA attribute values

### Visual Accessibility
- [ ] Color contrast ratio ≥ 4.5:1 (text)
- [ ] Color contrast ratio ≥ 3:1 (large text, UI components)
- [ ] Information not conveyed by color alone
- [ ] Text resizable to 200% without loss of functionality
- [ ] No flashing content (epilepsy risk)

### Images & Media
- [ ] All images have descriptive `alt` text
- [ ] Decorative images use empty `alt=""`
- [ ] Complex images have long descriptions
- [ ] SVGs have proper `<title>` and `<desc>` elements
- [ ] Videos have captions/transcripts

### Forms
- [ ] All inputs have associated `<label>` elements
- [ ] Error messages are accessible (aria-invalid, aria-describedby)
- [ ] Required fields are marked (aria-required or required)
- [ ] Form validation is announced to screen readers

### Dynamic Content
- [ ] Loading states announced (aria-busy, aria-live)
- [ ] Route changes announced (Next.js Router events)
- [ ] Modal focus management (trap focus, restore on close)
- [ ] Toast notifications use aria-live regions

### Internationalization (i18n)
- [ ] `lang` attribute on `<html>` element
- [ ] Language changes marked with `lang` attribute
- [ ] Text direction (RTL) support if needed

## Output Format:
```
♿ Accessibility Audit Report
=============================

📊 Summary:
- ESLint a11y issues: X
- Storybook violations: Y
- Manual audit findings: Z

🔴 Critical Issues (WCAG A violations):
  1. [component] Missing alt text for images
  2. [page] Form inputs without labels

🟡 Important Issues (WCAG AA violations):
  1. [component] Insufficient color contrast
  2. [page] Missing skip links

🟢 Recommendations:
  1. Add ARIA labels to icon buttons
  2. Improve keyboard navigation in modal

✅ Compliant Areas:
  - Semantic HTML structure
  - Heading hierarchy
  - Form validation

🎯 Priority Actions:
  1. Fix all WCAG A violations
  2. Address color contrast issues
  3. Add missing ARIA labels
  4. Test with screen reader (VoiceOver/NVDA)
```

## Testing Recommendations:
1. **Automated**: Run on every commit (ESLint + Playwright)
2. **Manual**: Test with:
   - Keyboard only (unplug mouse)
   - Screen reader (VoiceOver on Mac, NVDA on Windows)
   - Browser zoom (200%, 400%)
   - Color blindness simulators
3. **Tools**: axe DevTools, WAVE, Lighthouse
