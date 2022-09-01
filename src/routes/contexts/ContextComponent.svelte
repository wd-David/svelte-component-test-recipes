<script>
	import { getContext } from 'svelte';

	const userDetails = getContext('user-details');
</script>

<div>
	<div>
		<strong>User Name:</strong>
		{userDetails.username}
	</div>

	<div>
		<strong>User Login Status:</strong>
		{userDetails.islogin}
	</div>
</div>
