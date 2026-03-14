<script>
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { BarChart, Highlight } from 'layerchart';
	import { cubicInOut } from 'svelte/easing';
	import { scaleBand } from 'd3-scale';

	const chartData = [
		{ month: 'January', year_2025: 205, year_2026: 200 },
		{ month: 'February', year_2025: 505, year_2026: 200 },
		{ month: 'March', year_2025: 237, year_2026: 120 },
		{ month: 'April', year_2025: 73, year_2026: 190 },
		{ month: 'May', year_2025: 209, year_2026: 130 },
		{ month: 'June', year_2025: 214, year_2026: 140 },
		{ month: 'July', year_2025: 214, year_2026: 140 },
		{ month: 'August', year_2025: 214, year_2026: 140 },
		{ month: 'September', year_2025: 214, year_2026: 140 },
		{ month: 'October', year_2025: 214, year_2026: 140 },
		{ month: 'November', year_2025: 214, year_2026: 140 }
	];

	const chartConfig = {
		year_2025: { label: '2025', color: 'var(--yellow-200)' },
		year_2026: { label: '2026', color: 'var(--yellow-200)' }
	};
	let context = $state();

	let activeChart = $state('year_2026');

	const seriesMap = {
		year_2025: [
			{
				key: 'year_2025',
				label: '2025',
				color: chartConfig.year_2025.color,
				props: { rounded: 'all' }
			}
		],
		year_2026: [
			{
				key: 'year_2026',
				label: '2026',
				color: chartConfig.year_2026.color,
				props: { rounded: 'all' }
			}
		]
	};

	const activeSeries = $derived(seriesMap[activeChart]);
</script>

<Card.Root class="flex flex-1 flex-col space-y-1 bg-linear-to-b from-grey-1000 to-grey-800">
	<Card.Header class="flex items-center justify-between px-4">
		<Card.Title>Payment History</Card.Title>
		<div class="flex">
			{#each ['year_2025', 'year_2026'] as key (key)}
				<button
					data-active={activeChart === key}
					class="text-preset-2 cursor-pointer border-s border-grey-775 px-2.5 py-0.5 text-grey-50 capitalize last:rounded-r-md data-[active=true]:border-grey-150 data-[active=true]:bg-grey-750 data-[active=true]:text-white-0 md:transition-colors md:hover:border-grey-150 md:hover:bg-grey-750 md:hover:text-white-0"
					onclick={() => (activeChart = key)}
				>
					{chartConfig[key].label}
				</button>
			{/each}
		</div>
	</Card.Header>
	<Card.Content class="mt-6 flex flex-1 flex-col px-0!">
		<Chart.Container config={chartConfig} class="aspect-auto w-full flex-1">
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
		</Chart.Container>
	</Card.Content>
</Card.Root>
