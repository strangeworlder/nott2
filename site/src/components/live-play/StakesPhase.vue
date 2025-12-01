<script setup lang="ts">
import { useLivePlay } from '../../composables/useLivePlay'
import WizardStep from '../WizardStep.vue'
import Card from '../Card.vue'
import Text from '../Text.vue'
import Checkbox from '../Checkbox.vue'

const { consequenceConfirmed } = useLivePlay()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'next'): void
}>()
</script>

<template>
  <WizardStep
    title="The Stakes"
    :step-number="4"
    :total-steps="6"
    :can-proceed="consequenceConfirmed"
    show-back
    @back="emit('back')"
    @next="emit('next')"
  >
    <div class="mb-6 text-center">
      <Text variant="quote" color="muted" class="italic">"Success can have a price, failure more so. Before you roll, we must agree: If this goes wrong, what is the Consequence?"</Text>
    </div>

    <div class="max-w-2xl mx-auto space-y-8">
      <div class="text-center space-y-4">
        <Text variant="h2">Define the Consequence</Text>
        <Text variant="body" color="muted">Before rolling, ask the Active Player:</Text>
        <Text variant="quote" color="red">"If this goes wrong, what is the Consequence?"</Text>
      </div>

      <Card class="bg-nott-red/5 border-nott-red/30">
        <Checkbox 
          v-model="consequenceConfirmed"
          label="We have agreed on a specific, terrible Consequence (Overexertion)."
        />
      </Card>
    </div>
  </WizardStep>
</template>
