<script setup lang="ts">
/**
 * ListItem (Wrapper)
 *
 * Philosophical:
 * An individual element within a collection. It represents a single unit of data
 * or a specific option within a larger set.
 *
 * Technical:
 * Dynamically loads the `ListItem` component based on the `selectedPlayset`.
 * Falls back to `defaults/ListItem.vue`.
 */
import { type Component, defineAsyncComponent, shallowRef, watchEffect } from 'vue';
import { useLivePlay } from '../composables/useLivePlay';
import { getPlaysetConfig } from '../utils/contentLoader';
import DefaultComponent from './defaults/ListItem.vue';

interface Props {
  color?: string;
  variant?: 'default' | 'ordered';
  index?: number;
}

defineProps<Props>();

const { selectedPlayset } = useLivePlay();
const playsetComponents = import.meta.glob('./playsets/**/ListItem.vue') as Record<
  string,
  () => Promise<{ default: Component }>
>;
const currentComponent = shallowRef<Component>(DefaultComponent);

watchEffect(() => {
  const playsetId = selectedPlayset.value;
  if (!playsetId || playsetId === 'default') {
    currentComponent.value = DefaultComponent;
    return;
  }

  const config = getPlaysetConfig(playsetId);
  if (config.overrides?.ListItem) {
    const path = `./playsets/${playsetId}/ListItem.vue`;
    const loader = playsetComponents[path];
    if (loader) {
      currentComponent.value = defineAsyncComponent(loader);
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
    v-bind="$props"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </component>
</template>
