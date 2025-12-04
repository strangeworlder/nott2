<script setup lang="ts">
/**
 * Toggle
 * 
 * Philosophical:
 * A compact switch for binary states. Similar to a checkbox but often implies a more 
 * immediate or system-level change (like a setting). It offers a clear visual distinction 
 * between "ON" and "OFF" states.
 * 
 * Technical:
 * A button-based toggle component.
 * 
 * Props:
 * - modelValue (boolean): The state of the toggle.
 * - labelOn (string): Label when true. Defaults to 'On'.
 * - labelOff (string): Label when false. Defaults to 'Off'.
 * 
 * Events:
 * - update:modelValue: Emitted when the toggle state changes.
 */

interface Props {
  modelValue: boolean
  labelOn?: string
  labelOff?: string
}

defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <button 
    @click="emit('update:modelValue', !modelValue)"
    class="text-xs uppercase tracking-widest px-4 py-2 rounded border transition-all duration-200"
    :class="modelValue 
      ? 'border-green-500 text-green-500 bg-green-500/10 shadow-[0_0_10px_rgba(34,197,94,0.2)]' 
      : 'border-nott-white/30 text-nott-white/60 hover:border-nott-white hover:text-nott-white'"
  >
    {{ modelValue ? (labelOn || 'On') : (labelOff || 'Off') }}
  </button>
</template>
