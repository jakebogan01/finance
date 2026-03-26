<script>
	import { authCheck } from '$lib/utils/functions.js';
	import { SIGNIN } from '$lib/utils/constants.js';
	import Head from '$lib/components/Head.svelte';
	import { onMount } from 'svelte';

	onMount(() => authCheck(303, SIGNIN, true));
</script>

<Head
	page_title="Finance | Expenses"
	description="Log, organize, and update your expenses to better understand your spending habits and stay within your budget."
/>
