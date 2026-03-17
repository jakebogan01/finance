<script>
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { BarChart, Highlight } from 'layerchart';
	import { cubicInOut } from 'svelte/easing';
	import { scaleBand } from 'd3-scale';

	let { expenseHistory = [], activeExpenses = null, budget = 0, class: className } = $props();

	let context = $state();
	let currentBudget = $derived(budget[0]?.amount || 0);

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

	/*
	Aggregate monthly totals
	*/
	let monthlyTotals = $derived.by(() => {
		const map = {};

		for (const record of filteredHistory) {
			if (record.year !== currentYear) continue;

			if (!map[record.month]) {
				map[record.month] = 0;
			}

			map[record.month] += record.amount;
		}

		return map;
	});

	/*
	Determine chart start month
	*/
	let startMonth = $derived.by(() => {
		const firstExpense = filteredHistory
			.map((e) => new Date(e.year, e.month - 1))
			.sort((a, b) => a - b)[0];

		if (!firstExpense) return 1;

		if (firstExpense.getFullYear() < currentYear) {
			return 1;
		}

		return firstExpense.getMonth() + 1;
	});

	/*
	Build chart data
	*/
	let chartData = $derived.by(() => {
		const data = [];

		for (let m = startMonth; m <= currentMonth; m++) {
			data.push({
				month: months[m - 1],
				expenses: monthlyTotals[m] ?? 0,
				budget: currentBudget
			});
		}

		return data;
	});

	let budgetStatus = $derived.by(() => {
		if (!chartData.length) {
			return {
				period: 'This month',
				label: 'No data',
				color: 'text-grey-50'
			};
		}

		const lastEntry = chartData[chartData.length - 1];

		const isCurrentMonth = lastEntry.month === months[currentMonth - 1];

		const period = isCurrentMonth ? 'This month' : 'Last month';

		const diff = lastEntry.expenses - lastEntry.budget;

		if (diff > 0) {
			return {
				period,
				label: `$${diff.toLocaleString()} over budget`,
				color: 'text-red-400'
			};
		}

		if (diff < 0) {
			return {
				period,
				label: `$${Math.abs(diff).toLocaleString()} under budget`,
				color: 'text-green-200'
			};
		}

		return {
			period,
			label: 'Exactly on budget',
			color: 'text-yellow-200'
		};
	});

	let barPadding = $derived.by(() => {
		if (!chartData || chartData.length === 0) return 0.35;
		if (chartData.length === 1) return 0.7;
		if (chartData.length === 2) return 0.5;
		return 0.35;
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
		'flex max-h-65 flex-1 flex-col space-y-1 bg-linear-to-b from-grey-1000 to-grey-800',
		className
	]}
>
	<Card.Header class="flex items-center justify-between px-4">
		<div class="flex flex-1 flex-col justify-center gap-1">
			<Card.Title>This Year's Expenditures</Card.Title>
			{#if currentBudget !== 0}
				<Card.Description>
					<span class="text-preset-2 mt-1 text-grey-50">
						{budgetStatus.period}:
					</span>

					<span class={['text-preset-2', budgetStatus.color]}>
						{budgetStatus.label}
					</span>
				</Card.Description>
			{/if}
		</div>
	</Card.Header>
	<Card.Content class="mt-2 flex flex-1 flex-col px-0!">
		<Chart.Container config={chartConfig} class="aspect-auto min-h-39 w-full flex-1">
			<BarChart
				bind:context
				data={chartData}
				xScale={scaleBand().padding(barPadding)}
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
	</Card.Content>
</Card.Root>
