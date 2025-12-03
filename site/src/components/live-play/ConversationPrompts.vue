<script setup lang="ts">
import { computed } from 'vue'
import Card from '../Card.vue'
import Text from '../Text.vue'
import List from '../List.vue'
import ListItem from '../ListItem.vue'
import { sensoryPrompts } from '../../data/sensoryPrompts'

const props = defineProps<{
  act: number
}>()

const currentQuestions = computed(() => {
  const promptData = sensoryPrompts.find(p => p.act === props.act)
  return promptData ? promptData.questions : sensoryPrompts[0].questions
})
</script>

<template>
  <Card title="2. Focus the Camera">
    <Text variant="body" color="muted" class="mb-4">The Active Player asks one of the following questions and the others answer:</Text>
    <List>
      <ListItem v-for="(question, index) in currentQuestions" :key="index">
        <em>"{{ question }}"</em>
      </ListItem>
    </List>
  </Card>
</template>
