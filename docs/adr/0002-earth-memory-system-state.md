# Architecture Decision Record (ADR-0002)

## Title
Earth Memory Timeline state and Visual Progression Playback

## Context
A major challenge inside carbon-reduction tools is "impact invisibility"—the user completes positive actions, yet has no immediate tangible visual feedback on how their efforts affect planetary systems.

We need a design element that makes the personal carbon footprint real, emotional, and responsive.

## Decision
We implemented a dynamic, real-time **Personal Earth Canvas** combined with an **Earth Memory Evolution Playback** feature:
* **canvas-rendering**: The canvas uses lightweight vector SVGs and CSS transitions to represent ecosystems (sky colors, cloud density, foliage, bird populations, and rabbit behavior) rather than heavy 3D canvases.
* **stateful-memory-playback**: We added a timeline scrubber which allows users to travel through different progression tiers:
  * **Day 1**: Gray industrial haze, lifeless brown bedrock, 0 plants.
  * **Week 1**: Clearing skies, early green seedlings growing.
  * **Month 1**: Bright blue weather, small deciduous forest clusters.
  * **Active Year (Live)**: Custom rendered state calculated from the user's active diagnostics, complete with fireflies or wildlife based on high performance.

## Status
Approved

## Consequences
* **Client-Only Fluid State**: Timeline scrubbing takes place instantaneously inside JSX without server requests, ensuring smooth interactive performance (60 FPS).
* **Positive Feedback Loop**: Users can visually appreciate the dramatic transformation of their environment from day one to their current carbon-saving status.
* **Low Carbon Overhead**: By selecting SVG nodes, the application limits GPU overhead, aligning with the "green application" design ethos.
