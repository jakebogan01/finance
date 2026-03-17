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
	class="flex flex-1 flex-col items-start rounded-30 border border-grey-300 bg-grey-1000 p-5 sm:flex-row"
>
	<Card.Header class="w-full flex-1 p-0! text-center sm:text-left">
		<Card.Title>{title}</Card.Title>
		<Card.Description class="text-grey-50 text-xs">
			<span class="text-sm">Highest expense:</span><br> {largest?.title}<br>({usdFormatter.format(largest?.amount ?? 0)})
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
