import { render, screen } from '@testing-library/svelte';
import ComponentEvent from './ComponentEvent.svelte'
import userEvent from '@testing-library/user-event'

it('Test ComponentEvent component', async () => {
  const user = userEvent.setup()
  const { component } = render(ComponentEvent)
  // Mock function
  let text = ''
  const mock = vi.fn((event) => text = event.detail.text)
  component.$on('message', mock)

  const button = screen.getByRole('button')
  await user.click(button)

  expect(mock).toHaveBeenCalled()
  expect(text).toBe('Hello!')
})