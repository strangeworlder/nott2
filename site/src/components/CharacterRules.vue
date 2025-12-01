<script setup lang="ts">
import { characterRules } from '../data/rules'
import Card from './Card.vue'
import Text from './Text.vue'

const suitIcons: Record<string, string> = {
  'Spades': '♠',
  'Hearts': '♥',
  'Clubs': '♣',
  'Diamonds': '♦',
}

const suitColors: Record<string, string> = {
  'Spades': '',
  'Hearts': 'text-nott-red',
  'Clubs': '',
  'Diamonds': 'text-nott-red',
}
</script>

<template>
  <div class="space-y-8">
    <!-- Creation Steps -->
    <section>
      <Text variant="h3" class="mb-4 border-l-4 border-nott-red pl-4">Creating the Cast</Text>
      <Card>
        <ol class="list-decimal list-inside space-y-2 text-nott-white/90">
          <li v-for="step in characterRules.creationSteps" :key="step">
            <Text variant="body" as="span">{{ step }}</Text>
          </li>
        </ol>
      </Card>
    </section>

    <!-- Aptitudes -->
    <section>
      <Text variant="h3" class="mb-4 border-l-4 border-nott-red pl-4">Aptitudes</Text>
      <Text variant="body" color="muted" class="mb-4 italic">{{ characterRules.aptitudes.description }}</Text>
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
      <Text variant="h3" class="mb-4 border-l-4 border-nott-red pl-4">Archetypes</Text>
      <div class="grid gap-6 md:grid-cols-2">
        <Card 
          v-for="group in characterRules.archetypes" 
          :key="group.aptitude"
          :title="`${suitIcons[group.suit]} ${group.aptitude}`"
        >
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="example in group.examples" 
              :key="example"
              class="px-2 py-1 bg-nott-gray/30 rounded text-sm text-nott-white/80 border border-nott-gray/50"
            >
              {{ example }}
            </span>
          </div>
        </Card>
      </div>
    </section>
  </div>
</template>
