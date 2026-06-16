# Architecture Decision Record (ADR-0001)

## Title
Multi-Agent Orchestrated AI Architecture for Granular Carbon Insights

## Context
Our early prototypes utilized a single monolithic text-prompt to analyze user diagnostics, create next-step recommendations, summarize weekly journals, and calculate eco-avatar descriptions. This resulted in:
1. Long generation latency.
2. Intermittent structural drift in JSON payloads.
3. Unpredictable shaming tones in feedback loops.
4. Difficulty maintaining individual agent prompts.

## Decision
We refactored the AI orchestration layer into a decentralized network of **Specialized Core Agents**. Each agent possesses a single, tightly defined responsibility and operates using a custom system prompt template and deterministic boundaries.

### The Specialized Agents Map:
1. **Carbon Assessment Agent**: Evaluates numeric metrics and outputs strict structured Carbon metrics.
2. **Lifestyle Recommendation Agent**: Produces contextual daily pledges and gamified quests based on the user's living setup (e.g. cycler, remote worker).
3. **Storytelling/Companion Agent**: Generates inspirational narratives that shape the user's eco-avatar evolution.
4. **Reflection Journal Agent**: Analyzes journal logs to determine vitality scores and current emotional status.

## Status
Approved

## Consequences
* **Decoupled Tests**: We can isolate and test single prompts (e.g. testing the validation rules of the Lifestyle Agent without invoking the entire suite).
* **Deterministic Structures**: We enforce strict schema parsing using `Type.OBJECT` specifications in `@google/genai` to guarantee 100% parse success rates.
* **Optimized Latency**: Responses are distributed, enabling fast delivery of intermediate insights.
* **Controlled Tone**: Shaming words or system leaks are checked and prevented by strict validation boundaries.
