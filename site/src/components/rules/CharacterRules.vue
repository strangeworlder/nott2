<script setup lang="ts">
/**
 * CharacterRules
 *
 * Philosophical:
 * CharacterRules introduces the cast of victims. It frames character creation
 * around slasher archetypes and the four Suit Aptitudes, emphasizing that who
 * you are determines both how you push your luck and what is lost when you die.
 *
 * Technical:
 * Displays character creation steps, Aptitude descriptions, and Suit Archetypes
 * loaded dynamically via contentLoader.
 *
 * Props:
 * (None - uses useLivePlay and contentLoader directly)
 */

import { computed } from 'vue';
import { useLivePlay } from '../../composables/useLivePlay';
import { getRulesContent } from '../../utils/contentLoader';
import Card from '../Card.vue';
import List from '../List.vue';
import ListItem from '../ListItem.vue';
import Text from '../Text.vue';

const { selectedPlayset } = useLivePlay();
const characterRules = computed(() => getRulesContent(selectedPlayset.value).characterRules);

const suitIcons: Record<string, string> = {
  Spades: '♠',
  Hearts: '♥',
  Clubs: '♣',
  Diamonds: '♦',
};

const suitColors: Record<string, 'white' | 'red'> = {
  Spades: 'white',
  Hearts: 'red',
  Clubs: 'white',
  Diamonds: 'red',
};
</script>

<template>
  <div class="space-y-8">
    <!-- Creation Steps -->
    <section class="space-y-4">
      <Text variant="h3" border="left">{{ characterRules.creationTitle }}</Text>
      <Card>
        <List as="ol">
          <ListItem v-for="step in characterRules.creationSteps" :key="step">
            <Text variant="body" as="span">{{ step }}</Text>
          </ListItem>
        </List>
      </Card>
    </section>

    <!-- Aptitudes -->
    <section class="space-y-4">
      <Text variant="h3" border="left">{{ characterRules.aptitudesTitle }}</Text>
      <Text variant="caption" color="muted">{{ characterRules.aptitudes.description }}</Text>
      <div class="grid gap-4 md:grid-cols-2">
        <Card
          v-for="apt in characterRules.aptitudes.list"
          :key="apt.name"
        >
          <div class="flex items-center gap-4">
            <Text variant="h2" :color="suitColors[apt.suit]" as="span">{{ suitIcons[apt.suit] }}</Text>
            <div>
              <Text variant="label">{{ apt.name }}</Text>
              <Text variant="caption" color="muted">{{ apt.description }}</Text>
            </div>
          </div>
        </Card>
      </div>
    </section>

    <!-- Archetypes -->
    <section class="space-y-4">
      <Text variant="h3" border="left">{{ characterRules.archetypesTitle }}</Text>
      <div class="grid gap-6 md:grid-cols-2">
        <Card
          v-for="group in characterRules.archetypes"
          :key="group.aptitude"
          :title="`${suitIcons[group.suit]} ${group.aptitude}`"
        >
          <List spacing="sm">
            <ListItem v-for="example in group.examples" :key="example">
              <Text variant="body" as="span">{{ example }}</Text>
            </ListItem>
          </List>
        </Card>
      </div>
    </section>
  </div>
</template>
