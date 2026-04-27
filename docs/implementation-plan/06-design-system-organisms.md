# Phase 6: Design System — Molecules & Organisms

> **Goal**: All game-specific UI components built, storied, and tested. The full visual vocabulary for the game page.  
> **Skills**: `frontend-design`, `web-design-guidelines`, `vercel-composition-patterns`, `storybook-story-writing`  
> **Estimated Effort**: 3–4 sessions  
> **Depends on**: Phase 1 (atoms) + Phase 3 (demo mode for real-context testing)

---

## Deliverables

- [x] 6 molecule components with stories and tests
- [x] 5 organism components with stories and tests
- [x] All components using design tokens (Vanilla Extract)
- [x] Props-driven variants, no ad-hoc styling
- [x] Compound component patterns where appropriate
- [ ] Responsive design for desktop + tablet
- [x] All components documented in Storybook with `autodocs`

---

## 6.1 Molecules

### PlayingCard

The central visual totem — a diegetic playing card with realistic pip layouts.

| Prop | Type | Description |
|------|------|-------------|
| `suit` | `Suit` | Card suit |
| `rank` | `Rank` | Card rank |
| `selected` | `boolean` | Red glow selection ring |
| `faceDown` | `boolean` | Show card back |
| `compact` | `boolean` | Smaller variant for tight spaces |
| `onClick` | `() => void` | Click handler |

**Stories**: All suits × representative ranks (Ace, 5, 10, Jack, Queen, King, Joker), selected state, face down, compact.

### Card (Container)

Content grouping container (ported from existing Card.vue).

| Prop | Type | Options |
|------|------|---------|
| `variant` | `string` | `default`, `muted`, `highlighted`, `success`, `failure`, `instruction`, `ghost` |
| `title` | `string?` | Optional header |
| `interactive` | `boolean` | Hover glow effects |
| `noPadding` | `boolean` | Remove internal padding |

### ActionFooter

Page-level progression button for phase advancement.

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Button text |
| `disabled` | `boolean` | Disabled state |
| `variant` | `ButtonVariant` | Delegates to Button variant |
| `onClick` | `() => void` | Click handler |

### PlayerAvatar *(NEW)*

Player identity display with character info and status.

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Player name |
| `character` | `Character` | Character data |
| `isActivePlayer` | `boolean` | Red glow highlight |
| `isConnected` | `boolean` | Online indicator |
| `size` | `'sm' \| 'md' \| 'lg'` | Scale |

### StrikeIndicator *(NEW)*

Visual strike tracker for a character (0–3 strikes).

| Prop | Type | Description |
|------|------|-------------|
| `strikes` | `0 \| 1 \| 2 \| 3` | Current strikes |
| `isDead` | `boolean` | Death state (skull) |
| `animated` | `boolean` | Animate new strike |

### DieSelector

Die face selection grid (ported, adapted for React).

| Prop | Type | Description |
|------|------|-------------|
| `sides` | `4 \| 10` | Number of sides |
| `value` | `number \| null` | Selected value |
| `onChange` | `(val: number) => void` | Selection handler |
| `label` | `string?` | Header label |
| `color` | `'white' \| 'red'` | Color variant |

---

## 6.2 Organisms

### GameBoard *(NEW)*

Compound component representing the shared game table. Uses `vercel-composition-patterns`'s compound component pattern:

```typescript
// Usage
<GameBoard>
  <GameBoard.DeckZone count={deckCount} onClick={onDraw} />
  <GameBoard.CardLine cards={visibleCards} selectedId={selectedId} onSelect={onSelect} />
  <GameBoard.TrophyZone card={trophyTop} isRandomized={isRandomized} />
  <GameBoard.PhaseInfo phase={phase} act={act} />
</GameBoard>
```

Each sub-component is a positioned zone within the game table canvas.

### PlayerPanel *(NEW)*

The Active Player's control surface — shows prompts, dice, resolution, stakes.

| Prop | Type | Description |
|------|------|-------------|
| `phase` | `Phase` | Current phase (determines which sub-view to show) |
| `sceneState` | `SceneState` | Current scene data |
| `computed` | `ComputedGameState` | Derived state |
| `onAction` | `(action: Action) => void` | Action dispatcher |

Renders different content per phase:
- `scene-setup` → Card selection UI
- `conversation-stakes` → Prompt + sacrifice input
- `resolution` → Dice selectors + modifiers
- `resolve-scene` → Result display
- `fallout` → Fallout effects + strike assignment

### ChatPanel *(NEW)*

Text chat + structured game event log.

| Prop | Type | Description |
|------|------|-------------|
| `messages` | `ChatMessage[]` | All messages |
| `onSend` | `(text: string) => void` | Send handler |
| `currentPlayerId` | `string` | For "own message" styling |

Message types:
- `chat` — Player text message
- `system` — Game event ("Act 2 has begun", "♠ The Jock draws 7♥")
- `escalation` — "Something's Not Right" mechanic
- `genre-point` — Genre point awards

### Header *(ported)*

Application header with game status. Adapted from existing LivePlayHeader.

### PhaseDisplay *(NEW)*

Full-screen phase content renderer. Each phase has its own sub-component:

```typescript
function PhaseDisplay({ phase }: { phase: Phase }) {
  switch (phase) {
    case 'welcome': return <WelcomePhase />;
    case 'game-setup': return <GameSetupPhase />;
    case 'act-setup': return <ActSetupPhase />;
    // ... etc
  }
}
```

---

## 6.3 Storybook Organization

```
Storybook sidebar:
├── Atoms/
│   ├── Text
│   ├── Button
│   ├── Icon
│   ├── Badge
│   ├── Toggle
│   └── Separator
├── Molecules/
│   ├── PlayingCard
│   ├── Card
│   ├── ActionFooter
│   ├── PlayerAvatar
│   ├── StrikeIndicator
│   └── DieSelector
└── Organisms/
    ├── GameBoard
    ├── PlayerPanel
    ├── ChatPanel
    ├── Header
    └── PhaseDisplay
```

---

## Verification

- [x] All molecules render correctly in Storybook
- [x] All organisms render correctly in Storybook
- [x] PlayingCard renders all suits × key ranks correctly
- [x] GameBoard sub-components compose properly
- [x] PlayerPanel shows correct content per phase
- [x] ChatPanel renders message types with correct styling
- [x] All component tests pass
- [ ] `storybook:build` succeeds
- [x] Components work in the demo mode page (`/demo`)
