<script setup lang="ts">
/**
 * ActionFooter (Wrapper)
 *
 * Philosophical:
 * The point of commitment. This component houses the primary actions that drive the
 * game forward, ensuring they are presented with appropriate gravity.
 *
 * Technical:
 * Dynamically loads the `ActionFooter` component based on the `selectedPlayset`.
 * Falls back to `defaults/ActionFooter.vue`.
 */
import { type Component, defineAsyncComponent, shallowRef, watchEffect } from 'vue';
import { useLivePlay } from '../composables/useLivePlay';
import { getPlaysetConfig } from '../utils/contentLoader';
import DefaultComponent from './defaults/ActionFooter.vue';

interface Props {
  label?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'debug';
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Continue',
  disabled: false,
  variant: 'primary',
});

const emit = defineEmits<(e: 'click') => void>();

const { selectedPlayset } = useLivePlay();
const playsetComponents = import.meta.glob('./playsets/**/ActionFooter.vue');
const currentComponent = shallowRef<Component>(DefaultComponent);

watchEffect(() => {
  const playsetId = selectedPlayset.value;
  if (!playsetId || playsetId === 'default') {
    currentComponent.value = DefaultComponent;
    return;
  }

  const config = getPlaysetConfig(playsetId);
  if (config.overrides?.ActionFooter) {
    const path = `./playsets/${playsetId}/ActionFooter.vue`;
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
    @click="emit('click')"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </component>
</template>
