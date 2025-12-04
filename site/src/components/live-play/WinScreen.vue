<script setup lang="ts">
import { useLivePlay } from '../../composables/useLivePlay'
import ActionFooter from '../ActionFooter.vue'
import Text from '../Text.vue'

const { fullReset } = useLivePlay()
</script>

<template>
  <div class="fixed inset-0 z-50 bg-nott-black flex flex-col items-center justify-center p-8 text-center animate-fade-in">
    <div class="max-w-2xl space-y-8">
      <Text variant="hero" color="red" class="mb-4">SURVIVED</Text>
      
      <Text variant="quote" color="muted">
        The night is over. The Red Joker has fallen.
        <br>
        You have survived the Night of the Thirteenth.
      </Text>

      <div class="pt-12">
        <ActionFooter 
          label="Play Again"
          @click="fullReset"
        />
      </div>
    </div>
  </div>
</template>


