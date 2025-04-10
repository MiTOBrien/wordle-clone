import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE, MAX_GUESSES_COUNT } from '../../settings'
import { nextTick } from 'process'
import GuessView from '../GuessView.vue'
import { wrap } from 'module'

describe('WordleBoard', () => {
  let wordOfTheDay: string = 'TESTS'
  let wrapper: ReturnType<typeof mount>
  beforeEach(() => {
    wrapper = mount(WordleBoard, { props: { wordOfTheDay } })
  })

  async function playerSubmitsGuess(guess: string) {
    const guessInput = wrapper.find('input[type=text]')
    await guessInput.setValue(guess)
    await guessInput.trigger('keydown.enter')
  }

  describe('End of the game messages', () => {
    test('A victory message appears when the user make a guess that matches the word of the day', async () => {
      await playerSubmitsGuess(wordOfTheDay)

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    describe.each([
      { numberOfGuesses: 0, shouldSeeDefeatMessage: false },
      { numberOfGuesses: 1, shouldSeeDefeatMessage: false },
      { numberOfGuesses: 2, shouldSeeDefeatMessage: false },
      { numberOfGuesses: 3, shouldSeeDefeatMessage: false },
      { numberOfGuesses: 4, shouldSeeDefeatMessage: false },
      { numberOfGuesses: 5, shouldSeeDefeatMessage: false },
      { numberOfGuesses: MAX_GUESSES_COUNT, shouldSeeDefeatMessage: true },
    ])(
      `A defeat message should appear if the player makes an incorrect guess ${MAX_GUESSES_COUNT} times in a row`,
      ({ numberOfGuesses, shouldSeeDefeatMessage }) => {
        test(`therefore for ${numberOfGuesses} guess(es), a defeat message should ${shouldSeeDefeatMessage ? '' : 'not'} appear`, async () => {
          for (let i = 0; i < numberOfGuesses; i++) {
            await playerSubmitsGuess('WRONG')
          }

          if (shouldSeeDefeatMessage) {
            expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
          } else {
            expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
          }
        })
      },
    )

    test('No end-of-game message appears if the user has not yet made a guess', async () => {
      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })
  })

  describe('Word of the day validation tests', () => {
    beforeEach(() => {
      console.warn = vi.fn()
    })

    test.each([
      { wordOfTheDay: 'RABBIT', reason: `is longer than ${WORD_SIZE} letters` },
      { wordOfTheDay: 'FLY', reason: `is shorter than ${WORD_SIZE} letters` },
      { wordOfTheDay: 'lower', reason: 'is lowercase letters' },
      { wordOfTheDay: 'QWERT', reason: `is not a valid ${WORD_SIZE} letter word` },
    ])('Since $wordOfTheDay $reason a warning is called', async ({ wordOfTheDay }) => {
      mount(WordleBoard, { props: { wordOfTheDay } })

      expect(console.warn).toHaveBeenCalled()
    })

    test(`No warning is called if the word of the day is a valid ${WORD_SIZE} letter uppercase word`, async () => {
      mount(WordleBoard, { props: { wordOfTheDay: 'CRACK' } })

      expect(console.warn).not.toHaveBeenCalled()
    })
  })

  describe('Player input validations', () => {
    test(`Player input is limited to ${WORD_SIZE} letters`, async () => {
      await playerSubmitsGuess(wordOfTheDay + 'EXTRA')

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    test('Player guesses can only be submitted if they are real words', async () => {
      await playerSubmitsGuess('QWERT')

      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })

    test('Players guesses are not case sensitive', async () => {
      await playerSubmitsGuess(wordOfTheDay.toLocaleLowerCase())

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    test('Player guesses can only contian letters', async () => {
      await playerSubmitsGuess('WR!T3')

      expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual('WRT')
    })

    test('Confirm non-letter characters do not render on the screen while being typed', async () => {
      await playerSubmitsGuess('12')
      await playerSubmitsGuess('123')

      expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual('')
    })

    test('remains in focus the entire time', async () => {
      document.body.innerHTML = `<div id="app"></div>`
      wrapper = mount(WordleBoard, {
        props: { wordOfTheDay },
        attachTo: '#app',
      })

      expect(wrapper.find('input[type=text]').attributes('autofocus')).not.toBeUndefined()

      await wrapper.find('input[type=text]').trigger('blur')
      expect(document.activeElement).toBe(wrapper.find('input[type=text]').element)
    })

    test('Player input gets cleared after submission', async () => {
      await playerSubmitsGuess('WRONG')

      expect(wrapper.find<HTMLInputElement>('input[type=text').element.value).toEqual('')
    })

    test('Controls are disabled after games is over - won or lost', async () => {})

    test('Player controls are disabled after max number of wrong guesses,', async () => {
      const guesses = ['WRONG', 'GUESS', 'CODER', 'HAPPY', 'WORLD', 'THREE']

      for (const guess of guesses) {
        await playerSubmitsGuess(guess)
      }

      expect(wrapper.find('input[type=text').attributes('disabled')).not.toBeUndefined()
    })

    test('Player controls are disabled after correct guess is made', async () => {
      await playerSubmitsGuess(wordOfTheDay)

      expect(wrapper.find('input[type=text').attributes('disabled')).not.toBeUndefined()
    })
  })

  describe(`There should only be ${MAX_GUESSES_COUNT} guess-views on the board`, async () => {
    test.todo(`${MAX_GUESSES_COUNT} views are present at the start of the game`, async () => {
      expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES_COUNT)
    })

    test.todo(`${MAX_GUESSES_COUNT} views are presesnt when the player wins`, async () => {
      await playerSubmitsGuess(wordOfTheDay)

      expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES_COUNT)
    })

    test.todo(`${MAX_GUESSES_COUNT} views are present when the player loses`, async () => {
      const guesses = [
        "HAPPY",
        "CODER",
        "WRONG",
        "TESTS",
        "WORLD",
        "VIEWS"
      ]

      for(const guess of guesses) {
        await playerSubmitsGuess(guess)

        expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES_COUNT)
      }
    })
  })

  test('All previous guess are visible on the page', async () => {
    const guesses = ['WRONG', 'GUESS', 'CODER', 'HAPPY', 'WORLD', 'HELLO']

    for (const guess of guesses) {
      await playerSubmitsGuess(guess)
    }

    for (const guess of guesses) {
      expect(wrapper.text()).toContain(guess)
    }
  })
})
