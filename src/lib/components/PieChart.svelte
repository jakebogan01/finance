<script>
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { PieChart, Text } from 'layerchart';
	import { usdFormatter } from '$lib/utils/misc.js';

	const chartData = [
		{ browser: 'chrome', visitors: 275, color: 'var(--color-blue-200)' },
		{ browser: 'safari', visitors: 200, color: 'var(--color-blue-300)' },
		{ browser: 'firefox', visitors: 287, color: 'var(--color-blue-400)' },
		{ browser: 'edge', visitors: 173, color: 'var(--color-blue-500)' },
		{ browser: 'other', visitors: 190, color: 'var(--color-blue-600)' }
	];

	const chartConfig = {
		visitors: { label: 'Visitors' },
		chrome: { label: 'Chrome', color: 'var(--chart-1)' },
		safari: { label: 'Safari', color: 'var(--chart-2)' },
		firefox: { label: 'Firefox', color: 'var(--chart-3)' },
		edge: { label: 'Edge', color: 'var(--chart-4)' },
		other: { label: 'Other', color: 'var(--chart-5)' }
	};

	const totalVisitors = chartData.reduce((acc, curr) => acc + curr.visitors, 0);
</script>

<Card.Root
	class="flex flex-1 flex-col items-start rounded-30 border border-grey-300 bg-grey-1000 p-5 sm:flex-row"
>
	<Card.Header class="w-full flex-1 p-0! text-center sm:text-left">
		<Card.Title>Total Expenses</Card.Title>
		<Card.Description class="text-preset-1 text-grey-50 ">Credit Card</Card.Description>
	</Card.Header>
	<Card.Content class="w-full min-w-28 flex-1 pt-5 pr-0 pl-0 sm:pt-0 sm:pl-4">
		<Chart.Container config={chartConfig} class="mx-auto aspect-square max-h-26">
			<PieChart
				data={chartData}
				key="browser"
				value="visitors"
				c="color"
				innerRadius={55}
				padding={13}
				props={{ pie: { motion: 'tween' } }}
			>
				{#snippet aboveMarks()}
					<Text
						value={usdFormatter.format(totalVisitors)}
						textAnchor="middle"
						verticalAnchor="middle"
						class="fill-white-0 text-xl! font-semibold"
						dy={3}
					/>
				{/snippet}
				{#snippet tooltip()}
					<Chart.Tooltip hideLabel />
				{/snippet}
			</PieChart>
		</Chart.Container>
	</Card.Content>
</Card.Root>
