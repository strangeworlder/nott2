<script setup lang="ts">
/**
 * Badge (Wrapper)
 *
 * Philosophical:
 * A mark of distinction or status. Badges highlight key attributes or states,
 * drawing the eye to critical information without overwhelming the narrative.
 *
 * Technical:
 * Dynamically loads the `Badge` component based on the `selectedPlayset`.
 * Falls back to `defaults/Badge.vue`.
 */
/**
 * Badge (Wrapper)
 *
 * Technical:
 * A wrapper component that dynamically loads either the default Badge implementation
 * or a playset-specific override. This enables visual customization per playset
 * while maintaining a consistent API.
 *
 * Props: See defaults/Badge.vue for full prop documentation.
 */

import { type Component, defineAsyncComponent, shallowRef, watchEffect } from 'vue';
import { useLivePlay } from '../composables/useLivePlay';
import { getPlaysetConfig } from '../utils/contentLoader';
import DefaultComponent from './defaults/Badge.vue';

interface Props {
  variant?: 'default' | 'outline' | 'red' | 'success' | 'danger';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
});

const { selectedPlayset } = useLivePlay();
const playsetComponents = import.meta.glob('./playsets/**/Badge.vue');
const currentComponent = shallowRef<Component>(DefaultComponent);

watchEffect(() => {
  const playsetId = selectedPlayset.value;
  if (!playsetId || playsetId === 'default') {
    currentComponent.value = DefaultComponent;
    return;
  }

  const config = getPlaysetConfig(playsetId);
  if (config.overrides?.Badge) {
    const path = `./playsets/${playsetId}/Badge.vue`;
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
