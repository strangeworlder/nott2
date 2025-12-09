<script setup lang="ts">
/**
 * NavButton (Wrapper)
 *
 * Philosophical:
 * A directional choice. Unlike a standard button which acts, a NavButton moves.
 * It changes the user's perspective or location within the application.
 *
 * Technical:
 * Dynamically loads the `NavButton` component based on the `selectedPlayset`.
 * Falls back to `defaults/NavButton.vue`.
 */
import { type Component, defineAsyncComponent, shallowRef, watchEffect } from 'vue';
import { useLivePlay } from '../composables/useLivePlay';
import { getPlaysetConfig } from '../utils/contentLoader';
import DefaultComponent from './defaults/NavButton.vue';

interface Props {
  active?: boolean;
}

defineProps<Props>();

const { selectedPlayset } = useLivePlay();
const playsetComponents = import.meta.glob('./playsets/**/NavButton.vue') as Record<
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
  if (config.overrides?.NavButton) {
    const path = `./playsets/${playsetId}/NavButton.vue`;
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
