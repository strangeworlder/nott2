<script setup lang="ts">
import { useLivePlay } from '../../composables/useLivePlay'
import Card from '../Card.vue'
import ScenePrompt from './ScenePrompt.vue'
import Text from '../Text.vue'
import Button from '../Button.vue'
import ActionFooter from '../ActionFooter.vue'

const { 
  activeCard,
  selectedJoker,
  isFirstTime,
  isSuccess,
  effortResult,
  rollEffort
} = useLivePlay()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'next'): void
}>()
</script>

<template>
  <div class="w-full max-w-4xl mx-auto animate-fade-in">
    <!-- Scene Prompt -->
    <!-- Scene Prompt -->
    <ScenePrompt 
      v-if="activeCard || selectedJoker" 
      :card="activeCard" 
      :selected-joker="selectedJoker"
      :is-first-time="isFirstTime"
      class="mb-8" 
    />

    <div class="mb-6 text-center">
      <Text variant="quote" color="muted"><em>"The dice have spoken. Now, tell us how it happens."</em></Text>
    </div>

    <div class="grid gap-6 md:grid-cols-2 mb-8">
      <!-- Outcome -->
      <Card :title="isSuccess ? 'Success' : 'Failure'" :variant="isSuccess ? 'success' : 'failure'">
        <div v-if="isSuccess">
          <Text variant="body" class="mb-4">The characters achieve their goal. They survive, escape, or find what they were looking for.</Text>
          <Text variant="caption" color="muted">Describe their triumph in the face of horror.</Text>
        </div>
        <div v-else>
          <Text variant="body" class="mb-4">The characters fail. The Killer catches up, the door is locked, or the clue is destroyed.</Text>
          <Text variant="caption" color="muted">Describe how the situation spirals out of control.</Text>
        </div>
      </Card>

      <!-- Effort / Sacrifice -->
      <Card title="Effort" class="border-nott-gray/30">
        <div v-if="rollEffort">
           <Text variant="h3" color="red" class="mb-2">{{ effortResult?.title || 'Effort Exerted' }}</Text>
           <div class="h-px w-1/2 mx-auto bg-nott-red/30 my-2"></div>
           <Text variant="body" color="white">{{ effortResult?.mechanic }}</Text>
        </div>
        <div v-else>
          <Text variant="body" color="muted">No extra effort was pushed. The result stands on its own.</Text>
        </div>
      </Card>
    </div>

    <Card variant="instruction" class="text-center mb-12">
      <Text variant="h3" class="mb-2">Bring the Scene to a Close</Text>
      <Text variant="body" color="muted">Work together to narrate the final moments of the scene based on these results. When the beat is finished, proceed to update the game state.</Text>
    </Card>

    <!-- Action Footer -->
    <ActionFooter>
      <Button 
        size="lg"
        variant="primary" 
        @click="$emit('next')"
        class="px-12"
      >
        Update Game State →
      </Button>
    </ActionFooter>
  </div>
</template>
