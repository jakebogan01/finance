<script>
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { usdFormatter } from '$lib/utils/misc.js';
	import { PieChart, Text } from 'layerchart';

	let { activeExpenses } = $props();

	const chartExpenses = $derived.by(() => {
		return activeExpenses.map((r) => ({
			id: r.id,
			title: r.title,
			amount: r.expand?.current_history?.amount ?? 0
		}));
	});

	const totalExpenses = $derived.by(() => {
		return chartExpenses.reduce((sum, r) => sum + r.amount, 0);
	});

	const mostExpensive = $derived.by(() => {
		return chartExpenses.reduce(
			(prev, curr) => (curr.amount > prev.amount ? curr : prev),
			chartExpenses[0]
		);
	});

	const chartData = $derived.by(() => {
		return chartExpenses.map((r, i) => ({
			browser: r.title,
			visitors: r.amount,
			color: `var(--chart-${i + 1})`
		}));
	});

	const chartConfig = $state({
		visitors: { label: 'Amount' },
		...chartExpenses.reduce((acc, r, i) => {
			acc[r.title] = { label: r.title, color: `var(--chart-${i + 1})` };
			return acc;
		}, {})
	});
</script>

<Card.Root
	class="flex flex-1 flex-col items-start rounded-30 border border-grey-300 bg-grey-1000 p-5 sm:flex-row"
>
	<Card.Header class="w-full flex-1 p-0! text-center sm:text-left">
		<Card.Title>Total Expenses</Card.Title>
		<Card.Description class="text-preset-1 text-grey-50">
			{mostExpensive.title} ({usdFormatter.format(mostExpensive.amount)})
		</Card.Description>
	</Card.Header>
	<Card.Content class="w-full min-w-28 flex-1 pt-5 pr-0 pl-0 sm:pt-0 sm:pl-2.5">
		<Chart.Container
			config={chartConfig}
			class="mx-auto aspect-square max-h-26 sm:mr-px sm:ml-auto"
		>
			<PieChart
				data={chartData}
				key="browser"
				value="visitors"
				c="color"
				innerRadius={55}
				padding={15}
				props={{ pie: { motion: 'tween' } }}
			>
				{#snippet aboveMarks()}
					<Text
						value={usdFormatter.format(totalExpenses)}
						textAnchor="middle"
						verticalAnchor="middle"
						class="fill-white-0 text-base! font-semibold"
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
