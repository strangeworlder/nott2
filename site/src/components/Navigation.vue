<script setup lang="ts">
/**
 * Navigation (Wrapper)
 *
 * Philosophical:
 * The map of the world. It provides orientation and transit options, changing its
 * appearance to match the thematic landscape of the playset.
 *
 * Technical:
 * Dynamically loads the `Navigation` component based on the `selectedPlayset`.
 * Falls back to `defaults/Navigation.vue`.
 */
import { type Component, defineAsyncComponent, shallowRef, watchEffect } from 'vue';
import { useLivePlay } from '../composables/useLivePlay';
import { getPlaysetConfig } from '../utils/contentLoader';
import DefaultComponent from './defaults/Navigation.vue';

const { selectedPlayset } = useLivePlay();
const playsetComponents = import.meta.glob('./playsets/**/Navigation.vue');
const currentComponent = shallowRef<Component>(DefaultComponent);

watchEffect(() => {
  const playsetId = selectedPlayset.value;
  if (!playsetId || playsetId === 'default') {
    currentComponent.value = DefaultComponent;
    return;
  }

  const config = getPlaysetConfig(playsetId);
  if (config.overrides?.Navigation) {
    const path = `./playsets/${playsetId}/Navigation.vue`;
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
  <component :is="currentComponent">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </component>
</template>
