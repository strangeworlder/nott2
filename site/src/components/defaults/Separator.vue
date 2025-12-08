<script setup lang="ts">
/**
 * Separator
 *
 * Philosophical:
 * The Separator is a visual pause. It creates a boundary between distinct thoughts or
 * sections without the weight of a full container. It allows the eye to rest and
 * reset before processing the next piece of information.
 *
 * Technical:
 * A simple visual divider that can be horizontal or vertical.
 *
 * Props:
 * - orientation (string): 'horizontal' | 'vertical'. Defaults to 'horizontal'.
 * - color (string): 'muted' | 'red' | 'white'. Defaults to 'muted'.
 */

import { computed } from 'vue';

interface Props {
  orientation?: 'horizontal' | 'vertical';
  color?: 'muted' | 'red' | 'white';
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  color: 'muted',
});

const classes = computed(() => {
  const base = 'bg-current opacity-30';

  const orientations = {
    horizontal: 'h-px w-full my-4',
    vertical: 'w-px h-full mx-4',
  };

  const colors = {
    muted: 'text-nott-gray',
    red: 'text-nott-red',
    white: 'text-nott-white',
  };

  return `${base} ${orientations[props.orientation]} ${colors[props.color]}`;
});
</script>

<template>
  <div :class="classes" role="separator"></div>
</template>
