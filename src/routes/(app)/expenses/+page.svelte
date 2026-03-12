<script>
	import { isEmpty, filterStatus, sortRecords } from '$lib/utils/misc.js';
	import FilterDropDown from '$lib/components/FilterDropDown.svelte';
	import OpenFormButton from '$lib/components/OpenFormButton.svelte';
	import RecordDetails from '$lib/components/RecordDetails.svelte';
	import { EXPENSESLUG } from '$lib/stores/expenseSlug.svelte.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import SearchExpand from '$lib/components/SearchExpand.svelte';
	import RecordList from '$lib/components/RecordList.svelte';
	import { expensesSchema } from '$lib/utils/schemas.js';

	let { data } = $props();
	let handleEditRecord;
	let filters = $state({
		status: 'all',
		sort: 'latest'
	});
	let dataList = $derived.by(() => {
		if (!data?.expenseRecords) return [];
		let list = [...data.expenseRecords];
		list = filterStatus(list, filters.status);
		list = sortRecords(list, filters.sort);
		return list;
	});
	let hasData = $derived(dataList && dataList?.length > 0);
	let expenseRecord = $derived.by(() => {
		if (!EXPENSESLUG.value) return null;
		if (!dataList || dataList.length === 0) return null;
		const slug = EXPENSESLUG.value.replace(/#/g, '');
		return dataList.find((item) => item.slug === slug) ?? {};
	});

	const handleURLSlug = (slug) => (EXPENSESLUG.value = slug);
</script>

{#if hasData}
	<section class="lg:max-h-168">
		<Command.Root class="space-y-5 bg-transparent text-white-0">
			<div class="flex items-center justify-between gap-5">
				<OpenFormButton
					title="Create Expenses"
					schema={expensesSchema}
					bind:handleEditRecord
					multiStepForm={false}
				/>
				<div class="flex items-center">
					<FilterDropDown bind:filters />
					<SearchExpand class="hidden md:flex" />
				</div>
			</div>
			<RecordList data={dataList} {handleURLSlug} />
		</Command.Root>
	</section>
	{#if !isEmpty(expenseRecord) && expenseRecord !== null}
		<section>
			<RecordDetails data={expenseRecord} {handleEditRecord} collectionName="Expenses" />
		</section>
	{/if}
{:else}
	<Skeleton class="absolute inset-0 z-0 animate-none! rounded-2xl bg-grey-700" />
	<div
		class="absolute top-1/2 left-1/2 z-5 flex size-full -translate-1/2 items-center justify-center text-center"
	>
		<div class="space-y-4">
			<span class="text-preset-3 block text-grey-50">No records</span>
			<OpenFormButton
				title="Create Expenses"
				schema={expensesSchema}
				bind:handleEditRecord
				multiStepForm={false}
			/>
		</div>
	</div>
{/if}
