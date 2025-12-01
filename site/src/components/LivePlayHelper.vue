<script setup lang="ts">
import { useLivePlay } from '../composables/useLivePlay'
import Text from './Text.vue'
import Button from './Button.vue'

// Import Steps
import GameSetup from './live-play/GameSetup.vue'
import SceneSetup from './live-play/SceneSetup.vue'
import ConversationPhase from './live-play/ConversationPhase.vue'
import StakesPhase from './live-play/StakesPhase.vue'
import ResolutionPhase from './live-play/ResolutionPhase.vue'
import FalloutPhase from './live-play/FalloutPhase.vue'

const { 
  currentStep, 
  isEndgame, 
  trophyTop, 
  fullReset, 
  startGame, 
  debugMode,
  middleStack,
  bottomStack,
  reserveQueue,
  trophyPile,
  weaknessesFound,
  strikes,
  getRankName
} = useLivePlay()

const nextStep = () => {
  if (currentStep.value < 6) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}
</script>

<template>
  <div class="min-h-screen bg-nott-black text-nott-white flex flex-col items-center p-4 md:p-8">
    <!-- Header -->
    <div class="w-full max-w-4xl flex justify-between items-center mb-8">
      <div class="flex flex-col">
        <Text variant="h3" color="red">Live Play Helper</Text>
        <Text v-if="trophyTop" variant="caption" color="muted">Base Difficulty: <span class="text-nott-white font-bold">{{ trophyTop.rank }}</span></Text>
      </div>
      <Button variant="secondary" @click="fullReset" class="text-xs px-3 py-1 h-8">Reset Game</Button>
    </div>

    <!-- Step 1: Game Setup / Endgame Setup -->
    <GameSetup 
      v-if="currentStep === 1"
      :is-endgame="isEndgame"
      @next="startGame"
    />

    <!-- Step 2: Scene Setup (Draw Threat) -->
    <SceneSetup 
      v-if="currentStep === 2"
      @back="prevStep"
      @next="nextStep"
    />

    <!-- Step 3: Conversation -->
    <ConversationPhase 
      v-if="currentStep === 3"
      @back="prevStep"
      @next="nextStep"
    />

    <!-- Step 4: Stakes -->
    <StakesPhase 
      v-if="currentStep === 4"
      @back="prevStep"
      @next="nextStep"
    />

    <!-- Step 5: Resolution -->
    <ResolutionPhase 
      v-if="currentStep === 5"
      @back="prevStep"
      @next="nextStep"
    />

    <!-- Step 6: Update Game State -->
    <FalloutPhase 
      v-if="currentStep === 6"
      @back="prevStep"
    />

    <!-- Debug Toggle -->
    <button 
      @click="debugMode = !debugMode"
      class="fixed bottom-4 right-4 z-50 bg-black/80 text-green-400 border border-green-500/30 px-2 py-1 text-xs font-mono rounded hover:bg-green-900/50"
      :class="{ 'mb-24': debugMode }"
    >
      {{ debugMode ? 'Hide Debug' : 'Show Debug' }}
    </button>
    <div v-if="debugMode" class="fixed bottom-0 left-0 right-0 bg-black/90 text-xs text-green-400 p-2 font-mono border-t border-green-500/30 overflow-x-auto z-50">
      <div class="flex gap-8 whitespace-nowrap">
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
      </div>
    </div>
  </div>
</template>
