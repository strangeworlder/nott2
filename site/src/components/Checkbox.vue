<script setup lang="ts">
import { defineAsyncComponent, shallowRef, watchEffect } from 'vue'
import { useLivePlay } from '../composables/useLivePlay'
import { getPlaysetConfig } from '../utils/contentLoader'
import DefaultComponent from './defaults/Checkbox.vue'

interface Props {
  modelValue: boolean
  label?: string
  id?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { selectedPlayset } = useLivePlay()
const playsetComponents = import.meta.glob('./playsets/**/Checkbox.vue')
const currentComponent = shallowRef(DefaultComponent)

watchEffect(() => {
  const playsetId = selectedPlayset.value
  if (!playsetId || playsetId === 'default') {
    currentComponent.value = DefaultComponent
    return
  }

  const config = getPlaysetConfig(playsetId)
  if (config.overrides?.Checkbox) {
    const path = `./playsets/${playsetId}/Checkbox.vue`
    const loader = playsetComponents[path]
    if (loader) {
      currentComponent.value = defineAsyncComponent(loader as any)
    } else {
      currentComponent.value = DefaultComponent
    }
  } else {
    currentComponent.value = DefaultComponent
  }
})
</script>

<template>
  <component 
    :is="currentComponent" 
    v-bind="props"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </component>
</template>
