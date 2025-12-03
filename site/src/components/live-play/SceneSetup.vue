<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLivePlay } from '../../composables/useLivePlay'

import ScenePrompt from './ScenePrompt.vue'
import Text from '../Text.vue'
import Button from '../Button.vue'
import PlayingCard from '../PlayingCard.vue'

import ActionFooter from '../ActionFooter.vue'
import ManualCardEntry from './ManualCardEntry.vue'
import { getSceneSetupContent } from '../../utils/contentLoader'


const { 
  activeCard, 
  visibleCards,
  selectedCardId,
  selectedJoker, 
  manualSuit, 
  manualRank, 
  manualJoker, 
  isEndgame,

  isRankAvailable,
  isSuitAvailable,
  addVisibleCard,
  selectCard,
  acesRemaining,
  hasFaceCardOnTable,
  getNextValidCard,
  currentAct,
  isBlackJokerRemoved,
  isFirstTime,
  selectedPlayset
} = useLivePlay()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'next'): void
}>()

const content = computed(() => getSceneSetupContent(selectedPlayset.value))

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

const explanationText = computed(() => {
  if (acesRemaining.value > 0) {
    return content.value.explanations.aces
  }
  
  if (currentAct.value === 3 || isEndgame.value) {
    return content.value.explanations.finale
  }

  return content.value.explanations.default
})
</script>

<template>
  <div class="w-full max-w-4xl mx-auto animate-fade-in">
    <div class="mb-6 text-center">
      <Text variant="quote" color="muted" v-html="explanationText"></Text>
    </div>

    <div class="space-y-8 mb-12">
      
      <!-- Card Table Area -->
      <div class="flex flex-col items-center gap-6">
        
        <!-- Guidance Text -->
        <div class="text-center animate-fade-in h-8">
            <Text v-if="canAddMore" variant="body" color="muted" v-html="content.guidance.draw"></Text>
            <Text v-else-if="!selectedCardId" variant="body" color="red" animation="pulse" v-html="content.guidance.select"></Text>
            <Text v-else variant="body" color="muted" v-html="content.guidance.selected"></Text>
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
              :selected="selectedCardId === card.id"
            />
            <div v-if="selectedCardId === card.id" class="absolute -bottom-8 left-0 right-0 text-center">
              <Text variant="label" color="red">{{ content.ui.selectedLabel }}</Text>
            </div>
          </div>
        </div>

        <!-- Face Card Warning -->
        <div v-if="hasFaceCardOnTable && visibleCards.length < 2" class="text-center animate-fade-in max-w-md">
            <Text variant="caption" color="red" v-html="content.guidance.faceCardActive"></Text>
            <Text variant="caption" color="muted" v-html="content.guidance.faceCardWarning"></Text>
        </div>

        <!-- Add Card Button / Interface -->
        <div v-if="canAddMore && !isAddingCard && !selectedJoker" class="animate-fade-in">
          <Button variant="secondary" @click="startAddCard">
            {{ content.ui.drawButton }}
          </Button>
        </div>

        <!-- Card Input Interface -->
        <ManualCardEntry
          v-if="isAddingCard"
          v-model:manualRank="manualRank"
          v-model:manualSuit="manualSuit"
          v-model:manualJoker="manualJoker"
          :is-endgame="isEndgame"
          :is-black-joker-removed="isBlackJokerRemoved"
          :is-valid-addition="isValidAddition"
          :is-rank-available="isRankAvailable"
          :is-suit-available="isSuitAvailable"
          @cancel="isAddingCard = false"
          @confirm="confirmAddCard"
        />

      </div>

      <!-- Prompt Display (Only when card selected) -->
      <div v-if="showPrompt" class="space-y-6 animate-fade-in border-t border-nott-gray/30 pt-8 mt-8">
        <div class="text-center">
             <Text variant="h3" color="red">{{ content.ui.promptTitle }}</Text>
        </div>

        <div v-if="selectedJoker" class="flex justify-center">
             <div class="w-64 h-80 rounded-xl bg-nott-black border-2 border-nott-red flex items-center justify-center">
                 <Text variant="h3" :color="selectedJoker === 'Red' ? 'red' : 'white'">{{ selectedJoker }} Joker</Text>
             </div>
        </div>

        <div v-if="activeCard || selectedJoker" class="max-w-2xl mx-auto">
          <ScenePrompt 
            :card="activeCard" 
            :selected-joker="selectedJoker"
            :is-first-time="isFirstTime"
          />
        </div>
      </div>

    </div>

    <!-- Action Footer -->
    <ActionFooter>
      <Button 
        size="lg"
        variant="primary" 
        @click="$emit('next')"
        :disabled="!showPrompt"
        class="px-12"
      >
        {{ content.ui.startButton }}
      </Button>
    </ActionFooter>
  </div>
</template>
