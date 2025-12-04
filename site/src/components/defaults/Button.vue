<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'debug'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  block: false,
})

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center font-display uppercase tracking-wider transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-nott-red text-white hover:bg-nott-red/80 border border-transparent shadow-[0_0_10px_rgba(var(--color-nott-red),0.5)] hover:shadow-[0_0_20px_rgba(var(--color-nott-red),0.8)]',
    secondary: 'bg-transparent text-nott-white border border-nott-gray hover:border-nott-red hover:text-nott-red hover:bg-nott-red/5',
    ghost: 'bg-transparent text-nott-white hover:text-nott-red hover:bg-nott-gray/20',
    debug: 'bg-transparent text-nott-green border border-nott-green/30 hover:text-nott-green hover:border-nott-green hover:bg-nott-green/10',
  }

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
    xl: 'px-12 py-4 text-xl',
  }

  const width = props.block ? 'w-full' : ''

  return `${base} ${variants[props.variant]} ${sizes[props.size]} ${width}`
})
</script>

<template>
  <button :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>
