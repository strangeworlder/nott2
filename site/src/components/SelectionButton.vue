<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  selected?: boolean
  disabled?: boolean
  variant?: 'default' | 'square'
  color?: 'default' | 'red'
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  disabled: false,
  variant: 'default',
  color: 'default'
})

const classes = computed(() => {
  const base = 'border font-display transition-all duration-200 flex items-center justify-center focus:outline-none'
  
  const variants = {
    default: 'h-12 px-4 rounded text-lg',
    square: 'h-10 w-full rounded text-lg aspect-square'
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
  
  // If color is red, use red styles, else default (white/black for selected)
  // But wait, the original code had different styles for Rank (Red) and Suit (White/Black).
  // So I added a color prop.

  return `${base} ${variants[props.variant]} ${colors[props.color]} ${disabledState}`
})
</script>

<template>
  <button :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>
