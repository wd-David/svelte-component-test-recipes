import {get, writable} from 'svelte/store'
import { render, screen } from '@testing-library/svelte'
import html from 'svelte-htm'
import Keypad from './Keypad.svelte'
import userEvent from '@testing-library/user-event'


describe('Test Keypad component', async () => {
  const user = userEvent.setup()
  it('Test two-way binding', async () => {
    const pin = writable('')
    const mock = vi.fn()
    /**
     * FIXME:
     * https://github.com/kenoxa/svelte-htm#readme
     * https://github.com/sveltejs/svelte/issues/6584
     * https://github.com/sveltejs/svelte/pull/6646
     * https://github.com/svelte-society/recipes-mvp/blob/2c7587ad559b3ee22a0caf5e1528bbac34dd475d/testing.md
     */
    render(html`<${Keypad} bind:value=${pin} on:submit=${mock}/>`)
    const button1 = screen.getByText('1')
    await user.click(button1)
    await user.click(button1)
    expect(get(pin)).toBe('11')

    const submitButton = screen.getByText('submit')
    await user.click(submitButton)
    expect(mock).toHaveBeenCalled()

    const clearButton = screen.getByText('clear')
    await user.click(clearButton)
    expect(get(pin)).toBe('')
  })
})

