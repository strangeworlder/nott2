<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  color?: string
}>()

const classes = computed(() => {
  if (props.color) {
    return props.color // Allow direct class override if needed, or we could map to design system colors
  }
  return ''
})
</script>

<template>
  <li :class="classes">
    <slot />
  </li>
</template>
