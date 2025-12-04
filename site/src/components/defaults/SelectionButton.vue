<script setup lang="ts">
/**
 * SelectionButton
 * 
 * Philosophical:
 * A tool for making specific, often exclusive, choices. Unlike the primary Button which 
 * advances the state, the SelectionButton configures it. It is tactile and toggle-like, 
 * allowing the user to "set" parameters before "executing" them.
 * 
 * Technical:
 * A button component designed for selection/toggle states.
 * 
 * Props:
 * - selected (boolean): Whether the button is in the selected state.
 * - disabled (boolean): Whether the button is interactive.
 * - variant (string): Shape variant ('default', 'square'). Defaults to 'default'.
 * - color (string): Color variant ('default', 'red'). Defaults to 'default'.
 * - size (string): Size variant ('sm', 'md'). Defaults to 'md'.
 * 
 * Slots:
 * - default: The label or content of the button.
 */

import { computed } from 'vue'

interface Props {
  selected?: boolean
  disabled?: boolean
  variant?: 'default' | 'square'
  color?: 'default' | 'red'
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  disabled: false,
  variant: 'default',
  color: 'default',
  size: 'md'
})

const classes = computed(() => {
  const base = 'border font-display transition-all duration-200 flex items-center justify-center focus:outline-none'
  
  const variants = {
    default: 'rounded px-4',
    square: 'rounded w-full aspect-square'
  }

  const sizes = {
    sm: props.variant === 'square' ? 'h-8 text-sm' : 'h-8 text-sm',
    md: props.variant === 'square' ? 'h-10 text-lg' : 'h-12 text-lg'
  }

  const colors = {
    default: props.selected 
      ? 'bg-nott-white border-nott-white text-nott-black' 
      : 'bg-nott-black border-nott-gray text-nott-white hover:border-nott-white/50',
    red: props.selected
      ? 'bg-nott-red border-nott-red text-white'
      : 'bg-nott-black border-nott-gray text-nott-white hover:border-nott-red/50'
  }

  const disabledState = props.disabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'

  return `${base} ${variants[props.variant]} ${sizes[props.size]} ${colors[props.color]} ${disabledState}`
})
</script>

<template>
  <button :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>
