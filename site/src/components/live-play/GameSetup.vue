<script setup lang="ts">
import Text from '../Text.vue'
import Button from '../Button.vue'
import ActionFooter from '../ActionFooter.vue'

const emit = defineEmits<{
  (e: 'next'): void
}>()
</script>

<template>
  <div class="w-full max-w-4xl mx-auto animate-fade-in flex flex-col items-center justify-center min-h-[50vh]">
    <div class="mb-6 text-center">
      <Text variant="h1" color="red" class="mb-4">Night of the Thirteenth</Text>
      <Text variant="body" color="muted" class="max-w-xl mx-auto">
        Welcome to the game. Prepare yourself for a night of horror.
      </Text>
    </div>

    <ActionFooter>
      <Button 
        size="xl"
        variant="primary" 
        @click="$emit('next')"
      >
        Begin Setup →
      </Button>
    </ActionFooter>
  </div>
</template>
