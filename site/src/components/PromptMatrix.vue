<script setup lang="ts">
import { ref, computed } from 'vue'
import { fullPromptMatrix, faceCardPrompts, faceCardPrompt } from '../data/rules'
import Card from './Card.vue'
import Button from './Button.vue'

const selectedSuit = ref<string | null>(null)
const selectedRank = ref<number | null>(null)
const isFirstTime = ref(true)

const suitIcons: Record<string, string> = {
  'Spades': '♠',
  'Hearts': '♥',
  'Clubs': '♣',
  'Diamonds': '♦',
}

const suitColors: Record<string, string> = {
  'Spades': 'text-nott-white',
  'Hearts': 'text-nott-red',
  'Clubs': 'text-nott-white',
  'Diamonds': 'text-nott-red',
}

const currentSuitData = computed(() => {
  return fullPromptMatrix.find(p => p.suit === selectedSuit.value)
})

const currentPrompt = computed(() => {
  if (!selectedSuit.value || !selectedRank.value) return null

  // Face Cards
  if (selectedRank.value > 10) {
    const faceData = faceCardPrompts.find(s => s.suit === selectedSuit.value)
    if (!faceData) return null
    
    if (selectedRank.value === 11) return `${faceCardPrompt} ${isFirstTime.value ? faceData.jack.firstTime : faceData.jack.recurring}`
    if (selectedRank.value === 12) return `${faceCardPrompt} ${isFirstTime.value ? faceData.queen.firstTime : faceData.queen.recurring}`
    if (selectedRank.value === 13) return `${faceCardPrompt} ${isFirstTime.value ? faceData.king.firstTime : faceData.king.recurring}`
  }

  // Number Cards & Ace
  return currentSuitData.value?.prompts.find(p => p.rank === selectedRank.value)?.prompt
})

const selectSuit = (suit: string) => {
  selectedSuit.value = suit
  selectedRank.value = null // Reset rank when suit changes
  isFirstTime.value = true
}

const getRankLabel = (rank: number) => {
  if (rank === 1) return 'A'
  if (rank === 11) return 'J'
  if (rank === 12) return 'Q'
  if (rank === 13) return 'K'
  return rank.toString()
}
</script>

<template>
  <div class="space-y-8">
    <!-- Suit Selection -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Button
        v-for="suit in fullPromptMatrix"
        :key="suit.suit"
        :variant="selectedSuit === suit.suit ? 'primary' : 'secondary'"
        class="h-32 flex flex-col items-center justify-center gap-3 transition-all duration-300"
        @click="selectSuit(suit.suit)"
      >
        <span 
          class="text-5xl transition-colors duration-300" 
          :class="selectedSuit === suit.suit ? 'text-white' : suitColors[suit.suit]"
        >
          {{ suitIcons[suit.suit] }}
        </span>
        <span class="text-sm font-display uppercase tracking-widest">{{ suit.suit }}</span>
      </Button>
    </div>

    <!-- Rank Selection & Prompt Display -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-4 opacity-0"
    >
      <div v-if="selectedSuit && currentSuitData" class="space-y-6">
        <div class="text-center">
          <h3 class="text-2xl font-display text-nott-white mb-2">
            <span :class="suitColors[selectedSuit]">{{ suitIcons[selectedSuit] }}</span>
            {{ selectedSuit }}
          </h3>
          <p class="text-nott-red uppercase tracking-widest text-sm">{{ currentSuitData.theme }}</p>
        </div>

        <!-- Rank Buttons -->
        <div class="flex flex-wrap justify-center gap-2">
          <!-- Ace -->
          <button
            @click="selectedRank = 1"
            class="w-10 h-10 rounded border transition-all duration-200 font-display text-lg flex items-center justify-center"
            :class="[
              selectedRank === 1
                ? 'bg-nott-red border-nott-red text-nott-white shadow-[0_0_10px_rgba(138,0,0,0.5)]'
                : 'bg-nott-black border-nott-gray text-nott-white/60 hover:border-nott-red hover:text-nott-white'
            ]"
          >
            A
          </button>
          
          <!-- Numbers 2-10 -->
          <button
            v-for="rank in 9"
            :key="rank + 1"
            @click="selectedRank = rank + 1"
            class="w-10 h-10 rounded border transition-all duration-200 font-display text-lg flex items-center justify-center"
            :class="[
              selectedRank === rank + 1
                ? 'bg-nott-red border-nott-red text-nott-white shadow-[0_0_10px_rgba(138,0,0,0.5)]'
                : 'bg-nott-black border-nott-gray text-nott-white/60 hover:border-nott-red hover:text-nott-white'
            ]"
          >
            {{ rank + 1 }}
          </button>

          <!-- Face Cards -->
          <button
            v-for="rank in [11, 12, 13]"
            :key="rank"
            @click="selectedRank = rank"
            class="w-10 h-10 rounded border transition-all duration-200 font-display text-lg flex items-center justify-center"
            :class="[
              selectedRank === rank
                ? 'bg-nott-red border-nott-red text-nott-white shadow-[0_0_10px_rgba(138,0,0,0.5)]'
                : 'bg-nott-black border-nott-gray text-nott-white/60 hover:border-nott-red hover:text-nott-white'
            ]"
          >
            {{ getRankLabel(rank) }}
          </button>
        </div>

        <!-- First Time Toggle for Face Cards -->
        <div v-if="selectedRank && selectedRank > 10" class="flex justify-center animate-fade-in">
          <button 
            @click="isFirstTime = !isFirstTime"
            class="text-xs uppercase tracking-widest px-4 py-2 rounded border transition-all duration-200"
            :class="isFirstTime ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-nott-white/30 text-nott-white/60 hover:border-nott-white hover:text-nott-white'"
          >
            {{ isFirstTime ? 'First Encounter' : 'Recurring Nightmare' }}
          </button>
        </div>

        <!-- Prompt Card -->
        <div v-if="selectedRank" class="max-w-2xl mx-auto">
           <Card class="text-center py-8">
             <div class="text-4xl font-display text-nott-red mb-4">{{ getRankLabel(selectedRank) }}</div>
             <p class="text-xl md:text-2xl text-nott-white leading-relaxed">
               "{{ currentPrompt }}"
             </p>
           </Card>
        </div>
        <div v-else class="text-center text-nott-white/40 italic mt-8">
          Select a rank to reveal the prompt...
        </div>
      </div>
    </Transition>
  </div>
</template>
