<script setup lang="ts">
import { ref, watch } from 'vue';
import DesignSystem from './components/dev/DesignSystem.vue';
import Header from './components/Header.vue';
import LivePlayHelper from './components/live-play/LivePlayHelper.vue';
import LoseScreen from './components/live-play/LoseScreen.vue';
import NavButton from './components/NavButton.vue';
import Navigation from './components/Navigation.vue';
import RulesReference from './components/rules/RulesReference.vue';
import { useLivePlay } from './composables/useLivePlay';
import { updateTheme } from './utils/theme';

const { selectedPlayset, isGameWon, currentPhase } = useLivePlay();

watch(
  selectedPlayset,
  (newId) => {
    updateTheme(newId);
  },
  { immediate: true }
);

const currentView = ref<'showcase' | 'rules' | 'play'>('play');
const isDev = import.meta.env.DEV;
</script>

<template>
  <div class="min-h-screen bg-nott-black p-4 md:p-8 font-body selection:bg-nott-red selection:text-white max-w-[960px] mx-auto">xx
    <Header>
      <Navigation>
        <NavButton 
          @click="currentView = 'play'"
          :active="currentView === 'play'"
        >
          Live Play Helper
        </NavButton>
        <NavButton 
          @click="currentView = 'rules'"
          :active="currentView === 'rules'"
        >
          Rules Reference
        </NavButton>

        <NavButton 
          v-if="isDev"
          @click="currentView = 'showcase'"
          :active="currentView === 'showcase'"
        >
          DS
        </NavButton>
      </Navigation>
    </Header>

    <main class="mx-auto">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-y-4 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform translate-y-4 opacity-0"
        mode="out-in"
      >
        <div v-if="currentView === 'showcase'" key="showcase">
          <DesignSystem />
        </div>
        
        <div v-else-if="currentView === 'rules'" key="rules">
          <RulesReference />
        </div>

        <div v-else-if="currentView === 'play'" key="play">
          <div v-if="currentPhase === 'win' && !isGameWon">
             <LoseScreen />
          </div>
          <LivePlayHelper v-else />
        </div>


      </Transition>
    </main>

  </div>
</template>
