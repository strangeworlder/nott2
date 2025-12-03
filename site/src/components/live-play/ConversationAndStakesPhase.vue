<script setup lang="ts">
import { computed } from 'vue'
import { useLivePlay } from '../../composables/useLivePlay'
import Card from '../Card.vue'
import ScenePrompt from './ScenePrompt.vue'
import Text from '../Text.vue'
import Checkbox from '../Checkbox.vue'
import Button from '../Button.vue'

import ActionFooter from '../ActionFooter.vue'
import ConversationPrompts from './ConversationPrompts.vue'

const { sacrificeConfirmed, currentAct, activeCard, selectedJoker, isFirstTime } = useLivePlay()

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
    
    <Text class="mb-8" variant="quote" align="center" color="muted">
      We will now create a scene for the Active Player's character. 
      The Active Player will be the Director for the scene, responsible for the start and 
      maintaining the tone they wish for it to have. They have complete authority over the actions of their characters and a veto right to anything suggested by the other players.
      Ask questions. Describe the situation. The other players can take the roles of 
      side characters and assist the Active Player in their scene. The scene will culminate in the active character trying
      something where success is left to the dice.
    </Text>

    <ScenePrompt 
      v-if="activeCard || selectedJoker" 
      :card="activeCard" 
      :selected-joker="selectedJoker"
      :is-first-time="isFirstTime"
      class="mb-8"
    />

    <div class="max-w-2xl mx-auto space-y-8 border-t border-nott-gray/20 pt-8 mb-12">
      <Card title="1. Set the scene">
        <Text variant="body" color="white">
          <strong>Active player:</strong><br/>
          Based on the scene prompt, above, describe where this scene is taking place.
          <div class="mb-4"></div>
          <strong>Other players:</strong><br/>
          Describe the situation and the characters in the scene.
          <div class="mb-4"></div>
          <strong>Active player:</strong><br/>
          Their character will be on the front and center of the scene.
        </Text>
      </Card>
    </div>
    <div class="grid gap-6 md:grid-cols-2 mb-8">
      <ConversationPrompts :act="currentAct" />
      <Card title="3. Define goals and escalate">
        <Text variant="body" color="white" class="mb-4">Once per scene, anyone can interject:</Text>
        <Text variant="quote" color="red" align="center" class="my-4">"Something's not right..."</Text>
        <Text variant="caption">Add a terrifying detail that makes the situation worse. The Active Player must accept it.</Text>
      </Card>
    </div>

    <div class="max-w-2xl mx-auto space-y-8 border-t border-nott-gray/20 pt-8 mb-12">
      <Card title="4. Commit to the effort">
        <Text variant="quote" color="red">"If you end up pushing yourself to reach your goal, what are you willing to risk?"</Text>
        <Text variant="caption" color="muted">Discuss the risk together and agree on a specific sacrifice that fits the current tension of the scene.</Text>

        <Text variant="body" color="muted" class="italic">
          {{ actDescription }}
        </Text>
      </Card>

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
