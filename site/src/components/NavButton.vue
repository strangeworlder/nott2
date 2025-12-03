<script setup lang="ts">
defineProps<{
  active?: boolean
}>()
</script>

<template>
  <button 
    class="relative text-nott-white hover:text-nott-red transition-all duration-300 font-display uppercase tracking-wider px-6 py-2 border border-transparent hover:border-nott-red/50 group"
    :class="{ 
      'text-nott-red border-nott-red bg-nott-red/10 shadow-[0_0_15px_rgba(var(--color-nott-red),0.4)]': active 
    }"
  >
    <span v-if="active" class="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] opacity-0 animate-fade-in">◆</span>
    <span :class="{ 'translate-x-1': active }" class="transition-transform duration-300 inline-block">
      <slot />
    </span>
    <span v-if="active" class="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] opacity-0 animate-fade-in">◆</span>
  </button>
</template>
