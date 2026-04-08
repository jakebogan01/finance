<script>
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { fillMissingMonths } from '$lib/utils/functions.js';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { BarChart, Highlight } from 'layerchart';
	import { cubicInOut } from 'svelte/easing';
	import { scaleBand } from 'd3-scale';

	let { historyMap, expenseId, class: className } = $props();

	let expenseHistory = $derived(historyMap?.[expenseId] ?? []);
	let years = $derived.by(() => {
		if (!expenseHistory.length) return [];
		const startYear = Math.min(...expenseHistory.map((h) => h.year));
		const endYear = new Date().getFullYear();
		const range = [];
		for (let y = startYear; y <= endYear; y++) {
			range.push(y);
		}
		return range;
	});
	let barPadding = $derived.by(() => {
		if (!chartData || chartData.length === 0) return 0.35; // default
		if (chartData.length === 1) return 0.7; // more space around single bar
		if (chartData.length === 2) return 0.5; // optional tweak for 2 bars
		if (chartData.length === 6) return 0.3; // optional tweak for 6 bars
		return 0.2; // normal padding for multiple bars
	});
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

		let monthsData = filled
			.filter((h) => h.year === activeYear)
			.map((h) => ({
				month: months[h.month - 1],
				[`year_${h.year}`]: h.amount
			}));

		// fallback: if still empty, show at least one bar
		if (!monthsData.length && expenseHistory.length) {
			const latest = expenseHistory[expenseHistory.length - 1];
			monthsData = [
				{
					month: months[latest.month - 1],
					[`year_${latest.year}`]: latest.amount
				}
			];
		}

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

<Separator class="my-5" />
<Card.Root
	class={[
		'flex min-h-70 flex-1 flex-col space-y-1 rounded-2xl border-t border-grey-500 bg-grey-900 pb-1! lg:min-h-52 dark:border-gray-300 dark:bg-gray-100 3xl-tall:pb-5!',
		className
	]}
>
	<Card.Header class="flex items-center justify-between">
		<Card.Title class="text-preset-5-semibold dark:text-grey-600">Payment History</Card.Title>
		<div class="flex">
			{#each years as year (year)}
				<button
					data-active={activeChart === `year_${year}`}
					class={[
						'cursor-pointer border-grey-775 px-2.5 py-0.5 text-grey-100 capitalize data-[active=true]:border-grey-150 data-[active=true]:text-white-0 md:transition-colors md:hover:border-grey-150 md:hover:bg-white-0/15 md:hover:text-white-0 dark:border-transparent dark:text-grey-400 dark:data-[active=true]:border-transparent dark:data-[active=true]:text-grey-900 dark:md:hover:border-transparent dark:md:hover:bg-transparent dark:md:hover:text-grey-900',
						years?.length > 1
							? 'border-s first:rounded-l-md last:rounded-r-md data-[active=true]:bg-white-0/15'
							: 'rounded-md'
					]}
					onclick={() => (activeChart = `year_${year}`)}
				>
					{year}
				</button>
			{/each}
		</div>
	</Card.Header>
	<Card.Content class="mt-4 flex flex-1 flex-col px-0! 2xl:mt-10">
		<Chart.Container config={chartConfig} class="flex aspect-auto w-full flex-1 flex-col">
			{#if activeSeries.length}
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
			{/if}
		</Chart.Container>
	</Card.Content>
</Card.Root>
