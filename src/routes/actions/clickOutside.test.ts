import { render, screen } from '@testing-library/svelte';
import html from 'svelte-htm';
import userEvent from '@testing-library/user-event';
import { clickOutside } from './clickOutside';

it('Test clickOuside svelte action', async () => {
	const user = userEvent.setup();
	const mock = vi.fn();

	render(html`
		<button>Outside the button</button>
		<button
			use:action=${clickOutside /** or (node) => yourAction(node, params) */}
			on:outclick=${mock}
		>
			Click outside me!
		</button>
	`);

	const button = screen.getByText('Outside the button');
	await user.click(button);
	expect(mock).toHaveBeenCalled();
});
