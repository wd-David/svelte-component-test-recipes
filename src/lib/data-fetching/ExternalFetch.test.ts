import { render, screen } from '@testing-library/svelte';
import ExternalFetch from './ExternalFetch.svelte';

it('render ExternalFetch', async () => {
	render(ExternalFetch);

	expect(screen.getByText('...waiting')).toBeInTheDocument();
	expect(await screen.findByText('first post body')).toBeInTheDocument();
});
