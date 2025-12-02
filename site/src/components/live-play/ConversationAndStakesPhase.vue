<script setup lang="ts">
import { computed } from 'vue'
import { useLivePlay } from '../../composables/useLivePlay'
import Card from '../Card.vue'
import ScenePrompt from './ScenePrompt.vue'
import Text from '../Text.vue'
import Checkbox from '../Checkbox.vue'
import Button from '../Button.vue'
import List from '../List.vue'
import ListItem from '../ListItem.vue'
import ActionFooter from '../ActionFooter.vue'

const { sacrificeConfirmed, currentPrompt, currentAct } = useLivePlay()

const actDescription = computed(() => {
  switch (currentAct.value) {
    case 1: return "This is Act 1, so the risks are not so dire."
    case 2: return "This is Act 2, so the stakes are higher."
    case 3: return "This is Act 3, so the risks should be terrible sacrifices."
    default: return ""
  }
})

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'next'): void
}>()
</script>

<template>
  <div class="w-full max-w-4xl mx-auto animate-fade-in">
    <ScenePrompt v-if="currentPrompt" :prompt="currentPrompt" class="mb-8"/>
    
    <Text class="mb-8" variant="quote" align="center" color="muted">
      Narrate the events leading up to this moment. Ask questions. Describe the world. Sooner or later, you'll try something risky.
    </Text>

    <div class="grid gap-6 md:grid-cols-2 mb-8">
      <Card title="Focus the Camera">
        <Text variant="body" color="muted" class="mb-4">Ask the Active Player one sensory question:</Text>
        <List>
          <ListItem><em>"What does it smell like?"</em></ListItem>
          <ListItem><em>"How close is the Killer?"</em></ListItem>
          <ListItem><em>"Is it pitch black?"</em></ListItem>
        </List>
      </Card>
      <Card title="Escalate">
        <Text variant="body" color="muted" class="mb-4">Once per scene, anyone can interject:</Text>
        <Text variant="quote" color="red" align="center" class="my-4">"Something's not right..."</Text>
        <Text variant="caption">Add a terrifying detail that makes the situation worse. The Active Player must accept it.</Text>
      </Card>
    </div>

    <div class="max-w-2xl mx-auto space-y-8 border-t border-nott-gray/20 pt-8 mb-12">
      <div class="text-center space-y-4">
        <Text variant="h2" color="white">Define the effort</Text>
        <Text variant="quote" color="red">"If you push yourself, what are you willing to risk?"</Text>
        <Text variant="caption" color="muted">Discuss the risk together and agree on a specific sacrifice that fits the current tension of the scene.</Text>

        <Text variant="body" color="muted" class="italic">
          {{ actDescription }}
        </Text>
      </div>

      <Card variant="failure">
        <Checkbox 
          v-model="sacrificeConfirmed"
          label="We have agreed on what happens when the character Overexerts themselves."
        />
      </Card>
    </div>

    <!-- Action Footer -->
    <ActionFooter>
      <Button 
        size="lg"
        variant="primary" 
        @click="$emit('next')"
        :disabled="!sacrificeConfirmed"
        class="px-12"
      >
        Roll Dice →
      </Button>
    </ActionFooter>
  </div>
</template>
