<script>
	import DashboardBarChart from '$lib/components/DashboardBarChart.svelte';
	import { authCheck, filterStatus, sortRecords } from '$lib/utils/misc';
	import ExpenseCarousel from '$lib/components/ExpenseCarousel.svelte';
	import DefaultTemplate from '$lib/components/DefaultTemplate.svelte';
	import OpenFormButton from '$lib/components/OpenFormButton.svelte';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import IncomeSummary from '$lib/components/IncomeSummary.svelte';
	import BudgetSummary from '$lib/components/BudgetSummary.svelte';
	import { EXPENSESLUG } from '$lib/stores/expenseSlug.svelte.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import SearchExpand from '$lib/components/SearchExpand.svelte';
	import PieChart from '$lib/components/PieChart.svelte';
	import { expensesSchema } from '$lib/utils/schemas.js';
	import { SIGNIN } from '$lib/utils/constants';
	import { onMount } from 'svelte';

	let { data } = $props();

	let handleEditRecord;
	let hasData = $derived(
		(data?.activeExpenses && data?.activeExpenses?.length > 0) ||
			(data?.activeIncome && data?.activeIncome?.length > 0)
	);

	onMount(() => authCheck(303, SIGNIN, true));

	let filters = $state({
		status: 'all',
		sort: 'latest'
	});
	let dataList = $derived.by(() => {
		if (!data?.activeExpenses) return [];
		let list = [...data.activeExpenses];
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
	let checkNumOfExpenses = dataList.length > 3 ? '' : 'sm:hidden';
</script>

{#if hasData}
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
							<Carousel.Previous class="mr-5 {checkNumOfExpenses}" />
							<Carousel.Next class="md:mr-5 {checkNumOfExpenses}" />
							{#if dataList.length > 3}
								<SearchExpand class="hidden md:flex" />
							{/if}
						{/if}
					</div>
				</div>
				{#if dataList?.length > 0}
					<ExpenseCarousel {dataList} />
				{/if}
			</Command.Root>
		</Carousel.Root>
		{#if data?.expenseHistory?.length > 0 && data?.activeExpenses?.length > 0}
			<DashboardBarChart
				activeExpenses={data?.activeExpenses}
				expenseHistory={data?.expenseHistory}
				budget={2000}
			/>
		{/if}
		<div class="flex items-center gap-5">
			{#if data?.activeExpenses?.length > 0}
				<PieChart
					title="Total Expenses"
					records={data?.activeExpenses}
					labelKey="title"
					valueFn={(r) => r.expand?.current_history?.amount ?? 0}
				/>
			{/if}
			{#if data?.activeIncome?.length > 0}
				<PieChart
					title="Total Income"
					records={data?.activeIncome}
					labelKey="company_name"
					valueKey="income"
				/>
			{/if}
		</div>
	</section>
	<section class="flex max-h-168.5 flex-col space-y-5">
		<div class="flex max-h-46.25 min-h-46.25 flex-1 gap-5">
			<IncomeSummary
				totalMonthlyIncome={data?.totalMonthlyIncome}
				totalMonthlyExpenses={data?.totalMonthlyExpenses}
				remainingIncome={data?.remainingIncome}
			/>
			<BudgetSummary budget={2000} totalMonthlyIncome={data?.totalMonthlyIncome} />
		</div>
	</section>
{:else}
	<DefaultTemplate message="No active data">
		<OpenFormButton
			title="Create Expenses"
			schema={expensesSchema}
			bind:handleEditRecord
			multiStepForm={false}
		/>
	</DefaultTemplate>
{/if}
