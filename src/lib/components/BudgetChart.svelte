<script>
	import { fillMissingMonths } from '$lib/utils/functions.js';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { usdFormatter } from '$lib/utils/functions.js';
	import { BarChart, Highlight } from 'layerchart';
	import { cubicInOut } from 'svelte/easing';
	import { scaleBand } from 'd3-scale';

	let { expenseHistory = [], activeExpenses = null, budget = 0, class: className } = $props();

	let context = $state();
	let currentBudget = $derived(budget || 0);

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1;

	const activeExpenseIds = $derived.by(() => {
		if (!activeExpenses) return null;
		return new Set(activeExpenses.map((e) => e.id));
	});

	const filteredHistory = $derived.by(() => {
		if (!activeExpenseIds) return expenseHistory;

		return expenseHistory.filter((h) => activeExpenseIds.has(h.expense));
	});

	let budgetStatus = $derived.by(() => {
		const hasAnySpending = chartData.some((d) => d.expenses > 0);

		if (!hasAnySpending) {
			return {
				period: 'This month',
				label: 'No spending yet',
				color: 'text-grey-50'
			};
		}

		const lastEntry = chartData[chartData.length - 1];

		const isCurrentMonth = lastEntry.monthIndex === currentMonth;

		const period = isCurrentMonth ? 'This month' : 'Last month';

		const diff = lastEntry.expenses - lastEntry.budget;

		if (diff > 0) {
			return {
				period,
				label: `${usdFormatter.format(diff)} over budget`,
				color: 'text-red-400'
			};
		}

		if (diff < 0) {
			return {
				period,
				label: `${usdFormatter.format(Math.abs(diff))} under budget`,
				color: 'text-green-200 dark:text-green-600'
			};
		}

		return {
			period,
			label: 'Exactly on budget',
			color: 'text-yellow-200'
		};
	});

	/*
    Aggregate monthly totals
    */
	let monthlyTotals = $derived.by(() => {
		const map = {};

		// group history by expense
		const grouped = {};

		for (const record of filteredHistory) {
			if (record.year !== currentYear) continue;

			if (!grouped[record.expense]) {
				grouped[record.expense] = [];
			}

			grouped[record.expense].push(record);
		}

		// process each expense separately
		for (const expenseId in grouped) {
			const filled = fillMissingMonths(grouped[expenseId]).filter(
				(r) => r.year === currentYear && r.month <= currentMonth
			);

			for (const record of filled) {
				if (record.year !== currentYear) continue;
				if (record.month > currentMonth) continue;

				if (!map[record.month]) {
					map[record.month] = 0;
				}

				map[record.month] += record.amount;
			}
		}

		return map;
	});

	/*
    Build chart data
    */
	let chartData = $derived.by(() => {
		const data = [];

		for (let m = 1; m <= currentMonth; m++) {
			data.push({
				month: months[m - 1],
				monthIndex: m,
				expenses: monthlyTotals[m] ?? 0,
				budget: currentBudget
			});
		}

		return data;
	});

	const chartConfig = {
		expenses: { label: 'expenses', color: 'var(--yellow-200)' },
		budget: { label: 'budget', color: 'var(--yellow-100)' }
	};

	const activeSeries = $derived([
		{
			key: 'expenses',
			label: 'expenses',
			color: chartConfig.expenses.color,
			props: { rounded: currentBudget === 0 ? 'all' : 'bottom' }
		},
		{
			key: 'budget',
			label: 'budget',
			color: chartConfig.budget.color
		}
	]);
</script>

<Card.Root
	class={[
		'flex min-h-70 flex-1 flex-col space-y-1 rounded-2xl border border-grey-300 bg-grey-1000 pb-1! sm:py-5 lg:min-h-52 dark:bg-white-0 3xl-tall:pb-5!',
		className
	]}
>
	<Card.Header class="flex items-center justify-between px-4 sm:px-5">
		<div
			class="flex flex-1 flex-col justify-center gap-1 sm:flex-row sm:items-center sm:justify-between"
		>
			<Card.Title class="font-semibold sm:text-lg sm:font-semibold dark:text-grey-600"
				>Budget Comparison</Card.Title
			>
			{#if currentBudget !== 0}
				<Card.Description>
					<span class={['text-preset-2', budgetStatus.color]}>
						{budgetStatus.label}
					</span>
				</Card.Description>
			{/if}
		</div>
	</Card.Header>
	<Card.Content class="relative mt-4 flex flex-1 flex-col px-0! 2xl:mt-10">
		{#if expenseHistory?.length > 0 && activeExpenses?.length > 0}
			<Chart.Container config={chartConfig} class="flex aspect-auto w-full flex-1 flex-col">
				<BarChart
					bind:context
					data={chartData}
					xScale={scaleBand().padding(0.35)}
					x="month"
					axis="x"
					rule={false}
					series={activeSeries}
					seriesLayout="stack"
					props={{
						bars: {
							stroke: 'none',
							initialY: context?.height,
							initialHeight: 0,
							motion: {
								y: { type: 'tween', duration: 300, easing: cubicInOut },
								height: { type: 'tween', duration: 300, easing: cubicInOut }
							}
						},
						highlight: { area: false },
						xAxis: { format: (d) => d.slice(0, 3) }
					}}
				>
					{#snippet belowMarks()}
						<Highlight area={{ class: 'fill-muted' }} />
					{/snippet}
					{#snippet tooltip()}
						<Chart.Tooltip />
					{/snippet}
				</BarChart>
			</Chart.Container>
		{:else}
			<div class="absolute inset-0 flex items-center justify-center gap-x-4">
				<span class="text-preset-3 text-grey-200">No expense data</span>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
