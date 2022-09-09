<script lang="ts">
	import axios from 'axios';

	interface Post {
		userId: number;
		id: number;
		title: string;
		body: string;
	}

	async function getRandomPost(): Promise<Post[]> {
		const { status, data } = await axios(`https://jsonplaceholder.typicode.com/posts`);

		if (status === 200) {
			return data;
		} else {
			throw new Error(data);
		}
	}
</script>

{#await getRandomPost()}
	<p>...waiting</p>
{:then posts}
	{#each posts as { id, userId, title, body }}
		<p>Post ID: {id}</p>
		<p>User ID: {userId}</p>
		<p>The title is {title}</p>
		<p>{body}</p>
	{/each}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
