<script setup lang="ts">
import { useLivePlay } from '../../composables/useLivePlay'
import Button from '../Button.vue'
import LivePlayHeader from './LivePlayHeader.vue'

// Import Steps
import WelcomeScreen from './WelcomeScreen.vue'
import GameSetup from './GameSetup.vue'
import ActSetup from './ActSetup.vue'
import SceneSetup from './SceneSetup.vue'
import ConversationAndStakesPhase from './ConversationAndStakesPhase.vue'
import ResolutionPhase from './ResolutionPhase.vue'
import ResolveScenePhase from './ResolveScenePhase.vue'
import FalloutPhase from './FalloutPhase.vue'
import WinScreen from './WinScreen.vue'

const { 
  currentPhase, 
  currentAct,
  isEndgame, 
  startEndgame,
  startGame, 
  debugMode,
  middleStack,
  bottomStack,
  reserveQueue,
  trophyPile,
  weaknessesFound,
  strikes,
  getRankName,
  tableGenrePoints,
  playerGenrePoints,
  nextPhase,
  prevPhase
} = useLivePlay()

import { watch } from 'vue'

watch(currentPhase, () => {
  window.scrollTo(0, 0)
}, { flush: 'post' })


const isDev = import.meta.env.DEV
</script>

<template>
  <div class="min-h-screen bg-nott-black text-nott-white flex flex-col items-center p-4 md:p-8">
    
    <!-- New Header (Visible on all screens except Welcome and Win, though Welcome handles its own layout) -->
    <LivePlayHeader v-if="currentPhase !== 'welcome' && currentPhase !== 'win'" />

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
      @next="isEndgame ? startEndgame() : (currentAct === 1 ? startGame() : nextPhase())"
    />

    <!-- Phase: Scene Setup (Draw Threat) -->
    <SceneSetup 
      v-if="currentPhase === 'scene-setup'"
      @back="prevPhase"
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

    <!-- Debug Panel -->
    <div v-if="debugMode" class="fixed bottom-0 left-0 right-0 bg-black/90 text-xs text-nott-green p-2 font-mono border-t border-nott-green/30 overflow-x-auto z-50">
      <div class="flex gap-8 whitespace-nowrap">
        <div>
          <strong class="text-white">Phase:</strong> {{ currentPhase }}
        </div>
        <div>
          <strong class="text-white">Middle Stack ({{ Object.values(middleStack).reduce((a, b) => a + b, 0) }}):</strong>
          <span v-for="(count, rank) in middleStack" :key="rank" class="ml-2">
            {{ rank }}:{{ count }}
          </span>
        </div>
        <div>
          <strong class="text-white">Bottom Stack ({{ Object.values(bottomStack).reduce((a, b) => a + b, 0) }}):</strong>
          <span v-for="(count, rank) in bottomStack" :key="rank" class="ml-2">
            <span v-if="count > 0">{{ rank }}:{{ count }}</span>
          </span>
        </div>
        <div>
          <strong class="text-white">Reserve Queue ({{ reserveQueue.length }}):</strong>
          {{ reserveQueue.join(', ') }}
        </div>
        <div>
          <strong class="text-white">Trophy Pile ({{ trophyPile.length }}):</strong>
          <span v-for="card in trophyPile" :key="card.id" class="ml-1">
            {{ getRankName(card.rank) }}{{ card.suit[0] }}
          </span>
        </div>
        <div>
          <strong class="text-white">Weaknesses:</strong>
          {{ weaknessesFound.join(', ') }}
        </div>
        <div>
          <strong class="text-white">Strikes:</strong> {{ strikes }}
        </div>
        <div>
          <strong class="text-white">Table GP:</strong> {{ tableGenrePoints }}
        </div>
        <div>
          <strong class="text-white">Player GP:</strong> {{ playerGenrePoints }}
        </div>
      </div>
    </div>
  </div>
</template>
