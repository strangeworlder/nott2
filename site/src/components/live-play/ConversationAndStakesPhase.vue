<script setup lang="ts">
import { computed } from 'vue'
import { useLivePlay } from '../../composables/useLivePlay'
import Card from '../Card.vue'
import ScenePrompt from './ScenePrompt.vue'
import Text from '../Text.vue'
import IngressText from '../IngressText.vue'
import Checkbox from '../Checkbox.vue'

import ActionFooter from '../ActionFooter.vue'
import ConversationPrompts from './ConversationPrompts.vue'
import { getConversationAndStakesContent } from '../../utils/contentLoader'

const { sacrificeConfirmed, currentAct, activeCard, selectedJoker, isFirstTime, selectedPlayset } = useLivePlay()

const content = computed(() => getConversationAndStakesContent(selectedPlayset.value))

const actDescription = computed(() => {
  switch (currentAct.value) {
    case 1: return content.value.actDescriptions["1"]
    case 2: return content.value.actDescriptions["2"]
    case 3: return content.value.actDescriptions["3"]
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
    
    <IngressText v-html="content.intro" />

    <ScenePrompt 
      v-if="activeCard || selectedJoker" 
      :card="activeCard" 
      :selected-joker="selectedJoker"
      :is-first-time="isFirstTime"
      class="mb-8"
    />

    <div class="max-w-2xl mx-auto space-y-8 border-t border-nott-gray/20 pt-8 mb-12">
      <Card :title="content.steps.setScene.title">
        <div class="space-y-4">
          <Text variant="body" color="white" v-html="content.steps.setScene.activePlayer1" />
          <Text variant="body" color="white" v-html="content.steps.setScene.otherPlayers" />
          <Text variant="body" color="white" v-html="content.steps.setScene.activePlayer2" />
        </div>
      </Card>
    </div>
    <div class="grid gap-6 md:grid-cols-2 mb-8">
      <ConversationPrompts 
        :act="currentAct" 
        :title="content.steps.focusCamera.title"
        :intro="content.steps.focusCamera.intro"
      />
      <Card :title="content.steps.defineGoals.title">
        <Text variant="body" color="white" class="mb-4"><span v-html="content.steps.defineGoals.intro"></span></Text>
        <Text variant="quote" color="red" align="center" class="my-4"><span v-html="content.steps.defineGoals.quote"></span></Text>
        <Text variant="caption"><span v-html="content.steps.defineGoals.caption"></span></Text>
      </Card>
    </div>

    <div class="max-w-2xl mx-auto space-y-8 border-t border-nott-gray/20 pt-8 mb-12">
      <Card :title="content.steps.commitToEffort.title">
        <Text variant="quote" color="red"><span v-html="content.steps.commitToEffort.quote"></span></Text>
        <Text variant="caption" color="muted"><span v-html="content.steps.commitToEffort.caption"></span></Text>

        <Text variant="body" color="muted" class="italic">
          {{ actDescription }}
        </Text>
      </Card>

      <Card variant="failure">
        <Checkbox 
          v-model="sacrificeConfirmed"
          :label="content.ui.checkboxLabel"
        />
      </Card>
    </div>

    <!-- Action Footer -->
    <!-- ActionFooter -->
    <ActionFooter 
      :label="content.ui.buttonText"
      :disabled="!sacrificeConfirmed"
      @click="$emit('next')"
    />
  </div>
</template>
