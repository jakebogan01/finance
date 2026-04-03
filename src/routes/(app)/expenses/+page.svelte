<script>
	import FailedSearchResults from '$lib/components/FailedSearchResults.svelte';
	import EmptyTemplate from '$lib/components/EmptyTemplate.svelte';
	import { expenseStore } from '$lib/stores/expenseStore.svelte.js';
	import { EXPENSESLUG } from '$lib/stores/expenseSlug.svelte.js';
	import CreateButton from '$lib/components/CreateButton.svelte';
	import ExpenseForm from '$lib/components/ExpenseForm.svelte';
	import RightLayout from '$lib/components/RightLayout.svelte';
	import RecordList from '$lib/components/RecordList.svelte';
	import LeftLayout from '$lib/components/LeftLayout.svelte';
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
		if (!expenseStore.paginated?.items?.length) return;
		const paginated = expenseStore.paginated;
		const filters = expenseStore.filters;
		hasAnyRecords = (paginated?.totalItems ?? 0) > 0;
		hasFilteredItems = (paginated?.items?.length ?? 0) > 0;
		isSearchingOrFiltering =
			filters.search?.length > 0 || (filters.status && filters.status !== 'all');
		const hash = page.url.hash;
		if (!hash) {
			const firstSlug = expenseStore.paginated?.items[0]?.slug;
			if (!firstSlug) return;
			if (page.url.hash !== `#${firstSlug}`) {
				goto(resolve(`${page.url.pathname}#${firstSlug}`), { replaceState: true });
			}
			return;
		}
		if (EXPENSESLUG.value !== hash) {
			EXPENSESLUG.value = hash;
		}
	});
	let cleanSlug = $derived(EXPENSESLUG.value?.slice(1) ?? null);
	let expenseRecord = $derived.by(() => {
		if (!expenseStore.paginated?.items || !cleanSlug) return null;
		return expenseStore.paginated?.items.find((item) => item.slug === cleanSlug) ?? null;
	});
	const handleURLSlug = (slug) => (EXPENSESLUG.value = slug.startsWith('#') ? slug : `#${slug}`);
</script>

<Head
	page_title="Finance | Expenses"
	description="Log, organize, and update your expenses to better understand your spending habits and stay within your budget."
/>

{#if hasAnyRecords}
	<LeftLayout
		bind:handleReset
		bind:handleEditRecord
		{resetForm}
		bind:open
		data={expenseRecord}
		store={expenseStore}
		sortBy="amount"
	>
		{#snippet form()}
			<ExpenseForm
				bind:handleReset
				bind:handleEditRecord
				{resetForm}
				bind:open
				data={expenseRecord}
			/>
		{/snippet}
		{#if hasFilteredItems}
			<RecordList
				items={expenseStore.paginated?.items ?? []}
				{handleURLSlug}
				store={expenseStore}
			/>
		{:else if isSearchingOrFiltering}
			<FailedSearchResults />
		{/if}
	</LeftLayout>
	<RightLayout
		data={expenseRecord}
		{handleEditRecord}
		collectionName="Expenses"
		store={expenseStore}
	/>
{:else}
	<EmptyTemplate>
		<CreateButton bind:handleReset bind:open>
			<ExpenseForm bind:handleReset {resetForm} bind:open />
		</CreateButton>
	</EmptyTemplate>
{/if}
