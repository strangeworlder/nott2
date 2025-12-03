<script setup lang="ts">
import { ref, watch } from 'vue'
import RulesReference from './components/RulesReference.vue'
import LivePlayHelper from './components/LivePlayHelper.vue'
import DesignSystem from './components/DesignSystem.vue'
import Header from './components/Header.vue'
import Navigation from './components/Navigation.vue'
import NavButton from './components/NavButton.vue'
import { useLivePlay } from './composables/useLivePlay'
import { updateTheme } from './utils/theme'

const { selectedPlayset } = useLivePlay()

watch(selectedPlayset, (newId) => {
  updateTheme(newId)
}, { immediate: true })

const currentView = ref<'showcase' | 'rules' | 'play'>('play')
</script>

<template>
  <div class="min-h-screen bg-nott-black p-4 md:p-8 font-body selection:bg-nott-red selection:text-white max-w-[960px] mx-auto">
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
          <LivePlayHelper />
        </div>


      </Transition>
    </main>
  </div>
</template>
