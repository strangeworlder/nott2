<script setup lang="ts">
/**
 * Button
 * 
 * Philosophical:
 * The Button is the primary agent of change in the interface. It represents a potential 
 * action the user can take. The design of the button (variant, size) communicates the 
 * weight and consequence of that action. Primary buttons are calls to adventure or 
 * commitment, while secondary or ghost buttons offer options without demanding immediate 
 * attention. The 'debug' variant serves as a meta-tool, breaking the fourth wall for 
 * development purposes.
 * 
 * Technical:
 * A versatile button component with multiple styles and sizes.
 * 
 * Props:
 * - variant (string): Visual style ('primary', 'secondary', 'ghost', 'debug'). Defaults to 'primary'.
 * - size (string): Size of the button ('xs', 'sm', 'md', 'lg', 'xl'). Defaults to 'md'.
 * - disabled (boolean): Whether the button is interactive. Defaults to false.
 * - block (boolean): Whether the button should take up the full width of its container. Defaults to false.
 * 
 * Slots:
 * - default: The content of the button (text or icons).
 */

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
