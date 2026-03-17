<script>
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { usdFormatter } from '$lib/utils/misc.js';

	let { budget, totalMonthlyIncome } = $props();

	let afterBudget = $derived(totalMonthlyIncome - budget);
	let value = $state(50);
</script>

<Card.Root
	class="flex flex-1 flex-col justify-between space-y-1 bg-linear-to-b from-grey-1000 to-grey-800 py-4! sm:py-5!"
>
	<Card.Header class="px-4! sm:px-5!">
		<Card.Title>Budget Summary</Card.Title>
	</Card.Header>
	<Card.Content>
		<Slider type="single" bind:value max={100} step={1} />
	</Card.Content>
	<Card.Footer class="px-4! sm:px-5!">
		<div
			class="text-preset-3-medium sm:text-preset-5-medium flex w-full items-center rounded-2xl bg-grey-600 p-1"
		>
			<span class="flex flex-1 items-center justify-center">
				{usdFormatter.format(budget)}
			</span>
			<Separator orientation="vertical" class="h-11.5" />
			<span
				class={[
					'flex flex-1 items-center justify-center',
					afterBudget > 0 ? 'text-green-200' : 'text-red-200'
				]}
			>
				{usdFormatter.format(afterBudget)}
			</span>
		</div>
	</Card.Footer>
</Card.Root>
