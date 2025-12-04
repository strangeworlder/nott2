<script setup lang="ts">
/**
 * ActionFooter
 * 
 * Philosophical:
 * The ActionFooter serves as the definitive "period" at the end of a user's interaction 
 * with a specific view or phase. It anchors the primary progression action (usually "Continue" 
 * or "Confirm") to the bottom of the content area, creating a clear visual separation 
 * between the information consumed and the action required to move forward. It provides 
 * a consistent, reliable location for the user to look for "what's next."
 * 
 * Technical:
 * A wrapper component that positions a primary action button.
 * 
 * Props:
 * - label (string): The text to display on the button. Defaults to 'Continue'.
 * - disabled (boolean): Whether the button is disabled. Defaults to false.
 * - variant (string): The visual style of the button ('primary', 'secondary', 'ghost', 'debug'). Defaults to 'primary'.
 * 
 * Events:
 * - click: Emitted when the button is clicked.
 * 
 * Slots:
 * - default: Optional slot to override the default button with custom content.
 */

import Button from '../Button.vue'

interface Props {
  label?: string
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'ghost' | 'debug'
}

withDefaults(defineProps<Props>(), {
  label: 'Continue',
  disabled: false,
  variant: 'primary'
})

defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <div class="flex justify-center pt-8 border-t border-nott-gray/30 gap-4">
    <slot>
      <Button 
        size="lg"
        :variant="variant" 
        :disabled="disabled"
        @click="$emit('click')"
        class="px-12"
      >
        {{ label }}
      </Button>
    </slot>
  </div>
</template>
