<script setup lang="ts">
import { defineAsyncComponent, shallowRef, watchEffect } from 'vue'
import { useLivePlay } from '../composables/useLivePlay'
import { getPlaysetConfig } from '../utils/contentLoader'
import DefaultComponent from './defaults/Badge.vue'

interface Props {
  variant?: 'default' | 'outline' | 'red' | 'success' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const { selectedPlayset } = useLivePlay()
const playsetComponents = import.meta.glob('./playsets/**/Badge.vue')
const currentComponent = shallowRef(DefaultComponent)

watchEffect(() => {
  const playsetId = selectedPlayset.value
  if (!playsetId || playsetId === 'default') {
    currentComponent.value = DefaultComponent
    return
  }

  const config = getPlaysetConfig(playsetId)
  if (config.overrides?.Badge) {
    const path = `./playsets/${playsetId}/Badge.vue`
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
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </component>
</template>
