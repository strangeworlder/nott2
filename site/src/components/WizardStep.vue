<script setup lang="ts">
import Button from './Button.vue'
import Text from './Text.vue'

defineProps<{
  title: string
  stepNumber: number
  totalSteps: number
  canProceed?: boolean
  nextLabel?: string
  showBack?: boolean
}>()

defineEmits<{
  (e: 'next'): void
  (e: 'back'): void
}>()
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8 border-b border-nott-red/30 pb-4">
      <Text variant="h2">
        <span class="text-nott-red mr-2">{{ stepNumber }}.</span>
        {{ title }}
      </Text>
      <Text variant="label" color="muted">
        STEP {{ stepNumber }} / {{ totalSteps }}
      </Text>
    </div>

    <!-- Content -->
    <div class="min-h-[400px] mb-8">
      <slot />
    </div>

    <!-- Navigation -->
    <div class="flex justify-between items-center border-t border-nott-gray/30 pt-8">
      <div>
        <Button 
          v-if="showBack" 
          variant="ghost" 
          @click="$emit('back')"
        >
          ← Back
        </Button>
      </div>
      <div>
        <Button 
          :disabled="!canProceed" 
          variant="primary" 
          @click="$emit('next')"
        >
          {{ nextLabel || 'Next Step' }} →
        </Button>
      </div>
    </div>
  </div>
</template>
