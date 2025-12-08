<script setup lang="ts">
import { characterRules } from '../../data/rules';
import Card from '../Card.vue';
import List from '../List.vue';
import ListItem from '../ListItem.vue';
import Text from '../Text.vue';

const suitIcons: Record<string, string> = {
  Spades: '♠',
  Hearts: '♥',
  Clubs: '♣',
  Diamonds: '♦',
};

const suitColors: Record<string, string> = {
  Spades: '',
  Hearts: 'text-nott-red',
  Clubs: '',
  Diamonds: 'text-nott-red',
};
</script>

<template>
  <div class="space-y-8">
    <!-- Creation Steps -->
    <section>
      <Text variant="h3" border="left" class="mb-4">Creating the Cast</Text>
      <Card>
        <List as="ol">
          <ListItem v-for="step in characterRules.creationSteps" :key="step">
            <Text variant="body" as="span">{{ step }}</Text>
          </ListItem>
        </List>
      </Card>
    </section>

    <!-- Aptitudes -->
    <section>
      <Text variant="h3" border="left" class="mb-4">Aptitudes</Text>
      <Text variant="body" color="muted" class="mb-4"><em>{{ characterRules.aptitudes.description }}</em></Text>
      <div class="grid gap-4 md:grid-cols-2">
        <div 
          v-for="apt in characterRules.aptitudes.list" 
          :key="apt.name"
          class="bg-nott-gray/10 p-4 rounded border border-nott-gray/30 flex items-center gap-4"
        >
          <span class="text-2xl" :class="suitColors[apt.suit]">{{ suitIcons[apt.suit] }}</span>
          <div>
            <Text variant="label">{{ apt.name }}</Text>
            <Text variant="caption" color="muted">{{ apt.description }}</Text>
          </div>
        </div>
      </div>
    </section>

    <!-- Archetypes -->
    <section>
      <Text variant="h3" border="left" class="mb-4">Archetypes</Text>
      <div class="grid gap-6 md:grid-cols-2">
        <Card 
          v-for="group in characterRules.archetypes" 
          :key="group.aptitude"
          :title="`${suitIcons[group.suit]} ${group.aptitude}`"
        >
          <List spacing="sm">
            <ListItem v-for="example in group.examples" :key="example">{{ example }}</ListItem>
          </List>
        </Card>
      </div>
    </section>
  </div>
</template>
