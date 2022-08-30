import { render, screen } from '@testing-library/svelte';
import html from 'svelte-htm';
import ContactCard from './ContactCard.svelte';

describe('Test name slots', () => {
	it('Only put slot "name"', () => {
		render(html`
			<${ContactCard}>
				<span slot="name"> P. Sherman </span>
			</${ContactCard}>
		`);
		// Fallbacks
		expect(screen.getByText('Unknown address')).toBeInTheDocument();
		expect(screen.getByText('Unknown email')).toBeInTheDocument();
	});
});
