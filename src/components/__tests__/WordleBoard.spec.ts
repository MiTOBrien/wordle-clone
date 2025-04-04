import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from '../../settings'

describe('WordleBoard', () => {
  let wordOfTheDay: string = 'TESTS'
  test('A victory message appears when the user make a guess that matches the word of the day', async () => {
    // ARRANGE PHASE
    const wrapper = mount(WordleBoard, { props: { wordOfTheDay } })

    // ACT PHASE
    const guessInput = wrapper.find('input[type=text]')
    await guessInput.setValue('TESTS')
    await guessInput.trigger('keydown.enter')

    // ASSERTION PHASE
    expect(wrapper.text()).toContain(VICTORY_MESSAGE)
  })

  test('a defeat message appears if the user makes a guess that is incorrect', async () => {
    // ARRANGE PHASE
    const wrapper = mount(WordleBoard, { props: { wordOfTheDay } })

    // ACT PHASE
    const guessInput = wrapper.find('input[type=text]')
    await guessInput.setValue('WRONG')
    await guessInput.trigger('keydown.enter')

    //ASSERTION PHASE
    expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
  })
  test('No end-of-game message appears if the user has not yet made a guess', async () => {
    // ARRANGE PHASE
    const wrapper = mount(WordleBoard, { props: { wordOfTheDay } })

    // ACT PHASE - NO USER INPUT

    //ASSERTION PHASE
    expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
    expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
  })
})
