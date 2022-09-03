<script lang="ts">
	import ComponentEvent from '$lib/events/ComponentEvent.svelte';

	function handleMessage(event: CustomEvent) {
		alert(event.detail.text);
	}
</script>

<ComponentEvent on:message={handleMessage} />
