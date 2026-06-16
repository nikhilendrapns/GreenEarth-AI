# Threat Modeling & Risk Identification Matrix

This document maps out the threats, risks, and mitigations defined for the GreenEarthAI application surface.

---

## 1. Attack Surface Map

The key entry points into the GreenEarthAI platform include:
1. **User Profile Submission**: Parameter inputs of annual lifestyles (diet, flights, energy usage, waste).
2. **Interactive Advisory Conversation**: Free-text fields submitted to the Sustainability Coach.
3. **Daily Reflection Log**: Text journal entries measuring user activities.

---

## 2. STRIDE Risk Classification and Control Metrics

| Threat Category | Potential Path on GreenEarthAI | Defensive Mitigation Control |
| :--- | :--- | :--- |
| **S**poofing | Attacker intercepting packets and pretending to be of high ecological status. | Connection over strict HTTPS. Session status is stored locally inside secure sandboxed standard containers. |
| **T**ampering | User modifying their carbon score parameters to crash the earth timeline rendering. | The `LivingEcosystemProps` checks the validity of bound inputs. Values out of range are clamped to safe minimums and maximums automatically. |
| **R**epudiation | Denying that a specific footprint entry or journal post was recorded. | Back-end transaction logging outputs timestamps to standard cloud monitors. |
| **I**nformation Disclosure | Extraction of proprietary prompt structures or instructions from browser memory. | Clean separation of business logic: Prompts remain server-side, never exposed to client-side. |
| **D**enial of Service | Flooding the Sustainability Coach with thousands of chat requests to exhaust API limits. | Rate-limiting constraints implemented on server API endpoints, and client-side button disabling during query loads. |
| **E**levation of Privilege | Inserting custom script payloads to force the back-end to act as general-purpose GPT proxy. | Generative parameters of `gemini-3.5-flash` are hardcoded to strict contexts. User inputs are joined only as parameter context strings. |

---

## 3. Threat Assessment Matrix

To determine priority fixes, threats are analyzed using the **DREAD** framework:

```
Score = (Damage + Reproducibility + Exploitability + Affected Users + Discoverability) / 5
```

1. **Threat**: Direct Theft of `GEMINI_API_KEY` from client.
   * **Calculated Risk**: **Critical (5/5)** if key resides client-side.
   * **Mitigated Score**: **0/5 (Not Applicable)** after server-side proxy migration (ADR-0003).

2. **Threat**: Infinite loop query on server API causing high billing rates.
   * **Calculated Risk**: **Medium (3/5)**.
   * **Mitigated Score**: **Low (1.2/5)** after adding UI state locks, button disabling, and input length filters.
