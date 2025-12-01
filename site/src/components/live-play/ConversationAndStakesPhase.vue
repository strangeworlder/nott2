<script setup lang="ts">
import { useLivePlay } from '../../composables/useLivePlay'
import WizardStep from '../WizardStep.vue'
import Card from '../Card.vue'
import Text from '../Text.vue'
import Checkbox from '../Checkbox.vue'

const { sacrificeConfirmed, currentPrompt } = useLivePlay()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'next'): void
}>()
</script>

<template>
  <WizardStep
    title="Conversation & Stakes"
    :step-number="3"
    :total-steps="6"
    :can-proceed="sacrificeConfirmed"
    show-back
    @back="emit('back')"
    @next="emit('next')"
  >
    <!-- Scene Prompt -->
    <div v-if="currentPrompt" class="mb-8 bg-nott-black p-6 rounded-lg border border-nott-red/30 shadow-[0_0_15px_rgba(220,38,38,0.2)] text-center animate-pulse-slow">
      <Text variant="h3" color="red" class="mb-2">SCENE PROMPT</Text>
      <Text variant="h2" class="text-white italic">"{{ currentPrompt }}"</Text>
    </div>

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

    <div class="max-w-2xl mx-auto space-y-8 border-t border-nott-gray/20 pt-8">
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
  </WizardStep>
</template>
