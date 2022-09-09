import { render, screen } from '@testing-library/svelte';
import InternalFetch from './InternalFetch.svelte';

it('render InternalFetch', async () => {
	render(InternalFetch);

	expect(screen.getByText('...waiting')).toBeInTheDocument();
	expect(await screen.findByText('The number is 0.25')).toBeInTheDocument();
});
