<script setup lang="ts">
interface Props {
  sides: number
  modelValue: number | null
  label?: string
  color?: 'white' | 'red'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'white'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const getClasses = (n: number) => {
  const isSelected = props.modelValue === n
  
  if (props.color === 'white') {
    return isSelected
      ? 'bg-nott-white text-nott-black border-nott-white shadow-[0_0_10px_rgba(255,255,255,0.5)]'
      : 'bg-nott-black border-nott-gray text-nott-white/60 hover:border-nott-white hover:text-nott-white'
  } else {
    return isSelected
      ? 'bg-nott-red text-nott-white border-nott-red shadow-[0_0_10px_rgba(138,0,0,0.5)]'
      : 'bg-nott-black border-nott-gray text-nott-white/60 hover:border-nott-red hover:text-nott-white'
  }
}
</script>

<template>
  <div class="space-y-4">
    <label v-if="label" class="block text-nott-white font-display uppercase text-center tracking-widest">
      {{ label }}
    </label>
    <div 
      class="grid gap-2"
      :class="sides > 6 ? 'grid-cols-5' : 'grid-cols-2'"
    >
      <button
        v-for="n in sides"
        :key="n"
        @click="emit('update:modelValue', sides === 10 ? n-1 : n)"
        class="aspect-square rounded border transition-all duration-200 font-display text-xl flex items-center justify-center"
        :class="[
          getClasses(sides === 10 ? n-1 : n),
          sides <= 6 ? 'aspect-video' : ''
        ]"
      >
        {{ sides === 10 ? n-1 : n }}
      </button>
    </div>
  </div>
</template>
