# Summer Camp Massacre Implementation Plan

## Overview
This document analyzes the feasibility of implementing the "Summer Camp Massacre" playset features within the current "Live Play Helper" application. It identifies supported features, missing capabilities, and provides a roadmap for implementation.

## Feature Analysis

### 1. Archetypes & Character Creation
*   **Playset Requirement**: Specific archetypes (Leader, Protector, Jock, etc.) mapped to suits.
*   **Current Capability**: `rules.ts` contains hardcoded `characterRules`. `GameSetup.vue` displays static content.
*   **Gap**: Character data is not currently loaded from JSON, making it hard to override per playset.
*   **Feasibility**: **Easy**.
*   **Plan**: Extract `characterRules` to `data/default/characterRules.json` and add a loader in `contentLoader.ts`. Create `data/summercamp/characterRules.json` with the playset specific archetypes.

### 2. The Curse & Discoveries
*   **Playset Requirement**:
    *   "Discoveries" tied to suits.
    *   Finding a Discovery allows permanently removing Face Cards of that suit (same as "Weakness" in core).
    *   **New**: Finding a Discovery removes the Difficulty Bonus (+1/+2/+3) for Face Cards of that suit.
*   **Current Capability**: `useLivePlay.ts` tracks `weaknessesFound`. It does *not* modify `targetDifficulty` based on found weaknesses.
*   **Gap**: Missing logic to reduce Face Card difficulty. Terminology difference ("Weakness" vs "Discovery").
*   **Feasibility**: **Medium**.
*   **Plan**:
    *   Update `targetDifficulty` in `useLivePlay.ts` to check `weaknessesFound` and ignore the modifier if the suit is found.
    *   Use JSON overrides to change UI text from "Weakness" to "Discovery".

### 3. Investigation Test
*   **Playset Requirement**:
    *   Can only investigate if Threat Card >= 6.
    *   Player declares intent -> Rolls -> Success = Discovery found.
*   **Current Capability**: `ResolveScenePhase.vue` assumes a standard resolution. `useLivePlay.ts` logic for "Success" on a Number Card is fixed (remove threat, add to trophy).
*   **Gap**: No UI to "Declare Investigation". No logic to handle "Investigation Success" (which adds to Trophy Pile AND marks Discovery/Weakness found).
*   **Feasibility**: **Hard**.
*   **Plan**:
    *   Modify `ResolveScenePhase.vue` to show an "Attempt Investigation" toggle/button if `activeCard.rank >= 6`.
    *   Update `useLivePlay.ts` to handle a new "Investigation" state or flag during resolution.
    *   If Investigation Success: Trigger `weaknessesFound.push(suit)` in addition to standard success logic.

### 4. Final Girl Mechanic
*   **Playset Requirement**: Final Scene triggers when only 1 survivor remains.
*   **Current Capability**: The app **does not track players or survivors**. It only tracks "Strikes" (which are global/abstract in the current app context, or per-player but not tracked individually).
*   **Gap**: No player state management.
*   **Feasibility**: **Hard**.
*   **Plan**:
    *   **MVP Approach**: Add a manual "Trigger Final Scene" button in the UI (e.g., in `ActionFooter` or a settings menu) to allow the table to manually advance to Act 3 when they determine the condition is met.
    *   **Full Implementation**: Add `players` state to `useLivePlay.ts`, track individual strikes/status. This is a significant refactor. **Recommendation**: Stick to MVP Approach for now.

### 5. Atmospheric Events
*   **Playset Requirement**: Specific flavor text for card values 1-10.
*   **Current Capability**: `ScenePrompt.vue` shows generic prompts. `scenePrompts.ts` (or json) likely handles this but needs verification.
*   **Gap**: Need a structured way to look up these events.
*   **Feasibility**: **Easy**.
*   **Plan**:
    *   Create `data/summercamp/atmosphericEvents.json` mapping ranks 1-10 to text.
    *   Update `ScenePrompt.vue` to display this text if available for the current playset.

### 6. Face Card Challenges
*   **Playset Requirement**: Specific prompts for J, Q, K.
*   **Current Capability**: `ScenePrompt.vue` likely handles this generically.
*   **Gap**: Need playset-specific Face Card prompts.
*   **Feasibility**: **Easy**.
*   **Plan**:
    *   Create `data/summercamp/faceCardPrompts.json`.
    *   Update `ScenePrompt.vue` to use this data.

### 7. Fallout Flavor Text
*   **Playset Requirement**: Specific text for Fallout 1-4.
*   **Current Capability**: `FalloutPhase.vue` loads content from `falloutPhase.json`.
*   **Gap**: None.
*   **Feasibility**: **Done**.
*   **Plan**: Create `data/summercamp/falloutPhase.json` with the specific text.

## Implementation Roadmap

### Phase 1: Data Structure & Content (Easy/Medium)
1.  **Extract Character Rules**: Move to JSON.
2.  **Create Playset JSONs**:
    *   `characterRules.json`
    *   `atmosphericEvents.json` (New)
    *   `faceCardPrompts.json` (New)
    *   `falloutPhase.json`
    *   `gameSetup.json` (Add playset to list)

### Phase 2: Logic Updates (Medium/Hard)
1.  **Update `useLivePlay.ts`**:
    *   Modify `targetDifficulty` to respect `weaknessesFound`.
    *   Add "Investigation" logic (optional flag in `applyGameStateUpdates`?).
2.  **Update Components**:
    *   `ScenePrompt.vue`: Support Atmospheric Events and Face Card Prompts.
    *   `ResolveScenePhase.vue`: Add "Investigation" UI.

### Phase 3: Manual Overrides (MVP for Hard Features)
1.  **Final Girl**: Add a "Force Final Scene" button in `LivePlayHelper` or `ActSetup` to handle the custom win condition manually.

## Next Steps
1.  Create the `data/summercamp` JSON files.
2.  Refactor `rules.ts` / `contentLoader.ts` to support `characterRules`.
3.  Implement the Logic Updates.
