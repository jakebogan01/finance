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

<div class="flex flex-col space-y-5.5 overflow-hidden pt-5.5 pb-4 lg:flex-1">
	<h3 class="sr-only">Income</h3>
	<div class="flex flex-col overflow-y-auto lg:flex-1">
		<ul
			role="list"
			class="relative space-y-3 lg:flex-1 lg:border-r lg:border-grey-800 lg:pr-5 lg:dark:border-grey-200"
		>
			{#each data as item, i (item?.id)}
				<RecordListItem {item} {i} {handleSlug} />
			{/each}
			<Command.Empty>No results found.</Command.Empty>
		</ul>
	</div>
</div>
