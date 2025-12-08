<script setup lang="ts">
import Text from '../Text.vue'
import IngressText from '../IngressText.vue'
import ActionFooter from '../ActionFooter.vue'
import SelectionButton from '../SelectionButton.vue'
import Card from '../Card.vue'
import { useLivePlay, type Playset } from '../../composables/useLivePlay'
import { getGameSetupContent, getPlaysetConfig, getRulesModuleDefinitions } from '../../utils/contentLoader'
import { computed } from 'vue'

const { selectedPlayset } = useLivePlay()
const content = computed(() => getGameSetupContent(selectedPlayset.value))

const emit = defineEmits<{
  (e: 'next'): void
}>()

const selectPlayset = (playsetId: string) => {
  selectedPlayset.value = playsetId as Playset
}

const selectedPlaysetDetails = computed(() => {
    return content.value.playsets.find((p: any) => p.id === selectedPlayset.value)
})

const selectedPlaysetConfig = computed(() => {
    return getPlaysetConfig(selectedPlayset.value)
})

const rulesDefinitions = computed(() => {
    return getRulesModuleDefinitions(selectedPlayset.value)
})
</script>

<template>
  <div class="w-full mx-auto animate-fade-in flex flex-col items-center justify-center min-h-[50vh]">
    <Text variant="h1" color="red" class="mb-4 text-center">{{ content.title }}</Text>
    <IngressText class="max-w-xl mx-auto" v-html="content.intro" />

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

            <div v-if="selectedPlaysetConfig?.rulesModules" class="pt-2 border-t border-red-900/30">
                <Text variant="label" color="red" class="mb-2">Special Rules</Text>
                <div v-for="(isEnabled, key) in selectedPlaysetConfig.rulesModules" :key="key" class="mb-2">
                    <template v-if="isEnabled && rulesDefinitions[key]">
                        <Text variant="label" color="red">{{ rulesDefinitions[key].label }}</Text>
                        <Text variant="caption" color="muted">{{ rulesDefinitions[key].description }}</Text>
                    </template>
                </div>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <ActionFooter
      :label="content.buttonText"
      :disabled="!selectedPlayset"
      @click="$emit('next')"
    />
  </div>
</template>
