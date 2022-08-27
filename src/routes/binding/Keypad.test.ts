import {writable} from 'svelte/store'
import { render, screen } from '@testing-library/svelte'
import html from 'svelte-htm'
import Keypad from './Keypad.svelte'

describe('Test Keypad component', async () => {
  it('Test two-way binding', async () => {
    const pin = writable('')
    const mock = vi.fn()
    /**
     * FIXME:
     * https://github.com/kenoxa/svelte-htm#readme
     * https://github.com/sveltejs/svelte/issues/6584
     */
    render(html`<${Keypad} bind:value=${pin} on:submit=${mock}/>`)

  })
})

