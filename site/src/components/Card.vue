<script setup lang="ts">
interface Props {
  title?: string
  interactive?: boolean
}

withDefaults(defineProps<Props>(), {
  interactive: true
})
</script>

<template>
  <div class="relative group">
    <!-- Card Border/Glow -->
    <!-- Card Border/Glow -->
    <div 
      class="absolute -inset-0.5 bg-gradient-to-r from-nott-red to-nott-gray rounded-lg blur opacity-25 transition duration-1000"
      :class="{ 'group-hover:opacity-50 group-hover:duration-200': interactive }"
    ></div>
    
    <!-- Card Content -->
    <div class="relative bg-nott-black border border-nott-gray rounded-lg p-6 h-full flex flex-col">
      <h3 v-if="title" class="text-xl font-display text-nott-white mb-4 border-b border-nott-red/30 pb-2">
        {{ title }}
      </h3>
      <div class="text-nott-white/80 font-body flex-grow">
        <slot />
      </div>
    </div>
  </div>
</template>
