import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from '../../settings'

describe('WordleBoard', () => {
  let wordOfTheDay: string = 'TESTS'
  let wrapper: ReturnType<typeof mount>;
  beforeEach(() => {
    wrapper = mount(WordleBoard, { props: { wordOfTheDay } })
  })

  async function playerSubmitsGuess(guess: string) {
    const guessInput = wrapper.find('input[type=text]')
    await guessInput.setValue(guess)
    await guessInput.trigger('keydown.enter')
  }

  describe("End of the game messages", () => {
    test('A victory message appears when the user make a guess that matches the word of the day', async () => {
      await playerSubmitsGuess(wordOfTheDay)
  
      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })
  
    test('a defeat message appears if the user makes a guess that is incorrect', async () => {
      await playerSubmitsGuess("WRONG")
  
      expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
    })
  
    test('No end-of-game message appears if the user has not yet made a guess', async () => {
  
      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })
  })

  describe("Word of the day validation tests for a word that is not 5 letters, in lowercase, or not a valid word", () => {
    test.each(
      [
        "RABBIT",
        "FLY",
        "lower",
        "QWERT",
      ]
    )("If '%s' is provided a warning is called", async (wordOfTheDay) => {
      // MOCKS THE CONSOLE WARN CALLED MESSAGE (CAN ALSO BE DONE WITH CONSOLE SPY)
      console.warn = vi.fn()
  
      mount(WordleBoard, {props: {wordOfTheDay: wordOfTheDay}})
  
      expect(console.warn).toHaveBeenCalled()
    })
  
    test("No warning is called if the word of the day is a valid 5 letter uppercase word", async () => {
      // MOCKS THE CONSOLE WARN CALLED MESSAGE (CAN ALSO BE DONE WITH CONSOLE SPY)
      console.warn = vi.fn()
  
      mount(WordleBoard, {props: {wordOfTheDay: "CRACK"}})
  
      expect(console.warn).not.toHaveBeenCalled()
    })
  })

  describe("Player input validations", () => {
    test("Player input is exactly 5 letters", () => {

    })

    test.todo("Player guesses can only be submitted if they are real words")
    test.todo("Players guesses are not case sensitive")
    test.todo("Player guesses can only contian letters")
  })
})
