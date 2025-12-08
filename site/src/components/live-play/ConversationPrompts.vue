<script setup lang="ts">
/**
 * ConversationPrompts
 *
 * Philosophical:
 * ConversationPrompts are the sensory palette—questions that ground the abstract
 * horror in tangible details. They ask about sights, sounds, smells, drawing
 * players deeper into the world. These prompts transform a tabletop session into
 * an immersive experience by engaging multiple senses in the storytelling.
 *
 * Technical:
 * A component that displays randomized sensory prompts for the current Act.
 *
 * Props:
 * - act (number): The current Act number to load prompts for.
 * - title (string): The title of the prompt card.
 * - intro (string): Introductory text displayed above the prompts.
 */

import { computed } from 'vue';
import { useLivePlay } from '../../composables/useLivePlay';
import { getSensoryPrompts } from '../../utils/contentLoader';
import Card from '../Card.vue';
import List from '../List.vue';
import ListItem from '../ListItem.vue';
import Text from '../Text.vue';

const props = defineProps<{
  act: number;
  title: string;
  intro: string;
}>();

const { selectedPlayset } = useLivePlay();

const currentQuestions = computed(() => {
  const allPrompts = getSensoryPrompts(selectedPlayset.value);
  const actPrompts = allPrompts[props.act.toString()] || [];

  // Shuffle and take 3
  const shuffled = [...actPrompts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
});
</script>

<template>
  <Card :title="title">
    <Text variant="body" color="white" class="mb-4"><span v-html="intro"></span></Text>
    <List>
      <ListItem v-for="(question, index) in currentQuestions" :key="index">
        <Text as="span">"{{ question }}"</Text>
      </ListItem>
    </List>
  </Card>
</template>
