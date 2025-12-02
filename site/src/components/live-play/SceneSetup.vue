<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLivePlay } from '../../composables/useLivePlay'
import Card from '../Card.vue'
import ScenePrompt from './ScenePrompt.vue'
import Text from '../Text.vue'
import Button from '../Button.vue'
import PlayingCard from '../PlayingCard.vue'
import SelectionButton from '../SelectionButton.vue'
import type { Suit, Rank } from '../../composables/useGameEngine'

const { 
  activeCard, 
  visibleCards,
  selectedCardId,
  selectedJoker, 
  manualSuit, 
  manualRank, 
  manualJoker, 
  isEndgame,
  currentPrompt,
  isRankAvailable,
  isSuitAvailable,
  addVisibleCard,
  selectCard,
  acesRemaining,
  hasFaceCardOnTable,
  getNextValidCard,
  currentAct
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

const isAddingCard = ref(false)
const targetVisibleCount = computed(() => {
  // If there are Aces remaining in the deck, OR if there is an Ace currently on the table, target is 1.
  // We only move to 2 cards when all Aces are cleared from play.
  const hasAceOnTable = visibleCards.value.some(c => c.rank === 1)
  return (acesRemaining.value > 0 || hasAceOnTable) ? 1 : 2
})

const canAddMore = computed(() => {
  // Cannot add more if a Face Card is on the table (unless it's the only card and we are just starting? No, rule says no draw)
  if (hasFaceCardOnTable.value) return false
  return visibleCards.value.length < targetVisibleCount.value
})

const isSelectionEnabled = computed(() => {
    // Can only select if we are NOT waiting to add more cards
    return !canAddMore.value
})

// Auto-select if only one card is visible AND selection is enabled
watch([visibleCards, isSelectionEnabled], ([newCards, enabled]) => {
  if (enabled && newCards.length === 1 && !selectedCardId.value) {
    selectCard(newCards[0].id)
  }
}, { immediate: true })

const startAddCard = () => {
    // Pre-fill with smart default
    const next = getNextValidCard()
    manualRank.value = next.rank
    manualSuit.value = next.suit
    isAddingCard.value = true
}

const confirmAddCard = () => {
  addVisibleCard()
  isAddingCard.value = false
}

const isValidAddition = computed(() => {
  if (manualJoker.value) return true
  return isRankAvailable(manualRank.value) && isSuitAvailable(manualRank.value, manualSuit.value)
})

const showPrompt = computed(() => {
  return !!activeCard.value || !!selectedJoker.value
})

const handleCardClick = (id: string) => {
    if (isSelectionEnabled.value) {
        selectCard(id)
    }
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto animate-fade-in">
    <div class="mb-6 text-center">
      <Text variant="quote" color="muted" class="italic">"Reveal the cards. Choose your challenge. The Suit is the nature of the threat, the Number is the severity."</Text>
    </div>

    <div class="space-y-8 mb-12">
      
      <!-- Card Table Area -->
      <div class="flex flex-col items-center gap-6">
        
        <!-- Guidance Text -->
        <div class="text-center animate-fade-in h-8">
            <Text v-if="canAddMore" variant="body" color="muted">Draw cards to populate the table...</Text>
            <Text v-else-if="!selectedCardId" variant="body" color="red" class="font-bold animate-pulse">Select a card to reveal the challenge</Text>
            <Text v-else variant="body" color="muted">Challenge selected.</Text>
        </div>

        <!-- Visible Cards Display -->
        <div v-if="visibleCards.length > 0" class="flex flex-wrap justify-center gap-4">
          <div 
            v-for="card in visibleCards" 
            :key="card.id"
            class="relative transition-transform"
            :class="{ 
                'cursor-pointer hover:scale-105': isSelectionEnabled, 
                'opacity-75 cursor-not-allowed': !isSelectionEnabled 
            }"
            @click="handleCardClick(card.id)"
          >
            <PlayingCard 
              :suit="card.suit" 
              :rank="card.rank" 
              :class="{ 'ring-4 ring-nott-red ring-offset-2 ring-offset-black': selectedCardId === card.id }"
            />
            <div v-if="selectedCardId === card.id" class="absolute -bottom-8 left-0 right-0 text-center">
              <Text variant="label" color="red">SELECTED</Text>
            </div>
          </div>
        </div>

        <!-- Face Card Warning -->
        <div v-if="hasFaceCardOnTable && visibleCards.length < 2" class="text-center animate-fade-in max-w-md">
            <Text variant="caption" color="red" class="font-bold">FACE CARD ACTIVE</Text>
            <Text variant="caption" color="muted">You cannot draw another card while a Face Card is on the table. You must deal with it.</Text>
        </div>

        <!-- Add Card Button / Interface -->
        <div v-if="canAddMore && !isAddingCard && !selectedJoker" class="animate-fade-in">
          <Button variant="secondary" @click="startAddCard">
            + Draw Card
          </Button>
        </div>

        <!-- Card Input Interface -->
        <div v-if="isAddingCard" class="w-full max-w-md animate-fade-in">
          <Card>
            <div class="space-y-6">
              <div class="space-y-2">
                <Text variant="label">Select Drawn Card</Text>
                
                <!-- Rank Grid -->
                <div class="grid grid-cols-5 gap-2">
                  <SelectionButton 
                    v-for="r in ranks" 
                    :key="r.value"
                    @click="manualRank = r.value"
                    :selected="manualRank === r.value"
                    :disabled="!isRankAvailable(r.value) || !!manualJoker"
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
                    :disabled="!isSuitAvailable(manualRank, s) || !!manualJoker"
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
                    :disabled="currentAct > 1"
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

              <div class="flex gap-2 mt-4">
                <Button variant="secondary" class="flex-1" @click="isAddingCard = false">Cancel</Button>
                <Button 
                  variant="primary"
                  class="flex-1"
                  @click="confirmAddCard"
                  :disabled="!isValidAddition"
                >
                  Add to Table
                </Button>
              </div>
            </div>
          </Card>
        </div>

      </div>

      <!-- Prompt Display (Only when card selected) -->
      <div v-if="showPrompt" class="space-y-6 animate-fade-in border-t border-nott-gray/30 pt-8 mt-8">
        <div class="text-center">
             <Text variant="h3" color="red">Challenge Selected</Text>
        </div>

        <div v-if="selectedJoker" class="flex justify-center">
             <div class="w-64 h-80 rounded-xl bg-nott-black border-2 border-nott-red flex items-center justify-center">
                 <Text variant="h3" :color="selectedJoker === 'Red' ? 'red' : 'white'">{{ selectedJoker }} Joker</Text>
             </div>
        </div>

        <div v-if="currentPrompt" class="max-w-2xl mx-auto">
          <ScenePrompt :prompt="currentPrompt" />
        </div>
      </div>

    </div>

    <!-- Action Footer -->
    <div class="flex justify-center pt-8 border-t border-nott-gray/30">
      <Button 
        size="lg"
        variant="primary" 
        @click="$emit('next')"
        :disabled="!showPrompt"
        class="px-12"
      >
        Start Scene →
      </Button>
    </div>
  </div>
</template>
