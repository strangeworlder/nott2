<script setup lang="ts">
import Text from '../Text.vue'
import ActionFooter from '../ActionFooter.vue'
import Card from '../Card.vue'
import { useLivePlay } from '../../composables/useLivePlay'

const { fullReset } = useLivePlay()
</script>

<template>
  <div class="w-full mx-auto animate-fade-in flex flex-col items-center justify-center min-h-[50vh] space-y-8">
    <div class="text-center space-y-4">
      <Text variant="h1" color="red" class="animate-pulse">THE KILLER WINS</Text>
      <Text variant="body" color="muted">No one survived the night.</Text>
    </div>

    <Card variant="failure" class="w-full max-w-md text-center">
        <Text variant="quote" color="red" glow>
            "And so it ends. Not with a scream, but with silence."
        </Text>
    </Card>

    <ActionFooter 
      label="TRY AGAIN"
      @click="fullReset"
    />
  </div>
</template>
