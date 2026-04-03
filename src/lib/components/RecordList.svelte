<script>
	import RecordListItem from '$lib/components/RecordListItem.svelte';
	import { EXPENSESLUG } from '$lib/stores/expenseSlug.svelte.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { INCOMESLUG } from '$lib/stores/incomeSlug.svelte.js';
	import Pagination from '$lib/components/Pagination.svelte';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let { items = [], handleURLSlug, store } = $props();

	const totalPages = $derived(Math.max(1, store.paginated?.totalPages ?? 1));
	const showPagination = $derived(totalPages > 1);

	onMount(() => {
		const hash = page.url.hash;
		if (!hash) return;
		if (!INCOMESLUG.value || !EXPENSESLUG.value) handleURLSlug(hash);
	});

	const handleSlug = (slug) => handleURLSlug(`#${slug}`);
</script>

<div class="flex flex-col space-y-5.5 overflow-hidden pt-5.5 pb-4 lg:flex-1">
	<h3 class="sr-only">Income</h3>
	<div
		class="flex flex-col lg:flex-1 lg:border-r lg:border-grey-800 lg:pr-5 lg:dark:border-grey-200"
	>
		<ul role="list" class="relative space-y-3 lg:flex-1">
			{#if items.length > 0}
				{#each items as item, i (item.id)}
					<RecordListItem {item} {i} {handleSlug} />
				{/each}
			{:else}
				<Command.Empty>No results found.</Command.Empty>
			{/if}
		</ul>
		{#if showPagination}
			<Pagination {store} />
		{/if}
	</div>
</div>
