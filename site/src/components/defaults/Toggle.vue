<script setup lang="ts">
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
