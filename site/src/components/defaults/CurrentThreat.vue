<script setup lang="ts">
/**
 * CurrentThreat
 * 
 * Philosophical:
 * The Current Threat represents the immediate danger or challenge facing the protagonists.
 * It is the focal point of tension, demanding attention and resolution. Visually, it should
 * be distinct and clear, communicating the nature of the threat (suit/rank) and its narrative
 * significance (name).
 * 
 * Technical:
 * Displays the currently active card or Joker.
 * 
 * Props:
 * - activeCard (Card | null): The currently active card.
 * - selectedJoker ('Red' | 'Black' | null): The currently selected Joker, if any.
 * - cardName (string): The narrative name of the card.
 */

import { computed } from 'vue'
import Text from '../Text.vue'

interface Card {
  suit: string
  rank: number
}

interface Props {
  activeCard?: Card | null
  selectedJoker?: 'Red' | 'Black' | null
  cardName?: string
}

const props = withDefaults(defineProps<Props>(), {
  activeCard: null,
  selectedJoker: null,
  cardName: '',
})

const suitSymbol = computed(() => {
  if (props.selectedJoker) return '🃏'
  if (!props.activeCard) return ''
  switch (props.activeCard.suit) {
    case 'Spades': return '♠'
    case 'Hearts': return '♥'
    case 'Clubs': return '♣'
    case 'Diamonds': return '♦'
    default: return ''
  }
})

const suitColor = computed(() => {
  if (props.selectedJoker === 'Red') return 'text-nott-red'
  if (props.selectedJoker === 'Black') return 'text-nott-white'
  if (!props.activeCard) return ''
  return ['Hearts', 'Diamonds'].includes(props.activeCard.suit) ? 'text-nott-red' : 'text-nott-white'
})

const rankDisplay = computed(() => {
    if (props.selectedJoker) return ''
    if (!props.activeCard) return ''
    const r = props.activeCard.rank
    if (r === 1) return 'A'
    if (r === 11) return 'J'
    if (r === 12) return 'Q'
    if (r === 13) return 'K'
    return r.toString()
})
</script>

<template>
  <div class="flex items-center gap-3">
    <div v-if="activeCard || selectedJoker" class="flex items-center gap-3">
      <!-- Card Visual (Rank + Suit) -->
      <div class="flex items-center justify-center w-12 h-12 rounded bg-nott-white/5 border border-nott-white/10">
         <Text variant="h3" :class="suitColor" leading="none">
            {{ rankDisplay }}{{ suitSymbol }}
         </Text>
      </div>
      
      <div class="flex flex-col">
        <Text variant="micro" color="muted">Current Threat</Text>
        <Text variant="body" leading="none"><strong>{{ cardName }}</strong></Text>
      </div>
    </div>
    <div v-else>
        <Text variant="body" color="muted"><em>No active threat</em></Text>
    </div>
  </div>
</template>
