<script setup lang="ts">
import { useLivePlay } from '../../composables/useLivePlay'
import WizardStep from '../WizardStep.vue'
import Card from '../Card.vue'
import Text from '../Text.vue'

const { 
  currentPrompt,
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
  <WizardStep
    title="Resolve the Scene"
    :step-number="5"
    :total-steps="6"
    :can-proceed="true"
    show-back
    @back="emit('back')"
    @next="emit('next')"
  >
    <!-- Scene Prompt -->
    <div v-if="currentPrompt" class="mb-8 bg-nott-black p-6 rounded-lg border border-nott-red/30 shadow-[0_0_15px_rgba(220,38,38,0.2)] text-center">
      <Text variant="h3" color="red" class="mb-2">SCENE PROMPT</Text>
      <Text variant="h2" class="text-white italic">"{{ currentPrompt }}"</Text>
    </div>

    <div class="mb-6 text-center">
      <Text variant="quote" color="muted" class="italic">"The dice have spoken. Now, tell us how it happens."</Text>
    </div>

    <div class="grid gap-6 md:grid-cols-2 mb-8">
      <!-- Outcome -->
      <Card :title="isSuccess ? 'Success' : 'Failure'" :class="isSuccess ? 'border-green-500/30 bg-green-900/10' : 'border-nott-red/30 bg-nott-red/5'">
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
      <Card title="The Cost" class="border-nott-gray/30">
        <div v-if="rollEffort">
           <Text variant="h3" class="mb-2 text-nott-red">{{ effortResult?.title || 'Effort Exerted' }}</Text>
           <Text variant="body" class="mb-4">You pushed yourself. Now you must pay the price.</Text>
           <Text variant="caption" color="muted">Narrate the immediate physical or emotional toll of this exertion. How does it leave you vulnerable?</Text>
        </div>
        <div v-else>
          <Text variant="body" color="muted">No extra effort was pushed. The result stands on its own.</Text>
        </div>
      </Card>
    </div>

    <div class="text-center bg-nott-white/5 p-6 rounded-lg border border-nott-white/10">
      <Text variant="h3" class="mb-2">Bring the Scene to a Close</Text>
      <Text variant="body" color="muted">Work together to narrate the final moments of the scene based on these results. When the beat is finished, proceed to update the game state.</Text>
    </div>
  </WizardStep>
</template>
