<script setup lang="ts">
import Text from '../Text.vue'
import Button from '../Button.vue'
import ActionFooter from '../ActionFooter.vue'
import SelectionButton from '../SelectionButton.vue'
import Card from '../Card.vue'
import { useLivePlay, type Playset } from '../../composables/useLivePlay'
import { getGameSetupContent } from '../../utils/contentLoader'
import { computed } from 'vue'

const { selectedPlayset } = useLivePlay()
const content = getGameSetupContent()

const emit = defineEmits<{
  (e: 'next'): void
}>()

const selectPlayset = (playsetId: string) => {
  selectedPlayset.value = playsetId as Playset
}

const selectedPlaysetDetails = computed(() => {
    return content.playsets.find(p => p.id === selectedPlayset.value)
})
</script>

<template>
  <div class="w-full max-w-4xl mx-auto animate-fade-in flex flex-col items-center justify-center min-h-[50vh]">
    <div class="mb-6 text-center">
      <Text variant="h1" color="red" class="mb-4">{{ content.title }}</Text>
      <Text variant="body" color="muted" class="max-w-xl mx-auto">
        <span v-html="content.intro"></span>
      </Text>
    </div>

    <div class="mb-8 w-full max-w-md space-y-4">
      <Text variant="h3" class="text-center">{{ content.playsetSelectionTitle }}</Text>
      <div class="flex flex-col gap-3">
        <SelectionButton 
            v-for="playset in content.playsets"
            :key="playset.id"
            :selected="selectedPlayset === playset.id"
            @click="selectPlayset(playset.id)"
        >
          {{ playset.name }}
        </SelectionButton>
      </div>

      <div v-if="selectedPlaysetDetails" class="animate-fade-in mt-4">
        <Card :title="selectedPlaysetDetails.name">
          <div class="space-y-4">
            <Text variant="body" color="muted">
              {{ selectedPlaysetDetails.description }}
            </Text>
            
            <div v-for="(detail, index) in selectedPlaysetDetails.details" :key="index">
              <Text variant="label" color="red" class="mb-1">{{ detail.label }}</Text>
              <Text variant="caption" color="muted">
                {{ detail.items.join(', ') }}
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <ActionFooter>
      <Button 
        size="xl"
        variant="primary" 
        :disabled="!selectedPlayset"
        @click="$emit('next')"
      >
        {{ content.buttonText }}
      </Button>
    </ActionFooter>
  </div>
</template>
