<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  suit: string
  rank: number
  isFace?: boolean
}

const props = defineProps<Props>()

const suitIcons: Record<string, string> = {
  'Spades': '♠', 'Hearts': '♥', 'Clubs': '♣', 'Diamonds': '♦',
}

// Fixed colors for white background card
const suitColors: Record<string, string> = {
  'Spades': 'text-nott-black', 
  'Hearts': 'text-nott-red', 
  'Clubs': 'text-nott-black', 
  'Diamonds': 'text-nott-red',
}

const rankName = computed(() => {
  if (props.rank === 1) return 'Ace'
  if (props.rank === 11) return 'Jack'
  if (props.rank === 12) return 'Queen'
  if (props.rank === 13) return 'King'
  return props.rank.toString()
})

const rankChar = computed(() => {
  return rankName.value[0]
})
</script>

<template>
  <div class="relative w-64 aspect-[2/3] bg-nott-white rounded-lg shadow-[0_0_30px_rgba(255,0,0,0.2)] flex flex-col items-center justify-center border-4 border-nott-black overflow-hidden select-none transition-transform hover:scale-105 duration-300">
    <!-- Corner Ranks -->
    <div class="absolute top-2 left-2 text-2xl font-display" :class="suitColors[suit]">
      {{ rankChar }}
      <div class="text-xl">{{ suitIcons[suit] }}</div>
    </div>
    <div class="absolute bottom-2 right-2 text-2xl font-display rotate-180" :class="suitColors[suit]">
      {{ rankChar }}
      <div class="text-xl">{{ suitIcons[suit] }}</div>
    </div>

    <!-- Center Content -->
    <div class="text-6xl" :class="suitColors[suit]">
      {{ suitIcons[suit] }}
    </div>
    <div class="mt-4 text-2xl font-display uppercase tracking-widest text-nott-black">
      {{ rankName }}
    </div>
    <div class="text-sm font-display uppercase tracking-widest text-nott-black/60">
      {{ suit }}
    </div>
  </div>
</template>
