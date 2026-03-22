<script>
	import DefaultLayout from '$lib/components/DefaultLayout.svelte';
	import MoveLeftIcon from '@lucide/svelte/icons/move-left';
	import { DASHBOARD } from '$lib/utils/constants.js';
	import Head from '$lib/components/Head.svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<Head page_title="Finance | {page.status}" description={page.error.message} />

<DefaultLayout>
	{#snippet content()}
		<span class="text-grey-50">{page.status}</span>
		<h2 class="text-preset-8-bold">{page.error.message}</h2>
		{#if page.status === 404}
			<p>Sorry, couldn't find the page you're looking for.</p>
		{/if}
		<a
			href={resolve(DASHBOARD)}
			aria-label="Return home"
			class="flex items-center gap-2 pt-4 text-grey-50 md:transition-colors md:hover:text-white-0"
		>
			<MoveLeftIcon class="size-4" />
			Back to home
		</a>
	{/snippet}
</DefaultLayout>
