<script setup lang="ts">
import Card from '../Card.vue'
import Text from '../Text.vue'
import Button from '../Button.vue'
import ActionFooter from '../ActionFooter.vue'
import List from '../List.vue'
import ListItem from '../ListItem.vue'
import { getActSetupContent } from '../../utils/contentLoader'
import { computed } from 'vue'

const props = defineProps<{
  act: number
}>()

const emit = defineEmits<{
  (e: 'next'): void
}>()

const content = computed(() => getActSetupContent(props.act))
</script>

<template>
  <div v-if="content" class="w-full max-w-4xl mx-auto animate-fade-in">
    <div class="mb-6 text-center">
      <Text variant="h2" color="red" class="mb-2" align="center">
        {{ content.title }}
      </Text>
      <Text variant="quote" align="center" color="muted">
        <span v-html="content.quote"></span>
      </Text>
    </div>

    <div :class="{'grid gap-6 md:grid-cols-2 mb-12': content.sections.length > 1, 'max-w-2xl mx-auto mb-12': content.sections.length === 1}">
        <Card v-for="(section, index) in content.sections" :key="index" :title="section.title">
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
    <ActionFooter>
      <Button 
        size="xl"
        variant="primary" 
        @click="$emit('next')"
      >
        {{ content.buttonText }}
        →
      </Button>
    </ActionFooter>
  </div>
</template>
