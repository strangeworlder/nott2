<script setup lang="ts">
/**
 * ProcessStep
 * 
 * Philosophical:
 * A breadcrumb in the forest of rules. The ProcessStep breaks down complex procedures 
 * into digestible, numbered chunks, guiding the user safely through the mechanics. 
 * It visualizes progress and hierarchy, turning a wall of text into a stepped path.
 * 
 * Technical:
 * A component representing a single step in a multi-step process.
 * 
 * Props:
 * - step (string | number): The step number or label.
 * - variant (string): Visual style ('success', 'failure', 'neutral'). Defaults to 'neutral'.
 * - title (string): Optional title for the step.
 * 
 * Slots:
 * - default: The content/description of the step.
 */

import { computed } from 'vue'
import Text from '../Text.vue'

const props = withDefaults(defineProps<{
  step: string | number
  variant?: 'success' | 'failure' | 'neutral'
  title?: string
}>(), {
  variant: 'neutral'
})

const styles = computed(() => {
  switch (props.variant) {
    case 'success':
      return {
        circle: 'border-nott-green/50 text-nott-green',
        title: 'success' as const
      }
    case 'failure':
      return {
        circle: 'border-nott-red/50 text-nott-red',
        title: 'red' as const
      }
    default:
      return {
        circle: 'border-nott-gray/50 text-nott-gray',
        title: 'muted' as const
      }
  }
})
</script>

<template>
  <div class="relative flex gap-6">
    <!-- Step Circle -->
    <div 
      class="w-8 h-8 rounded-full bg-nott-black border flex items-center justify-center shrink-0 z-10 font-display transition-colors duration-300"
      :class="styles.circle"
    >
      {{ step }}
    </div>

    <!-- Content -->
    <div class="flex-1">
      <Text 
        v-if="title" 
        variant="label" 
        :color="styles.title" 
        class="mb-1"
      >
        {{ title }}
      </Text>
      <slot></slot>
    </div>
  </div>
</template>
