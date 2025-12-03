<script setup lang="ts">
import Text from '../Text.vue'
import Button from '../Button.vue'
import ActionFooter from '../ActionFooter.vue'
import SelectionButton from '../SelectionButton.vue'
import Card from '../Card.vue'
import { useLivePlay, type Playset } from '../../composables/useLivePlay'

const { selectedPlayset } = useLivePlay()

const emit = defineEmits<{
  (e: 'next'): void
}>()

const selectPlayset = (playset: Playset) => {
  selectedPlayset.value = playset
}

const playsetDetails: Record<Playset, { description: string, warnings: string[], touchstones: string[] }> = {
  'Generic slasher (no flavor)': {
    description: "A classic slasher setup. No specific tropes enforced, just you and the killer.",
    warnings: ["Violence", "Gore", "Death"],
    touchstones: ["Halloween", "Friday the 13th", "Scream"]
  },
  'Summercamp Slasher': {
    description: "Counselors, cabins, and a killer in the woods. The quintessential slasher setting.",
    warnings: ["Violence", "Gore", "Death", "Teen peril"],
    touchstones: ["Friday the 13th", "Sleepaway Camp", "The Burning", "Fear Street: 1978"]
  }
}

</script>

<template>
  <div class="w-full max-w-4xl mx-auto animate-fade-in flex flex-col items-center justify-center min-h-[50vh]">
    <div class="mb-6 text-center">
      <Text variant="h1" color="red" class="mb-4">Night of the Thirteenth</Text>
      <Text variant="body" color="muted" class="max-w-xl mx-auto">
        Welcome to the game. Prepare yourself for a night of horror.
      </Text>
    </div>

    <div class="mb-8 w-full max-w-md space-y-4">
      <Text variant="h3" class="text-center">Select Playset</Text>
      <div class="flex flex-col gap-3">
        <SelectionButton 
          :selected="selectedPlayset === 'Generic slasher (no flavor)'"
          @click="selectPlayset('Generic slasher (no flavor)')"
        >
          Generic slasher (no flavor)
        </SelectionButton>
        <SelectionButton 
          :selected="selectedPlayset === 'Summercamp Slasher'"
          @click="selectPlayset('Summercamp Slasher')"
        >
          Summercamp Slasher
        </SelectionButton>
      </div>

      <div v-if="selectedPlayset" class="animate-fade-in mt-4">
        <Card :title="selectedPlayset">
          <div class="space-y-4">
            <Text variant="body" color="muted">
              {{ playsetDetails[selectedPlayset].description }}
            </Text>
            
            <div>
              <Text variant="label" color="red" class="mb-1">Content Warnings</Text>
              <Text variant="caption" color="muted">
                {{ playsetDetails[selectedPlayset].warnings.join(', ') }}
              </Text>
            </div>

            <div>
              <Text variant="label" color="red" class="mb-1">Touchstones</Text>
              <Text variant="caption" color="muted">
                {{ playsetDetails[selectedPlayset].touchstones.join(', ') }}
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
        Begin Setup →
      </Button>
    </ActionFooter>
  </div>
</template>
