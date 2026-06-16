# Architecture Decision Record (ADR-0003)

## Title
Proxy-Based Server-Hosted Gemini API integration

## Context
Running Gemini API queries on the client side exposes sensitive system instructions, prompt strategies, and our `GEMINI_API_KEY` directly to browser inspection tools (DevTools). This breaches security guidelines and increases our vulnerability to billing abuse, key theft, and prompt engineering manipulation.

## Decision
We implemented a strict full-stack architecture where all `@google/genai` model interactions are hosted on an Express server (binding to port `3000`).
* The client sends clean parameters representing user actions via secure POST requests to `/api/*` endpoints.
* The server retrieves `GEMINI_API_KEY` from environmental context (`process.env`), initializes the SDK safely, loads custom system instructions, manages the temperature, and builds the contents payload.
* The server returns only the processed results (or formatted JSON values matching the required API structure) to the browser.
* We set strict telemetry markers `httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }` in our server initializer.

## Status
Approved

## Consequences
* **Absolute Secrets Isolation**: The browser is never exposed to the private API key or internal agent instructions.
* **Resilience to Package Updates**: Changes or updates to the `@google/genai` package do not require rebuilding the browser bundle.
* **Unified Error Mapping**: Backend failures or throttling conditions are caught and structured gracefully before reaching the client-side handlers.
