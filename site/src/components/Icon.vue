<script setup lang="ts">
import { defineAsyncComponent, shallowRef, watchEffect } from 'vue'
import { useLivePlay } from '../composables/useLivePlay'
import { getPlaysetConfig } from '../utils/contentLoader'
import DefaultComponent from './defaults/Icon.vue'

interface Props {
  name: 'clock' | 'users' | 'supplies' | 'Spades' | 'Hearts' | 'Clubs' | 'Diamonds'
  size?: number | string
  color?: 'white' | 'red' | 'muted' | 'success'
}

const props = defineProps<Props>()

const { selectedPlayset } = useLivePlay()
const playsetComponents = import.meta.glob('./playsets/**/Icon.vue')
const currentComponent = shallowRef(DefaultComponent)

watchEffect(() => {
  const playsetId = selectedPlayset.value
  if (!playsetId || playsetId === 'default') {
    currentComponent.value = DefaultComponent
    return
  }

  const config = getPlaysetConfig(playsetId)
  if (config.overrides?.Icon) {
    const path = `./playsets/${playsetId}/Icon.vue`
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
