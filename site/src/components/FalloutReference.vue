<script setup lang="ts">
import { effortScale } from '../data/rules'
import Card from './Card.vue'
</script>

<template>
  <div class="grid gap-6 md:grid-cols-2">
    <Card
      v-for="effort in effortScale"
      :key="effort.level"
      :title="`${effort.level}. ${effort.title}`"
      class="h-full"
    >
      <div class="space-y-3">
        <p class="text-nott-red font-display tracking-wider text-sm uppercase border-b border-nott-gray/30 pb-1">
          {{ effort.description }}
        </p>
        <p class="text-sm leading-relaxed text-nott-white/90">
          {{ effort.mechanic }}
        </p>
      </div>
    </Card>
  </div>
</template>
