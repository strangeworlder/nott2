<script setup lang="ts">
import { useLivePlay } from '../../composables/useLivePlay'
import Card from '../Card.vue'
import ScenePrompt from './ScenePrompt.vue'
import Text from '../Text.vue'
import Checkbox from '../Checkbox.vue'
import Button from '../Button.vue'

const { sacrificeConfirmed, currentPrompt } = useLivePlay()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'next'): void
}>()
</script>

<template>
  <div class="w-full max-w-4xl mx-auto animate-fade-in">
    <!-- Scene Prompt -->
    <!-- Scene Prompt -->
    <ScenePrompt v-if="currentPrompt" :prompt="currentPrompt" class="mb-8 animate-pulse-slow" />

    <div class="mb-6 text-center">
      <Text variant="quote" color="muted" class="italic">"Narrate the events leading up to this moment. Ask questions. Describe the world. Sooner or later, you'll try something risky."</Text>
    </div>

    <div class="grid gap-6 md:grid-cols-2 mb-8">
      <Card title="Focus the Camera">
        <Text variant="body" color="muted" class="mb-4">Ask the Active Player one sensory question:</Text>
        <ul class="list-disc list-inside text-nott-white/60 space-y-2 italic">
          <li>"What does it smell like?"</li>
          <li>"How close is the Killer?"</li>
          <li>"Is it pitch black?"</li>
        </ul>
      </Card>
      <Card title="Escalate">
        <Text variant="body" color="muted" class="mb-4">Once per scene, anyone can interject:</Text>
        <Text variant="h3" color="red" class="text-center my-4">"Something's not right..."</Text>
        <Text variant="caption">Add a terrifying detail that makes the situation worse. The Active Player must accept it.</Text>
      </Card>
    </div>

    <div class="max-w-2xl mx-auto space-y-8 border-t border-nott-gray/20 pt-8 mb-12">
      <div class="text-center space-y-4">
        <Text variant="h2">Define the Sacrifice</Text>
        <Text variant="body" color="muted">Before rolling, ask the Active Player:</Text>
        <Text variant="quote" color="red">"If you push yourself, what are you willing to Sacrifice?"</Text>
      </div>

      <Card class="bg-nott-red/5 border-nott-red/30">
        <Checkbox 
          v-model="sacrificeConfirmed"
          label="We have agreed on a specific, terrible Sacrifice (Overexertion)."
        />
      </Card>
    </div>

    <!-- Action Footer -->
    <div class="flex justify-center pt-8 border-t border-nott-gray/30">
      <Button 
        size="lg"
        variant="primary" 
        @click="$emit('next')"
        :disabled="!sacrificeConfirmed"
        class="px-12"
      >
        Roll Dice →
      </Button>
    </div>
  </div>
</template>
