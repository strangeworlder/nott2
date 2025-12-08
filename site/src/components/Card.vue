<script setup lang="ts">
import { type Component, defineAsyncComponent, shallowRef, watchEffect } from 'vue';
import { useLivePlay } from '../composables/useLivePlay';
import { getPlaysetConfig } from '../utils/contentLoader';
import DefaultComponent from './defaults/Card.vue';

interface Props {
  title?: string;
  interactive?: boolean;
  variant?: 'default' | 'muted' | 'highlighted' | 'success' | 'failure' | 'instruction' | 'ghost';
  noPadding?: boolean;
  center?: boolean;
}

withDefaults(defineProps<Props>(), {
  interactive: true,
  variant: 'default',
  noPadding: false,
  center: false,
});

const { selectedPlayset } = useLivePlay();
const playsetComponents = import.meta.glob('./playsets/**/Card.vue') as Record<
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
  if (config.overrides?.Card) {
    const path = `./playsets/${playsetId}/Card.vue`;
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
