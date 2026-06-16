# Architectural Specification - GreenEarthAI Platform

This document outlines the system architecture, design patterns, directory semantics, and data-flow pipelines of **GreenEarthAI** (formerly Lens AI). The platform is constructed using a modern full-stack TypeScript environment configured to run in highly scalable, sandboxed Cloud Run containers.

---

## 1. Architectural Topology Overview

GreenEarthAI delivers a high-fidelity, interactive, and gamified carbon-accounting and habit-correction interface. The application follows a rigorous **Separation of Concerns (SoC)** approach, with distinct roles assigned to the stateful client (Single Page Application via React & Vite) and the stateless, server-side controller layer (Express & `@google/genai` Multi-Agent Engine).

```
   ┌────────────────────────────────────────────────────────┐
   │                       CLIENT VIEW                      │
   │               (React 19 / Tailwind / Motion)           │
   └───────────┬────────────────────────────────┬───────────┘
               │                                │
               │ (Secure HTTP POST JSON)        │ (Real-time timeline scrubbing)
               ▼                                ▼
   ┌────────────────────────────────────────────────────────┐
   │                 EXPRESS REST API MIDDLEWARE            │
   │                     (Local Server Port 3000)           │
   └────────────────────────────┬───────────────────────────┘
                                │
                                │ (Server-Protected Gemini API Call)
                                ▼
   ┌────────────────────────────────────────────────────────┐
   │            MULTI-AGENT ORCHESTRATION PIPELINE          │
   │           (Google GenAI SDK - gemini-3.5-flash)        │
   │  ┌───────────────────────┐  ┌───────────────────────┐  │
   │  │  Carbon Intelligence  │  │  Lifestyle Nudge Agent│  │
   │  └───────────────────────┘  └───────────────────────┘  │
   │  ┌───────────────────────┐  ┌───────────────────────┐  │
   │  │  Storytelling Agent   │  │  Reflection Journal   │  │
   │  └───────────────────────┘  └───────────────────────┘  │
   └────────────────────────────────────────────────────────┘
```

---

## 2. Shared File and Module Organization

```
/
├── .env.example              # Declarations of required private configurations (e.g., GEMINI_API_KEY)
├── package.json              # Standardized Node script triggers, ESM configuration, & strict lint rules
├── tsconfig.json             # Compiles client TSX and server TS with precise, strict parameter rules
├── vite.config.ts            # Bundles assets and configures CSS injection with zero HMR noise
│
├── server/                   # Strict Server-Side Domain Core
│   ├── server.ts             # REST Entry Point, port 3000 routing, and development Vite middleware
│   ├── build/                # Standalone bundled CommonJS (dist/server.cjs)
│   ├── controllers/          # Stateless routing drivers (coach, journal, assessment, simulator)
│   └── services/             # Core business utilities (Multi-Agent prompt generation & schemas)
│
├── src/                      # Single-Page client application architecture
│   ├── main.tsx              # React mounting root
│   ├── index.css             # Unified Tailwind source stylesheet incorporating display font rules
│   ├── app/                  # Top-level layout orchestration (App.tsx)
│   ├── assets/               # Scalable imagery and visual artifacts
│   ├── components/           # Extracted UI elements (such as EnvironmentalProtectionBanner)
│   ├── constants/            # Centralized labels and prompt instructions cataloged here
│   ├── hooks/                # Stateful abstraction logic (useCoach, useAssessment)
│   ├── types/                # Strict, immutable shared interfaces and schema parameters
│   └── features/             # Sovereign feature-level domain bounds
│       ├── assessment/       # Carbon profiling UI wizardry
│       ├── avatar/           # Dynamic evolving companion rendering & AI description
│       ├── coach/            # Sustainability chat interface widgets
│       ├── ecosystem/        # Active Personal Earth visualization & timeline state
│       └── simulator/        # Time machine carbon forecasting
│
└── docs/                     # Full platform governance, testing, and audit literature
```

---

## 3. Data Integrity & Inversion of Control Flows

1. **Lifestyle Questionnaire Submission**:
   - The user finishes the five-parameter diagnostic stage.
   - Values are posted securely to `/api/assessment/profile` as clean JSON.
   - Payload is validated against structural schema constructs (via `zod`).

2. **Server-Side Agent Evaluation**:
   - The payload is dispatched to the **Carbon Intelligence Engine** on the server.
   - System prompts are augmented with context-aware metadata.
   - Structured JSON is requested from `gemini-3.5-flash` using a defined `responseSchema`.
   - The controller receives, validates, and parses the structured response.

3. **Client-Side Rendering**:
   - The validated profile indicators (Carbon Score, Eco-Vitality points, Archetype) are stored in local storage and state.
   - The **Personal Earth Canvas** (`LivingEcosystem.tsx`) dynamically adapts its weather systems, wildlife, foliage density, and environmental lighting using these parameters immediately.

---

## 4. Architectural Decision Rules

* **Zero-Trust Client Design**: No credentials or private SDK hooks reside in browser frames. The server acts as a strict proxy gatekeeper. This guarantees robustness against prompt injection attacks and protects proprietary system instructions.
* **Functional Composition**: State logic is isolated into hooks (`useCoach`, etc.), separating viewport code from reactive variables.
* **Performance Offloading**: SVG nodes and CSS transitions are used over intensive three.js rendering for general client operations. This guarantees a smooth user experience even on low-end mobile hardware, keeping the application fast and accessible.
