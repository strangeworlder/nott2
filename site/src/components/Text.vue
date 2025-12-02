<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'hero' | 'h1' | 'h2' | 'h3' | 'lead' | 'body' | 'label' | 'caption' | 'quote' | 'micro'
  as?: string
  color?: 'white' | 'red' | 'muted' | 'success'
  glow?: boolean
  border?: 'none' | 'left' | 'bottom'
  align?: 'left' | 'center' | 'right' | 'justify'
  leading?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'
  animation?: 'pulse' | 'none'
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

  if (props.as === 'span') 
    base.push('inline');
  else {
    base.push('block'); 
    if (props.variant === 'body') base.push('font-body text-base leading-relaxed')
  }

  // Variants
  if (props.variant === 'hero') base.push('font-display uppercase tracking-widest text-6xl md:text-8xl')
  if (props.variant === 'h1') base.push('font-display uppercase tracking-widest text-4xl md:text-6xl')
  if (props.variant === 'h2') base.push('font-display uppercase tracking-widest text-2xl md:text-4xl')
  if (props.variant === 'h3') base.push('font-display uppercase tracking-widest text-xl')
  if (props.variant === 'label') base.push('font-display uppercase tracking-widest text-sm')
  if (props.variant === 'caption') base.push('font-body text-sm italic')
  if (props.variant === 'lead') base.push('font-body text-lg md:text-xl leading-relaxed')
  if (props.variant === 'quote') base.push('font-body text-xl md:text-2xl leading-relaxed')
  if (props.variant === 'micro') base.push('font-display uppercase tracking-widest text-[10px]')

  // Colors
  if (props.color === 'white') base.push('text-nott-white')
  if (props.color === 'red') base.push('text-nott-red')
  if (props.color === 'muted') base.push('text-nott-white/60')
  if (props.color === 'success') base.push('text-nott-green')

  // Glow
  if (props.glow) {
    if (props.color === 'success') base.push('text-shadow-glow-green')
    else base.push('text-shadow-glow')
  }

  // Borders
  if (props.border === 'left') base.push('border-l-4 border-nott-red pl-4')
  if (props.border === 'bottom') base.push('border-b border-nott-gray/30 pb-1')

  // Alignment
  if (props.align === 'center') base.push('text-center')
  if (props.align === 'right') base.push('text-right')
  if (props.align === 'left') base.push('text-left')
  if (props.align === 'justify') base.push('text-justify')

  // Leading
  if (props.leading === 'none') base.push('leading-none')
  if (props.leading === 'tight') base.push('leading-tight')
  if (props.leading === 'snug') base.push('leading-snug')
  if (props.leading === 'normal') base.push('leading-normal')
  if (props.leading === 'relaxed') base.push('leading-relaxed')
  if (props.leading === 'loose') base.push('leading-loose')

  // Animation
  if (props.animation === 'pulse') base.push('animate-pulse')

  return base.join(' ')
})
</script>

<template>
  <component :is="tag" :class="classes">
    <slot />
  </component>
</template>
