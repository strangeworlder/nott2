<script setup lang="ts">
/**
 * IngressText (Wrapper)
 *
 * Philosophical:
 * The narrative voice. Ingress text bridges the gap between the interface and the
 * player's imagination, providing flavor and context that plain controls cannot.
 *
 * Technical:
 * Dynamically loads the `IngressText` component based on the `selectedPlayset`.
 * Falls back to `defaults/IngressText.vue`.
 */
import { type Component, defineAsyncComponent, shallowRef, watchEffect } from 'vue';
import { useLivePlay } from '../composables/useLivePlay';
import { getPlaysetConfig } from '../utils/contentLoader';
import DefaultComponent from './defaults/IngressText.vue';

const { selectedPlayset } = useLivePlay();
const playsetComponents = import.meta.glob('./playsets/**/IngressText.vue') as Record<
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
  if (config.overrides?.IngressText) {
    const path = `./playsets/${playsetId}/IngressText.vue`;
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
  <component :is="currentComponent">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </component>
</template>
