<script>
	import DashboardBarChart from '$lib/components/DashboardBarChart.svelte';
	import { authCheck, filterStatus, sortRecords } from '$lib/utils/misc';
	import ExpenseCarousel from '$lib/components/ExpenseCarousel.svelte';
	import OpenFormButton from '$lib/components/OpenFormButton.svelte';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import SearchExpand from '$lib/components/SearchExpand.svelte';
	import { EXPENSESLUG } from '$lib/stores/expenseSlug.svelte.js';
	import PieChart from '$lib/components/PieChart.svelte';
	import { expensesSchema } from '$lib/utils/schemas.js';
	import { SIGNIN } from '$lib/utils/constants';
	import { onMount } from 'svelte';

	let { data } = $props();

	onMount(() => authCheck(303, SIGNIN, true));

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

	let handleEditRecord;
	let expenseRecord = $derived.by(() => {
		if (!EXPENSESLUG.value) return null;
		if (!dataList || dataList.length === 0) return null;
		const slug = EXPENSESLUG.value.replace(/#/g, '');
		return dataList.find((item) => item.slug === slug) ?? {};
	});
</script>

<section class="flex min-w-0 flex-col space-y-5">
	<Carousel.Root class="space-y-5">
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
					{#if dataList?.length > 0}
						{#if dataList.length > 3}
							<Carousel.Previous class="mr-5" />
							<Carousel.Next class="md:mr-5" />
						{/if}
						<SearchExpand class="hidden md:flex" />
					{/if}
				</div>
			</div>
			{#if dataList?.length > 0}
				<ExpenseCarousel {dataList} />
			{/if}
		</Command.Root>
	</Carousel.Root>
	{#if data?.expenseHistory?.length > 0}
		<DashboardBarChart expenseHistory={data?.expenseHistory} budget={2000} />
	{/if}
	<div class="flex items-center gap-5">
		<PieChart />
		<PieChart />
	</div>
</section>
<section class="flex max-h-168.5 flex-col space-y-5"></section>
