<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
})

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center font-display uppercase tracking-wider transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-nott-red text-white hover:bg-red-900 border border-transparent shadow-[0_0_10px_rgba(138,0,0,0.5)] hover:shadow-[0_0_20px_rgba(138,0,0,0.8)]',
    secondary: 'bg-transparent text-nott-white border border-nott-gray hover:border-nott-red hover:text-nott-red hover:bg-nott-red/5',
    ghost: 'bg-transparent text-nott-white hover:text-nott-red hover:bg-nott-gray/20',
  }

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  }

  return `${base} ${variants[props.variant]} ${sizes[props.size]}`
})
</script>

<template>
  <button :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>
