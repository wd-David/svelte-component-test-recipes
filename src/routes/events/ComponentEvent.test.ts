import { render, screen, fireEvent } from '@testing-library/svelte';
import ComponentEvent from './ComponentEvent.svelte'

it('Test ComponentEvent component', async () => {
  const { component } = render(ComponentEvent)
  // Mock function
  let text = ''
  const mock = vi.fn((event) => text = event.detail.text)
  component.$on('message', mock)
  
  const button = screen.getByRole('button')
  await fireEvent.click(button)

  expect(mock).toHaveBeenCalled()
  expect(text).toBe('Hello!')
})