<script setup lang="ts">
import Text from '../Text.vue'
import Card from '../Card.vue'

defineProps<{
  prompt: string
  label?: string
}>()
</script>

<template>
  <Card variant="muted" :title="label || 'SCENE PROMPT'" :interactive="false" class="text-center">
    <Text variant="body" color="white">{{ prompt }}</Text>
    <div class="h-px w-1/2 mx-auto bg-nott-red/30 my-2"></div>
  </Card>
</template>
