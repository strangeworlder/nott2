# Phase 7: Game Assembly

> **Goal**: Full game playable online with 4 players. All pages, all phases, all features wired together.  
> **Skills**: `next-best-practices`, `vercel-react-best-practices`, `zustand`, `multiplayer-game`  
> **Estimated Effort**: 4–5 sessions  
> **Depends on**: Phase 3 (demo), 4 (multiplayer), 5 (WebRTC), 6 (organisms)

---

## Deliverables

- [ ] Landing page (SSR) — game intro + Create/Join CTAs
- [ ] Lobby page — room creation, player list, playset selection, ready states, video preview
- [ ] Game page — full multiplayer game with all phases
- [ ] Rules reference page (SSR)
- [ ] Turn management — AP rotation, per-player actions
- [ ] "Something's Not Right" escalation via chat
- [ ] Animated dice rolling via `react-ttrpg-dice`
- [ ] All phase UIs wired to multiplayer state
- [ ] Demo mode still works at `/demo`
- [ ] Responsive layout (desktop priority, tablet support)

---

## 7.1 Page Architecture

### Landing Page (`/`)

Server-rendered. The "poster" for the game.

- Game title with hero typography + red glow
- Atmospheric background (subtle dark gradient or texture)
- Two CTAs: "Create Game" → `/lobby`, "Join Game" → `/lobby?join=true`
- Brief game description
- "Solo Demo" → `/demo`
- "Rules" → `/rules`

### Lobby Page (`/lobby`)

Client-side. Where players gather before the game starts.

**Create flow**: Generate room code → show code prominently → wait for players
**Join flow**: Enter room code → join room → wait for host to start

```
┌─────────────────────────────────────────────────┐
│  Room Code: XKCD42      [Copy] [Share]          │
│  Playset: Generic Slasher  [Change]             │
├──────────────────────┬──────────────────────────┤
│  Players (2/4)       │  Your Preview            │
│                      │  ┌──────────────────┐    │
│  1. ♠ Alice (Host)   │  │  [Camera Feed]   │    │
│     ✅ Ready         │  │                  │    │
│  2. ♥ Bob            │  └──────────────────┘    │
│     ⏳ Not Ready     │  [🎤 Mute] [📷 Off]     │
│  3. (empty)          │                          │
│  4. (empty)          │  Your Name: [_Bob_____]  │
│                      │  Character: [The Final▼] │
├──────────────────────┴──────────────────────────┤
│  [Start Game] (host only, enabled when all      │
│   players ready)                                │
└─────────────────────────────────────────────────┘
```

### Game Page (`/game/[roomId]`)

Client-side (`'use client'`). The main gameplay surface.

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER: Night of the Thirteenth | Act 2 | Scene Setup | [Leave]│
├──────────────────────────────────────┬───────────────────────────┤
│                                      │  VIDEO GRID (2×2)         │
│  GAME TABLE                          │  ┌────────┬────────┐     │
│  ┌─────────────────────────────┐     │  │ P1 cam │ P2 cam │     │
│  │  [Deck]  [Card] [Card]  [T]│     │  │ ♠ Jock │ ♥Final │     │
│  │                             │     │  ├────────┼────────┤     │
│  │  Threat   Visible    Trophy │     │  │ P3 cam │ P4 cam │     │
│  │  Deck     Cards      Pile  │     │  │ ♣ Nerd │ ♦Rebel │     │
│  └─────────────────────────────┘     │  └────────┴────────┘     │
│                                      │                          │
│  ACTIVE PLAYER PANEL                 │  CHAT / GAME LOG         │
│  ┌─────────────────────────────┐     │  ┌──────────────────┐    │
│  │  [Phase-specific controls]  │     │  │ System: Act 2... │    │
│  │  Prompts, dice, stakes,     │     │  │ Alice: I'll check│    │
│  │  resolution, fallout...     │     │  │ Bob: Something's │    │
│  │                             │     │  │   not right...   │    │
│  │  [Next Phase / Continue]    │     │  │ [_Type here___]  │    │
│  └─────────────────────────────┘     │  └──────────────────┘    │
├──────────────────────────────────────┴───────────────────────────┤
│  CHARACTERS: [♠ Jock ⚡⚡_] [♥ Final ___] [♣ Nerd ⚡__] [♦ Reb _]│
│  Genre Points: Pool 9 | You: 2          Act 3 in: 7 cards       │
└──────────────────────────────────────────────────────────────────┘
```

### Rules Reference (`/rules`)

Server-rendered. Static rules display for quick reference during play. Opens in a new tab from the game page.

---

## 7.2 Turn Management

### Active Player Selection

| Phase | AP Selection Rule |
|-------|-------------------|
| Aces (Prologue) | Auto-assigned: player whose character suit matches the Ace's suit |
| Main Game | **Host selects** (or table agrees via chat), then host sets AP |
| Face Card visible | Must choose that card → AP is whoever's turn it is |

In the UI, the host sees a "Select Active Player" dropdown/selector when entering `scene-setup`. Other players see who the AP is.

### Per-Player Action Restrictions

| Action | Who Can Do It |
|--------|--------------|
| Draw card | AP only |
| Select card | AP only |
| Set sacrifice | AP only |
| Roll dice | AP only |
| Apply aptitude | AP only |
| Use genre point (own) | AP only |
| Advance phase | Host only |
| "Something's Not Right" | Any non-AP player (once per scene) |
| Award genre point | Any player |
| Assign strike | Host (or AP with table agreement) |
| Chat | Any player |

---

## 7.3 "Something's Not Right" Mechanic

Implemented as a special chat action:

1. Any non-AP player has an "Escalate" button during `conversation-stakes` phase
2. Clicking it opens a text input: "Something's not right..."
3. Submitted as a `type: 'escalation'` chat message
4. Displayed with special styling in the chat (red border, dramatic font)
5. Button disabled for all non-AP players after one escalation per scene
6. The escalation flag resets when `startNextScene()` is called

---

## 7.4 Animated Dice (`react-ttrpg-dice`)

Replace the manual `DieSelector` during `resolution` phase:

```typescript
import { DiceOverlay } from 'react-ttrpg-dice';

// Two dice groups: white d10 + red d4
<DiceOverlay
  groups={[
    { notation: '1d10', theme: 'white', label: 'Main Die' },
    { notation: '1d4', theme: 'red', label: 'Effort Die' },
  ]}
  onResult={(results) => {
    gameStore.rollDice(results[0].total, results[1].total);
  }}
/>
```

**Fallback**: Manual `DieSelector` still available via toggle (for accessibility or if 3D doesn't load).

---

## 7.5 Content System

Port the existing JSON content system from the Vue app:

- Scene prompts (`prompts.json`)
- Act setup text (`actSetup.json`)
- Phase descriptions and guidance
- Sensory prompts for "Focus the Camera"

Load via Next.js `import` (static JSON, no dynamic fetch needed).

---

## Verification

- [ ] Landing page renders (SSR, fast load)
- [ ] Create room → lobby shows room code
- [ ] Second player joins → appears in lobby
- [ ] Host starts game → all players enter game page
- [ ] Full game playable: Act 1 → Act 2 → Act 3 → Win/Lose
- [ ] Animated dice roll → results sync to all players
- [ ] Chat messages appear for all players
- [ ] "Something's Not Right" escalation works once per scene
- [ ] Genre points tracked across players
- [ ] Strike assignment → death → character grayed out
- [ ] Video feeds visible for all 4 players during game
- [ ] Demo mode still works at `/demo`
- [ ] Rules page loads (SSR)
