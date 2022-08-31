import { render, screen } from '@testing-library/svelte';
import html from 'svelte-htm';
import Box from './Box.svelte';

describe('Test slot fallbacks', () => {
	it('Put some elements', () => {
		render(html`<${Box}><h2>Hello!</h2></${Box}>`);
		expect(screen.getByText('Hello!')).toBeInTheDocument();
	});

	it('Test slot fallback', () => {
		render(html`<${Box} />`);
		expect(screen.getByText('no content was provided')).toBeInTheDocument();
	});
});
