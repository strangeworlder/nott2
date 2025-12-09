<script setup lang="ts">
/**
 * Text (Wrapper)
 *
 * Philosophical:
 * The prose of the interface. Displays content that is meant to be read, usually
 * with specific typographic weighting (heading, body, caption) to imply hierarchy.
 *
 * Technical:
 * Dynamically loads the `Text` component based on the `selectedPlayset`.
 * Falls back to `defaults/Text.vue`.
 */
import { type Component, defineAsyncComponent, shallowRef, watchEffect } from 'vue';
import { useLivePlay } from '../composables/useLivePlay';
import { getPlaysetConfig } from '../utils/contentLoader';
import DefaultComponent from './defaults/Text.vue';

interface Props {
  variant?: 'hero' | 'h1' | 'h2' | 'h3' | 'lead' | 'body' | 'label' | 'caption' | 'quote' | 'micro';
  as?: string;
  color?: 'white' | 'red' | 'muted' | 'success';
  glow?: boolean;
  border?: 'none' | 'left' | 'bottom';
  align?: 'left' | 'center' | 'right' | 'justify';
  leading?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
  animation?: 'pulse' | 'none';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'body',
  color: 'white',
});

const { selectedPlayset } = useLivePlay();
const playsetComponents = import.meta.glob('./playsets/**/Text.vue');
const currentComponent = shallowRef<Component>(DefaultComponent);

watchEffect(() => {
  const playsetId = selectedPlayset.value;
  if (!playsetId || playsetId === 'default') {
    currentComponent.value = DefaultComponent;
    return;
  }

  const config = getPlaysetConfig(playsetId);
  if (config.overrides?.Text) {
    const path = `./playsets/${playsetId}/Text.vue`;
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
