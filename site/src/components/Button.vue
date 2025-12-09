<script setup lang="ts">
/**
 * Button (Wrapper)
 *
 * Philosophical:
 * The Gateway to Action. This component represents the abstract concept of a button,
 * delegating the concrete physical manifestation to the active reality (Playset).
 *
 * Technical:
 * Dynamically loads the `Button` component based on the `selectedPlayset`.
 * Falls back to `defaults/Button.vue`.
 */
import { type Component, defineAsyncComponent, shallowRef, watchEffect } from 'vue';
import { useLivePlay } from '../composables/useLivePlay';
import { getPlaysetConfig } from '../utils/contentLoader';
import DefaultComponent from './defaults/Button.vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'debug';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  block?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  block: false,
});

const { selectedPlayset } = useLivePlay();
const playsetComponents = import.meta.glob('./playsets/**/Button.vue');
const currentComponent = shallowRef<Component>(DefaultComponent);

watchEffect(() => {
  const playsetId = selectedPlayset.value;
  if (!playsetId || playsetId === 'default') {
    currentComponent.value = DefaultComponent;
    return;
  }

  const config = getPlaysetConfig(playsetId);
  if (config.overrides?.Button) {
    const path = `./playsets/${playsetId}/Button.vue`;
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
