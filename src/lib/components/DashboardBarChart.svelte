<script>
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { BarChart, Highlight } from 'layerchart';
	import { cubicInOut } from 'svelte/easing';
	import { scaleBand } from 'd3-scale';

	let { class: className } = $props();

	const chartData = [
		{ month: 'January', expenses: 1865, budget: 2000 },
		{ month: 'February', expenses: 1978, budget: 2000 },
		{ month: 'March', expenses: 1893, budget: 2000 },
		{ month: 'April', expenses: 2018, budget: 2000 },
		{ month: 'May', expenses: 1679, budget: 2000 },
		{ month: 'June', expenses: 1978, budget: 2000 },
		{ month: 'July', expenses: 2190, budget: 2000 },
		{ month: 'August', expenses: 1789, budget: 2000 },
		{ month: 'September', expenses: 1678, budget: 2000 },
		{ month: 'October', expenses: 1789, budget: 2000 },
		{ month: 'November', expenses: 1678, budget: 2000 }
	];

	const chartConfig = {
		expenses: { label: 'expenses', color: 'var(--yellow-200)' },
		budget: { label: 'budget', color: 'var(--yellow-100)' }
	};

	let context = $state();
	let activeChart = $state('both');

	let barPadding = $derived.by(() => {
		if (!chartData || chartData.length === 0) return 0.35; // default
		if (chartData.length === 1) return 0.7; // more space around single bar
		if (chartData.length === 2) return 0.5; // optional tweak for 2 bars
		return 0.35; // normal padding for multiple bars
	});

	const seriesMap = {
		both: [
			{
				key: 'expenses',
				label: 'expenses',
				color: chartConfig.expenses.color,
				props: { rounded: 'bottom' }
			},
			{
				key: 'budget',
				label: 'budget',
				color: chartConfig.budget.color
			}
		]
	};

	const activeSeries = $derived(seriesMap[activeChart]);
</script>

<Card.Root
	class={['flex flex-1 flex-col space-y-1 bg-linear-to-b from-grey-1000 to-grey-800', className]}
>
	<Card.Header class="flex items-center justify-between px-4">
		<div class="flex flex-1 flex-col justify-center gap-1">
			<Card.Title>This Year's Expenditures</Card.Title>
			<Card.Description>
				<span class="text-preset-2 mt-1 text-grey-50">Last month:</span>
				<span class="text-preset-2 text-green-200">Under budget</span>
			</Card.Description>
		</div>
	</Card.Header>
	<Card.Content class="mt-6 flex flex-1 flex-col px-0!">
		<Chart.Container config={chartConfig} class="aspect-auto w-full flex-1">
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
