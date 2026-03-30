<script>
	import RecordListItem from '$lib/components/RecordListItem.svelte';
	import { EXPENSESLUG } from '$lib/stores/expenseSlug.svelte.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { INCOMESLUG } from '$lib/stores/incomeSlug.svelte.js';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let { data, handleURLSlug } = $props();

	onMount(() => {
		if ((page.url.hash && !INCOMESLUG.value) || (page.url.hash && !EXPENSESLUG.value))
			handleURLSlug(page.url.hash);
	});

	const handleSlug = (slug) => handleURLSlug(`#${slug}`);
</script>

<div
	class="flex flex-col space-y-4 overflow-hidden rounded-2xl border border-grey-300 bg-grey-1000 px-2.5 py-4 sm:rounded-20 sm:px-4 lg:flex-1 dark:bg-white-0"
>
	<h3 class="text-preset-4-semibold text-white-0 dark:text-grey-900">
		<span class="text-grey-150 dark:text-grey-400">Total:</span> $4,385
	</h3>
	<div
		class="flex flex-col overflow-y-auto rounded-2xl bg-grey-400 p-1.5 sm:p-2.5 lg:flex-1 dark:bg-grey-200"
	>
		<ul role="list" class="relative space-y-1.5 lg:flex-1">
			{#each data as item, i (item?.id)}
				<RecordListItem {item} {i} {handleSlug} />
			{/each}
			<Command.Empty>No results found.</Command.Empty>
		</ul>
	</div>
</div>
