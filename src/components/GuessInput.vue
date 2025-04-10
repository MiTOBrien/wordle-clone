<script setup lang="ts">
import { computed, ref, triggerRef } from 'vue'
import { WORD_SIZE } from '@/settings'
import GuessView from './GuessView.vue'
import englishWords from '@/englishWordsWith5Letters.json'

withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false })

const guessInProgress = ref<string | null>(null)
const emit = defineEmits<{
  'guess-submitted': [guess: string]
}>()

const formattedGuessInProgress = computed<string>({
  get() {
    return guessInProgress.value ?? ''
  },
  set(rawValue: string) {
    guessInProgress.value = null

    guessInProgress.value = rawValue
      .slice(0, WORD_SIZE)
      .toUpperCase()
      .replace(/[^A-Z]+/gi, '')

    triggerRef(formattedGuessInProgress)
  },
})

function onSubmit() {
  if (!englishWords.includes(formattedGuessInProgress.value)) {
    return
  }

  emit('guess-submitted', formattedGuessInProgress.value)

  guessInProgress.value = null
}
</script>

<template>
  <guess-view :guess="formattedGuessInProgress" />

  <input
    v-model="formattedGuessInProgress"
    :maxlength="WORD_SIZE"
    :disabled="disabled"
    aria-label="Make your guess for the word of the day!"
    autofocus
    @blur="({ target }) => (target as HTMLInputElement).focus()"
    type="text"
    @keydown.enter="onSubmit"
  />
</template>

<style scoped>
input {
  position: absolute;
  opacity: 0;
}
</style>
