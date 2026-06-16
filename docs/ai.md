# AI Architecture & Orchestration Specification

This document details the AI architecture, model selections, system design patterns, and output validation mechanisms driving **GreenEarthAI**.

---

## 1. Google GenAI Model Strategy

We use different Gemini models depending on the complexity of the task:

1. **`gemini-3.5-flash`** (Core Text & Structured Tasks):
   - Used for all core business routines: profiling, chat, journal audits, and forecasting.
   - Selected for its very low latency (INP < 100ms) and cost efficiency.
   - Handles schemas and structural rules with high accuracy.

2. **`gemini-3.1-pro-preview`** (Complex Reasoning & STEM):
   - Kept as our premium fallback option for deep, multi-variable climate science analysis.

---

## 2. Structured JSON Generation & Guardrails

We enforce strict schema parsing using the SDK's `responseSchema` and `responseMimeType: "application/json"` parameters to prevent format errors during JSON processing:

```ts
// Example Server-Side Guardrail Setup
const response = await ai.models.generateContent({
  model: 'gemini-3.5-flash',
  contents: promptString,
  config: {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        archetype: { type: Type.STRING },
        explanation: { type: Type.STRING }
      },
      required: ["score", "archetype", "explanation"]
    }
  }
});
```

---

## 3. Fallback Strategies (Resilient State Machine)

If the external API suffers an interruption or rate timeout, GreenEarthAI prevents visual layout crashes by using a robust fallback layer:

```
                  ┌───────────────────────────────┐
                  │       Post Request JSON       │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                    [Check Network & API Keys]
                        /               \
              (Success) /                 \ (Failure / Timeout)
                      /                     \
                     ▼                       ▼
          ┌─────────────────────┐   ┌──────────────────────┐
          │  Call Gemini API    │   │ Invoke Safe fallback │
          │  and return JSON    │   │  (Static Profiler)   │
          └─────────────────────┘   └──────────────────────┘
```

---

## 4. Confidence Metric Calculation

* Every model response is accompanied by a validation pipeline that evaluates output fields against structural limits (e.g., verifying that the carbon score is a positive number).
* This pipeline assigns a confidence rating; fields that deviate from the expected format are normalized in our controllers to guarantee a clean user experience.
