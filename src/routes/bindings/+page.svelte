<script lang="ts">
	import Keypad from '$lib/bindings/Keypad.svelte';

	let pin: string;
	$: view = pin ? pin.replace(/\d(?!$)/g, '•') : 'enter your pin';

	function handleSubmit() {
		alert(`submitted ${pin}`);
	}
</script>

<h1 style="color: {pin ? '#333' : '#ccc'}">{view}</h1>

<Keypad bind:value={pin} on:submit={handleSubmit} />
