<script setup lang="ts">
/**
 * ResolveScenePhase
 *
 * Philosophical:
 * ResolveScenePhase is the narrative climax—where the dice have spoken and now
 * the story must answer. It presents the outcome (success or failure) and guides
 * players on how to narrate the resolution. This is where mechanics become memory,
 * where numbers transform into harrowing scenes of survival or defeat.
 *
 * Technical:
 * A phase component that displays the outcome and effort result for narration.
 *
 * Props:
 * (None - uses useLivePlay composable directly)
 *
 * Events:
 * - back: Emitted when the user wants to return to the previous phase.
 * - next: Emitted when the user proceeds to fallout.
 */

import { computed } from 'vue';
import { useLivePlay } from '../../composables/useLivePlay';
import { getResolveScenePhaseContent } from '../../utils/contentLoader';
import ActionFooter from '../ActionFooter.vue';
import Card from '../Card.vue';
import Separator from '../defaults/Separator.vue';
import IngressText from '../IngressText.vue';
import Text from '../Text.vue';
import ScenePrompt from './ScenePrompt.vue';

const {
  activeCard,
  selectedJoker,
  isFirstTime,
  isSuccess,
  effortResult,
  rollEffort,
  selectedPlayset,
} = useLivePlay();

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'next'): void;
}>();

const content = computed(() => getResolveScenePhaseContent(selectedPlayset.value));
</script>

<template>
  <div class="w-full max-w-4xl mx-auto animate-fade-in">
    <!-- Scene Prompt -->
    <ScenePrompt 
      v-if="activeCard || selectedJoker" 
      :card="activeCard" 
      :selected-joker="selectedJoker"
      :is-first-time="isFirstTime"
      class="mb-8" 
    />

    <IngressText>
      <span v-html="content.ingress"></span>
    </IngressText>

    <div class="grid gap-6 md:grid-cols-2 mb-8">
      <!-- Outcome -->
      <Card :title="isSuccess ? content.outcome.success.title : content.outcome.failure.title" :variant="isSuccess ? 'success' : 'failure'">
        <div v-if="isSuccess">
          <Text variant="body" class="mb-4">
            <span v-html="content.outcome.success.body"></span>
          </Text>
          <Text variant="caption" color="muted">
            <span v-html="content.outcome.success.caption"></span>
          </Text>
        </div>
        <div v-else>
          <Text variant="body" class="mb-4">
            <span v-html="content.outcome.failure.body"></span>
          </Text>
          <Text variant="caption" color="muted">
            <span v-html="content.outcome.failure.caption"></span>
          </Text>
        </div>
      </Card>

      <!-- Effort / Sacrifice -->
      <Card :title="content.effort.title" class="border-nott-gray/30">
        <div v-if="rollEffort">
           <Text variant="h3" color="red" class="mb-2">{{ effortResult?.title || content.effort.defaultTitle }}</Text>
           <Separator class="w-1/2 mx-auto my-2" />
           <Text variant="body" color="white">{{ effortResult?.mechanic }}</Text>
        </div>
        <div v-else>
          <Text variant="body" color="muted">{{ content.effort.none }}</Text>
        </div>
      </Card>
    </div>

    <Card variant="instruction" class="text-center mb-12">
      <Text variant="h3" class="mb-2">{{ content.instruction.title }}</Text>
      <Text variant="body" color="muted"><span v-html="content.instruction.body"></span></Text>
    </Card>

    <ActionFooter 
      :label="content.buttonLabel"
      @click="$emit('next')"
    />
  </div>
</template>
