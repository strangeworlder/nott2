<script setup lang="ts">
import { type Component, defineAsyncComponent, shallowRef, watchEffect } from 'vue';
import { useLivePlay } from '../composables/useLivePlay';
import { getPlaysetConfig } from '../utils/contentLoader';
import DefaultPlayingCard from './defaults/PlayingCard.vue';

interface Props {
  suit?: string;
  rank?: number;
  isFace?: boolean;
  selected?: boolean;
  isJoker?: boolean;
  jokerColor?: 'Red' | 'Black';
}

const props = defineProps<Props>();
const { selectedPlayset } = useLivePlay();

// Load all playset components eagerly or lazily
// We use a glob import to find all potential overrides
const playsetComponents = import.meta.glob('./playsets/**/PlayingCard.vue');

const currentComponent = shallowRef<Component>(DefaultPlayingCard);

watchEffect(() => {
  const playsetId = selectedPlayset.value;
  if (!playsetId || playsetId === 'default') {
    currentComponent.value = DefaultPlayingCard;
    return;
  }

  const config = getPlaysetConfig(playsetId);
  if (config.overrides?.PlayingCard) {
    // Construct the expected path
    const path = `./playsets/${playsetId}/PlayingCard.vue`;
    const loader = playsetComponents[path];

    if (loader) {
      // It's an async component
      currentComponent.value = defineAsyncComponent(loader as () => Promise<Component>);
    } else {
      console.warn(
        `Playset ${playsetId} requested PlayingCard override but file not found at ${path}`
      );
      currentComponent.value = DefaultPlayingCard;
    }
  } else {
    currentComponent.value = DefaultPlayingCard;
  }
});
</script>

<template>
  <component 
    :is="currentComponent" 
    v-bind="props"
  />
</template>
