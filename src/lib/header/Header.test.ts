import { render, screen } from '@testing-library/svelte';
import Header from './Header.svelte';

it('Render About page', () => {
	render(Header);

	const home = screen.getByText('Home');
	expect(home).toBeInTheDocument();

	const props = screen.getByText('Props');
	expect(props).toBeInTheDocument();

	const events = screen.getByText('Events');
	expect(events).toBeInTheDocument();
});
