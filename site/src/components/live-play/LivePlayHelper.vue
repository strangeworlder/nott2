<script setup lang="ts">
/**
 * LivePlayHelper
 *
 * Philosophical:
 * The LivePlayHelper is the stage manager—the behind-the-scenes orchestrator that
 * directs the flow of the entire live play experience. It decides which scene
 * (phase component) is visible, manages transitions between acts, and maintains
 * the ever-present header. It is invisible to the player but essential to the
 * coherence of the journey.
 *
 * Technical:
 * The main container component that renders the appropriate phase based on game state.
 * Manages phase transitions, header display, and debug tools.
 *
 * Props:
 * (None - uses useLivePlay composable for all state)
 */

import { useLivePlay } from '../../composables/useLivePlay';
import Button from '../Button.vue';
import LivePlayHeader from '../LivePlayHeader.vue';
import ActSetup from './ActSetup.vue';
import ConversationAndStakesPhase from './ConversationAndStakesPhase.vue';
import DebugPanel from './DebugPanel.vue';
import FalloutPhase from './FalloutPhase.vue';
import GameSetup from './GameSetup.vue';
import ResolutionPhase from './ResolutionPhase.vue';
import ResolveScenePhase from './ResolveScenePhase.vue';
import SceneSetup from './SceneSetup.vue';
import TrophySetup from './TrophySetup.vue';
// Import Steps
import WelcomeScreen from './WelcomeScreen.vue';
import WinScreen from './WinScreen.vue';

const {
  currentPhase,
  currentAct,
  isEndgame,
  startEndgame,
  startGame,
  debugMode,
  trophyTop,
  isTrophyTopRandomized,
  cardName,
  activeCard,
  selectedJoker,
  fullReset,
  nextPhase,
  prevPhase,
  jokersAdded,
  act3Countdown,
  acesRemaining,
  pendingActSetups,
  consumePendingActSetup,
  hasMorePendingActSetups,
} = useLivePlay();

import { computed, watch } from 'vue';

watch(
  currentPhase,
  () => {
    window.scrollTo(0, 0);
  },
  { flush: 'post' }
);

const isDev = import.meta.env.DEV;

// Computed: Get the current setup key from the pending queue, or fall back to act number
const currentSetupKey = computed(() => {
  // If there are pending act setups in the queue, use the first one
  if (pendingActSetups.value.length > 0) {
    return pendingActSetups.value[0];
  }
  // Fall back to legacy behavior: check jokersAdded flag
  if (jokersAdded.value) {
    return 'jokers';
  }
  return undefined;
});

// Handler for when user proceeds from act setup
const handleActSetupNext = () => {
  // Consume the current setup from the queue
  consumePendingActSetup();

  // If there are more pending setups, stay on act-setup phase
  if (hasMorePendingActSetups()) {
    // Phase is already 'act-setup', so just let the component re-render with new key
    return;
  }

  // No more pending setups, proceed normally
  if (isEndgame.value) {
    startEndgame();
  } else if (currentAct.value === 1) {
    startGame();
  } else {
    nextPhase();
  }
};
</script>

<template>
  <div class="min-h-screen bg-nott-black text-nott-white flex flex-col items-center p-4 md:p-8">
    
    <!-- New Header (Visible on all screens except Welcome and Win, though Welcome handles its own layout) -->
    <LivePlayHeader 
      v-if="currentPhase !== 'welcome' && currentPhase !== 'win'"
      :current-act="currentAct"
      :current-phase="currentPhase"
      :trophy-top="trophyTop"
      :is-trophy-top-randomized="isTrophyTopRandomized"
      :card-name="cardName"
      :active-card="activeCard"
      :selected-joker="selectedJoker"
      :full-reset="fullReset"
      :act3-countdown="act3Countdown"
      :aces-remaining="acesRemaining"
    />

    <!-- Phase: Welcome Screen -->
    <WelcomeScreen 
      v-if="currentPhase === 'welcome'"
      @next="nextPhase"
    />

    <!-- Phase: Game Setup (Placeholder) -->
    <GameSetup 
      v-if="currentPhase === 'game-setup'"
      @next="nextPhase"
    />

    <!-- Phase: Act Setup -->
    <ActSetup 
      v-if="currentPhase === 'act-setup'"
      :act="currentAct"
      :setup-key="currentSetupKey"
      @next="handleActSetupNext"
    />

    <!-- Phase: Scene Setup (Draw Threat) -->
    <SceneSetup 
      v-if="currentPhase === 'scene-setup'"
      @back="prevPhase"
      @next="nextPhase"
    />

    <!-- Phase: Trophy Setup -->
    <TrophySetup 
      v-if="currentPhase === 'trophy-setup'"
      @next="nextPhase"
    />

    <!-- Phase: Conversation & Stakes -->
    <ConversationAndStakesPhase 
      v-if="currentPhase === 'conversation-stakes'"
      @back="prevPhase"
      @next="nextPhase"
    />

    <!-- Phase: Resolution -->
    <ResolutionPhase 
      v-if="currentPhase === 'resolution'"
      @back="prevPhase"
      @next="nextPhase"
    />

    <!-- Phase: Resolve Scene -->
    <ResolveScenePhase 
      v-if="currentPhase === 'resolve-scene'"
      @back="prevPhase"
      @next="nextPhase"
    />

    <!-- Phase: Fallout -->
    <FalloutPhase 
      v-if="currentPhase === 'fallout'"
      @back="prevPhase"
    />

    <!-- Win Screen -->
    <WinScreen 
      v-if="currentPhase === 'win'" 
    />

    <!-- Debug Toggle -->
    <div v-if="isDev" class="fixed bottom-4 right-4 z-50" :class="{ 'mb-24': debugMode }">
      <Button 
        @click="debugMode = !debugMode"
        variant="debug"
        size="xs"
      >
        {{ debugMode ? 'Hide Debug' : 'Show Debug' }}
      </Button>
    </div>

    <!-- Debug Panel Component -->
    <DebugPanel v-if="isDev && debugMode" />
  </div>
</template>
