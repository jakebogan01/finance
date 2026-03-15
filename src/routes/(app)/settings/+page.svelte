<script>
	import { SIGNIN } from '$lib/utils/constants.js';
	import { authCheck } from '$lib/utils/misc.js';
	import { onMount } from 'svelte';

	onMount(() => authCheck(303, SIGNIN, true));
</script>
