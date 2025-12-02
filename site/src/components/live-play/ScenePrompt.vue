<script setup lang="ts">
import Text from '../Text.vue'

defineProps<{
  prompt: string
  label?: string
}>()
</script>

<template>
  <div class="bg-nott-black p-6 rounded-lg border border-nott-red/30 shadow-[0_0_15px_rgba(220,38,38,0.2)] text-center">
    <Text variant="h3" color="red" class="mb-2">{{ label || 'SCENE PROMPT' }}</Text>
    <Text variant="body" class="text-white italic">"{{ prompt }}"</Text>
  </div>
</template>
