<script setup lang="ts">
import { ref, computed } from 'vue'
import { getScenePrompt, cardPrompts } from '../../data/scenePrompts'
import type { Suit } from '../../composables/useGameEngine'
import Card from '../Card.vue'
import Button from '../Button.vue'
import Text from '../Text.vue'
import SelectionButton from '../SelectionButton.vue'

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
  'Spades': '',
  'Hearts': 'text-nott-red',
  'Clubs': '',
  'Diamonds': 'text-nott-red',
}

const currentSuitData = computed(() => {
  return cardPrompts.suits.find(p => p.suit === selectedSuit.value)
})

// Filter out Joker for the UI matrix
const displaySuits = computed(() => {
  return cardPrompts.suits.filter(s => s.suit !== 'Joker')
})

const currentPrompt = computed(() => {
  if (!selectedSuit.value || !selectedRank.value) return null

  // Use the shared helper
  const card = { rank: selectedRank.value, suit: selectedSuit.value as Suit }
  return getScenePrompt(card, null, isFirstTime.value)
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
        v-for="suit in displaySuits"
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
          <Text variant="h3" class="mb-2">
            <span :class="suitColors[selectedSuit]">{{ suitIcons[selectedSuit] }}</span>
            {{ selectedSuit }}
          </Text>
          <Text variant="label" color="red">{{ currentSuitData.theme }}</Text>
        </div>

        <!-- Rank Buttons -->
        <div class="flex flex-wrap justify-center gap-2">
          <!-- Ace -->
          <SelectionButton
            @click="selectedRank = 1"
            :selected="selectedRank === 1"
            variant="square"
            color="red"
          >
            A
          </SelectionButton>
          
          <!-- Numbers 2-10 -->
          <SelectionButton
            v-for="rank in 9"
            :key="rank + 1"
            @click="selectedRank = rank + 1"
            :selected="selectedRank === rank + 1"
            variant="square"
            color="red"
          >
            {{ rank + 1 }}
          </SelectionButton>

          <!-- Face Cards -->
          <SelectionButton
            v-for="rank in [11, 12, 13]"
            :key="rank"
            @click="selectedRank = rank"
            :selected="selectedRank === rank"
            variant="square"
            color="red"
          >
            {{ getRankLabel(rank) }}
          </SelectionButton>
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
             <Text variant="h2" color="red" class="mb-4">{{ getRankLabel(selectedRank) }}</Text>
             <Text variant="quote">
               <span v-html="currentPrompt"></span>
             </Text>
           </Card>
        </div>
        <div v-else class="text-center text-nott-white/40 italic mt-8">
          <Text variant="caption" color="muted">Select a rank to reveal the prompt...</Text>
        </div>
      </div>
    </Transition>
  </div>
</template>
