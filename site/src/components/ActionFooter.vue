<script setup lang="ts">
import { defineAsyncComponent, shallowRef, watchEffect } from 'vue'
import { useLivePlay } from '../composables/useLivePlay'
import { getPlaysetConfig } from '../utils/contentLoader'
import DefaultComponent from './defaults/ActionFooter.vue'

interface Props {
  label?: string
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'ghost' | 'debug'
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Continue',
  disabled: false,
  variant: 'primary'
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const { selectedPlayset } = useLivePlay()
const playsetComponents = import.meta.glob('./playsets/**/ActionFooter.vue')
const currentComponent = shallowRef(DefaultComponent)

watchEffect(() => {
  const playsetId = selectedPlayset.value
  if (!playsetId || playsetId === 'default') {
    currentComponent.value = DefaultComponent
    return
  }

  const config = getPlaysetConfig(playsetId)
  if (config.overrides?.ActionFooter) {
    const path = `./playsets/${playsetId}/ActionFooter.vue`
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
    @click="emit('click')"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </component>
</template>
