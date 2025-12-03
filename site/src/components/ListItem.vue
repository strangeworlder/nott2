<script setup lang="ts">
import { computed } from 'vue'
import Text from './Text.vue'

const props = defineProps<{
  color?: string
  variant?: 'default' | 'ordered'
  index?: number
}>()

const classes = computed(() => {
  const base = []
  
  if (props.variant === 'ordered') {
    base.push('flex items-start gap-2')
  }

  if (props.color) {
    base.push(props.color)
  }
  
  return base.join(' ')
})
</script>

<template>
  <li :class="classes">
    <template v-if="variant === 'ordered' && index !== undefined">
      <Text variant="label" color="red">{{ index + 1 }}.</Text>
      <Text variant="body" as="span">
        <slot />
      </Text>
    </template>
    <slot v-else />
  </li>
</template>
