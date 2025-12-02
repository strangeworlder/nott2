<script setup lang="ts">
import { computed } from 'vue'
import { useLivePlay } from '../../composables/useLivePlay'
import Text from '../Text.vue'
import Button from '../Button.vue'

const { 
  currentAct, 
  currentPhase, 
  trophyTop, 
  isTrophyTopRandomized,
  cardName, 
  activeCard, 
  selectedJoker,
  fullReset 
} = useLivePlay()

const phaseName = computed(() => {
  switch (currentPhase.value) {
    case 'game-setup': return 'Game Setup'
    case 'scene-setup': return 'Scene Setup'
    case 'conversation-stakes': return 'The Conversation & Setting The Stakes'
    case 'resolution': return 'Resolution'
    case 'resolve-scene': return 'Narrate The Results'
    case 'fallout': return 'Deck Management'
    case 'win': return 'Victory'
    default: return ''
  }
})

const showContext = computed(() => {
  return ['conversation-stakes', 'resolution', 'resolve-scene', 'fallout'].includes(currentPhase.value)
})

const suitSymbol = computed(() => {
  if (selectedJoker.value) return '🃏'
  if (!activeCard.value) return ''
  switch (activeCard.value.suit) {
    case 'Spades': return '♠'
    case 'Hearts': return '♥'
    case 'Clubs': return '♣'
    case 'Diamonds': return '♦'
    default: return ''
  }
})

const suitColor = computed(() => {
  if (selectedJoker.value === 'Red') return 'text-nott-red'
  if (selectedJoker.value === 'Black') return 'text-nott-white'
  if (!activeCard.value) return ''
  return ['Hearts', 'Diamonds'].includes(activeCard.value.suit) ? 'text-nott-red' : 'text-nott-white'
})

const rankDisplay = computed(() => {
    if (selectedJoker.value) return ''
    if (!activeCard.value) return ''
    const r = activeCard.value.rank
    if (r === 1) return 'A'
    if (r === 11) return 'J'
    if (r === 12) return 'Q'
    if (r === 13) return 'K'
    return r.toString()
})
</script>

<template>
  <div class="w-full max-w-4xl mb-8 animate-fade-in">
    <!-- Top Bar: Act & Reset -->
    <div class="flex justify-between items-center mb-4 border-b border-nott-red/30 pb-2">
      <div class="flex items-center gap-4">
        <Text variant="caption" color="red" class="uppercase tracking-widest">
          <strong>Act {{ currentAct }}</strong>
        </Text>
        <div class="h-4 w-px bg-nott-gray/30"></div>
        <Text variant="caption" color="muted" class="uppercase tracking-wider">
          {{ phaseName }}
        </Text>
      </div>
      <Button variant="ghost" @click="fullReset" class="text-xs px-2 py-1 h-auto text-nott-gray hover:text-nott-red">
        Reset Game
      </Button>
    </div>

    <!-- Context Bar (Active Card & Difficulty) -->
    <div v-if="showContext" class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-nott-black/50 p-4 rounded-lg border border-nott-gray/20">
      
      <!-- Active Card Info -->
      <div class="flex items-center gap-3">
        <div v-if="activeCard || selectedJoker" class="flex items-center gap-3">
          <!-- Card Visual (Rank + Suit) -->
          <div class="flex items-center justify-center w-12 h-12 rounded bg-nott-white/5 border border-nott-white/10">
             <span class="text-2xl font-display font-bold" :class="suitColor">
                {{ rankDisplay }}{{ suitSymbol }}
             </span>
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

      <!-- Difficulty Info -->
      <div v-if="trophyTop" class="flex items-center gap-3">
        <div class="text-right">
          <Text variant="micro" color="muted">Top of the Trophy Pile</Text>
          <div class="flex items-center justify-end gap-2">
            <Text variant="h3" color="white" leading="none">
              {{ isTrophyTopRandomized ? 'Unknown' : trophyTop.rank }}
            </Text>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
