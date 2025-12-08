<script setup lang="ts">
/**
 * WinScreen
 *
 * Philosophical:
 * The WinScreen is catharsis—the release of tension after surviving the Night.
 * It celebrates the players' victory over the horror, acknowledging their triumph
 * with gravitas. The screen should feel earned, providing closure and a sense of
 * accomplishment after the perilous journey.
 *
 * Technical:
 * A full-screen victory display component.
 *
 * Props:
 * (None - uses useLivePlay composable for reset)
 */

import { useLivePlay } from '../../composables/useLivePlay';
import { getWinScreenContent } from '../../utils/contentLoader';

const { fullReset, selectedPlayset } = useLivePlay();
const content = getWinScreenContent(selectedPlayset.value);
</script>

<template>
  <div class="fixed inset-0 z-50 bg-nott-black flex flex-col items-center justify-center p-8 text-center animate-fade-in">
    <div class="max-w-2xl space-y-8">
      <Text variant="hero" color="red" class="mb-4">{{ content.title }}</Text>
      
      <Text variant="quote" color="muted">
        {{ content.subtitle }}
        <br>
        {{ content.body }}
      </Text>

      <div class="pt-12">
        <ActionFooter 
          :label="content.buttonText"
          @click="fullReset"
        />
      </div>
    </div>
  </div>
</template>
