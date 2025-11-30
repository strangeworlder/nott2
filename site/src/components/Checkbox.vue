<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
  label?: string
  id?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const inputId = computed(() => props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`)
</script>

<template>
  <div class="flex items-start gap-4">
    <input 
      type="checkbox" 
      :id="inputId" 
      :checked="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      class="mt-1 w-6 h-6 rounded border-nott-gray bg-nott-black checked:bg-nott-red focus:ring-nott-red transition-colors cursor-pointer"
    >
    <label v-if="label" :for="inputId" class="text-nott-white cursor-pointer select-none">
      {{ label }}
      <slot />
    </label>
  </div>
</template>
