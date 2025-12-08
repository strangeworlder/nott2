<script setup lang="ts">
import { type Component, defineAsyncComponent, shallowRef, watchEffect } from 'vue';
import { useLivePlay } from '../composables/useLivePlay';
import { getPlaysetConfig } from '../utils/contentLoader';
import DefaultComponent from './defaults/LivePlayHeader.vue';

interface Card {
  suit: string;
  rank: number;
}

interface Props {
  currentAct: number;
  currentPhase: string;
  trophyTop?: Card | null;
  isTrophyTopRandomized?: boolean;
  cardName?: string;
  activeCard?: Card | null;
  selectedJoker?: 'Red' | 'Black' | null;
  act3Countdown?: number | null;
  acesRemaining?: number;
  fullReset: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  trophyTop: null,
  isTrophyTopRandomized: false,
  cardName: '',
  activeCard: null,
  selectedJoker: null,
});

const { selectedPlayset } = useLivePlay();
const playsetComponents = import.meta.glob('./playsets/**/LivePlayHeader.vue');
const currentComponent = shallowRef<Component>(DefaultComponent);

watchEffect(() => {
  const playsetId = selectedPlayset.value;
  if (!playsetId || playsetId === 'default') {
    currentComponent.value = DefaultComponent;
    return;
  }

  const config = getPlaysetConfig(playsetId);
  if (config.overrides?.LivePlayHeader) {
    const path = `./playsets/${playsetId}/LivePlayHeader.vue`;
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
