<script setup lang="ts">
import { ref } from 'vue'
import PromptMatrix from '../live-play/PromptMatrix.vue'
import FalloutReference from './FalloutReference.vue'
import BasicRules from './BasicRules.vue'
import CharacterRules from './CharacterRules.vue'
import Navigation from '../Navigation.vue'
import NavButton from '../NavButton.vue'

const activeTab = ref<'basic' | 'characters' | 'prompts' | 'fallout'>('basic')
</script>

<template>
  <div class="space-y-8">
    <Navigation>
      <NavButton 
        :active="activeTab === 'basic'"
        @click="activeTab = 'basic'"
      >
        Basic Rules
      </NavButton>
      <NavButton 
        :active="activeTab === 'characters'"
        @click="activeTab = 'characters'"
      >
        Characters
      </NavButton>
      <NavButton 
        :active="activeTab === 'prompts'"
        @click="activeTab = 'prompts'"
      >
        Prompt Matrix
      </NavButton>
      <NavButton 
        :active="activeTab === 'fallout'"
        @click="activeTab = 'fallout'"
      >
        Effort Scale
      </NavButton>
    </Navigation>

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
