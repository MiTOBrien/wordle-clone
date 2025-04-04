import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import {VICTORY_MESSAGE, DEFEAT_MESSAGE} from '../../settings'

describe('WordleBoard', () :void => {
  test("A victory message appears when the user make a guess that matches the word of the day", async() => {
    // ARRANGE PHASE
    const wrapper = mount(WordleBoard, {props: {wordOfTheDay: "TESTS"}})

    // ACT PHASE
    const guessInput = wrapper.find("input[type=text]")
    await guessInput.setValue("TESTS")
    await guessInput.trigger("keydown.enter")

    // ASSERTION PHASE
    expect(wrapper.text()).toContain(VICTORY_MESSAGE)
  })

  test("a defeat message appears if the user makes a guess that is incorrect", async() => {
    // ARRANGE PHASE
    const wrapper = mount(WordleBoard, {props: {wordOfTheDay: "TESTS"}})

    // ACT PHASE
    const guessInput = wrapper.find("input[type=text]")
    await guessInput.setValue("WRONG")
    await guessInput.trigger("keydown.enter")

    //ASSERTION PHASE
    expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
  })
  test.todo("No end-of-game message appears if the user has not yet made a guess")
})
