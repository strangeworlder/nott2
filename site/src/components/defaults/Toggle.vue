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
  modelValue: boolean;
  labelOn?: string;
  labelOff?: string;
  variant?: 'button' | 'switch';
}

withDefaults(defineProps<Props>(), {
  variant: 'button',
});
const emit = defineEmits<(e: 'update:modelValue', value: boolean) => void>();
</script>

<template>
  <button 
    v-if="variant === 'button'"
    @click="emit('update:modelValue', !modelValue)"
    class="text-xs uppercase tracking-widest px-4 py-2 rounded border transition-all duration-200"
    :class="modelValue 
      ? 'border-green-500 text-green-500 bg-green-500/10 shadow-[0_0_10px_rgba(34,197,94,0.2)]' 
      : 'border-nott-white/30 text-nott-white/60 hover:border-nott-white hover:text-nott-white'"
  >
    {{ modelValue ? (labelOn || 'On') : (labelOff || 'Off') }}
  </button>

  <div 
    v-else
    class="flex items-center gap-3 cursor-pointer group w-full text-centered"
    @click="emit('update:modelValue', !modelValue)"
  >
    <!-- Switch Track -->
    <div 
      class="w-12 h-6 rounded-full relative transition-colors duration-200"
      :class="modelValue ? 'bg-nott-green/20 border border-nott-green' : 'bg-nott-white/10 border border-nott-white/30 group-hover:border-nott-white/50'"
    >
      <!-- Switch Thumb -->
      <div 
        class="absolute top-1 w-4 h-4 rounded-full transition-all duration-200 shadow-sm"
        :class="[
          modelValue ? 'left-7 bg-nott-green shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'left-1 bg-nott-white/60 group-hover:bg-nott-white'
        ]"
      ></div>
    </div>
    
    <!-- Label -->
    <span 
      class="text-xs uppercase tracking-widest transition-colors duration-200"
      :class="modelValue ? 'text-nott-green' : 'text-nott-white/60 group-hover:text-nott-white'"
    >
      {{ modelValue ? (labelOn || 'On') : (labelOff || 'Off') }}
    </span>
  </div>
</template>
