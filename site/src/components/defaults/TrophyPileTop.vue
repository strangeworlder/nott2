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

import { getLivePlayHeaderContent } from '../../utils/contentLoader';
import Text from '../Text.vue';

interface Card {
  suit: string;
  rank: number;
}

interface Props {
  trophyTop?: Card | null;
  isRandomized?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  trophyTop: null,
  isRandomized: false,
});

const content = getLivePlayHeaderContent();
</script>

<template>
  <div v-if="trophyTop" class="text-right">
    <Text variant="micro" color="muted">{{ content.trophyPile.label }}</Text>
    <div class="flex items-center justify-end gap-2">
      <Text variant="h3" color="white" leading="none">
        {{ (trophyTop.rank === 0 || (isRandomized && trophyTop.suit !== 'Unknown')) ? content.trophyPile.unknown : trophyTop.rank }}
      </Text>
    </div>
  </div>
</template>
