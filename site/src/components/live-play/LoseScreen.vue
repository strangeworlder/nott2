<script setup lang="ts">
/**
 * LoseScreen
 *
 * Philosophical:
 * The LoseScreen is the bitter end—where the horror wins and the night claims its
 * victims. It does not celebrate failure but acknowledges it with the same gravitas
 * as victory. This screen provides closure, even in defeat, and offers the players
 * a chance to begin anew. Every good horror story needs the possibility of doom.
 *
 * Technical:
 * A defeat display component shown when all characters are eliminated.
 *
 * Props:
 * (None - uses useLivePlay composable for reset)
 */

import { useLivePlay } from '../../composables/useLivePlay';
import { getLoseScreenContent } from '../../utils/contentLoader';
import ActionFooter from '../ActionFooter.vue';
import Card from '../Card.vue';
import Text from '../Text.vue';

const { fullReset, selectedPlayset } = useLivePlay();
const content = getLoseScreenContent(selectedPlayset.value);
</script>

<template>
  <div class="w-full mx-auto animate-fade-in flex flex-col items-center justify-center min-h-[50vh] space-y-8">
    <div class="text-center space-y-4">
      <Text variant="h1" color="red" class="animate-pulse">{{ content.title }}</Text>
      <Text variant="body" color="muted">{{ content.subtitle }}</Text>
    </div>

    <Card variant="failure" class="w-full max-w-md text-center">
        <Text variant="quote" color="red" glow>
            {{ content.quote }}
        </Text>
    </Card>

    <ActionFooter 
      :label="content.buttonText"
      @click="fullReset"
    />
  </div>
</template>
