<script setup lang="ts">
import { ref } from 'vue'
import RulesReference from './components/RulesReference.vue'
import LivePlayHelper from './components/LivePlayHelper.vue'
import DesignSystem from './components/DesignSystem.vue'

const currentView = ref<'showcase' | 'rules' | 'play'>('showcase')
</script>

<template>
  <div class="min-h-screen bg-nott-black p-4 md:p-8 font-body selection:bg-nott-red selection:text-white max-w-[960px] mx-auto">
    <header class="mx-auto mb-12 text-center">
      <h1 class="text-5xl md:text-7xl font-display text-nott-red mb-2 tracking-tighter animate-pulse-slow text-shadow-glow">
        NIGHT OF THE THIRTEENTH
      </h1>
      
      <nav class="flex justify-center gap-4 mt-8">
        <button 
          @click="currentView = 'showcase'"
          class="text-nott-white hover:text-nott-red transition-colors font-display uppercase tracking-wider px-4 py-2 border border-transparent hover:border-nott-red/50"
          :class="{ 'text-nott-red border-nott-red': currentView === 'showcase' }"
        >
          Design System
        </button>
        <button 
          @click="currentView = 'rules'"
          class="text-nott-white hover:text-nott-red transition-colors font-display uppercase tracking-wider px-4 py-2 border border-transparent hover:border-nott-red/50"
          :class="{ 'text-nott-red border-nott-red': currentView === 'rules' }"
        >
          Rules Reference
        </button>
        <button 
          @click="currentView = 'play'"
          class="text-nott-white hover:text-nott-red transition-colors font-display uppercase tracking-wider px-4 py-2 border border-transparent hover:border-nott-red/50"
          :class="{ 'text-nott-red border-nott-red': currentView === 'play' }"
        >
          Live Play Helper
        </button>

      </nav>
    </header>

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
