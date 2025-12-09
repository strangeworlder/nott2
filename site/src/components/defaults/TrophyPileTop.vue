<script setup lang="ts">
/**
 * TrophyPileTop
 *
 * Philosophical:
 * The Trophy Pile represents the players' accumulated successes and resources. The top card
 * sets the difficulty for future actions. It is a beacon of hope or a reminder of the
 * challenge ahead.
 *
 * Technical:
 * Displays the rank of the top card in the trophy pile.
 *
 * Props:
 * - trophyTop (Card | null): The top card of the trophy pile.
 * - isRandomized (boolean): Whether the trophy pile is randomized (unknown top card).
 */

import { computed } from 'vue';
import { getLivePlayHeaderContent } from '../../utils/contentLoader';
import Text from '../Text.vue';

interface Card {
  suit: string;
  rank: number;
}

interface Props {
  trophyTop?: Card | null;
  isRandomized?: boolean;
  availableTrophyRanks?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  trophyTop: null,
  isRandomized: false,
  availableTrophyRanks: () => [],
});

const content = getLivePlayHeaderContent();

const resolvedRank = computed(() => {
  // If randomized but only one option exists, we know the rank
  if (props.isRandomized && props.availableTrophyRanks.length === 1) {
    return props.availableTrophyRanks[0];
  }
  return props.trophyTop?.rank;
});

const isUnknown = computed(() => {
  if (props.trophyTop?.rank === 0) return true;

  if (props.isRandomized) {
    // If we have available ranks data
    if (props.availableTrophyRanks.length > 0) {
      return props.availableTrophyRanks.length > 1;
    }
    // Fallback to original logic if no ranks data
    return props.trophyTop?.suit !== 'Unknown';
  }

  return false;
});
</script>

<template>
  <div v-if="trophyTop" class="text-right">
    <Text variant="micro" color="muted">{{ content.trophyPile.label }}</Text>
    <div class="flex items-center justify-end gap-2">
      <Text variant="h3" color="white" leading="none">
        {{ isUnknown ? content.trophyPile.unknown : resolvedRank }}
      </Text>
    </div>

  </div>
</template>
