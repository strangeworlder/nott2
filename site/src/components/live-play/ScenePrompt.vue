<script setup lang="ts">
import { computed } from 'vue'
import Text from '../Text.vue'
import Separator from '../defaults/Separator.vue'
import Card from '../Card.vue'
import { getScenePrompt } from '../../data/scenePrompts'
import type { Suit } from '../../composables/useGameEngine'

const props = defineProps<{
  card?: { rank: number, suit: Suit } | null
  selectedJoker?: 'Red' | 'Black' | null
  isFirstTime?: boolean
  label?: string
}>()

const promptText = computed(() => {
  return getScenePrompt(props.card || null, props.selectedJoker || null, props.isFirstTime ?? true)
})
</script>

<template>
  <Card variant="muted" :title="label || 'SCENE PROMPT'" :interactive="false" class="text-center">
    <Text variant="quote" color="white">
      <span v-html="promptText"></span>
    </Text>
    <div class="h-px w-1/2 mx-auto bg-nott-red/30 my-2"></div>
    <Separator class="w-1/2 mx-auto my-2" />
  </Card>
</template>
