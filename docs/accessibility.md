# Accessibility Specification (WCAG 2.2 AA Compliance)

This document outlines the accessibility compliance framework, verification tests, and styling constraints implemented inside **GreenEarthAI** to comply with Web Content Accessibility Guidelines (WCAG) 2.2 AA status.

---

## 1. Core Principles of Inclusive Design

We believe environmental protection should be accessible to all persons. We build our components around four foundational principles: Perceivable, Operable, Understandable, and Robust (POUR).

---

## 2. Implementations of Accessibility Controls

### Screen Reader and Assistive Technology Support
* **Semantic HTML**: We use standard descriptive HTML elements (`<header>`, `<main>`, `<section>`, `<footer>`, `<button>`) instead of nested generic wrapper structures (`<div>`) to establish logical document trees for screen readers.
* **ARIA Landmarks & Labels**: Meaningful interactive controls are labeled with human-readable accessibility markers:
  * Buttons have `aria-label` tags detailing their action (e.g., `<button aria-label="Toggle twilight eye-care dark mode">`).
  * Non-text icons (Lucide Icons) possess `aria-hidden="true"` to prevent visual reading clutter.
* **Live Regions**: AI text generation pipelines use `aria-live="polite"` regions so assistive technologies can announce updates without breaking the current focus state.

### Keyboard Focus Operations
* **Visible Focus Rings**: Interactive elements provide a clear, high-contrast visual outline focus state (`focus-visible:ring-2 focus-visible:ring-emerald-700 focus:outline-none`) when navigated with standard tab cycles.
* **Sequential Navigation Order**: Dialogs and lists possess logical tab routes from top-to-bottom and left-to-right.
* **No Traps**: Elements are fully reachable and exits are simple to trigger.

---

## 3. Custom Accessibility Attributes

### Motion and Interaction Considerations
Scolling or moving decorative graphics (drifting clouds, rain particle lines, hopping rabbits) can trigger vestibular disorders. 
* **Safe Motion Flags**: We read the system option `window.matchMedia('(prefers-reduced-motion: reduce)')` to automatically toggle off non-functional animations.
* **Reduced Motion Controls**: Our central Personal Earth canvas handles a dedicated parameter `reducedMotion?: boolean`. When active, it stops all secondary motion (such as cloud paths, rain velocity, sun flare cycles) while keeping high informational values.

---

## 4. Accessibility Audit Checklist

| Item | WCAG SC | Compliance State | Verification Methodology |
| :--- | :--- | :--- | :--- |
| **Color Contrast** | SC 1.4.3 | **Compliant** | Contrast ratios exceed 4.5:1. Core buttons use deep `#047857` (emerald-700) against white, achieving a visual ratio of 5.1:1. |
| **Bypass Blocks** | SC 2.4.1 | **Compliant** | Standard landmark tags establish logical skip routes. |
| **Resize Text** | SC 1.4.4 | **Compliant** | Visual components use relative layout spacing (`rem`, `em`, `vh`, `vw`) to support 200% magnification settings without breaking visual text wraps. |
| **Focus Visible** | SC 2.4.7 | **Compliant** | All actionable objects render bright visual rings during keyboard focus cycles. |
| **Touch Targets** | SC 2.5.5 | **Compliant** | Buttons, controllers, and quick links possess a clickable surface of **at least 44px by 44px**, preventing mis-clicks. |
