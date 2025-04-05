<script setup lang="ts">
import { computed, ref } from 'vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE } from '@/settings'
import englishWords from '@/englishWordsWith5Letters.json'

defineProps({
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) => englishWords.includes(wordGiven),
  },
})

const guessInProgress = ref('')
const guessSubmitted = ref('')

const formattedGuessInProgress = computed({
  get() {
    return guessInProgress.value
  },
  set(rawValue: string) {
    guessInProgress.value = rawValue.slice(0, WORD_SIZE)
  },
})

function onSubmit() {
  if(!englishWords.includes(guessInProgress.value)) {
    return;
  }
  
  guessSubmitted.value = guessInProgress.value
}
</script>

<template>
  <input
    type="text"
    v-model="formattedGuessInProgress"
    maxlength="WORD_SIZE"
    @keydown.enter="onSubmit"
  />
  <p
    v-if="guessSubmitted.length > 0"
    v-text="guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE"
  />
</template>

<style scoped></style>
