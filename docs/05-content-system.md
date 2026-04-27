# Content & Playset System

## 1. Overview

Night of the Thirteenth uses a **data-driven content architecture** where all textual content lives in external JSON files, not in component templates. This separation enables:

- **Content updates** without code changes
- **Playset overrides** — alternative themes can replace or modify any content
- **Rich text** via Markdown syntax within JSON values
- **Future localization** support

The content system is built around three pillars:
1. **Content Loader** (`contentLoader.ts`) — loads and merges JSON data
2. **Default Data** (`data/default/`) — the baseline content for all playsets
3. **Playset Overrides** (`data/{playsetId}/`) — partial overrides per playset

---

## 2. Content Loader (`contentLoader.ts`)

### 2.1 Loading Strategy

All JSON files are loaded eagerly at build time using Vite's glob imports:

```typescript
const dataFiles = import.meta.glob('../data/**/*.json', { eager: true });
```

This creates a map of all JSON files in the `data/` directory tree, keyed by their relative paths.

### 2.2 The `loadData<T>()` Function

The core loading function:

```typescript
function loadData<T>(filename: string, playsetId?: string | null): T {
  // 1. Load default data
  const defaultPath = `../data/default/${filename}`;
  const defaultModule = dataFiles[defaultPath];
  let data = defaultModule ? defaultModule.default : ({} as T);

  // 2. Load playset override (if exists)
  if (playsetId && playsetId !== 'default') {
    const playsetPath = `../data/${playsetId}/${filename}`;
    const playsetModule = dataFiles[playsetPath];
    if (playsetModule) {
      data = deepMerge(data, playsetModule.default);
    }
  }

  return data;
}
```

### 2.3 Deep Merge

The `deepMerge<T>(target, source)` function handles the override pattern:

| Input Type | Behavior |
|-----------|----------|
| Primitives | Source replaces target |
| Arrays | Source replaces target (no concatenation) |
| Objects | Recursive deep merge (key-by-key) |

This means a playset only needs to include the **keys it wants to change**. Everything else inherits from the default.

### 2.4 Markdown Parsing

Most content loader functions parse Markdown using `marked`:

```typescript
export function getWelcomeScreenContent(playsetId?: string | null): WelcomeScreenContent {
  const data = loadData<WelcomeScreenRaw>('welcomeScreen.json', playsetId);
  const intro = data.intro.map((text) => marked.parseInline(text) as string);
  // ...
}
```

Two modes are used:
- `marked.parseInline()` — for inline content (no wrapping `<p>` tags)
- `marked.parse()` — for block content (full paragraph wrapping)

---

## 3. Content Loader Functions

Each game phase has a dedicated content loader:

| Function | JSON File | Used By |
|----------|-----------|---------|
| `getWelcomeScreenContent()` | `welcomeScreen.json` | WelcomeScreen.vue |
| `getGameSetupContent()` | `gameSetup.json` | GameSetup.vue |
| `getActSetupContent(act)` | `actSetup.json` | ActSetup.vue |
| `getTrophySetupContent()` | `trophySetup.json` | TrophySetup.vue |
| `getSceneSetupContent()` | `sceneSetup.json` | SceneSetup.vue |
| `getConversationAndStakesContent()` | `conversationAndStakes.json` | ConversationAndStakesPhase.vue |
| `getResolutionPhaseContent()` | `resolutionPhase.json` | ResolutionPhase.vue |
| `getResolveScenePhaseContent()` | `resolveScenePhase.json` | ResolveScenePhase.vue |
| `getFalloutPhaseContent()` | `falloutPhase.json` | FalloutPhase.vue |
| `getManualCardEntryContent()` | `manualCardEntry.json` | ManualCardEntry.vue |
| `getStrikeAssignmentContent()` | `strikeAssignment.json` | StrikeAssignmentModal.vue |
| `getWinScreenContent()` | `winScreen.json` | WinScreen.vue |
| `getLoseScreenContent()` | `loseScreen.json` | LoseScreen.vue |
| `getLivePlayHeaderContent()` | `livePlayHeader.json` | LivePlayHeader.vue |
| `getCssContent()` | `css.json` | theme.ts |
| `getSensoryPrompts()` | `sensoryPrompts.json` | ConversationPrompts.vue |
| `getPlaysetConfig()` | `config.json` | Multiple (game logic) |
| `getRulesModuleDefinitions()` | `rulesModules.json` | GameSetup.vue |
| `getAvailablePlaysets()` | All `config.json` files | GameSetup.vue |

---

## 4. JSON Data File Schemas

### 4.1 `config.json` — Playset Configuration

```json
{
  "name": "Generic Slasher",
  "description": "A classic slasher setup. No specific tropes enforced.",
  "details": [
    {
      "label": "Content Warnings",
      "items": ["Violence", "Gore", "Death"]
    },
    {
      "label": "Touchstones",
      "items": ["Halloween", "Friday the 13th", "Scream"]
    }
  ],
  "overrides": {
    "PlayingCard": true
  },
  "rulesModules": {
    "classicSetup": true,
    "finalGirl": false
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name of the playset |
| `description` | string | Short description for selection screen |
| `details` | array | Labeled info groups (content warnings, touchstones) |
| `overrides` | object | Component names that this playset overrides (e.g., `PlayingCard: true`) |
| `rulesModules` | object | Boolean flags for rules module activation |

### 4.2 `welcomeScreen.json`

```json
{
  "title": "Night of the Thirteenth",
  "intro": [
    "In this game, **you are the victims.**",
    "There is no Director to save you."
  ],
  "infoGrid": [
    { "label": "Duration", "value": "90-120 min", "icon": "clock" },
    { "label": "Players", "value": "3-5", "icon": "users" },
    { "label": "Needs", "value": ["A standard deck", "d10 + d4"], "icon": "supplies" }
  ],
  "buttonText": "Begin Setup"
}
```

Values support Markdown (parsed by the loader). Array values in `infoGrid` are joined with `<br>`.

### 4.3 `actSetup.json`

Keyed by act number (or special key like `'jokers'`):

```json
{
  "1": {
    "title": "Act 1: The Setup",
    "quote": "*The night begins with whispers...*",
    "sections": [
      {
        "title": "Building the Board",
        "intro": "Follow these steps to prepare the decks:",
        "steps": [
          "Shuffle the **Number Cards** (2-10).",
          "Deal **8 cards** face down."
        ],
        "footer": "The Aces are placed face up on top."
      }
    ],
    "buttonText": "Begin"
  },
  "jokers": {
    "title": "The Finale",
    "quote": "*Both Jokers enter the deck...*",
    "buttonText": "Face Your Fate"
  }
}
```

### 4.4 `prompts.json` — Scene Prompt Matrix

The Oracle system — maps suit × rank to narrative prompts:

```json
{
  "faceCardPrefix": "The Killer is here. How do they corner you?",
  "suits": [
    {
      "suit": "Spades",
      "theme": "Power (Physical threat)",
      "prompts": {
        "1": "**ESTABLISHING SHOT.**\n\nWe see you handling a physical task.",
        "2": "A heavy door slams shut behind you.",
        "11": {
          "firstTime": "What is the first thing you notice about their silhouette?",
          "recurring": "How does that silhouette loom over you right now?"
        }
      }
    },
    {
      "suit": "Joker",
      "prompts": {
        "Red": "THE FINAL TEST. How do you escape death?",
        "Black": "THE TWIST. What do you sacrifice to survive?"
      }
    }
  ]
}
```

**Prompt types:**
- **String** — Simple prompt (number cards, aces, jokers)
- **Object `{firstTime, recurring}`** — Face card prompt with state tracking

### 4.5 `css.json` — Theme Configuration

```json
{
  "colors": {
    "nott-black": "#0a0a0a",
    "nott-red": "#8a0000",
    "nott-white": "#e8e8e8",
    "nott-gray": "#4a4a4a",
    "nott-green": "#2d5a2d"
  },
  "fonts": {
    "display": "'Playfair Display', serif",
    "body": "'Inter', sans-serif"
  }
}
```

### 4.6 `rulesModules.json`

```json
{
  "finalGirl": {
    "label": "Final Girl Rule",
    "description": "Any encounter with the Killer results in a Strike..."
  },
  "classicSetup": {
    "label": "Classic Setup",
    "description": "Use the original curated deck setup..."
  }
}
```

### 4.7 Other Data Files

| File | Purpose | Key Fields |
|------|---------|------------|
| `conversationAndStakes.json` | Conversation phase text | `intro`, `actDescriptions`, `steps` (setScene, focusCamera, defineGoals, commitToEffort), `ui` |
| `resolutionPhase.json` | Resolution phase text | `intro`, `targetDifficulty`, `dice`, `reminders` (genrePoint, aptitude), `results`, `buttonText` |
| `resolveScenePhase.json` | Scene outcome text | `ingress`, `outcome` (success/failure), `effort`, `instruction`, `buttonLabel` |
| `falloutPhase.json` | Fallout phase text | `intro`, `genrePoint`, `decks`, `jokers` (red/black), `standard` (success/failure), `buttons`, `breakingPoint` |
| `sceneSetup.json` | Scene setup guidance | `explanations` (aces/finale/default), `guidance` (draw/select/faceCard), `ui` |
| `sensoryPrompts.json` | Camera focus suggestions | Keyed by suit: `{ "Spades": ["What does it smell like?", ...] }` |
| `manualCardEntry.json` | Card entry UI labels | `title`, `joker` (title/red/black/none), `buttons` (cancel/add) |
| `strikeAssignment.json` | Strike assignment labels | `title`, `subtitle`, `pendingLabel`, `eliminatedLabel`, etc. |
| `winScreen.json` | Victory text | `title`, `subtitle`, `body`, `buttonText` |
| `loseScreen.json` | Defeat text | `title`, `subtitle`, `quote`, `buttonText` |
| `livePlayHeader.json` | Header labels | `resetButton`, `act3CountdownLabel`, `trophyPile`, `currentThreat` |
| `header.json` | App header config | `title` |
| `uiLabels.json` | Misc UI labels | Various shared labels |

---

## 5. Playset System

### 5.1 Philosophy

Playsets are **overrides, not copies**. A new playset starts nearly empty (only `config.json` is required). Only files and properties that differ from the default are included. The content loader handles the rest via deep merge.

### 5.2 Current Playsets

#### Default — Generic Slasher

The baseline horror experience. No special rules modules.

```
data/default/
├── config.json         (no rulesModules)
├── prompts.json        (full 4-suit × 13-rank prompt matrix)
├── css.json            (default color scheme)
└── ... (21 files total)
```

#### Generic Slasher (Classic)

The original curated deck setup with known card positions.

```
data/generic_slasher_classic/
├── config.json         (rulesModules: { classicSetup: true })
└── actSetup.json       (custom act transition text)
```

Only 2 files — everything else inherits from default. The `classicSetup` flag modifies:
- Deck initialization (known rank distributions)
- Reserve management (ordered queue vs. unknown pool)
- Card identity (specific vs. Unknown)
- Trophy Pile setup (pre-populated 10s vs. manual entry)

#### Summer Camp Massacre

A themed playset with custom visuals and the Final Girl rules module.

```
data/summercamp/
├── config.json         (rulesModules: { finalGirl: true }, overrides: { PlayingCard: true })
├── actSetup.json       (custom act text)
└── css.json            (custom color theme)
```

The `overrides.PlayingCard = true` flag tells the wrapper component system to load `components/playsets/summercamp/PlayingCard.vue` instead of the default.

### 5.3 Creating a New Playset

1. Create a directory: `data/{playset-id}/`
2. Create `config.json` with at minimum:
   ```json
   {
     "name": "My Playset",
     "description": "Description for selection screen",
     "details": [{ "label": "Touchstones", "items": ["Film 1", "Film 2"] }]
   }
   ```
3. Add only the JSON files you want to override
4. Within those files, include only the keys you want to change
5. If overriding components, set `overrides: { "ComponentName": true }` and create the component at `components/playsets/{playset-id}/ComponentName.vue`

### 5.4 Playset Discovery

Playsets are discovered automatically by `getAvailablePlaysets()`:

```typescript
export function getAvailablePlaysets(): PlaysetData[] {
  for (const path in dataFiles) {
    if (path.endsWith('config.json')) {
      // Extract playset ID from path
      // Read config and add to list
    }
  }
  // Sort: 'default' first, then alphabetical
}
```

Any directory under `data/` that contains a `config.json` with `name`, `description`, and `details` fields will appear as a selectable playset.

---

## 6. Scene Prompt System (`scenePrompts.ts`)

### 6.1 Architecture

Scene prompts are loaded from `prompts.json` and accessed via `getScenePrompt()`:

```typescript
function getScenePrompt(
  card: { rank: number; suit: Suit } | null,
  selectedJoker: 'Red' | 'Black' | null,
  isFirstTime: boolean
): string | null
```

### 6.2 Prompt Resolution

1. **Joker?** → Load from the Joker suit in prompts data
2. **Card?** → Find matching suit data, then lookup rank
3. **String prompt?** → Return parsed Markdown
4. **Object prompt?** → Return `firstTime` or `recurring` variant, prefixed with `faceCardPrefix`

### 6.3 First Time vs. Recurring

Face cards (11-13) have two prompts:
- **First Time:** Used when this suit's Face Card has never been defeated. Prompts focus on *describing* the Killer's attributes.
- **Recurring:** Used after the suit has been defeated once. Prompts focus on how those attributes have *intensified*.

The `isFirstTime` flag is determined by checking `weaknessesFound` — if the suit is not in the array, it's the first encounter.

---

## 7. Rules Modules

Rules modules modify game behavior through boolean flags in `playsetConfig.rulesModules`.

### 7.1 `classicSetup`

Affects the entire game flow:

| Area | Default (Random) | Classic |
|------|-----------------|---------|
| **Threat Deck** | 8 random number cards + 1 Jack | All 2s, 3s, 4s (12 cards) + 1 Jack |
| **Reserve** | 14 unknown cards | All 5s-10s (ordered) |
| **Card Identity** | Unknown until drawn | Known by rank |
| **Trophy Start** | Manual entry required | Four 10s, randomly selected |
| **Reserve Addition** | Generic count decrement | Specific rank shift from queue |
| **Face Card Addition** | Unknown identity in bottom stack | Known to bottom stack |

### 7.2 `finalGirl`

Adds two rules:
1. **Automatic Strike on Face Card Encounter:** Drawing/facing any Face Card immediately adds `strikesToAssign++`
2. **Accelerated Endgame:** When only one character survives, Act 3 + Jokers trigger immediately

---

## 8. Theming Pipeline

The flow from JSON configuration to rendered CSS:

```
data/{playset}/css.json
        ↓
contentLoader.getCssContent(playsetId)
        ↓ (deep merged with default)
theme.updateTheme(playsetId)
        ↓
  ┌─────────────────────┐
  │ For each color:     │
  │   Parse named color │
  │   ─→ RGB string     │
  │   ─→ CSS variable   │
  │                     │
  │ For each font:      │
  │   Set CSS variable  │
  └─────────────────────┘
        ↓
  :root {
    --color-nott-red: 138 0 0;
    --font-display: 'Creepster', cursive;
  }
        ↓
  Tailwind reads variables:
    bg-nott-red → rgb(138 0 0 / 1)
    bg-nott-red/50 → rgb(138 0 0 / 0.5)
```

The `getRgbFromColor()` helper converts any CSS color (named, hex, etc.) to an RGB triplet by temporarily rendering it in the DOM and reading the computed style. This allows `css.json` to use any valid CSS color format.
