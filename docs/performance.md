# Performance Engineering & Optimization Guide

This document describes the performance engineering framework, benchmarks, and architectural strategies implemented inside **GreenEarthAI** to ensure blistering load speeds and smooth interactions.

---

## 1. Core Web Vitals Targets

The codebase is engineered to satisfy strict performance targets:

* **Largest Contentful Paint (LCP)**: Under `1.8s` (Target: Excellent).
* **Interaction to Next Paint (INP)**: Under `50ms` (Target: Immediate).
* **Cumulative Layout Shift (CLS)**: Under `0.05` (Target: High Visual Stability).
* **Lighthouse Score**: Target `95+` across Performance, Accessibility, and Best Practices.

---

## 2. Rendering Strategy: Lightweight Vector SVGs vs. WebGL Overhead

Traditional ecological representations leverage three.js or canvas graphics. While attractive, WebGL applications suffer from:
1. High CPU/GPU utilization (increasing device battery drain, which is ironic for an eco-friendly application).
2. Huge initial bundle size (+500KB for the engine import).
3. Slow first paint because of asset assets compilation (high LCP values).

Our solution renders custom **Vector SVG components** (`LivingEcosystem.tsx`) driven by Tailwind utility classes and hardware-accelerated animations (`motion`).
* **Instantaneous Paint**: SVGs are declared inline, allowing instantaneous browser processing without bundle delay.
* **Responsive Fluid Scaling**: The canvas uses a standard `viewBox="0 0 400 300"` combined with a responsive layout watcher to fluidly scale coordinates across devices.
* **Minimal Battery/CPU Impact**: SVG nodes are light on memory, freeing system resources.

---

## 3. Bundle Optimizations

* **Code Splitting & Suspense Rules**: Features are asynchronously loaded where logical to decrease initial chunk loads.
* **Tree Shaking**: Utilizing Named Exports across all files prevents loading unused utility methods in final bundles.
* **CSS Compilation**: Tailwind 4 compiled styles extract precise utility rules into a single stylesheet, avoiding redundant layout definitions.
* **Component Memoization**: React components incorporate structured props to prevent unnecessary, repetitive DOM re-renders inside high-frequency controls (e.g. while scrubbing the timeline slider).
