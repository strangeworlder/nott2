# Design System Audit — Night of the Thirteenth 2

> **Purpose**: An LLM-consumable reference that ensures correct component and token selection. Read this before writing any UI code.

---

## Part 1 — Design Tokens

All tokens live in `tokens/theme.css.ts`. The `vars` contract is the API; `darkTheme` is the default implementation. Playsets override values without touching components.

### 1.1 Color Tokens

| Token | Value | Semantic Role | When to Use |
|---|---|---|---|
| `color.background` | `#0a0a0a` | Page root | `<body>`, full-bleed backgrounds |
| `color.surface` | `#141414` | Card/panel fill | Default `<Card>` background, sidebar panels |
| `color.surfaceElevated` | `#1a1a1a` | Modal/elevated fill | Overlays, dropdowns, popovers, highlighted cards |
| `color.accent` | `#8a0000` | Brand accent (blood) | Borders, button fills, left-border decorations |
| `color.accentBright` | `#dc2626` | Hover/active accent | Button hover, error text, red glow text, focus rings |
| `color.text` | `#e8e8e8` | Primary text | All body copy and headings |
| `color.textMuted` | `#6a6a6a` | Secondary text | Captions, placeholders, helper text, disabled labels |
| `color.success` | `#2d5a2d` | Positive (dark) | Success card borders, green glow base |
| `color.successBright` | `#4ade80` | Positive (bright) | Success text, green glow highlight, debug buttons |
| `color.warning` | `#fbbf24` | Caution | Warning callouts, amber indicators |
| `color.border` | `#2a2a2a` | Default divider | Card borders, separators, table rules |
| `color.borderSubtle` | `rgba(255,255,255,0.12)` | Faint divider | Outline badges, bottom-border decorations |
| `color.borderActive` | `#8a0000` | Focused/selected | Selected card border, active tab underline |

> [!IMPORTANT]
> **No `color.danger` token exists.** Danger states use `color.accentBright` (the brand red IS danger). There is no blue or purple in the contract — StatusCallout uses hardcoded RGBA for `info` and `highlight` variants because those colors are UI-only, not brand colors.

### 1.2 Font Tokens

| Token | Value | Role |
|---|---|---|
| `font.display` | Playfair Display, Georgia, serif | Headlines, buttons, labels, badges — anything that commands |
| `font.body` | Inter, system-ui, sans-serif | Body copy, captions, quotes, helper text — anything that explains |
| `font.mono` | monospace | Code, debug output (rarely used in game UI) |

**Decision rule**: If text is UPPERCASE or a heading → `font.display`. If text is a sentence or paragraph → `font.body`.

### 1.3 Font Size Tokens

| Token | Value | Usage |
|---|---|---|
| `fontSize.hero` | clamp(3rem, 8vw, 6rem) | Full-screen titles only (e.g. "Night of the Thirteenth") |
| `fontSize.h1` | clamp(2rem, 5vw, 3.5rem) | Phase display titles, act break headings |
| `fontSize.h2` | clamp(1.5rem, 3vw, 2.5rem) | Section headings, PhaseHeader title |
| `fontSize.h3` | 1.25rem | Card titles, sub-section headings |
| `fontSize.bodyLg` | 1.125rem | Large button text (lg size) |
| `fontSize.body` | 1rem | Default body text, medium buttons |
| `fontSize.label` | 0.875rem | Labels, captions, callout text, helper text |
| `fontSize.small` | 0.75rem | XS buttons |
| `fontSize.micro` | 0.625rem | Badges, micro-labels, tiny UI annotations |
| `fontSize.nano` | 0.5rem | Rarely used — extreme micro text |

### 1.4 Spacing Tokens (4px grid)

| Token | px | Typical Use |
|---|---|---|
| `space.xs` | 4 | Inline gaps, icon-to-text spacing |
| `space.sm` | 8 | Default Row gap, tight padding |
| `space.md` | 16 | Default Stack gap, standard padding, Card inner padding |
| `space.lg` | 24 | Card padding, generous section spacing |
| `space.xl` | 32 | Large section spacing |
| `space.2xl` | 48 | Major layout breaks |
| `space.3xl` | 64 | Hero spacing |

### 1.5 Radius Tokens

| Token | px | Feel | When |
|---|---|---|---|
| `radius.sm` | 2 | Sharp, gritty | Badges — deliberate rawness |
| `radius.md` | 4 | Default | Buttons, inputs, callouts — functional corners |
| `radius.lg` | 8 | Soft | Cards — content containers feel warm |
| `radius.full` | 9999 | Pill | Online indicators, pills — circular elements |

> [!TIP]
> The system favors **sharp corners** for its gritty horror feel. `radius.lg` is the softest you should go for rectangular containers.

### 1.6 Shadow (Glow) Tokens

| Token | Role |
|---|---|
| `shadow.glowSubtle` | Default button box-shadow (blood-red, quiet) |
| `shadow.glow` | Hover/active button glow, interactive card hover |
| `shadow.glowIntense` | Maximum emphasis — rarely used |
| `shadow.glowGreen` | Success state glow (weakness found, survival) |
| `shadow.glowGreenBright` | Bright success emphasis |

**Principle**: Glows are blood-red by default. Green glows are reserved for positive outcomes (survival, weakness discovery).

### 1.7 Transition Tokens

| Token | Duration | Use |
|---|---|---|
| `transition.fast` | 150ms ease-out | Micro-interactions: tooltips, badge flashes |
| `transition.normal` | 200ms ease-out | **Default**: button hover, border, opacity |
| `transition.slow` | 400ms ease-out | Dramatic: overlay enter/exit, panel open/close |

---

## Part 2 — Component Inventory

### Atom → Molecule → Organism hierarchy

```
Atoms (primitives — no game logic)
├── Text, Button, Icon, Badge, Toggle, Separator
├── TextField, TextArea
├── Stack, Row (layout)
├── StatusCallout, PhaseHeader

Molecules (composed atoms — single-purpose game widgets)
├── Card, ActionFooter, PlayingCard, PlayerAvatar
├── StrikeIndicator, DieSelector, ResultBanner
├── EffortBand, DifficultyBadge, DiceResult
├── TrophyIndicator, WeaknessTracker, WaitingIndicator
├── TabBar, CardMatt, Deck, DoomClock, DoomClockTransition

Organisms (compound — full screen sections)
├── GameBoard, Header, ChatPanel, PlayerPanel
├── PhaseDisplay, PhasePanel, CharacterBar
├── TransitionOverlay, ActBreakOverlay, SceneChallengeOverlay
```

---

## Part 3 — Atoms Reference

### Text
**The typographic authority.** All text in the UI passes through this component.

| Variant | Font | Rendering | Semantic Use |
|---|---|---|---|
| `hero` | display | `<p>`, huge, uppercase | Full-screen splash titles only |
| `h1` | display | `<h1>`, uppercase | Page-level headings (one per screen) |
| `h2` | display | `<h2>`, uppercase | Section headings |
| `h3` | display | `<h3>`, uppercase | Card titles, sub-sections |
| `lead` | body | `<p>`, clamp-sized | Introductory paragraphs (larger body) |
| `body` | body | `<p>` | **Default.** Standard paragraphs |
| `label` | display | `<div>`, uppercase, tracked | UI labels, form labels, zone labels |
| `caption` | body | `<p>`, italic | Attributions, footnotes, metadata |
| `quote` | body | `<p>`, italic, large | Flavor text, prompts, in-world narration |
| `micro` | display | `<p>`, tiny, uppercase, wide-tracked | Badges, annotations, extreme-small labels |

**Color prop**: `white` (default) · `red` (accent/danger) · `muted` (secondary) · `success` (positive)
**Glow prop**: Adds text-shadow. Red glow for white/red/muted text; green glow for success text.
**Border prop**: `left` = red left accent bar · `bottom` = subtle rule underneath

> [!CAUTION]
> **Never use utility classes** (font-bold, text-red-400) on `<Text>`. Use props only. If a style doesn't exist, consult the user about adding it to the design system.

### Button
**The agent of change.** Every interactive action uses this.

| Variant | Visual | Semantic |
|---|---|---|
| `primary` | Blood-red fill + glow | **Main action** — "Begin," "Confirm," "Roll" |
| `secondary` | Transparent + muted border | **Alternative** — "Cancel," "Skip," "Back" |
| `ghost` | Transparent, no border | **Subtle** — inline actions, settings toggles |
| `debug` | Green border | **Dev-only** — debug tools, test triggers |

| Size | Padding | Typical Context |
|---|---|---|
| `xs` | 4×8 | Inline micro-actions, token adjustments |
| `sm` | 6×12 | Compact toolbars, grouped controls |
| `md` | 8×24 | **Default.** Most standalone buttons |
| `lg` | 12×32 | ActionFooter primary button |
| `xl` | 16×48 | Hero CTA (rare) |

`block` prop makes it full-width. Always use `<ActionFooter>` for the primary page-level action instead of raw Button.

### Icon
**Dual-mode icon renderer.**

- **Custom SVGs** (card suits): `spades`, `hearts`, `diamonds`, `clubs` — inline `<svg>`, future custom artwork candidates.
- **Material Symbols** (everything else): rendered via font glyph. Size via `font-size`, color via recipe.

Color prop: `white` · `red` · `muted` · `success` · `inherit` (default).

Helper: `suitToIconName('Spades')` → `'spades'` — use this instead of maintaining your own suit-to-symbol maps.

### Badge
**Quick-scan status labels.**

| Variant | Visual | Use |
|---|---|---|
| `default` | Gray fill, muted text | Neutral tags, categories |
| `outline` | Transparent, subtle border | Secondary tags, metadata |
| `red` | Red-tinted fill, red text | Warnings, threat indicators, Killer-related |
| `success` | Green-tinted fill, green text | Positive status, weakness found |

### StatusCallout
**The game's stage directions** — contextual system messages with emotional temperature.

| Variant | Color | Semantic Use |
|---|---|---|
| `info` | Blue | Neutral game state info, round order, general tips |
| `warning` | Amber | Important procedural notices, approaching limits |
| `danger` | Red | Critical alerts, breaking point, death imminent |
| `success` | Green | Positive outcomes, survival, weakness discovered |
| `highlight` | Purple | Aptitude activation, special abilities, genre points |

Optional `icon` prop prepends a DS Icon.

### Toggle
Two visual modes for binary state:
- `button` variant: text button showing "On"/"Off" (or custom labels). For decisive settings.
- `switch` variant: track+thumb slider with label. For lighter settings panels.

### TextField / TextArea
- **TextField**: single-line input. Gateway to player expression (names, room codes).
- **TextArea**: multi-line. For longer content (backstory, scene descriptions).

Both share: label, helper text, error state (red), character count, ghost variant (borderless). The focus glow is blood-red.

### Stack / Row (Layout primitives)
- **Stack**: Vertical flex column. Gap defaults to `md`. The spine of every phase screen.
- **Row**: Horizontal flex row. Gap defaults to `sm`. Supports wrap, justify, align.

### PhaseHeader
Operational screen title: `title` + optional `subtitle` + optional `step` indicator ("Step 2 of 4"). Used at the top of PhasePanel. **Distinct from PhaseDisplay** (which is cinematic).

### Separator
A horizontal `<hr>`. No props. A visual breath between content sections.

---

## Part 4 — Molecules Reference

### Card (Container)
**Content grouping surface.** This is NOT a playing card — it's a UI container.

| Variant | Background | Border | When |
|---|---|---|---|
| `default` | surface | border | General content grouping |
| `muted` | background, 70% opacity | border | De-emphasized content |
| `highlighted` | surfaceElevated | borderActive (red) | Selected/important content |
| `success` | surface | success (green) | Positive outcome display |
| `failure` | surface | accentBright (red) | Negative outcome display |
| `instruction` | red-tinted transparent | accent | Game instructions, italic |
| `ghost` | transparent | none | Invisible container (layout only) |

`interactive` prop adds hover glow + lift. `noPadding` removes internal padding. `title` renders an h3 header.

### ActionFooter
**The threshold before commitment.** A sticky bottom footer with a single primary action button.

Use this (not raw Button) for the main page-level CTA. Props: `label`, `disabled`, `variant`, `hint` (explanatory text above button).

### PlayingCard
**The central totem** — a diegetic card face. Renders suit/rank with correct pip layout.

Sizes: default (full) · `compact` (smaller) · `micro` (28×40px, rank+suit only).
States: `selected` (red glow ring) · `faceDown` (card back pattern) · `joker` (special layout).

### PlayerAvatar
**Player identity at the table.** Shows suit icon, name, character name, online indicator, active-player glow.

Sizes: `sm` (CharacterBar) · `md` (panels) · `lg` (lobby).

### StrikeIndicator
**Three strikes = death.** Renders 0–3 marks: ○ (empty) → ✕ (blood-red). Third strike or `isDead` shows ☠ skull.

### DieSelector
**Tactile die selection.** Grid of clickable faces for d4 (1–4) or d10 (0–9). `color='red'` for threat die, `color='white'` for effort die.

### ResultBanner
**The verdict.** SUCCESS (green) or FAILURE (red) in dramatic display font. Shows roll total vs difficulty breakdown. Most dramatic single-moment UI element.

### EffortBand
**The d4 thermometer.** Four levels with escalating color temperature:
- `controlled` — calm (target icon)
- `pushing-it` — tense (air icon)
- `overexertion` — hot (fire icon)
- `breaking-point` — critical (dangerous icon)

### DifficultyBadge
**The omen before the roll.** Large display-font number + optional breakdown text.

### DiceResult
**The autopsy report.** Clinical `d10 + d4 = Total` layout with optional aptitude modifier (struck-through original value).

### TrophyIndicator
**The Killer's power level.** Shows trophy pile top card (suit icon + rank). Amber-toned, always present.

### WeaknessTracker
**The countdown to hope.** Four suit pips — found ones glow green, unfound are muted. Fixed order: Spades, Hearts, Clubs, Diamonds.

### WaitingIndicator
**The held breath.** Pulsing dot + message for multiplayer waiting states. Respects prefers-reduced-motion.

### TabBar
**Two-road sign.** Horizontal tab navigation (create/join in lobby). Understated, bureaucratic.

### CardMatt
**The physical playing surface.** Textured felt-like surface for 3D card landing. Ref-forwarding so `react-ttrpg-cards` measures the bounding rect. `glow` prop = pulsing halo when cards are selectable.

### Deck
**A shrouded stack of fate.** Renders layered PlayingCard components (face-down). Optional `topCard` renders the top card face-up (Trophy pile). `glow` prop for draw prompts. `showCount` for numeric badge.

### DoomClock
**The impossible 13th hour.** SVG clock with 12 arc segments. Hand sweeps as reserve cards are added. At 13: clock face shatters with cracks and red glow. Compact size (~80px) for sidebar use.

### DoomClockTransition
**The dramatic tick.** Full-screen (240px) version of DoomClock that animates a single tick: hand sweeps, segment flares, countdown drops. Break variant shatters the face.

---

## Part 5 — Organisms Reference

### GameBoard (Compound)
**The digital table.** Container with spatial zone sub-components:
- `GameBoard.DeckZone` — threat deck
- `GameBoard.CardLine` — 2D card display (legacy)
- `GameBoard.CardLine3D` — ref-forwarding target for 3D card overlay
- `GameBoard.TrophyZone` — trophy pile via Deck molecule
- `GameBoard.PhaseInfo` — act/phase status
- `GameBoard.DoomClockZone` — countdown clock (hidden during prologue)

`vertical` prop switches to sidebar column layout.

### Header
**Orientation bar.** Sticky top with title, act/phase pills, optional room code, reset button, and action slot. Uses backdrop blur.

### ChatPanel
**Player voice at the table.** Scrollable message list + text input. Four message types with distinct visuals:
- `chat` — player bubbles (own = right-aligned)
- `system` — impersonal game announcements
- `escalation` — ⚠ weighted warnings
- `genre-point` — ★ genre point notifications

### PlayerPanel
**Phase-aware control surface.** Renders different sub-views per game phase:
- `resolution` → DieSelector pair + result
- `fallout` → strike assignment info
- generic → single ActionFooter with phase-appropriate label

### PhaseDisplay (Cinematic)
**The narrator's voice.** Full-screen, full-bleed phase announcement with title, subtitle, and optional body text. Has built-in defaults for all game phases. Used for dramatic moments, NOT for operational screens.

### PhasePanel (Operational)
**The director's desk.** Structured container: PhaseHeader + scrollable content area. Used for all active-play screens. The working counterpart to PhaseDisplay.

> [!IMPORTANT]
> **PhaseDisplay vs PhasePanel**: PhaseDisplay = cinematic narration (full-bleed, dramatic). PhasePanel = operational workspace (structured, scrollable). Never use PhaseDisplay for a screen where the player needs to interact with controls.

### CharacterBar
**The playbill.** Footer bar showing all 4 characters: avatar, strikes, genre points, Ace turn tokens. Active player glows red. Dead characters are greyed out. Genre Pool count at the end.

### TransitionOverlay
**The blackout between scenes.** Full-screen portal with enter/exit CSS animations. Click to dismiss early. `onExited` fires after exit animation for state advancement.

### ActBreakOverlay
**The VHS title card.** Full-screen portal (z-index 15000) for act transitions. Self-contained copy matrix for acts 1/2/3/prologue/finale. Wall texture backdrop, VHS grain panel. Has a visible "Begin Act" button.

### SceneChallengeOverlay
**The evidence photo.** Positioned absolutely within `.game-main` (NOT a portal — no z-index warfare). Shows scene prompt, suit theme, difficulty, and a crime-scene-style photo. `jumpScare` variant: white flash + screen shake for Killer encounters and Jokers.

---

## Part 6 — Decision Trees

### "Which component do I use for text?"
```
Is it any text at all? → <Text>
  Is it a heading? → variant="h1" | "h2" | "h3"
  Is it a paragraph? → variant="body" (default)
  Is it introductory? → variant="lead"
  Is it a UI label? → variant="label"
  Is it flavor/narration? → variant="quote"
  Is it a footnote? → variant="caption"
  Is it a tiny annotation? → variant="micro"
```

### "Which container do I use?"
```
Grouping related content? → <Card>
  Needs emphasis? → variant="highlighted"
  Is it an instruction? → variant="instruction"
  Is it a positive result? → variant="success"
Vertical spacing? → <Stack>
Horizontal layout? → <Row>
Phase operational screen? → <PhasePanel>
Phase dramatic moment? → <PhaseDisplay>
```

### "Which feedback component?"
```
System message to the player? → <StatusCallout>
  Neutral info → variant="info"
  Warning → variant="warning"  
  Critical/danger → variant="danger"
  Positive → variant="success"
  Special ability → variant="highlight"
Roll outcome? → <ResultBanner>
Inline tag/label? → <Badge>
Waiting state? → <WaitingIndicator>
```

### "How do I handle a page action?"
```
Primary page CTA? → <ActionFooter label="..." onClick={...}>
  (NOT <Button> directly — ActionFooter handles sticky positioning)
Secondary inline actions? → <Button variant="secondary">
Subtle/inline toggle? → <Button variant="ghost"> or <Toggle>
```

---

## Part 7 — Anti-Patterns

| ❌ Don't | ✅ Do |
|---|---|
| `<p>`, `<h1>`, `<span>` for text | `<Text variant="body">`, `<Text variant="h1">` |
| `<div>` for content grouping | `<Card>` with appropriate variant |
| `<button>` for actions | `<Button>` with variant/size props |
| Raw `<hr>` for dividers | `<Separator>` |
| Inline SVGs for icons | `<Icon name="...">` |
| `<Button>` at page bottom for primary CTA | `<ActionFooter label="...">` |
| Utility classes on `<Text>` | Use `color`, `glow`, `border` props |
| Hardcoded suit symbols (♠♥♦♣) | `<Icon name={suitToIconName(suit)}>` |
| `font-bold`, `text-red-400` overrides | Use component props and variants |
| Ad-hoc color values | Reference `vars.color.*` tokens |
| PhaseDisplay for interactive screens | PhasePanel for operational, PhaseDisplay for cinematic |

---

## Part 8 — Theming & Playsets

The entire system is built on a **theme contract** (`vars`). The `darkTheme` is the default Night of the Thirteenth implementation. Playsets create alternative themes by calling `createTheme(vars, { ...overrides })` — components never need to change.

The Storybook preview wraps all stories in the `darkTheme` class with the dark background and Inter font. The Storybook manager itself is themed to match (blood-red primary, dark surfaces).

**Key principle**: Components reference `vars.*` tokens, never hardcoded values. This means a playset can completely change the visual identity (colors, fonts, spacing) by providing a single new theme — no component code changes needed.
