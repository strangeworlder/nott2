# Night of the Thirteenth 2 — Documentation

**(c) 2025 Gogam — Designed by Petri Leinonen**

This documentation suite is the authoritative reference for the Night of the Thirteenth 2 project, covering both the tabletop game rules and the web assistant that accompanies it. All documents are self-contained.

---

## Documents

### [01 — Game Rules](./01-game-rules.md)
The complete rules of Night of the Thirteenth v2.0, sourced from the latest implemented behavior in the web assistant. Covers the d13 system, table setup, character creation, genre points, the three-act structure, the full game loop with worked examples, fallout mechanics, strike system, joker rules, and rules modules.

### [02 — Application Architecture](./02-architecture.md)
High-level architecture overview of the web assistant. Covers the technology stack (Vue 3, TypeScript, Vite, Tailwind, Firebase), project structure, the Shared State Singleton pattern, Facade composable, component wrapper pattern, phase lifecycle FSM, and testing strategy.

### [03 — Design System](./03-design-system.md)
The complete design system and component catalog. Covers the "Slasher" aesthetic philosophy, design tokens (colors, fonts, effects), theming via CSS variables, the component wrapper pattern, and a full catalog of all 22 components with props, variants, and usage guidelines.

### [04 — Game Engine](./04-game-engine.md)
A deep technical dive into the game logic implementation. Covers the type system, complete state inventory (56+ reactive values), deck logic algorithms (availability, drawing, shuffling, reserves), the phase FSM, all resolution handlers, difficulty calculation, and a complete data flow walkthrough.

### [05 — Content & Playset System](./05-content-system.md)
Documentation of the data-driven content architecture. Covers the content loader with deep merge, all JSON file schemas, the playset override philosophy ("overrides, not copies"), scene prompt oracle system, rules modules, and the theming pipeline from JSON to CSS variables.

### [06 — Online Play](./06-online-play.md)
The multiplayer system documentation. Covers the Firebase Realtime Database architecture, host/client connection model, state serialization and hydration, echo prevention, the shared game canvas with zone-based layout, and known limitations.

---

## Quick Links

| What | Where |
|------|-------|
| Web app source | `site/src/` |
| Game logic | `site/src/composables/game/` |
| UI components | `site/src/components/` |
| Content data | `site/src/data/` |
| Tests | `site/src/**/__tests__/` |
