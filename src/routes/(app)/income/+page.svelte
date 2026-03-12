<script>
	import { isEmpty, filterStatus, sortRecords } from '$lib/utils/misc.js';
	import FilterDropDown from '$lib/components/FilterDropDown.svelte';
	import OpenFormButton from '$lib/components/OpenFormButton.svelte';
	import RecordDetails from '$lib/components/RecordDetails.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import SearchExpand from '$lib/components/SearchExpand.svelte';
	import { INCOMESLUG } from '$lib/stores/incomeSlug.svelte.js';
	import RecordList from '$lib/components/RecordList.svelte';
	import { incomeSchema } from '$lib/utils/schemas.js';

	let { data } = $props();
	let handleEditRecord;
	let filters = $state({
		status: 'all',
		sort: 'latest'
	});
	let dataList = $derived.by(() => {
		if (!data?.incomeRecords) return [];
		let list = [...data.incomeRecords];
		list = filterStatus(list, filters.status);
		list = sortRecords(list, filters.sort);
		return list;
	});
	let hasData = $derived(dataList && dataList?.length > 0);
	let incomeRecord = $derived.by(() => {
		if (!INCOMESLUG.value) return null;
		if (!dataList || dataList.length === 0) return null;
		const slug = INCOMESLUG.value.replace(/#/g, '');
		return dataList.find((item) => item.slug === slug) ?? {};
	});

	const handleURLSlug = (slug) => (INCOMESLUG.value = slug);
</script>

{#if hasData}
	<section class="lg:max-h-168">
		<Command.Root class="space-y-5 bg-transparent text-white-0">
			<div class="flex items-center justify-between gap-5">
				<OpenFormButton title="Add Income" schema={incomeSchema} bind:handleEditRecord />
				<div class="flex items-center">
					<FilterDropDown bind:filters sortType="income" />
					<SearchExpand class="hidden md:flex" />
				</div>
			</div>
			<RecordList data={dataList} {handleURLSlug} title="Income" />
		</Command.Root>
	</section>
	{#if !isEmpty(incomeRecord) && incomeRecord !== null}
		<section>
			<RecordDetails data={incomeRecord} {handleEditRecord} collectionName="Income" />
		</section>
	{/if}
{:else}
	<Skeleton class="absolute inset-0 z-0 animate-none! rounded-2xl bg-grey-700" />
	<div
		class="absolute top-1/2 left-1/2 z-5 flex size-full -translate-1/2 items-center justify-center text-center"
	>
		<div class="space-y-4">
			<span class="text-preset-3 block text-grey-50">No records</span>
			<OpenFormButton title="Add Income" schema={incomeSchema} bind:handleEditRecord />
		</div>
	</div>
{/if}
