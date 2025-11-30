<script setup lang="ts">
interface Props {
  variant?: 'default' | 'outline' | 'red'
}

withDefaults(defineProps<Props>(), {
  variant: 'default'
})
</script>

<template>
  <span 
    class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-display uppercase tracking-widest"
    :class="{
      'bg-nott-white/10 text-nott-white/60': variant === 'default',
      'border border-nott-white/30 text-nott-white/60': variant === 'outline',
      'bg-nott-red/10 text-nott-red border border-nott-red/30': variant === 'red'
    }"
  >
    <slot />
  </span>
</template>
