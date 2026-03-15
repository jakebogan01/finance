<script>
	import { SIGNIN } from '$lib/utils/constants';
	import { authCheck } from '$lib/utils/misc';
	import { onMount } from 'svelte';

	onMount(() => authCheck(303, SIGNIN, true));
</script>

<section></section>
