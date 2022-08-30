import { render, screen } from '@testing-library/svelte';
import html from 'svelte-htm';
import Project from './Project.svelte';
import Comment from './Comment.svelte';

describe('Test optional slots', () => {
	it('Put Comment component in Project', () => {
		render(html`
			<${Project} title="Add TypeScript support" tasksCompleted="{25}" totalTasks="{57}">
				<div slot="comments">
					<${Comment} name="Ecma Script" postedAt=${new Date('2020-08-17T14:12:23')}>
						<p>Those interface tests are now passing.</p>
					</${Comment}>
				</div>
			</${Project}>
		`);
		const article = screen.getAllByRole('article')[0];
		expect(article).toHaveClass('has-discussion');
	});
	it('No slot in Project component', () => {
		render(html`
			<${Project} title="Update documentation" tasksCompleted="{18}" totalTasks="{21}" />
		`);
		const article = screen.getAllByRole('article')[0];
		expect(article).not.toHaveClass('has-discussion');
		expect(screen.queryByText('Comments')).not.toBeInTheDocument();
	});
});
