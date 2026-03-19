<script>
	import { isEmpty, filterStatus, sortRecords, authCheck } from '$lib/utils/misc.js';
	import DefaultTemplate from '$lib/components/DefaultTemplate.svelte';
	import FilterDropDown from '$lib/components/FilterDropDown.svelte';
	import OpenFormButton from '$lib/components/OpenFormButton.svelte';
	import RecordDetails from '$lib/components/RecordDetails.svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import SearchExpand from '$lib/components/SearchExpand.svelte';
	import { INCOMESLUG } from '$lib/stores/incomeSlug.svelte.js';
	import RecordList from '$lib/components/RecordList.svelte';
	import { incomeSchema } from '$lib/utils/schemas.js';
	import { SIGNIN } from '$lib/utils/constants.js';
	import { onMount } from 'svelte';

	let { data } = $props();

	onMount(() => authCheck(303, SIGNIN, true));

	let hasData = $derived(data?.incomeRecords && data?.incomeRecords?.length > 0);
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
				<OpenFormButton
					title="Add Income"
					schema={incomeSchema}
					bind:handleEditRecord
					data={incomeRecord}
				/>
				<div class="mr-4 flex items-center sm:mr-0">
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
	<DefaultTemplate>
		<OpenFormButton title="Add Income" schema={incomeSchema} bind:handleEditRecord />
	</DefaultTemplate>
{/if}
