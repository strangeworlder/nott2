<script setup lang="ts">
/**
 * RulesReference
 *
 * Philosophical:
 * RulesReference is the table's quick-reference codex. It organizes the rules
 * into digestible tabs—Basic Rules, Characters, Prompt Matrix, and Effort Scale—
 * so players can look up any mechanic or prompt without losing their place in
 * the Live Play Helper, or download the complete printable Ashcan Booklet PDF.
 *
 * Technical:
 * A tabbed container component switching between BasicRules, CharacterRules,
 * PromptMatrix, and FalloutReference, with an action to open/download the
 * printable Ashcan Booklet PDF.
 *
 * Props:
 * (None - manages active tab internally)
 */

import { computed, ref } from 'vue';
import { useLivePlay } from '../../composables/useLivePlay';
import { getUiLabelsContent } from '../../utils/contentLoader';
import Button from '../Button.vue';
import PromptMatrix from '../live-play/PromptMatrix.vue';
import NavButton from '../NavButton.vue';
import Navigation from '../Navigation.vue';
import BasicRules from './BasicRules.vue';
import CharacterRules from './CharacterRules.vue';
import FalloutReference from './FalloutReference.vue';

type TabId = 'basic' | 'characters' | 'prompts' | 'fallout';

const { selectedPlayset } = useLivePlay();
const labels = computed(() => getUiLabelsContent(selectedPlayset.value).rulesReference);

const tabs = computed<{ id: TabId; label: string }[]>(() => [
  { id: 'basic', label: labels.value.tabs.basic },
  { id: 'characters', label: labels.value.tabs.characters },
  { id: 'prompts', label: labels.value.tabs.prompts },
  { id: 'fallout', label: labels.value.tabs.fallout },
]);

const activeTab = ref<TabId>('basic');

function downloadBooklet() {
  window.open(labels.value.bookletUrl, '_blank', 'noopener,noreferrer');
}
</script>

<template>
  <div class="space-y-8">
    <Navigation>
      <NavButton
        v-for="tab in tabs"
        :key="tab.id"
        :active="activeTab === tab.id"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </NavButton>
    </Navigation>

    <div class="flex justify-center">
      <Button variant="secondary" size="sm" @click="downloadBooklet">
        {{ labels.downloadBooklet }}
      </Button>
    </div>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-4 opacity-0"
      mode="out-in"
    >
      <div v-if="activeTab === 'basic'" key="basic">
        <BasicRules />
      </div>
      <div v-else-if="activeTab === 'characters'" key="characters">
        <CharacterRules />
      </div>
      <div v-else-if="activeTab === 'prompts'" key="prompts">
        <PromptMatrix />
      </div>
      <div v-else key="fallout">
        <FalloutReference />
      </div>
    </Transition>
  </div>
</template>
