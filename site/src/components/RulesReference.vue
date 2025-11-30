<script setup lang="ts">
import { ref } from 'vue'
import PromptMatrix from './PromptMatrix.vue'
import FalloutReference from './FalloutReference.vue'
import BasicRules from './BasicRules.vue'
import CharacterRules from './CharacterRules.vue'
import Button from './Button.vue'

const activeTab = ref<'basic' | 'characters' | 'prompts' | 'fallout'>('basic')
</script>

<template>
  <div class="space-y-8">
    <div class="flex justify-center gap-4 flex-wrap">
      <Button 
        :variant="activeTab === 'basic' ? 'primary' : 'ghost'"
        @click="activeTab = 'basic'"
      >
        Basic Rules
      </Button>
      <Button 
        :variant="activeTab === 'characters' ? 'primary' : 'ghost'"
        @click="activeTab = 'characters'"
      >
        Characters
      </Button>
      <Button 
        :variant="activeTab === 'prompts' ? 'primary' : 'ghost'"
        @click="activeTab = 'prompts'"
      >
        Prompt Matrix
      </Button>
      <Button 
        :variant="activeTab === 'fallout' ? 'primary' : 'ghost'"
        @click="activeTab = 'fallout'"
      >
        Fallout Scale
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
