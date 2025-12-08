<script setup lang="ts">
/**
 * TrophySetup
 *
 * Philosophical:
 * TrophySetup establishes the foundation upon which the game's difficulty is built.
 * The Trophy Pile represents accumulated player success, and its starting card sets
 * the initial threshold the antagonist must overcome. This ceremonial first card
 * creates narrative weight from the very beginning—players are investing in their
 * collective power before the first threat even emerges.
 *
 * Technical:
 * A phase component for manually selecting the initial Trophy Pile card.
 *
 * Props:
 * (None - uses useLivePlay composable directly)
 *
 * Events:
 * - next: Emitted when the user confirms the starting card and proceeds.
 */

import { computed } from 'vue';
import { useLivePlay } from '../../composables/useLivePlay';
import { getTrophySetupContent } from '../../utils/contentLoader';
import IngressText from '../IngressText.vue';
import Text from '../Text.vue';
import ManualCardEntry from './ManualCardEntry.vue';

const emit = defineEmits<(e: 'next') => void>();

const {
  manualRank,
  manualSuit,
  manualJoker,
  addCardToTrophyPile,
  getRankName,
  selectedPlayset,
  updateDeckState,
} = useLivePlay();

const content = computed(() => getTrophySetupContent(selectedPlayset.value));

// Initialize defaults
manualRank.value = 10;
manualSuit.value = 'Spades';

const confirmCard = () => {
  const card = {
    id: `trophy-start`,
    rank: manualRank.value,
    suit: manualSuit.value,
    name: getRankName(manualRank.value),
    description: 'Starting Trophy Card',
    type: (manualRank.value > 10 ? 'face' : 'number') as 'face' | 'number',
  };

  addCardToTrophyPile(card);

  // Mark card as drawn effectively removing it from threat deck availability
  updateDeckState(manualRank.value, manualSuit.value, 'draw');

  emit('next');
};

const isValid = computed(() => {
  if (manualJoker.value) return false; // No jokers in trophy start
  return true;
});

const isRankAvailable = (rank: number) => {
  // Trophy card must be a number card (2-10). Aces are handled separately.
  return rank >= 2 && rank <= 10;
};
</script>

<template>
  <div class="w-full max-w-4xl mx-auto animate-fade-in">
    <Text variant="h2" color="red" class="mb-2 text-center block">
      {{ content.title }}
    </Text>
    <IngressText v-html="content.ingress" />

    <div class="flex flex-col items-center gap-6 mt-8 mb-12">
        <ManualCardEntry
          v-model:manualRank="manualRank"
          v-model:manualSuit="manualSuit"
          v-model:manualJoker="manualJoker"
          :is-endgame="false"
          :is-black-joker-removed="false"
          :are-jokers-available="false"
          :is-valid-addition="isValid"
          :is-rank-available="isRankAvailable" 
          :is-suit-available="() => true"
          @cancel="$emit('next')" 
          @confirm="confirmCard"
        />
    </div>
  </div>
</template>
