<script setup lang="ts">
/**
 * GameSetup
 *
 * Philosophical:
 * GameSetup is where players choose their instrument of terror. The Playset selection
 * is more than configuration—it's a commitment to a specific narrative flavor. Each
 * Playset brings its own horror tropes, settings, and mechanical tweaks. This
 * component must convey the identity of each option while making the selection
 * process feel momentous rather than bureaucratic.
 *
 * Technical:
 * A phase component for selecting the game playset and displaying its details.
 *
 * Props:
 * (None - uses useLivePlay composable directly)
 *
 * Events:
 * - next: Emitted when the user confirms their playset selection.
 */

import { computed } from 'vue';
import { useLivePlay } from '../../composables/useLivePlay';
import {
  getGameSetupContent,
  getPlaysetConfig,
  getRulesModuleDefinitions,
  type PlaysetData,
} from '../../utils/contentLoader';
import ActionFooter from '../ActionFooter.vue';
import Card from '../Card.vue';
import IngressText from '../IngressText.vue';
import SelectionButton from '../SelectionButton.vue';
import Text from '../Text.vue';

const { selectedPlayset } = useLivePlay();
const content = computed(() => getGameSetupContent(selectedPlayset.value));

defineEmits<(e: 'next') => void>();

const selectPlayset = (playsetId: string) => {
  selectedPlayset.value = playsetId;
};

const selectedPlaysetDetails = computed(() => {
  return content.value.playsets.find((p: PlaysetData) => p.id === selectedPlayset.value);
});

const selectedPlaysetConfig = computed(() => {
  return getPlaysetConfig(selectedPlayset.value);
});

const rulesDefinitions = computed(() => {
  return getRulesModuleDefinitions(selectedPlayset.value);
});
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
