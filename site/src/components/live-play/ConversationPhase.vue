<script setup lang="ts">
import WizardStep from '../WizardStep.vue'
import Card from '../Card.vue'
import Text from '../Text.vue'

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'next'): void
}>()
</script>

<template>
  <WizardStep
    title="The Conversation"
    :step-number="3"
    :total-steps="6"
    :can-proceed="true"
    show-back
    @back="emit('back')"
    @next="emit('next')"
  >
    <div class="mb-6 text-center">
      <Text variant="quote" color="muted" class="italic">"Narrate the events leading up to this moment. Ask questions. Describe the world. Sooner or later, you'll try something risky."</Text>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
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
  </WizardStep>
</template>
