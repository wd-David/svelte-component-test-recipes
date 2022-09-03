<script lang="ts">
	import { page } from '$app/stores';
	import logo from './svelte-logo.svg';
</script>

<header>
	<div class="corner">
		<a href="https://kit.svelte.dev">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li class:active={$page.url.pathname === '/'}>
				<a data-sveltekit-prefetch href="/">Home</a>
			</li>
			<li class:active={$page.url.pathname === '/props'}>
				<a data-sveltekit-prefetch href="/props">Props</a>
			</li>
			<li class:active={$page.url.pathname === '/events'}>
				<a data-sveltekit-prefetch href="/events">Events</a>
			</li>
			<li class:active={$page.url.pathname === '/bindings'}>
				<a data-sveltekit-prefetch href="/bindings">Two-way Bindings</a>
			</li>
			<li class:active={$page.url.pathname === '/actions'}>
				<a data-sveltekit-prefetch href="/actions">Actions</a>
			</li>
			<li class:active={$page.url.pathname === '/contexts'}>
				<a data-sveltekit-prefetch href="/contexts">Context API</a>
			</li>
			<li class:active={$page.url.pathname === '/slots/name-slots'}>
				<a data-sveltekit-prefetch href="/slots/name-slots">Slots - Name Slots</a>
			</li>
			<li class:active={$page.url.pathname === '/slots/optional-slots'}>
				<a data-sveltekit-prefetch href="/slots/optional-slots">Slots - Optional Slots</a>
			</li>
			<li class:active={$page.url.pathname === '/slots/slot-fallbacks'}>
				<a data-sveltekit-prefetch href="/slots/slot-fallbacks">Slots - Slot Fallbacks</a>
			</li>
			<li class:active={$page.url.pathname === '/slots/slot-props'}>
				<a data-sveltekit-prefetch href="/slots/slot-props">Slots - Slot Props</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		<!-- TODO put something else here? github link? -->
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li.active::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent-color);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--accent-color);
	}
</style>
