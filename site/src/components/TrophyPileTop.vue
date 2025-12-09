<script setup lang="ts">
/**
 * TrophyPileTop (Wrapper)
 *
 * Philosophical:
 * The prize of victory. It displays the most recently conquered challenge, symbolizing
 * the player's momentum and the resources they have accumulated.
 *
 * Technical:
 * Dynamically loads the `TrophyPileTop` component based on the `selectedPlayset`.
 * Falls back to `defaults/TrophyPileTop.vue`.
 */
import { type Component, defineAsyncComponent, shallowRef, watchEffect } from 'vue';
import { useLivePlay } from '../composables/useLivePlay';
import { getPlaysetConfig } from '../utils/contentLoader';
import DefaultComponent from './defaults/TrophyPileTop.vue';

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

const { selectedPlayset } = useLivePlay();
const playsetComponents = import.meta.glob('./playsets/**/TrophyPileTop.vue');
const currentComponent = shallowRef<Component>(DefaultComponent);

watchEffect(() => {
  const playsetId = selectedPlayset.value;
  if (!playsetId || playsetId === 'default') {
    currentComponent.value = DefaultComponent;
    return;
  }

  const config = getPlaysetConfig(playsetId);
  if (config.overrides?.TrophyPileTop) {
    const path = `./playsets/${playsetId}/TrophyPileTop.vue`;
    const loader = playsetComponents[path];
    if (loader) {
      currentComponent.value = defineAsyncComponent(loader as () => Promise<Component>);
    } else {
      currentComponent.value = DefaultComponent;
    }
  } else {
    currentComponent.value = DefaultComponent;
  }
});
</script>

<template>
  <component 
    :is="currentComponent" 
    v-bind="props"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </component>
</template>
