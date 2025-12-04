<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  as?: 'ul' | 'ol'
  variant?: 'disc' | 'decimal' | 'none'
  color?: 'muted' | 'white' | 'red'
  spacing?: 'sm' | 'md' | 'lg'
  inside?: boolean
}>(), {
  as: 'ul',
  color: 'muted',
  spacing: 'sm',
  inside: true
})

const classes = computed(() => {
  const base = [
    props.inside ? 'list-inside' : 'list-outside'
  ]

  // Variant
  if (props.variant) {
    base.push(`list-${props.variant}`)
  } else {
    base.push(props.as === 'ol' ? 'list-decimal' : 'list-disc')
  }

  // Color
  switch (props.color) {
    case 'white':
      base.push('text-nott-white')
      break
    case 'red':
      base.push('text-nott-red')
      break
    case 'muted':
    default:
      base.push('text-nott-white/80')
      break
  }

  // Spacing
  switch (props.spacing) {
    case 'md':
      base.push('space-y-2')
      break
    case 'lg':
      base.push('space-y-4')
      break
    case 'sm':
    default:
      base.push('space-y-1')
      break
  }

  return base.join(' ')
})
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>
