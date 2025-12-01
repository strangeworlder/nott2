<script setup lang="ts">
import { computed } from 'vue'
import { useLivePlay } from '../../composables/useLivePlay'
import WizardStep from '../WizardStep.vue'
import Card from '../Card.vue'
import Text from '../Text.vue'
import Button from '../Button.vue'
import PlayingCard from '../PlayingCard.vue'
import SelectionButton from '../SelectionButton.vue'
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

const isValidSelection = computed(() => {
  if (manualJoker.value) return true
  return isRankAvailable(manualRank.value) && isSuitAvailable(manualRank.value, manualSuit.value)
})
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
        
        <div class="max-w-md mx-auto">
          <Card>
            <div class="space-y-6">
              <div class="space-y-2">
                <Text variant="label">Select Card</Text>
                
                <!-- Rank Grid -->
                <div class="grid grid-cols-5 gap-2">
                  <SelectionButton 
                    v-for="r in ranks" 
                    :key="r.value"
                    @click="manualRank = r.value"
                    :selected="manualRank === r.value"
                    :disabled="!isRankAvailable(r.value)"
                    variant="square"
                    color="red"
                  >
                    {{ r.label }}
                  </SelectionButton>
                </div>

                <!-- Suit Grid -->
                <div class="grid grid-cols-4 gap-2 mt-4">
                  <SelectionButton 
                    v-for="s in suits" 
                    :key="s"
                    @click="manualSuit = s"
                    :selected="manualSuit === s"
                    :disabled="!isSuitAvailable(manualRank, s)"
                    variant="default"
                    color="default"
                    :class="suitColors[s]"
                  >
                    {{ suitIcons[s] }}
                  </SelectionButton>
                </div>
              </div>

              <div v-if="isEndgame" class="border-t border-nott-gray/30 pt-4">
                <Text variant="label" class="mb-2">Or Joker?</Text>
                <div class="flex gap-4 justify-center">
                  <SelectionButton
                    @click="manualJoker = 'Red'"
                    :selected="manualJoker === 'Red'"
                    color="red"
                    class="flex-1"
                  >
                    Red
                  </SelectionButton>
                  <SelectionButton
                    @click="manualJoker = 'Black'"
                    :selected="manualJoker === 'Black'"
                    color="default"
                    class="flex-1"
                  >
                    Black
                  </SelectionButton>
                  <SelectionButton
                    @click="manualJoker = null"
                    :selected="manualJoker === null"
                    color="default"
                    class="flex-1 text-nott-gray"
                  >
                    None
                  </SelectionButton>
                </div>
              </div>

              <Button 
                variant="primary"
                class="w-full mt-4"
                @click="confirmCardSelection"
                :disabled="!isValidSelection"
              >
                REVEAL PROMPT
              </Button>
            </div>
          </Card>
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
