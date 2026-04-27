# Design System & Component Catalog

## 1. Philosophy

The Night of the Thirteenth design system embodies a **dark, moody, premium "Slasher" aesthetic**. Every component is designed to feel like part of a horror movie's UI — intense reds against deep blacks, uppercase display typography with wide letter-spacing, and subtle glow effects that suggest something alive and dangerous lurking beneath the surface.

### Core Principles

1. **Design System First** — The system is the single source of truth for all UI/UX decisions. New UI elements must be added to the system first, then used in features.
2. **Props Over Classes** — Components expose variations through typed props (e.g., `variant="primary"`), not utility classes. This is critical for future-proofing and playset theming.
3. **Component-First Architecture** — Avoid raw HTML elements where a design system component exists. Use `<Text>` instead of `<p>`, `<Card>` instead of styled `<div>`s.
4. **Data-Driven Templates** — Content is driven by data structures and rendered with `v-for`, not hardcoded in templates.

---

## 2. Design Tokens

### 2.1 Colors

Colors are defined as CSS custom properties (RGB triplets) and exposed through Tailwind:

| Token | CSS Variable | Default Value | Purpose |
|-------|-------------|---------------|---------|
| `nott-black` | `--color-nott-black` | Deep black | Background, primary surface |
| `nott-red` | `--color-nott-red` | Blood red | Accent, danger, the Killer |
| `nott-white` | `--color-nott-white` | Off-white | Primary text |
| `nott-gray` | `--color-nott-gray` | Muted gray | Borders, secondary elements |
| `nott-green` | `--color-nott-green` | Sickly green | Success, debug, survival |

Colors are stored as space-separated RGB values (e.g., `220 38 38`) and consumed with Tailwind's alpha syntax:
```css
/* Usage: bg-nott-red, text-nott-red/60, etc. */
'nott-red': 'rgb(var(--color-nott-red) / <alpha-value>)',
```

### 2.2 Typography

| Token | CSS Variable | Purpose |
|-------|-------------|---------|
| `font-display` | `--font-display` | Headlines, labels, buttons — uppercase, tracked |
| `font-body` | `--font-body` | Body text, descriptions — readable, relaxed |

Global heading styles enforce the slasher aesthetic:
```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### 2.3 Effects

| Effect | Class | Description |
|--------|-------|-------------|
| Text glow (red) | `text-shadow-glow` | Red halo, used on important headings |
| Text glow (green) | `text-shadow-glow-green` | Green halo, used on success states |
| Fade-in animation | `animate-fade-in` | 0.3s ease-out opacity fade |

### 2.4 Theming

Playsets can override colors and fonts via a `css.json` file. The `theme.ts` utility:
1. Loads the playset's `css.json` (merged with defaults via `contentLoader`)
2. Converts named colors to RGB
3. Updates CSS custom properties on `:root`

This means a playset can change the entire app's color scheme by providing:
```json
{
  "colors": {
    "nott-red": "#8B0000",
    "nott-green": "#2E8B57"
  },
  "fonts": {
    "display": "'Creepster', cursive"
  }
}
```

---

## 3. Component Architecture

### 3.1 Wrapper Pattern

Every design system component has two layers:

```
components/
├── Button.vue              ← Wrapper (consumer-facing)
└── defaults/
    └── Button.vue           ← Default implementation
```

The **wrapper** dynamically loads either the default or a playset-specific override:

```vue
<script setup>
import DefaultButton from './defaults/Button.vue';
// ... watchEffect checks selectedPlayset and loads override if available
</script>
<template>
  <component :is="activeComponent" v-bind="$props">
    <slot />
  </component>
</template>
```

This enables playsets (e.g., "Summer Camp Massacre") to visually override specific components without touching default code.

### 3.2 Atomic Design Classification

| Level | Components |
|-------|-----------|
| **Atoms** | Text, Icon, Badge, Button, Toggle, Checkbox, NavButton, Separator |
| **Molecules** | Card, ListItem, SelectionButton, DieSelector, ProcessStep, ActionFooter, IngressText, PlayingCard, CurrentThreat, TrophyPileTop |
| **Organisms** | List, Header, Navigation, LivePlayHeader |

---

## 4. Component Catalog

### 4.1 Text

**Purpose:** The voice of the game — enforces typographic hierarchy. Every piece of text in the UI should use this component.

| Prop | Type | Default | Options |
|------|------|---------|---------|
| `variant` | string | `'body'` | `hero`, `h1`, `h2`, `h3`, `lead`, `body`, `label`, `caption`, `quote`, `micro` |
| `as` | string | auto | Any HTML tag (overrides variant default) |
| `color` | string | `'white'` | `white`, `red`, `muted`, `success` |
| `glow` | boolean | `false` | Red text shadow (green if `color="success"`) |
| `border` | string | — | `none`, `left` (red left border), `bottom` (gray bottom border) |
| `align` | string | — | `left`, `center`, `right`, `justify` |
| `leading` | string | — | `none`, `tight`, `snug`, `normal`, `relaxed`, `loose` |
| `animation` | string | — | `pulse`, `none` |

**Variant → Tag Mapping:**
- `h1` → `<h1>`, `h2` → `<h2>`, `h3` → `<h3>`, `label` → `<div>`, everything else → `<p>`

**Variant → Style Mapping:**

| Variant | Font | Size | Style |
|---------|------|------|-------|
| `hero` | Display | 6xl / 8xl | Uppercase, widest tracking |
| `h1` | Display | 4xl / 6xl | Uppercase, widest tracking |
| `h2` | Display | 2xl / 4xl | Uppercase, widest tracking |
| `h3` | Display | xl | Uppercase, widest tracking |
| `lead` | Body | lg / xl | Relaxed leading |
| `body` | Body | base | Relaxed leading |
| `label` | Display | sm | Uppercase, widest tracking |
| `caption` | Body | sm | Italic |
| `quote` | Body | xl / 2xl | Relaxed leading |
| `micro` | Display | 10px | Uppercase, widest tracking |

**Usage rule:** Do NOT use utility classes on `<Text>` to override styles. Use the provided props.

---

### 4.2 Button

**Purpose:** Primary agent of change — represents triggerable actions.

| Prop | Type | Default | Options |
|------|------|---------|---------|
| `variant` | string | `'primary'` | `primary`, `secondary`, `ghost`, `debug` |
| `size` | string | `'md'` | `xs`, `sm`, `md`, `lg`, `xl` |
| `disabled` | boolean | `false` | — |
| `block` | boolean | `false` | Full width when true |

**Variant Descriptions:**

| Variant | Background | Border | Glow |
|---------|-----------|--------|------|
| `primary` | nott-red | Transparent | Red shadow |
| `secondary` | Transparent | nott-gray → nott-red on hover | None |
| `ghost` | Transparent | None | None |
| `debug` | Transparent | nott-green | None |

All buttons use `font-display`, uppercase text, and wider tracking.

---

### 4.3 Card

**Purpose:** Container for content sections — the fundamental grouping unit.

| Prop | Type | Default | Options |
|------|------|---------|---------|
| `title` | string | — | Optional header text |
| `interactive` | boolean | `true` | Show hover glow effects |
| `variant` | string | `'default'` | `default`, `muted`, `highlighted`, `success`, `failure`, `instruction`, `ghost` |
| `noPadding` | boolean | `false` | Removes internal padding |
| `center` | boolean | `false` | Centers content |

**Variant Descriptions:**

| Variant | Border | Glow | Use Case |
|---------|--------|------|----------|
| `default` | Gray | Red-gray gradient | General content |
| `muted` | Faint gray | Hidden | Background information |
| `highlighted` | Red | Red, intense | Active/important cards |
| `success` | Green | Green | Victory states |
| `failure` | Red | Red | Failure states |
| `instruction` | White/10 | Hidden | UI guidance |
| `ghost` | Transparent | Hidden | Seamless containers |

Features a gradient glow background with interactive hover effects.

---

### 4.4 Icon

**Purpose:** Visual shorthand — renders inline SVG icons.

| Prop | Type | Default | Options |
|------|------|---------|---------|
| `name` | string | required | `clock`, `users`, `supplies`, `Spades`, `Hearts`, `Clubs`, `Diamonds` |
| `size` | number/string | `24` | Pixel dimensions |
| `color` | string | — | `white`, `red`, `muted`, `success` |

Suit icons use filled paths; utility icons use stroked paths.

---

### 4.5 Badge

**Purpose:** Small inline labels for categorization and status.

| Prop | Type | Default | Options |
|------|------|---------|---------|
| `variant` | string | `'default'` | `default`, `outline`, `red`, `success`, `danger` |

Compact, uppercase display font, wide tracking.

---

### 4.6 ActionFooter

**Purpose:** Page-level progression action — the definitive "next step" at the end of a view.

| Prop | Type | Default | Options |
|------|------|---------|---------|
| `label` | string | `'Continue'` | Button text |
| `disabled` | boolean | `false` | — |
| `variant` | string | `'primary'` | `primary`, `secondary`, `ghost`, `debug` |

| Event | Description |
|-------|-------------|
| `click` | Button pressed |

Has a default slot for custom content override.

---

### 4.7 Toggle

**Purpose:** Binary state switch for settings and mode toggles.

| Prop | Type | Default | Options |
|------|------|---------|---------|
| `modelValue` | boolean | required | v-model binding |
| `labelOn` | string | `'On'` | Label when active |
| `labelOff` | string | `'Off'` | Label when inactive |
| `variant` | string | `'button'` | `button`, `switch` |

| Event | Description |
|-------|-------------|
| `update:modelValue` | State changed |

Two visual modes:
- **Button:** Styled toggle button with green glow when active
- **Switch:** Track + thumb slider design

---

### 4.8 Checkbox

**Purpose:** Binary opt-in with custom styling.

| Prop | Type | Default |
|------|------|---------|
| `modelValue` | boolean | required |
| `label` | string | — |
| `id` | string | auto-generated |

| Event | Description |
|-------|-------------|
| `update:modelValue` | State changed |

Custom styled with red fill on checked, checkmark SVG overlay.

---

### 4.9 SelectionButton

**Purpose:** Configuring state (e.g., selecting a suit, rank, or option).

| Prop | Type | Default | Options |
|------|------|---------|---------|
| `selected` | boolean | `false` | — |
| `disabled` | boolean | `false` | — |
| `variant` | string | `'default'` | `default`, `square` |
| `color` | string | `'default'` | `default` (white), `red` |
| `size` | string | `'md'` | `sm`, `md` |

Inverts colors when selected (white-on-black → black-on-white).

---

### 4.10 DieSelector

**Purpose:** Die face selection grid — bridges digital and tabletop.

| Prop | Type | Default | Options |
|------|------|---------|---------|
| `sides` | number | required | Number of sides (4, 10, etc.) |
| `modelValue` | number/null | required | Selected value |
| `label` | string | — | Header label |
| `color` | string | `'white'` | `white`, `red` |

| Event | Description |
|-------|-------------|
| `update:modelValue` | Value selected |

Grid layout adapts: `grid-cols-5` for d10, `grid-cols-2` for d4. d10 values display 0–9 (offset by -1).

---

### 4.11 PlayingCard

**Purpose:** Central totem — diegetic playing card with realistic pip layouts.

| Prop | Type | Default |
|------|------|---------|
| `suit` | string | — |
| `rank` | number | — |
| `selected` | boolean | `false` |
| `isJoker` | boolean | `false` |
| `jokerColor` | string | — |

Features:
- Corner rank + suit indicators (top-left and bottom-right, inverted)
- Accurate pip layouts for all ranks 1–10 (with rotation for bottom-half pips)
- Face card display (large centered icon + title)
- Joker display (star symbols + color text)
- Selection ring (red glow) when selected
- Hover scale effect
- Red/black suit coloring (Hearts/Diamonds = red, Spades/Clubs = black)

---

### 4.12 ProcessStep

**Purpose:** Numbered step in a multi-step procedure.

| Prop | Type | Default | Options |
|------|------|---------|---------|
| `step` | string/number | required | Step identifier |
| `variant` | string | `'neutral'` | `success`, `failure`, `neutral` |
| `title` | string | — | Step title |

Renders a numbered circle with connecting content. Circle color changes with variant.

---

### 4.13 IngressText

**Purpose:** Introductory text blocks — the opening paragraph of a phase.

Simple wrapper component for styled introductory content.

---

### 4.14 List & ListItem

**Purpose:** Structured lists with consistent styling.

**List Props:**

| Prop | Type | Default | Options |
|------|------|---------|---------|
| `variant` | string | `'default'` | `default`, `numbered` |

**ListItem Props:**

| Prop | Type | Default |
|------|------|---------|
| `marker` | string | — |

---

### 4.15 CurrentThreat

**Purpose:** Displays the currently active card in the header.

| Prop | Type | Default |
|------|------|---------|
| `activeCard` | Card/null | `null` |
| `selectedJoker` | 'Red'/'Black'/null | `null` |
| `cardName` | string | `''` |

Shows rank + suit symbol with appropriate coloring (red for Hearts/Diamonds, white for Spades/Clubs). Falls back to "No threat" message when empty.

---

### 4.16 TrophyPileTop

**Purpose:** Displays the current top card of the Trophy Pile in the header.

| Prop | Type | Default |
|------|------|---------|
| `trophyTop` | Card/null | — |
| `isRandomized` | boolean | — |

Shows the rank as the difficulty base value with an indicator for whether it was randomly selected.

---

### 4.17 LivePlayHeader

**Purpose:** Persistent game status bar visible during all play phases.

| Prop | Type | Default |
|------|------|---------|
| `currentAct` | number | — |
| `currentPhase` | string | — |
| `trophyTop` | Card/null | — |
| `isTrophyTopRandomized` | boolean | — |
| `cardName` | string | — |
| `activeCard` | Card/null | — |
| `selectedJoker` | string/null | — |
| `fullReset` | function | — |
| `act3Countdown` | number/null | — |
| `acesRemaining` | number | — |
| `availableTrophyRanks` | number[] | — |

Displays: Act number, phase name, Trophy Pile top, Current Threat, reset button, and Act 3 countdown.

---

### 4.18 Header

**Purpose:** Application header with title/branding.

Renders the app title and navigation slot.

---

### 4.19 Navigation & NavButton

**Navigation** — Flex container for nav buttons.

**NavButton Props:**

| Prop | Type | Default |
|------|------|---------|
| `active` | boolean | `false` |

Styled navigation button with active state highlighting (red underline + brighter text).

---

### 4.20 Separator

**Purpose:** Visual divider between content sections.

Simple horizontal rule with consistent styling.

---

## 5. Usage Guidelines

### 5.1 Text Content

```vue
<!-- ✅ Correct -->
<Text variant="h1" color="red" glow>Night of the Thirteenth</Text>
<Text variant="body">You are not heroes.</Text>
<Text variant="caption" color="muted">Roll the d13.</Text>

<!-- ❌ Incorrect — raw HTML -->
<h1 class="text-red-500">Night of the Thirteenth</h1>
<p>You are not heroes.</p>

<!-- ❌ Incorrect — utility class overrides -->
<Text variant="body" class="font-bold text-red-400">Important text</Text>
```

### 5.2 Rich Text in JSON

```vue
<!-- ✅ Correct — v-html directly on Text -->
<Text v-html="content.intro" />

<!-- ❌ Incorrect — wrapping in span -->
<Text><span v-html="content.intro"></span></Text>
```

### 5.3 Content Grouping

```vue
<!-- ✅ Correct -->
<Card title="The Killer" variant="highlighted">
  <Text>The Killer approaches...</Text>
</Card>

<!-- ❌ Incorrect — raw div styling -->
<div class="border border-red-500 p-4 rounded">
  <h3>The Killer</h3>
  <p>The Killer approaches...</p>
</div>
```

### 5.4 Data-Driven Rendering

```vue
<!-- ✅ Correct — v-for with data -->
<SelectionButton
  v-for="suit in suits"
  :key="suit.id"
  :selected="selectedSuit === suit.id"
  @click="selectSuit(suit.id)"
>
  {{ suit.name }}
</SelectionButton>

<!-- ❌ Incorrect — hardcoded buttons -->
<SelectionButton @click="selectSuit('Spades')">Spades</SelectionButton>
<SelectionButton @click="selectSuit('Hearts')">Hearts</SelectionButton>
```
