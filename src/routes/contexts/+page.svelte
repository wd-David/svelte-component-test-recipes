<script>
	import { setContext } from 'svelte';
	import ContextComponent from '$lib/contexts/ContextComponent.svelte';

	const userDetails = { username: 'abc@example.com', islogin: 'yes' };

	setContext('user-details', userDetails);
</script>

<main>
	<p>Context Example.</p>
	<hr />

	<div>
		<br />
		<ContextComponent />
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
