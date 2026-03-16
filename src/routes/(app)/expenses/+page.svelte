<script>
	import { isEmpty, filterStatus, sortRecords, authCheck } from '$lib/utils/misc.js';
	import DefaultTemplate from '$lib/components/DefaultTemplate.svelte';
	import FilterDropDown from '$lib/components/FilterDropDown.svelte';
	import OpenFormButton from '$lib/components/OpenFormButton.svelte';
	import RecordDetails from '$lib/components/RecordDetails.svelte';
	import { EXPENSESLUG } from '$lib/stores/expenseSlug.svelte.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import SearchExpand from '$lib/components/SearchExpand.svelte';
	import RecordList from '$lib/components/RecordList.svelte';
	import { expensesSchema } from '$lib/utils/schemas.js';
	import BarChart from '$lib/components/BarChart.svelte';
	import { SIGNIN } from '$lib/utils/constants.js';
	import { onMount } from 'svelte';

	let { data } = $props();

	onMount(() => authCheck(303, SIGNIN, true));

	let hasData = $derived(data?.expenseRecords && data?.expenseRecords?.length > 0);
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
					data={expenseRecord}
				/>
				<div class="flex items-center">
					<FilterDropDown bind:filters sortType="amount" />
					<SearchExpand class="hidden md:flex" />
				</div>
			</div>
			<RecordList data={dataList} {handleURLSlug} title="Expenses" />
		</Command.Root>
	</section>
	{#if !isEmpty(expenseRecord) && expenseRecord !== null}
		<section class="flex max-h-168.5 flex-col space-y-5">
			<RecordDetails data={expenseRecord} {handleEditRecord} collectionName="Expenses" />
			<BarChart historyMap={data.expenseHistoryMap} expenseId={expenseRecord.id} />
		</section>
	{/if}
{:else}
	<DefaultTemplate>
		<OpenFormButton
			title="Create Expenses"
			schema={expensesSchema}
			bind:handleEditRecord
			multiStepForm={false}
		/>
	</DefaultTemplate>
{/if}
