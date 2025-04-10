<script setup lang="ts">
import { computed, ref, triggerRef } from 'vue'
import { WORD_SIZE } from '@/settings'
import englishWords from '@/englishWordsWith5Letters.json'

const props = defineProps<{ guess: string; answer?: string }>()

function getFeedback(letterPostion: number): null | 'correct' | 'incorrect' | 'almost' {
  if (!props.answer) {
    return null
  }

  return props.answer[letterPostion] === props.guess[letterPostion] ? 'correct' : 'incorrect'
}
</script>

<template>
  <ul class="word">
    <li
      v-for="(letter, index) in guess.padEnd(WORD_SIZE, ' ')"
      :key="`${letter}-${index}`"
      :data-letter="letter"
      :data-letter-feedback="getFeedback(index)"
      :class="{ 'with-flips': answer }"
      class="letter"
      v-text="letter"
    />
  </ul>
</template>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;
}

.word {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 0.25rem;
}

.letter {
  --front-color: hsl(0, 0%, 99%);
  --back-color: hsl(0, 0%, 70%);
  background-color: var(--front-color);
  border: 1px solid hsl(0, 0%, 70%);
  width: 5rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bolder;
}

li:not([data-letter=' ']) {
  animation: pop 100ms;
}

@keyframes pop {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.4);
  }
}

$maxWordSize: 5;
@for $i from 1 through $maxWordSize {
  .with-flips:nth-last-of-type(#{$i}) {
    animation: flip-card 300ms forwards;
    animation-delay: #{250 * $i}ms;
  }
}

@keyframes flip-card {
  0% {
    transform: rotateY(0);
    background-color: var(--front-color);
  }
  49% {
    background-color: var(--front-color);
  }
  50% {
    transform: rotateY(-90deg);
    background-color: var(--back-color);
  }
  100% {
    transform: rotateY(0);
    background-color: var(--back-color);
  }
}
</style>
