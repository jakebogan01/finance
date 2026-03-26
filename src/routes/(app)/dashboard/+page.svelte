<script>
	import { authCheck } from '$lib/utils/functions.js';
	import { SIGNIN } from '$lib/utils/constants.js';
	import Head from '$lib/components/Head.svelte';
	import { onMount } from 'svelte';

	onMount(() => authCheck(303, SIGNIN, true));
</script>

<Head
	page_title="Finance | Dashboard"
	description="View a complete overview of your finances with a clean dashboard showing income, expenses, and budget insights to help you stay on track."
/>
