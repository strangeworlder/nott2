<script setup lang="ts">
import { ref } from 'vue'
import Button from './components/Button.vue'
import Card from './components/Card.vue'
import RulesReference from './components/RulesReference.vue'
import LivePlayHelper from './components/LivePlayHelper.vue'
import OnlinePlayTool from './components/OnlinePlayTool.vue'
import Text from './components/Text.vue'
import Toggle from './components/Toggle.vue'
import Badge from './components/Badge.vue'
import DieSelector from './components/DieSelector.vue'
import PlayingCard from './components/PlayingCard.vue'
import Checkbox from './components/Checkbox.vue'

const currentView = ref<'showcase' | 'rules' | 'play' | 'online'>('showcase')
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
        <button 
          @click="currentView = 'online'"
          class="text-nott-white hover:text-nott-red transition-colors font-display uppercase tracking-wider px-4 py-2 border border-transparent hover:border-nott-red/50"
          :class="{ 'text-nott-red border-nott-red': currentView === 'online' }"
        >
          Online Play Tool
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
          <!-- Design System Content -->
          <div class="space-y-12">
            <!-- Typography -->
            <section class="space-y-4">
              <h2 class="text-3xl font-display text-nott-white border-b border-nott-gray pb-2">Typography</h2>
              <div class="grid md:grid-cols-2 gap-8">
                <div>
                  <p class="text-nott-gray mb-2">Display Font (Oswald)</p>
                  <div class="text-nott-white font-display space-y-2">
                    <p class="text-4xl">The Killer Is Watching</p>
                    <p class="text-2xl">Don't Split The Party</p>
                    <p class="text-xl">Something's not right...</p>
                  </div>
                </div>
                <div>
                  <p class="text-nott-gray mb-2">Body Font (Courier Prime)</p>
                  <div class="text-nott-white space-y-2">
                    <p>The old house stood silent on the hill. Too silent.</p>
                    <p class="italic">"Did you hear that?" she whispered.</p>
                    <p class="font-bold">EFFORT: THE TWIST</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Colors -->
            <section class="space-y-4">
              <h2 class="text-3xl font-display text-nott-white border-b border-nott-gray pb-2">Color Palette</h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="space-y-2">
                  <div class="h-24 bg-nott-black border border-nott-gray"></div>
                  <p class="text-nott-white">Nott Black <span class="text-nott-gray text-sm">#0a0a0a</span></p>
                </div>
                <div class="space-y-2">
                  <div class="h-24 bg-nott-red"></div>
                  <p class="text-nott-white">Nott Red <span class="text-nott-gray text-sm">#8a0000</span></p>
                </div>
                <div class="space-y-2">
                  <div class="h-24 bg-nott-white"></div>
                  <p class="text-nott-white">Nott White <span class="text-nott-gray text-sm">#f0f0f0</span></p>
                </div>
                <div class="space-y-2">
                  <div class="h-24 bg-nott-gray"></div>
                  <p class="text-nott-white">Nott Gray <span class="text-nott-gray text-sm">#2a2a2a</span></p>
                </div>
              </div>
            </section>

            <!-- Components -->
            <section class="space-y-4">
              <h2 class="text-3xl font-display text-nott-white border-b border-nott-gray pb-2">Components</h2>
              
              <div class="grid md:grid-cols-2 gap-8">
                <div class="space-y-4">
                  <h3 class="text-xl text-nott-white font-display">Buttons</h3>
                  <div class="flex flex-wrap gap-4">
                    <Button>Primary Action</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost Button</Button>
                  </div>
                  <div class="flex flex-wrap gap-4">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                  <div class="flex gap-4">
                    <Button disabled>Disabled</Button>
                  </div>
                </div>

                <div class="space-y-4">
                  <h3 class="text-xl text-nott-white font-display">Cards</h3>
                  <Card title="Threat Card">
                    <p class="text-nott-white mb-4">You hear a noise upstairs. It sounds like heavy boots dragging across the floorboards.</p>
                    <Button size="sm" class="w-full">Investigate</Button>
                  </Card>
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-8 mt-8">
                <div class="space-y-4">
                  <Text variant="h3">Text & Typography</Text>
                  <div class="space-y-2 border border-nott-gray p-4 rounded bg-nott-white/5">
                    <Text variant="h1">Heading 1</Text>
                    <Text variant="h2">Heading 2</Text>
                    <Text variant="h3">Heading 3</Text>
                    <Text variant="body">Body text. The quick brown fox jumps over the lazy dog.</Text>
                    <Text variant="label">Label Text</Text>
                    <Text variant="caption">Caption text</Text>
                    <Text variant="quote">"This is a dramatic quote."</Text>
                  </div>
                </div>

                <div class="space-y-4">
                  <Text variant="h3">Interactive Elements</Text>
                  <div class="space-y-4 border border-nott-gray p-4 rounded bg-nott-white/5">
                    <div class="flex gap-4 items-center">
                      <Toggle :modelValue="true" />
                      <Toggle :modelValue="false" />
                    </div>
                    <div class="flex gap-4 items-center">
                      <Checkbox :modelValue="true" label="Checked" />
                      <Checkbox :modelValue="false" label="Unchecked" />
                    </div>
                    <div class="flex gap-4 items-center">
                      <Badge>Default</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="red">Red</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-8 mt-8">
                <div class="space-y-4">
                  <Text variant="h3">Game Elements</Text>
                  <div class="flex gap-4 flex-wrap">
                    <PlayingCard suit="Spades" :rank="1" />
                    <PlayingCard suit="Hearts" :rank="12" />
                  </div>
                </div>

                <div class="space-y-4">
                  <Text variant="h3">Dice Selectors</Text>
                  <div class="space-y-4">
                    <DieSelector :sides="4" :modelValue="1" label="d4" color="red" />
                    <DieSelector :sides="10" :modelValue="5" label="d10" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        
        <div v-else-if="currentView === 'rules'" key="rules">
          <RulesReference />
        </div>

        <div v-else-if="currentView === 'play'" key="play">
          <LivePlayHelper />
        </div>

        <div v-else key="online">
          <OnlinePlayTool />
        </div>
      </Transition>
    </main>
  </div>
</template>
