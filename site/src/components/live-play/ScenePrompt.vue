<script setup lang="ts">
/**
 * ScenePrompt
 *
 * Philosophical:
 * The ScenePrompt is the oracle—translating the cold mechanics of cards into
 * evocative narrative direction. It whispers suggestions to the players, sparking
 * imagination and guiding the story. Each prompt is a seed of horror, waiting
 * to bloom in the players' collaborative telling.
 *
 * Technical:
 * A display component that shows the scene prompt based on the active card/joker.
 *
 * Props:
 * - card (object): The active card with rank and suit.
 * - selectedJoker ('Red' | 'Black' | null): The selected joker, if any.
 * - isFirstTime (boolean): Whether this is the first encounter with a Face Card suit.
 * - label (string): Optional custom label for the card title.
 */

import { computed } from 'vue';
import type { Suit } from '../../composables/useGameEngine';
import { getScenePrompt } from '../../data/scenePrompts';
import Card from '../Card.vue';
import Separator from '../defaults/Separator.vue';
import Text from '../Text.vue';

const props = defineProps<{
  card?: { rank: number; suit: Suit } | null;
  selectedJoker?: 'Red' | 'Black' | null;
  isWelcomePhase?: boolean;
  label?: string;
}>();

const promptText = computed(() => {
  return getScenePrompt(
    props.card || null,
    props.selectedJoker || null,
    props.isWelcomePhase ?? true
  );
});
</script>

<template>
  <Card variant="muted" :title="label || 'SCENE PROMPT'" :interactive="false" class="text-center">
    <Text variant="quote" color="white">
      <span v-html="promptText"></span>
    </Text>
    <div class="h-px w-1/2 mx-auto bg-nott-red/30 my-2"></div>
    <Separator class="w-1/2 mx-auto my-2" />
  </Card>
</template>
