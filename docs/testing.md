# Quality Assurance & Multi-Tier Testing Specifications

This document outlines the testing strategy, frameworks, and verification processes implemented to guarantee 100% bug-free deployments for **GreenEarthAI**.

---

## 1. Multi-Tier Testing Hierarchy

```
   ┌────────────────────────────────────────────────────────┐
   │                    END-TO-END TESTS                    │
   │      (Simulating full User flows from Onboarding)      │
   └───────────┬────────────────────────────────┬───────────┘
               │                                │
               ▼                                ▼
   ┌────────────────────────────────────────────────────────┐
   │                 COMPONENT / HOOK TESTS                 │
   │      (Testing stateful lifecycle of LivingEcosystem)    │
   └───────────┬────────────────────────────────┬───────────┘
               │                                │
               ▼                                ▼
   ┌────────────────────────────────────────────────────────┐
   │                  UNIT & SCHEMA TESTS                   │
   │      (Validating parsing rules & mock structures)      │
   └────────────────────────────────────────────────────────┘
```

---

## 2. Front-End Test Specifications

* **Test Framework**: Vitest & React Testing Library.
* **Component Testing (`LivingEcosystem.test.tsx`)**:
  - Simulates clicking the weather controller overrides and asserts appropriate canvas class changes.
  - Verifies that dragging the timeline playback scrubber triggers state transitions (updates emissions display metrics and re-renders foliage counts correctly).
  - Asserts that when the `reducedMotion` flag is enabled, CSS animation tags are safely disabled to accommodate users with vestibular conditions.
* **Hook Testing (`useCoach.test.ts`)**:
  - Asserts that clearing the chat history successfully purges local storage arrays.

---

## 3. Back-End Route Testing

* **Endpoint Testing (`server/tests/routes.test.ts`)**:
  - Dispatches mock JSON responses through our controller layer to verify that parameter validators successfully reject abnormal input keys.
  - Verifies that standard error handlers correctly intercept and catch missing parameters (e.g., throwing a `400 Bad Request` if a diet value is missing).
  - Enforces strict JSON return types to prevent raw text responses from disrupting the client-side state managers.
