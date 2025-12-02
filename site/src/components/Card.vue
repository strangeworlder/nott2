<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  interactive?: boolean
  variant?: 'default' | 'muted' | 'highlighted' | 'success' | 'failure' | 'instruction'
  noPadding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  interactive: true,
  variant: 'default',
  noPadding: false
})

const containerClasses = computed(() => {
  const base = 'relative bg-nott-black border rounded-lg h-full flex flex-col transition-colors duration-300'
  const padding = props.noPadding ? '' : 'p-6'
  
  const variants = {
    default: 'border-nott-gray',
    muted: 'border-nott-gray/50 bg-nott-black/50',
    highlighted: 'border-nott-red shadow-[0_0_15px_rgba(220,38,38,0.2)]',
    success: 'border-nott-green/30 bg-green-900/10',
    failure: 'border-nott-red/30 bg-nott-red/5',
    instruction: 'border-nott-white/10 bg-nott-white/5'
  }

  return `${base} ${padding} ${variants[props.variant]}`
})

const glowClasses = computed(() => {
  const base = 'absolute -inset-0.5 rounded-lg blur opacity-25 transition duration-1000'
  
  const variants = {
    default: 'bg-gradient-to-r from-nott-red to-nott-gray',
    muted: 'bg-nott-gray hidden',
    highlighted: 'bg-nott-red opacity-50',
    success: 'bg-nott-green',
    failure: 'bg-nott-red',
    instruction: 'bg-nott-white hidden'
  }

  return `${base} ${variants[props.variant]}`
})

const titleClasses = computed(() => {
  const base = 'text-xl font-display mb-4 border-b pb-2'
  
  const variants = {
    default: 'text-nott-white border-nott-red/30',
    muted: 'text-nott-white/60 border-nott-gray/30',
    highlighted: 'text-nott-white border-nott-red',
    success: 'text-nott-green border-nott-green/30',
    failure: 'text-nott-red border-nott-red/30',
    instruction: 'text-nott-white border-nott-white/10'
  }

  return `${base} ${variants[props.variant]}`
})
</script>

<template>
  <div class="relative group">
    <!-- Card Border/Glow -->
    <div 
      :class="[glowClasses, { 'group-hover:opacity-50 group-hover:duration-200': interactive && variant !== 'muted' }]"
    ></div>
    
    <!-- Card Content -->
    <div :class="containerClasses">
      <h3 v-if="title" :class="titleClasses">
        {{ title }}
      </h3>
      <div class="text-nott-white/80 font-body flex-grow">
        <slot />
      </div>
    </div>
  </div>
</template>
