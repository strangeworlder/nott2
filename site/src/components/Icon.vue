<script setup lang="ts">
/**
 * Icon (Wrapper)
 *
 * Technical:
 * A wrapper component that dynamically loads either the default Icon implementation
 * or a playset-specific override. This enables visual customization per playset
 * while maintaining a consistent API.
 *
 * Props: See defaults/Icon.vue for full prop documentation.
 */

import { type Component, defineAsyncComponent, shallowRef, watchEffect } from 'vue';
import { useLivePlay } from '../composables/useLivePlay';
import { getPlaysetConfig } from '../utils/contentLoader';
import DefaultComponent from './defaults/Icon.vue';

export type IconName = 'clock' | 'users' | 'supplies' | 'Spades' | 'Hearts' | 'Clubs' | 'Diamonds';

interface Props {
  name: IconName;
  size?: number | string;
  color?: 'white' | 'red' | 'muted' | 'success';
}

defineProps<Props>();

const { selectedPlayset } = useLivePlay();
const playsetComponents = import.meta.glob('./playsets/**/Icon.vue') as Record<
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
  if (config.overrides?.Icon) {
    const path = `./playsets/${playsetId}/Icon.vue`;
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
