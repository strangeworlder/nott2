<script setup lang="ts">
import Text from '../Text.vue'
import Button from '../Button.vue'

defineEmits(['next'])
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center space-y-12 animate-fade-in py-8">
    
    <!-- Hero Section -->
    <div class="space-y-8">
        <Text variant="h2" class="text-nott-red">
            Live Play Helper
        </Text>
        <div class="space-y-6 max-w-3xl mx-auto">
            <Text variant="body" class="text-lg md:text-xl text-nott-white/90 leading-relaxed">
                Gather your friends and prepare for a night of terror. In <span class="text-nott-red font-bold">Night of the Thirteenth</span>, you will tell the story of a slasher movie. 
                Together, you will weave a tale of suspense, gore, and desperate survival. You will need a deck of cards to determine your fate, some dice to test your luck, and the courage to face the darkness. The nightmare will last for about 2 to 3 hours.
            </Text>
            <Text variant="body" class="text-lg md:text-xl text-nott-white/90 leading-relaxed">
                This Live Play Helper is designed to help you navigate the rules of the game and make the most of your experience, but the story will be all you.
            </Text>
            <Text variant="body" class="text-lg md:text-xl text-nott-red font-bold block mt-4">
                Will you survive the night?
            </Text>
        </div>
    </div>

    <!-- Info Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-4 border-t border-b border-nott-gray/30 py-8">
        <div class="flex flex-col items-center justify-start text-center space-y-3">
            <div class="text-nott-red/80">
                <!-- Clock SVG -->
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
            </div>
            <div class="space-y-1">
                <Text variant="label" color="muted">Duration</Text>
                <Text variant="body" class="text-lg">2-3 Hours</Text>
            </div>
        </div>

        <div class="flex flex-col items-center justify-start text-center space-y-3">
            <div class="text-nott-red/80">
                <!-- Users SVG -->
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            </div>
            <div class="space-y-1">
                <Text variant="label" color="muted">Players</Text>
                <Text variant="body" class="text-lg">4 Players</Text>
            </div>
        </div>

        <div class="flex flex-col items-center justify-start text-center space-y-3">
            <div class="text-nott-red/80">
                <!-- Cards/Dice SVG -->
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                    <line x1="7" y1="2" x2="7" y2="22"></line>
                    <line x1="17" y1="2" x2="17" y2="22"></line>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <line x1="2" y1="7" x2="7" y2="7"></line>
                    <line x1="2" y1="17" x2="7" y2="17"></line>
                    <line x1="17" y1="17" x2="22" y2="17"></line>
                    <line x1="17" y1="7" x2="22" y2="7"></line>
                </svg>
            </div>
            <div class="space-y-1">
                <Text variant="label" color="muted">Supplies</Text>
                <Text variant="body" class="text-base leading-snug">
                    Deck of Cards (2 Jokers)<br>
                    d10 & d4 Dice<br>
                    13 Tokens<br>
                    Pen & Paper
                </Text>
            </div>
        </div>
    </div>

    <!-- Action -->
    <div class="pt-8">
        <Button variant="primary" size="lg" @click="$emit('next')" class="animate-pulse-slow text-xl px-12 py-4">
            Start the Nightmare
        </Button>
    </div>
  </div>
</template>
