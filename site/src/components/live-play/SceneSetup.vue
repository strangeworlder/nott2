<script setup lang="ts">
import { useLivePlay } from '../../composables/useLivePlay'
import WizardStep from '../WizardStep.vue'
import Card from '../Card.vue'
import Text from '../Text.vue'
import Button from '../Button.vue'
import PlayingCard from '../PlayingCard.vue'
import type { Suit, Rank } from '../../composables/useGameEngine'

const { 
  currentStep, 
  currentCard, 
  selectedJoker, 
  manualSuit, 
  manualRank, 
  manualJoker, 
  isEndgame,
  currentPrompt,
  isRankAvailable,
  isSuitAvailable,
  setManualCard
} = useLivePlay()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'next'): void
}>()

const suits: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds']
const ranks: { label: string, value: Rank }[] = [
  { label: 'A', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
  { label: 'J', value: 11 },
  { label: 'Q', value: 12 },
  { label: 'K', value: 13 },
]

const suitIcons: Record<string, string> = {
  'Spades': '♠', 'Hearts': '♥', 'Clubs': '♣', 'Diamonds': '♦',
}
const suitColors: Record<string, string> = {
  'Spades': '', 'Hearts': 'text-nott-red', 'Clubs': '', 'Diamonds': 'text-nott-red',
}

const confirmCardSelection = () => {
  setManualCard()
}
</script>

<template>
  <WizardStep
    title="Scene Setup"
    :step-number="2"
    :total-steps="6"
    :can-proceed="!!currentCard || !!selectedJoker"
    show-back
    @back="emit('back')"
    @next="emit('next')"
  >
    <div class="mb-6 text-center">
      <Text variant="quote" color="muted" class="italic">"Reveal the top card of the Threat Deck. This is the Threat Card. It tells you what the next challenge is. The Suit is the nature of the threat, the Number is the severity."</Text>
    </div>

    <div class="space-y-8">
      <div v-if="!currentCard && !selectedJoker" class="text-center py-12">
        <Text variant="quote" class="mb-8">Draw a card from your physical deck...</Text>
        
        <div class="max-w-md mx-auto bg-nott-white/5 p-6 rounded border border-nott-gray/50 space-y-6">
          <div class="space-y-2">
            <Text variant="label">Select Card</Text>
            
            <!-- Rank Grid -->
            <div class="grid grid-cols-5 gap-2">
              <button 
                v-for="r in ranks" 
                :key="r.value"
                @click="manualRank = r.value"
                :disabled="!isRankAvailable(r.value)"
                class="h-10 rounded border font-display text-lg transition-all duration-200 flex items-center justify-center"
                :class="[
                  manualRank === r.value 
                    ? 'bg-nott-red border-nott-red text-white' 
                    : 'bg-nott-black border-nott-gray text-nott-white hover:border-nott-red/50',
                  !isRankAvailable(r.value) ? 'opacity-20 cursor-not-allowed' : ''
                ]"
              >
                {{ r.label }}
              </button>
            </div>

            <!-- Suit Grid -->
            <div class="grid grid-cols-4 gap-2 mt-4">
              <button 
                v-for="s in suits" 
                :key="s"
                @click="manualSuit = s"
                class="h-12 rounded border font-display text-2xl transition-all duration-200 flex items-center justify-center"
                :class="[
                  manualSuit === s 
                    ? 'bg-nott-white border-nott-white text-nott-black' 
                    : 'bg-nott-black border-nott-gray hover:border-nott-white/50',
                  suitColors[s],
                  !isSuitAvailable(manualRank, s) ? 'opacity-20 cursor-not-allowed' : ''
                ]"
                :disabled="!isSuitAvailable(manualRank, s)"
              >
                {{ suitIcons[s] }}
              </button>
            </div>
          </div>

          <div v-if="isEndgame" class="border-t border-nott-gray/30 pt-4">
            <Text variant="label" class="mb-2">Or Joker?</Text>
            <div class="flex gap-4 justify-center">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="manualJoker" value="Red" class="text-nott-red focus:ring-nott-red bg-nott-black border-nott-gray">
                <span class="text-nott-red font-display">Red</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="manualJoker" value="Black" class="text-nott-white focus:ring-nott-white bg-nott-black border-nott-gray">
                <span class="text-nott-white font-display">Black</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="manualJoker" :value="null" class="text-nott-gray focus:ring-nott-gray bg-nott-black border-nott-gray">
                <span class="text-nott-gray font-display">None</span>
              </label>
            </div>
          </div>

          <Button 
            variant="primary"
            class="w-full mt-4"
            @click="confirmCardSelection"
          >
            REVEAL PROMPT
          </Button>
        </div>
      </div>

      <div v-else class="space-y-6 animate-fade-in">
        <!-- Card Display -->
        <div class="flex justify-center">
          <PlayingCard 
            v-if="currentCard"
            :suit="currentCard.suit"
            :rank="currentCard.rank"
          />
          <div v-else-if="selectedJoker" class="w-64 h-80 rounded-xl bg-nott-black border-2 border-nott-red flex items-center justify-center">
             <Text variant="h3" :color="selectedJoker === 'Red' ? 'red' : 'white'">{{ selectedJoker }} Joker</Text>
          </div>
        </div>

        <!-- Prompt Display -->
        <div v-if="currentPrompt" class="max-w-2xl mx-auto">
          <Card class="text-center py-8 border-nott-red/50">
            <Text variant="quote">"{{ currentPrompt }}"</Text>
          </Card>
        </div>
      </div>
    </div>
  </WizardStep>
</template>
