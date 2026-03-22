<script>
	import DefaultLayout from '$lib/components/DefaultLayout.svelte';
	import { SIGNUP } from '$lib/utils/constants.js';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<DefaultLayout>
	{#snippet content()}
		{#if page.url.pathname === SIGNUP}
			<h2 class="text-preset-8-bold">Sign up</h2>
			<p class="text-grey-50">Keeping track of your finances starts here.</p>
		{:else}
			<h2 class="text-preset-8-bold">Sign in</h2>
			<p class="text-grey-50">Manage your finances with confidence!</p>
		{/if}
	{/snippet}
	{@render children?.()}
</DefaultLayout>
