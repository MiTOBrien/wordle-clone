<script setup lang="ts">
import { ref } from 'vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from '@/settings'
import GuessInput from './GuessInput.vue'
import englishWords from '@/englishWordsWith5Letters.json'

defineProps({
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) => englishWords.includes(wordGiven),
  },
})

const guessSubmitted = ref('')
</script>

<template>
  <guess-input @guess-submitted="(guess) => (guessSubmitted = guess)" />
  <p
    v-if="guessSubmitted.length > 0"
    v-text="guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE"
  />
</template>

<style scoped></style>
