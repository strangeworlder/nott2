<script setup lang="ts">
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
    class="relative w-64 aspect-[2/3] old-card-texture text-nott-black rounded-lg shadow-[0_0_30px_rgba(255,0,0,0.2)] flex flex-col items-center justify-center border-4 border-nott-black overflow-hidden select-none transition-transform hover:scale-105 duration-300"
    :class="{ 'ring-4 ring-nott-red ring-offset-2 ring-offset-black': selected }"
  >
    <template v-if="isJoker">
      <div class="absolute top-2 left-2 text-2xl font-display" :class="jokerColor === 'Red' ? 'text-nott-red' : ''">
        🔪
      </div>
      <div class="absolute bottom-2 right-2 text-2xl font-display rotate-180" :class="jokerColor === 'Red' ? 'text-nott-red' : ''">
        🔪
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
      <div :class="[suitColors[suit], rank === 1 ? 'text-9xl scale-125' : 'text-8xl']">
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

<style scoped>
.old-card-texture {
  background-color: #fdfbf7;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E");
  box-shadow: inset 0 0 40px rgba(139, 69, 19, 0.15), 0 0 30px rgba(255,0,0,0.2);
}
</style>
