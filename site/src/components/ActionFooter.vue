<script setup lang="ts">
import Button from './Button.vue'

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
