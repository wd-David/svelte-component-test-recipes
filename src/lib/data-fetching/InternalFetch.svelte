<script lang="ts">
	import axios from 'axios';

	async function getRandomNumber(): Promise<string> {
		const { status, data } = await axios(`/random-number`);

		if (status === 200) {
			return data;
		} else {
			throw new Error(data);
		}
	}

	let promise = getRandomNumber();

	function handleClick() {
		promise = getRandomNumber();
	}
</script>

<button on:click={handleClick}> generate random number </button>

{#await promise}
	<p>...waiting</p>
{:then number}
	<p>The number is {number}</p>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
