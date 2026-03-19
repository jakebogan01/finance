<script>
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { usdFormatter } from '$lib/utils/misc.js';
	import { PieChart, Text } from 'layerchart';

	let { title = '', records = [], labelKey = '', valueKey = '', valueFn = null } = $props();

	const chartItems = $derived.by(() => {
		return records.map((r) => ({
			id: r.id,
			title: r[labelKey],
			amount: valueFn ? valueFn(r) : (r[valueKey] ?? 0)
		}));
	});

	const total = $derived.by(() => {
		return chartItems.reduce((sum, r) => sum + r.amount, 0);
	});

	const largest = $derived.by(() => {
		return chartItems.reduce(
			(prev, curr) => (curr.amount > prev.amount ? curr : prev),
			chartItems[0]
		);
	});

	const chartData = $derived.by(() => {
		return chartItems.map((r, i) => ({
			browser: r.title,
			visitors: r.amount,
			color: `var(--chart-${i + 1})`
		}));
	});

	const chartConfig = $derived.by(() => {
		return {
			visitors: { label: 'Amount' },
			...chartItems.reduce((acc, r, i) => {
				acc[r.title] = { label: r.title, color: `var(--chart-${i + 1})` };
				return acc;
			}, {})
		};
	});
</script>

<Card.Root
	class="flex w-full flex-1 flex-row items-start rounded-2xl border border-grey-300 bg-grey-1000 p-4 sm:rounded-30 sm:p-5"
>
	<Card.Header class="w-full flex-1 p-0! text-left">
		<Card.Title>{title}</Card.Title>
		<Card.Description class="text-xs text-grey-50">
			<span class="text-sm">Top Expense:</span><br />
			{largest?.title} - {usdFormatter.format(largest?.amount ?? 0)}
		</Card.Description>
	</Card.Header>
	<Card.Content class="w-full min-w-28 flex-1 pt-0 pr-0 pl-2.5">
		<Chart.Container config={chartConfig} class="mr-px ml-auto aspect-square max-h-26">
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
						value={usdFormatter.format(total)}
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
