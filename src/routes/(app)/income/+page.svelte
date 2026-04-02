<script>
	import { authCheck, usdFormatter } from '$lib/utils/functions.js';
	import RecordDetails from '$lib/components/RecordDetails.svelte';
	import EmptyTemplate from '$lib/components/EmptyTemplate.svelte';
	import { incomeStore } from '$lib/stores/incomeStore.svelte.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import CreateButton from '$lib/components/CreateButton.svelte';
	import SearchButton from '$lib/components/SearchButton.svelte';
	import FilterButton from '$lib/components/FilterButton.svelte';
	import { INCOMESLUG } from '$lib/stores/incomeSlug.svelte.js';
	import IncomeForm from '$lib/components/IncomeForm.svelte';
	import RecordList from '$lib/components/RecordList.svelte';
	import { SIGNIN } from '$lib/utils/constants.js';
	import Head from '$lib/components/Head.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	onMount(() => authCheck(303, SIGNIN, true));

	let isSearching = $derived(incomeStore.filters.search?.length > 0);
	let hasData = $derived(incomeStore.paginated?.items?.length > 0);
	let hasAnyData = $derived(incomeStore.total > 0);
	let open = $state(false);
	let resetForm = $state(false);
	let handleReset = $state(null);
	$effect(() => {
		if (!incomeStore.paginated?.items?.length) return;
		const hash = page.url.hash;
		if (!hash) {
			const firstSlug = incomeStore.paginated?.items[0]?.slug;
			if (!firstSlug) return;
			if (page.url.hash !== `#${firstSlug}`) {
				goto(resolve(`${page.url.pathname}#${firstSlug}`), { replaceState: true });
			}
			return;
		}
		if (INCOMESLUG.value !== hash) {
			INCOMESLUG.value = hash;
		}
	});
	let cleanSlug = $derived(INCOMESLUG.value?.slice(1) ?? null);
	let incomeRecord = $derived.by(() => {
		if (!incomeStore.paginated?.items || !cleanSlug) return null;
		return incomeStore.paginated?.items.find((item) => item.slug === cleanSlug) ?? null;
	});
	const handleURLSlug = (slug) => (INCOMESLUG.value = slug.startsWith('#') ? slug : `#${slug}`);
</script>

<Head
	page_title="Finance | Income"
	description="Track and manage all your income sources in one place. Add, update, and monitor earnings over time with ease."
/>

{#if hasAnyData || isSearching}
	<section>
		<Command.Root class="rounded-none bg-transparent dark:bg-transparent!">
			<div class="flex items-center justify-between gap-5">
				<CreateButton bind:handleReset bind:open>
					<IncomeForm bind:handleReset {resetForm} bind:open />
				</CreateButton>
				<div class="mr-0 flex items-center lg:mr-5">
					<FilterButton
						filters={incomeStore.filters}
						sortType="income"
						onChange={(f) => incomeStore.setFilters(f)}
					/>
					<SearchButton class="hidden md:flex" onSearch={(value) => incomeStore.setSearch(value)} />
				</div>
			</div>
			{#if hasData}
				<RecordList items={incomeStore.paginated?.items ?? []} {handleURLSlug} />
			{:else if isSearching}
				<div class="flex flex-col space-y-5.5 overflow-hidden pt-5.5 pb-4 lg:flex-1">
					<div
						class="flex flex-col items-center justify-center lg:flex-1 lg:border-r lg:border-grey-800 lg:pr-5 lg:dark:border-grey-200"
					>
						<p class="text-center text-grey-200 dark:text-grey-500">
							No results found for "{incomeStore.filters.search}"
						</p>
					</div>
				</div>
			{/if}
		</Command.Root>
	</section>
	<section>
		<h3 class="text-preset-4-semibold hidden h-13 items-center justify-end text-yellow-200 lg:flex">
			<span class="text-preset-5-semibold mr-2 text-grey-100/80 dark:text-grey-400">Total:</span
			>{usdFormatter.format(incomeStore.total)}
		</h3>
		{#if incomeRecord}
			<RecordDetails data={incomeRecord} />
		{/if}
	</section>
{:else}
	<EmptyTemplate>
		<CreateButton bind:handleReset bind:open>
			<IncomeForm bind:handleReset {resetForm} bind:open />
		</CreateButton>
	</EmptyTemplate>
{/if}
