<script setup lang="ts">
/**
 * ListItem
 * 
 * Philosophical:
 * A single atom of information within a List structure. It represents one distinct 
 * point, rule, or option. In ordered lists, it carries its own ordinality, emphasizing 
 * sequence and progression.
 * 
 * Technical:
 * A component for rendering individual list items.
 * 
 * Props:
 * - color (string): Text color override.
 * - variant (string): Style variant ('default', 'ordered').
 * - index (number): The index of the item (for ordered lists).
 * 
 * Slots:
 * - default: The content of the list item.
 */

import { computed } from 'vue'
import Text from '../Text.vue'

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
