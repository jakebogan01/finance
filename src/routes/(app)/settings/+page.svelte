<script>
	import { authCheck } from '$lib/utils/functions.js';
	import { SIGNIN } from '$lib/utils/constants.js';
	import Head from '$lib/components/Head.svelte';
	import { onMount } from 'svelte';

	onMount(() => authCheck(303, SIGNIN, true));
</script>

<Head
	page_title="Finance | Settings"
	description="Manage your account, profile, and shared access. Invite others and control how your financial data is shared and updated."
/>
