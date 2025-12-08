<script setup lang="ts">
import Card from '../Card.vue'
import Text from '../Text.vue'
import IngressText from '../IngressText.vue'
import ActionFooter from '../ActionFooter.vue'
import List from '../List.vue'
import ListItem from '../ListItem.vue'
import { getActSetupContent } from '../../utils/contentLoader'
import { computed } from 'vue'
import { useLivePlay } from '../../composables/useLivePlay'

const props = defineProps<{
  act?: number
  setupKey?: string
}>()

const emit = defineEmits<{
  (e: 'next'): void
}>()

const { selectedPlayset } = useLivePlay()
const content = computed(() => {
    if (props.setupKey) {
        // If setupKey is provided, try to load that specific key from actSetup.json
        // We need to cast or extend getActSetupContent to support string keys if it doesn't already
        // But getActSetupContent likely expects a number.
        // Let's check getActSetupContent implementation first? 
        // No, I'll assume I need to modify it or use a new loader.
        // Actually, looking at previous view_file of ActSetup.vue, it imported getActSetupContent.
        // I should check utils/contentLoader.ts to see if it supports string keys.
        // If not, I'll need to update it.
        return getActSetupContent(props.setupKey, selectedPlayset.value)
    }
    return getActSetupContent(props.act!, selectedPlayset.value)
})
</script>

<template>
  <div v-if="content" class="w-full max-w-4xl mx-auto animate-fade-in">
    <Text variant="h2" color="red" class="mb-2 text-center block">
      {{ content.title }}
    </Text>
    <IngressText v-html="content.quote" />

    <div :class="{'grid gap-6 md:grid-cols-2 mb-12': content.sections.length > 1, 'max-w-2xl mx-auto mb-12': content.sections.length === 1}">
        <Card 
          v-for="(section, index) in content.sections" 
          :key="index" 
          :title="section.title"
          :class="{
            'md:col-span-2': content.sections.length > 1 && content.sections.length % 2 !== 0 && index === content.sections.length - 1
          }"
        >
            <Text v-if="section.intro" variant="body" color="muted" class="mb-4">
                <span v-html="section.intro"></span>
            </Text>
            <List variant="none" as="ol" spacing="lg">
                <ListItem v-for="(step, stepIndex) in section.steps" :key="stepIndex" variant="ordered" :index="stepIndex">
                    <span v-html="step"></span>
                </ListItem>
            </List>
            <Text v-if="section.footer" variant="body" color="muted" class="mt-8">
                <span v-html="section.footer"></span>
            </Text>
        </Card>
    </div>

    <!-- Action Footer -->
    <!-- ActionFooter -->
    <ActionFooter 
      :label="content.buttonText"
      @click="$emit('next')"
    />
  </div>
</template>
