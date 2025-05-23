<script setup lang="ts">
import { ref, computed } from 'vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, MAX_GUESSES_COUNT } from '@/settings'
import GuessInput from './GuessInput.vue'
import GuessView from './GuessView.vue'
import englishWords from '@/englishWordsWith5Letters.json'

const props = defineProps({
  wordOfTheDay: {
    type: String,
    required: true,
    validator: (wordGiven: string) => englishWords.includes(wordGiven),
  },
})

const guessesSubmitted = ref<string[]>([])

const isGameOver = computed(
  () =>
    guessesSubmitted.value.length === MAX_GUESSES_COUNT ||
    guessesSubmitted.value.includes(props.wordOfTheDay),
)

const countOfEmptyGuesses = computed(() => {
  const guessesRemaing = MAX_GUESSES_COUNT - guessesSubmitted.value.length

  return isGameOver.value ? guessesRemaing : guessesRemaing - 1
})
</script>

<template>
  <main>
    <h1 class="word-guess">WORD GUESS</h1>
    <p
      v-if="isGameOver"
      class="end-of-game-message"
      v-text="guessesSubmitted.includes(wordOfTheDay) ? VICTORY_MESSAGE : DEFEAT_MESSAGE"
    />
    <ul>
      <li v-for="(guess, index) in guessesSubmitted" :key="`${index}-${guess}`">
        <guess-view :guess="guess" :answer="wordOfTheDay" />
      </li>
      <li>
        <guess-input
          :disabled="isGameOver"
          @guess-submitted="(guess) => guessesSubmitted.push(guess)"
        />
      </li>
      <li v-for="i in countOfEmptyGuesses" :key="`remaining-guess-${i}`">
        <guess-view guess="" />
      </li>
    </ul>
    <guess-input @guess-submitted="(guess) => guessesSubmitted.push(guess)" />
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  margin-bottom: 0.25rem;
}

.word-guess {
  font-size: 5rem;
}

.end-of-game-message {
  font-size: 3rem;
  animation: end-of-game-message-animation 700ms forwards;
  white-space: nowrap;
  text-align: center;
}

@keyframes end-of-game-message-animation {
  0% {
    opacity: 0;
    transform: rotateZ(0);
  }
  100% {
    opacity: 1;
    transform: translateY(2rem);
  }
}
</style>
