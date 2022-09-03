import type { ComponentProps } from 'svelte';
import { render, screen } from '@testing-library/svelte';
import DefaultProps from './DefaultProps.svelte';

describe('Test DefaultProps component', async () => {
	it("doesn't pass prop", () => {
		render(DefaultProps);
		expect(screen.queryByText('The answer is a mystery')).toBeInTheDocument();
	});

	it('set and update prop', async () => {
		const { component } = render(DefaultProps, { answer: 'I dunno' });

		expect(screen.queryByText('The answer is I dunno')).toBeInTheDocument();

		// Update prop
		await component.$set({ answer: 'another mystery' });
		expect(screen.queryByText('The answer is another mystery')).toBeInTheDocument();
	});

	it('Pass predefined prop to the component', () => {
		const prop: ComponentProps<DefaultProps> = { answer: 'TypeScript!' };

		render(DefaultProps, prop);

		expect(screen.getByText('The answer is TypeScript!'));
	});
});
