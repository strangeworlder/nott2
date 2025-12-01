<script setup lang="ts">
import WizardStep from '../WizardStep.vue'
import Card from '../Card.vue'
import Text from '../Text.vue'

defineProps<{
  isEndgame: boolean
}>()

const emit = defineEmits<{
  (e: 'next'): void
}>()
</script>

<template>
  <WizardStep
    :title="isEndgame ? 'Endgame Setup' : 'Game Setup'"
    :step-number="1"
    :total-steps="6"
    :can-proceed="true"
    :next-label="isEndgame ? 'Start the Endgame' : 'Start the Night'"
    @next="emit('next')"
  >
    <div class="mb-6 text-center">
      <Text variant="quote" color="muted" class="italic">"You are no heroes. You are just in the wrong place at the wrong time. The horror starts small, but it will escalate."</Text>
    </div>

    <div v-if="!isEndgame" class="grid gap-6 md:grid-cols-2">
      <Card title="Build the Decks">
        <Text variant="body" color="muted" class="mb-4">Manually build the deck:</Text>
        <ul class="space-y-4 text-nott-white/80">
          <li class="flex items-start gap-2">
            <Text variant="label" color="red">1.</Text>
            <Text variant="body"><strong>Threat Deck:</strong> 4 Aces on top, then 2s-4s + 1 Jack shuffled.</Text>
          </li>
          <li class="flex items-start gap-2">
            <Text variant="label" color="red">2.</Text>
            <Text variant="body"><strong>Reserves:</strong> Keep 5s-10s and Face Cards nearby.</Text>
          </li>
          <li class="flex items-start gap-2">
            <Text variant="label" color="red">3.</Text>
            <Text variant="body"><strong>Trophy Pile:</strong> Place a random 10 face up.</Text>
          </li>
        </ul>
      </Card>
      <Card title="Create Characters">
        <ul class="space-y-4 text-nott-white/80">
          <li class="flex items-start gap-2">
            <Text variant="label" color="red">1.</Text>
            <Text variant="body">Choose a Name and Archetype.</Text>
          </li>
          <li class="flex items-start gap-2">
            <Text variant="label" color="red">2.</Text>
            <Text variant="body">Answer: "Why are you here?"</Text>
          </li>
          <li class="flex items-start gap-2">
            <Text variant="label" color="red">3.</Text>
            <Text variant="body">Select an Aptitude (Power, Resolve, Intellect, Finesse).</Text>
          </li>
        </ul>
      </Card>
    </div>
    <div v-else class="max-w-2xl mx-auto">
      <Card title="Prepare for the End">
        <ul class="space-y-4 text-nott-white/80">
          <li class="flex items-start gap-2">
            <Text variant="label" color="red">1.</Text>
            <Text variant="body"><strong>Remove Number Cards:</strong> Take all Number Cards out of the Threat Deck.</Text>
          </li>
          <li class="flex items-start gap-2">
            <Text variant="label" color="red">2.</Text>
            <Text variant="body"><strong>Add Jokers:</strong> Shuffle both the Red and Black Jokers into the remaining Face Cards.</Text>
          </li>
          <li class="flex items-start gap-2">
            <Text variant="label" color="red">3.</Text>
            <Text variant="body"><strong>The Goal:</strong> Survive until the Red Joker appears, then defeat it to win.</Text>
          </li>
        </ul>
      </Card>
    </div>
  </WizardStep>
</template>
