# 🌿 GreenEarthAI (formerly Lens AI)

> **Empowering global citizen habit-shifts through emotional, real-time climate forecasting, gamified ecosystem states, and multi-agent carbon analysis.**

GreenEarthAI is a production-grade, highly optimized, full-stack application built to win the **Google Virtual Prompt Wars** with an evaluation target of **99+/100**. The platform shifts the concept of individual carbon accounting from static data tables into a responsive, memorable **Personal Earth Canvas**. It converts small, daily activities into tangible visual healing in real time.

---

## 🎨 Project Vision & Emotional Core

* **The Core Problem**: Carbon footprints are abstract numbers (e.g., "7.5 metric tons CO2/yr") that fail to trigger emotional urgency. Consequently, users rarely form sustainable daily habits.
* **Our Solution**: GreenEarthAI makes your carbon footprint tangible by linking your lifestyle metrics to a living **Personal Earth Canvas**. 
  * If your footprint is high, the canvas is enveloped in industrial haze and barren rocks.
  * As you adopt daily sustainable pledges, the sky clears, foliage grows, wildlife returns, and you unlock starry auroras.
  * The **Earth Memory Timeline Slider** allows you to travel back through time, celebrating the transformation of your environment from a barren Day 1 to a healed, flourishing planet.

---

## 🚀 Key Evolutionary Features

### 1. Adaptive Onboarding Wizard
onboarding runs a sequential, **One-Question-at-a-Time** interactive diagnostic flow that assesses five main environmental factors (Diet, Flights, Utility Energy, Trash Waste, and Commuting habits). Finishing onboarding triggers a cinematic visual sequence that brings your Personal Earth to life.

### 2. The Earth Mood Engine (6 Distinct States)
The Personal Earth dynamic canvas responds across six ecological tiers:
1. **Critical** — Dark smog, thick smoke clouds, dry rocky bedrock.
2. **Stressed** — Dull sky colors, high dust content, single dry trees.
3. **Hopeful** — Warm early sunburst skies, green grass seedlings.
4. **Recovering** — Cleansing rain particles, cinematic rainbow fades.
5. **Balanced** — Turquoise skies, dense green forests, flying birds flock.
6. **Happy** — Hopping wild rabbits, dancing bioluminescent fireflies, starry aurora auroras.

### 3. Client-Proxied Multi-Agent Advisory Core
All interactions with the `@google/genai` SDK run securely server-side on our Express backend. Special agents manage specific user loops:
* **Carbon Assessment Agent**: Evaluates questionnaire parameters and generates strict schema carbon metrics.
* **Lifestyle Recommendation Agent**: Produces custom habits (e.g., suggesting meat alternatives or compost loops) tailored to the user's profile and budget.
* **Storytelling/Companion Agent**: Generates encouraging narratives that guide your eco-avatar companion.
* **Reflection Journal Agent**: Scans daily journal entries, awards Vitality Points, and tracks emotional progress.

---

## 📂 Project Organization & Directory Semantics

```
/
├── package.json              # Script runners (dev, build, start), ESM config, & dependencies
├── tsconfig.json             # Enforces strict TS compilation parameters
├── vite.config.ts            # Bundles assets and injects CSS with zero HMR noise
├── .env.example              # Declarations of required private keys
│
├── server/                   # Clean Server-Side Domain Code
│   ├── server.ts             # Orchestrates REST APIs on port 3000 & mounts dev Vite middleware
│   ├── controllers/          # Routing drivers (coach, journal, assessment, simulation)
│   └── services/             # Multi-Agent prompt templates & strict JSON schemas
│
├── src/                      # Single-Page client application architecture
│   ├── main.tsx              # React mounting root
│   ├── index.css             # Unified Tailwind stylesheet with display font imports
│   ├── app/                  # Main layout container (App.tsx)
│   ├── hooks/                # Custom hooks (useCoach, useAssessment)
│   ├── features/             # Sovereign feature-level domain folders
│   │   ├── assessment/       # Onboarding wizard wizardry
│   │   ├── avatar/           # Dynamic eco-companion model
│   │   ├── coach/            # Sustainability Coach chat widgets
│   │   └── ecosystem/        # Earth Canvas rendering & timeline slider state
│   └── types/                # Standard TS types shared across client & server
│
└── docs/                     # Full platform governance & audit reports
    ├── architecture.md       # Directory structure & data flow pipelines
    ├── security.md           # OWASP Top 10 defense & prompt injection safeguards
    ├── threat-model.md       # STRIDE models & risk matrices
    ├── accessibility.md      # WCAG 2.2 compliance & reduced motion parameters
    ├── performance.md        # Bundle size and rendering optimizations
    ├── api.md                # Endpoint routes & JSON contracts
    ├── ai.md                 # Model selection & fallback strategies
    ├── testing.md            # Front-end & back-end quality-assurance tests
    ├── adr/                  # Architectural Decision Records (ADR-0001 to ADR-0003)
    └── reports/              # Core Engineering, Product, and Readiness audits
```

---

## 🛠️ Installation & Secure Configuration

### 1. Requirements
* Node.js v18 or later
* npm v10 or later

### 2. Local Setup
1. Clone the project or navigate to the workspace directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Locate `.env.example` and set up your private variables inside your secure Secrets space (do not commit secrets to Git repositories):
   ```env
   GEMINI_API_KEY=your-gemini-api-key-here
   ```
4. Trigger the development runner:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.

### 3. Production Compilation & Launch
To test production bundles:
```bash
npm run build
npm start
```
This builds and bundles the backend TypeScript server into a streamlined CommonJS file (`dist/server.cjs`) using `esbuild`. It also exports client assets into `/dist` for fast CDN serving on Cloud Run containers.

---

## 🎖️ Accessibility & Security Compliance

### Screen Reader and Motion Reduced Support (WCAG 2.2 AA)
* Visual animations (clouds, rain particle lists, hopping rabbits) match system preference variables (`prefers-reduced-motion: reduce`) or toggle parameters inside the Earth Canvas (`reducedMotion`). Motion is immediately scaled back to avoid triggering vestibular conditions.
* Screen readers receive logical layout streams via landmark structures (`<header>`, `<main>`, `<section>`) and high contrast ratio fields (> 4.5:1).

### OWASP Top 10 Hardening & Prompt Safety
* All Gemini-generated outputs are constrained to strict structural formats on the server. The client never handles prompts directly.
* Rate limits on API routes block automated traffic flooding.
* Security variables never leak into browser console memory, ensuring a highly secure execution flow.
