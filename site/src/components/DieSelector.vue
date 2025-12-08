<script setup lang="ts">
/**
 * DieSelector (Wrapper)
 *
 * Technical:
 * A wrapper component that dynamically loads either the default DieSelector
 * implementation or a playset-specific override. This enables visual customization
 * per playset while maintaining a consistent API.
 *
 * Props: See defaults/DieSelector.vue for full prop documentation.
 * Events: See defaults/DieSelector.vue for full event documentation.
 */

import { type Component, defineAsyncComponent, shallowRef, watchEffect } from 'vue';
import { useLivePlay } from '../composables/useLivePlay';
import { getPlaysetConfig } from '../utils/contentLoader';
import DefaultComponent from './defaults/DieSelector.vue';

interface Props {
  sides: number;
  modelValue: number | null;
  label?: string;
  color?: 'white' | 'red';
}

withDefaults(defineProps<Props>(), {
  color: 'white',
});

defineEmits<(e: 'update:modelValue', value: number) => void>();

const { selectedPlayset } = useLivePlay();
const playsetComponents = import.meta.glob('./playsets/**/DieSelector.vue') as Record<
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
  if (config.overrides?.DieSelector) {
    const path = `./playsets/${playsetId}/DieSelector.vue`;
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
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </component>
</template>
