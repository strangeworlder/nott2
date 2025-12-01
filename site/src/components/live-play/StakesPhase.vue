<script setup lang="ts">
import { useLivePlay } from '../../composables/useLivePlay'
import WizardStep from '../WizardStep.vue'
import Card from '../Card.vue'
import Text from '../Text.vue'
import Checkbox from '../Checkbox.vue'

const { sacrificeConfirmed } = useLivePlay()

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
    :can-proceed="sacrificeConfirmed"
    show-back
    @back="emit('back')"
    @next="emit('next')"
  >
    <div class="mb-6 text-center">
      <Text variant="quote" color="muted" class="italic">"Success can have a price, failure more so. Before you roll, we must agree: If you push yourself, what are you willing to Sacrifice?"</Text>
    </div>

    <div class="max-w-2xl mx-auto space-y-8">
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
