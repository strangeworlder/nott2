<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'label' | 'caption' | 'quote'
  as?: string
  color?: 'white' | 'red' | 'muted' | 'success'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'body',
  color: 'white'
})

const tag = computed(() => {
  if (props.as) return props.as
  if (props.variant === 'h1') return 'h1'
  if (props.variant === 'h2') return 'h2'
  if (props.variant === 'h3') return 'h3'
  if (props.variant === 'label') return 'div'
  return 'p'
})

const classes = computed(() => {
  const base = []
  
  // Variants
  if (props.variant === 'h1') base.push('block font-display uppercase tracking-widest text-4xl md:text-6xl')
  if (props.variant === 'h2') base.push('block font-display uppercase tracking-widest text-2xl md:text-4xl')
  if (props.variant === 'h3') base.push('block font-display uppercase tracking-widest text-xl')
  if (props.variant === 'body') base.push('block font-body text-base leading-relaxed')
  if (props.variant === 'label') base.push('block font-display uppercase tracking-widest text-sm')
  if (props.variant === 'caption') base.push('block font-body text-sm italic')
  if (props.variant === 'quote') base.push('block font-body text-xl md:text-2xl leading-relaxed italic')

  // Colors
  if (props.color === 'white') base.push('text-nott-white')
  if (props.color === 'red') base.push('text-nott-red')
  if (props.color === 'muted') base.push('text-nott-white/60')
  if (props.color === 'success') base.push('text-green-500')

  return base.join(' ')
})
</script>

<template>
  <component :is="tag" :class="classes">
    <slot />
  </component>
</template>
