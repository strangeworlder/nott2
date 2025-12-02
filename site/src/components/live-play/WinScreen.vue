<script setup lang="ts">
import { useLivePlay } from '../../composables/useLivePlay'
import Button from '../Button.vue'
import Text from '../Text.vue'

const { fullReset } = useLivePlay()
</script>

<template>
  <div class="fixed inset-0 z-50 bg-nott-black flex flex-col items-center justify-center p-8 text-center animate-fade-in">
    <div class="max-w-2xl space-y-8">
      <Text variant="h1" color="red" class="text-6xl md:text-8xl mb-4">SURVIVED</Text>
      
      <Text variant="body" class="text-xl md:text-2xl text-nott-white/80">
        The night is over. The Red Joker has fallen.
        <br>
        You have survived the Night of the Thirteenth.
      </Text>

      <div class="pt-12">
        <Button variant="primary" size="lg" @click="fullReset">
          Play Again
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
