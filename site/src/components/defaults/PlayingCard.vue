<script setup lang="ts">
/**
 * PlayingCard
 *
 * Philosophical:
 * The PlayingCard is the central totem of the game's aesthetic. It is not merely a
 * UI element but a diegetic object that anchors the digital game in the physical world
 * of cards, chance, and fate. It carries the weight of the game's core mechanic.
 * Its visual fidelity—the suits, the layout, the selection glow—is crucial for
 * maintaining the illusion of a tabletop experience.
 *
 * Technical:
 * A complex component rendering a standard playing card or Joker.
 *
 * Props:
 * - suit (string): The suit of the card ('Spades', 'Hearts', 'Clubs', 'Diamonds').
 * - rank (number): The rank of the card (1-13).
 * - isFace (boolean): Whether the card is a face card (deprecated/unused logic might exist).
 * - selected (boolean): Whether the card is currently selected (highlighted).
 * - isJoker (boolean): Whether the card is a Joker.
 * - jokerColor (string): The color of the Joker ('Red', 'Black').
 */

import { computed } from 'vue';

interface Props {
  suit?: string;
  rank?: number;
  isFace?: boolean;
  selected?: boolean;
  isJoker?: boolean;
  jokerColor?: 'Red' | 'Black';
}

const props = defineProps<Props>();

const suitIcons: Record<string, string> = {
  Spades: '♠',
  Hearts: '♥',
  Clubs: '♣',
  Diamonds: '♦',
};

// Fixed colors for white background card
const suitColors: Record<string, string> = {
  Spades: '',
  Hearts: 'text-nott-red',
  Clubs: '',
  Diamonds: 'text-nott-red',
};

const rankName = computed(() => {
  if (!props.rank) return '';
  if (props.rank === 1) return 'Ace';
  if (props.rank === 11) return 'Jack';
  if (props.rank === 12) return 'Queen';
  if (props.rank === 13) return 'King';
  return props.rank.toString();
});

const rankChar = computed(() => {
  return rankName.value[0];
});
</script>

<template>
  <div 
    class="relative w-64 aspect-[2/3] bg-nott-white text-nott-black rounded-lg shadow-[0_0_30px_rgba(255,0,0,0.2)] flex flex-col items-center justify-center border-4 border-nott-black overflow-hidden select-none transition-transform hover:scale-105 duration-300"
    :class="{ 'ring-4 ring-nott-red ring-offset-2 ring-offset-black': selected }"
  >
    <template v-if="isJoker">
      <div class="absolute top-2 left-2 text-2xl font-display" :class="jokerColor === 'Red' ? 'text-nott-red' : ''">
        ★
      </div>
      <div class="absolute bottom-2 right-2 text-2xl font-display rotate-180" :class="jokerColor === 'Red' ? 'text-nott-red' : ''">
        ★
      </div>
      
      <div class="text-4xl font-display uppercase tracking-widest text-center" :class="jokerColor === 'Red' ? 'text-nott-red' : ''">
        {{ jokerColor }}<br>Joker
      </div>
    </template>

    <template v-else-if="suit && rank">
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
    </template>
  </div>
</template>
