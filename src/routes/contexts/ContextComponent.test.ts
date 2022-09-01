import { render, screen } from '@testing-library/svelte';
import html from 'svelte-htm';
import Fragment from 'svelte-fragment-component';
import ContextComponent from './ContextComponent.svelte';

it('Test Context API', () => {
	const userDetails = { username: 'abc@example.com', islogin: 'yes' };

	render(html`
		<${Fragment} context=${{ 'user-details': userDetails }}>
			<${ContextComponent}/>
		</$>
	`);

	expect(screen.getByText('abc@example.com')).toBeInTheDocument();
	expect(screen.getByText('yes')).toBeInTheDocument();
});
