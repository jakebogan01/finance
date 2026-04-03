<script>
	import FailedSearchResults from '$lib/components/FailedSearchResults.svelte';
	import EmptyTemplate from '$lib/components/EmptyTemplate.svelte';
	import { incomeStore } from '$lib/stores/incomeStore.svelte.js';
	import CreateButton from '$lib/components/CreateButton.svelte';
	import { INCOMESLUG } from '$lib/stores/incomeSlug.svelte.js';
	import RightLayout from '$lib/components/RightLayout.svelte';
	import LeftLayout from '$lib/components/LeftLayout.svelte';
	import IncomeForm from '$lib/components/IncomeForm.svelte';
	import RecordList from '$lib/components/RecordList.svelte';
	import { authCheck } from '$lib/utils/functions.js';
	import { SIGNIN } from '$lib/utils/constants.js';
	import Head from '$lib/components/Head.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	onMount(() => authCheck(303, SIGNIN, true));

	let hasAnyRecords = $state(false);
	let hasFilteredItems = $state(false);
	let isSearchingOrFiltering = $state(false);
	let handleEditRecord;
	let open = $state(false);
	let resetForm = $state(false);
	let handleReset = $state(null);
	$effect(() => {
		if (!incomeStore.paginated?.items?.length) return;
		const paginated = incomeStore.paginated;
		const filters = incomeStore.filters;
		hasAnyRecords = (paginated?.totalItems ?? 0) > 0;
		hasFilteredItems = (paginated?.items?.length ?? 0) > 0;
		isSearchingOrFiltering =
			filters.search?.length > 0 || (filters.status && filters.status !== 'all');
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

{#if hasAnyRecords}
	<LeftLayout
		bind:handleReset
		bind:handleEditRecord
		{resetForm}
		bind:open
		data={incomeRecord}
		store={incomeStore}
		sortBy="income"
	>
		{#snippet form()}
			<IncomeForm
				bind:handleReset
				bind:handleEditRecord
				{resetForm}
				bind:open
				data={incomeRecord}
			/>
		{/snippet}
		{#if hasFilteredItems}
			<RecordList items={incomeStore.paginated?.items ?? []} {handleURLSlug} store={incomeStore} />
		{:else if isSearchingOrFiltering}
			<FailedSearchResults />
		{/if}
	</LeftLayout>
	<RightLayout
		data={incomeRecord}
		{handleEditRecord}
		collectionName="Incomes"
		store={incomeStore}
	/>
{:else}
	<EmptyTemplate>
		<CreateButton bind:handleReset bind:open>
			<IncomeForm bind:handleReset {resetForm} bind:open />
		</CreateButton>
	</EmptyTemplate>
{/if}
