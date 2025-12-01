<script setup lang="ts">
import { effortScale } from '../data/rules'
import Card from './Card.vue'
import Text from './Text.vue'
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
        <Text variant="label" color="red" class="border-b border-nott-gray/30 pb-1">
          {{ effort.description }}
        </Text>
        <Text variant="body" class="text-nott-white/90">
          {{ effort.mechanic }}
        </Text>
      </div>
    </Card>
  </div>
</template>
