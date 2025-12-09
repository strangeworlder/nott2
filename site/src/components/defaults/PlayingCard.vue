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
 * A complex component rendering a standard playing card or Joker with realistic
 * pip layouts matching actual playing cards.
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
import Icon from '../Icon.vue';

type SuitName = 'Spades' | 'Hearts' | 'Clubs' | 'Diamonds';

interface Props {
  suit?: string;
  rank?: number;
  isFace?: boolean;
  selected?: boolean;
  isJoker?: boolean;
  jokerColor?: 'Red' | 'Black';
}

const props = defineProps<Props>();

// Suit color classes
const suitColors: Record<string, string> = {
  Spades: 'text-nott-black',
  Hearts: 'text-nott-red',
  Clubs: 'text-nott-black',
  Diamonds: 'text-nott-red',
};

const rankName = computed(() => {
  if (!props.rank) return '';
  if (props.rank === 1) return 'A';
  if (props.rank === 11) return 'J';
  if (props.rank === 12) return 'Q';
  if (props.rank === 13) return 'K';
  return props.rank.toString();
});

const isFaceCard = computed(() => props.rank && props.rank >= 11 && props.rank <= 13);
const isAce = computed(() => props.rank === 1);

// Pip positions for each rank (coordinates as percentages)
// Grid is conceptually 3 columns x 5 rows
const pipLayouts: Record<number, { x: number; y: number; rotate?: boolean }[]> = {
  // Ace - 1 large center
  1: [{ x: 50, y: 50 }],

  // 2 - top and bottom center
  2: [
    { x: 50, y: 20 },
    { x: 50, y: 80, rotate: true },
  ],

  // 3 - top, center, bottom
  3: [
    { x: 50, y: 20 },
    { x: 50, y: 50 },
    { x: 50, y: 80, rotate: true },
  ],

  // 4 - four corners
  4: [
    { x: 30, y: 20 },
    { x: 70, y: 20 },
    { x: 30, y: 80, rotate: true },
    { x: 70, y: 80, rotate: true },
  ],

  // 5 - four corners + center
  5: [
    { x: 30, y: 20 },
    { x: 70, y: 20 },
    { x: 50, y: 50 },
    { x: 30, y: 80, rotate: true },
    { x: 70, y: 80, rotate: true },
  ],

  // 6 - two columns of 3
  6: [
    { x: 30, y: 20 },
    { x: 70, y: 20 },
    { x: 30, y: 50 },
    { x: 70, y: 50 },
    { x: 30, y: 80, rotate: true },
    { x: 70, y: 80, rotate: true },
  ],

  // 7 - six + one center-top
  7: [
    { x: 30, y: 20 },
    { x: 70, y: 20 },
    { x: 50, y: 35 },
    { x: 30, y: 50 },
    { x: 70, y: 50 },
    { x: 30, y: 80, rotate: true },
    { x: 70, y: 80, rotate: true },
  ],

  // 8 - six + two center
  8: [
    { x: 30, y: 20 },
    { x: 70, y: 20 },
    { x: 50, y: 35 },
    { x: 30, y: 50 },
    { x: 70, y: 50 },
    { x: 50, y: 65, rotate: true },
    { x: 30, y: 80, rotate: true },
    { x: 70, y: 80, rotate: true },
  ],

  // 9 - eight + center
  9: [
    { x: 30, y: 15 },
    { x: 70, y: 15 },
    { x: 30, y: 38 },
    { x: 70, y: 38 },
    { x: 50, y: 50 },
    { x: 30, y: 62, rotate: true },
    { x: 70, y: 62, rotate: true },
    { x: 30, y: 85, rotate: true },
    { x: 70, y: 85, rotate: true },
  ],

  // 10 - 4+2+4 pattern
  10: [
    { x: 30, y: 15 },
    { x: 70, y: 15 },
    { x: 50, y: 28 },
    { x: 30, y: 38 },
    { x: 70, y: 38 },
    { x: 30, y: 62, rotate: true },
    { x: 70, y: 62, rotate: true },
    { x: 50, y: 72, rotate: true },
    { x: 30, y: 85, rotate: true },
    { x: 70, y: 85, rotate: true },
  ],

  // Face cards - single large center (handled differently in template)
  11: [{ x: 50, y: 50 }],
  12: [{ x: 50, y: 50 }],
  13: [{ x: 50, y: 50 }],
};

const currentPipLayout = computed(() => {
  if (!props.rank) return [];
  return pipLayouts[props.rank] || [];
});

const pipSize = computed(() => {
  if (isAce.value) return 64;
  if (isFaceCard.value) return 80;
  return 28;
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
      <!-- Corner Ranks - Top Left -->
      <div class="absolute top-2 left-2 flex flex-col items-center" :class="suitColors[suit]">
        <span class="text-xl font-display font-bold leading-none">{{ rankName }}</span>
        <Icon :name="suit as SuitName" :size="16" />
      </div>
      
      <!-- Corner Ranks - Bottom Right (inverted) -->
      <div class="absolute bottom-2 right-2 flex flex-col items-center rotate-180" :class="suitColors[suit]">
        <span class="text-xl font-display font-bold leading-none">{{ rankName }}</span>
        <Icon :name="suit as SuitName" :size="16" />
      </div>

      <!-- Pip Area -->
      <div class="absolute inset-0 mx-8 my-10" :class="suitColors[suit]">
        <!-- Face Card - Large centered icon with text -->
        <template v-if="isFaceCard">
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <Icon :name="suit as SuitName" :size="pipSize" />
            <div class="mt-2 text-2xl font-display uppercase tracking-widest text-nott-black/80">
              {{ rank === 11 ? 'Jack' : rank === 12 ? 'Queen' : 'King' }}
            </div>
          </div>
        </template>
        
        <!-- Ace - Large centered icon -->
        <template v-else-if="isAce">
          <div class="absolute inset-0 flex items-center justify-center">
            <Icon :name="suit as SuitName" :size="pipSize" />
          </div>
        </template>
        
        <!-- Number Cards - Pip layout -->
        <template v-else>
          <Icon
            v-for="(pip, i) in currentPipLayout"
            :key="i"
            :name="suit as SuitName"
            :size="pipSize"
            class="absolute -translate-x-1/2 -translate-y-1/2"
            :class="{ 'rotate-180': pip.rotate }"
            :style="{ left: `${pip.x}%`, top: `${pip.y}%` }"
          />
        </template>
      </div>
    </template>
  </div>
</template>
