<script>
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { fillMissingMonths } from '$lib/utils/misc.js';
	import { BarChart, Highlight } from 'layerchart';
	import { cubicInOut } from 'svelte/easing';
	import { scaleBand } from 'd3-scale';

	let { historyMap, expenseId } = $props();

	let expenseHistory = $derived(historyMap?.[expenseId] ?? []);
	let years = $derived([...new Set(expenseHistory.map((h) => h.year))].sort());
	let activeChart = $state();

	$effect(() => {
		if (years.length) {
			activeChart = `year_${years[years.length - 1]}`;
		}
	});

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

	let chartData = $derived.by(() => {
		if (!activeChart) return [];
		const activeYear = Number(activeChart.replace('year_', ''));
		if (!expenseHistory || expenseHistory.length === 0) return [];
		const yearHistory = expenseHistory.filter((h) => h.year <= activeYear);
		const filled = fillMissingMonths(yearHistory);
		const monthsData = filled
			.filter((h) => h.year === activeYear)
			.map((h) => ({
				month: months[h.month - 1],
				[`year_${h.year}`]: h.amount
			}));
		monthsData.sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));
		return monthsData;
	});

	let chartConfig = $derived.by(() => {
		const config = {};
		for (const year of years) {
			config[`year_${year}`] = {
				label: String(year),
				color: 'var(--yellow-200)'
			};
		}
		return config;
	});

	let context = $state();

	let seriesMap = $derived.by(() => {
		const map = {};
		for (const year of years) {
			map[`year_${year}`] = [
				{
					key: `year_${year}`,
					label: String(year),
					color: 'var(--yellow-200)',
					props: { rounded: 'all' }
				}
			];
		}
		return map;
	});

	const activeSeries = $derived(
		activeChart && seriesMap[activeChart] ? seriesMap[activeChart] : []
	);
</script>

<Card.Root class="flex flex-1 flex-col space-y-1 bg-linear-to-b from-grey-1000 to-grey-800">
	<Card.Header class="flex items-center justify-between px-4">
		<Card.Title>Payment History</Card.Title>
		<div class="flex">
			{#each years as year, i (i)}
				<button
					data-active={activeChart === `year_${year}`}
					class="text-preset-2 cursor-pointer border-s border-grey-775 px-2.5 py-0.5 text-grey-50 capitalize last:rounded-r-md data-[active=true]:border-grey-150 data-[active=true]:bg-grey-750 data-[active=true]:text-white-0 md:transition-colors md:hover:border-grey-150 md:hover:bg-grey-750 md:hover:text-white-0"
					onclick={() => (activeChart = `year_${year}`)}
				>
					{year}
				</button>
			{/each}
		</div>
	</Card.Header>
	<Card.Content class="mt-6 flex flex-1 flex-col px-0!">
		<Chart.Container config={chartConfig} class="aspect-auto w-full flex-1">
			{#if activeSeries.length}
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
								y: { type: 'tween', duration: 500, easing: cubicInOut },
								height: { type: 'tween', duration: 500, easing: cubicInOut }
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
			{/if}
		</Chart.Container>
	</Card.Content>
</Card.Root>
