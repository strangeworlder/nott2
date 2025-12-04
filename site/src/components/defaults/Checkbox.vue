<script setup lang="ts">
/**
 * Checkbox
 * 
 * Philosophical:
 * The Checkbox represents a binary choice, a commitment to a specific state or condition. 
 * Unlike a button which triggers an action, the checkbox modifies the context in which 
 * actions occur. It allows the user to opt-in, confirm understanding, or toggle a 
 * boolean property of the game state.
 * 
 * Technical:
 * A custom-styled checkbox component with an optional label.
 * 
 * Props:
 * - modelValue (boolean): The checked state of the checkbox.
 * - label (string): Optional text label displayed next to the checkbox.
 * - id (string): Optional ID for the input. If not provided, a random ID is generated.
 * 
 * Events:
 * - update:modelValue: Emitted when the checkbox state changes.
 */

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
    <div class="relative mt-1 w-6 h-6">
      <input 
        type="checkbox" 
        :id="inputId" 
        :checked="modelValue"
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
        class="appearance-none w-full h-full rounded border border-nott-gray bg-nott-black checked:bg-nott-red focus:outline-none focus:ring-2 focus:ring-nott-red focus:ring-offset-1 focus:ring-offset-nott-black transition-colors cursor-pointer peer"
      >
      <svg 
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-nott-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <label v-if="label" :for="inputId" class="text-nott-white cursor-pointer select-none">
      {{ label }}
      <slot />
    </label>
  </div>
</template>
