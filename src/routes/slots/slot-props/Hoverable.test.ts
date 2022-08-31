import { get, writable } from 'svelte/store';
import { prettyDOM, render, screen } from '@testing-library/svelte';
import html from 'svelte-htm';
import Hoverable from './Hoverable.svelte';
import userEvent from '@testing-library/user-event';

it('Test slot props', async () => {
  const user = userEvent.setup();
	const hovering = writable(false);
	render(html`
		<${Hoverable} let:hovering=${hovering}>
			<div data-testid="hover" class:active=${hovering}>
        <p>Hover over me!</p>
			</div>
		</${Hoverable}>
    <style>
      .active {
        background-color: #ff3e00;
        color: white;
      }
    </style>
	`);
  
  const element = screen.getByText('Hover over me!')
  await user.hover(element)

  expect(get(hovering)).toBeTruthy()
  expect(screen.getByTestId('hover')).toHaveClass('active')
});
