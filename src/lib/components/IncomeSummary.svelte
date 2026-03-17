<script>
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { usdFormatter } from '$lib/utils/misc.js';

	let { totalMonthlyIncome, totalMonthlyExpenses, remainingIncome } = $props();
</script>

<Card.Root
	class="flex flex-1 flex-col justify-between space-y-1 rounded-30 border border-grey-300 bg-grey-1000 py-4! sm:py-5!"
>
	<Card.Header class="px-4! sm:px-5!">
		<Card.Title>Monthly Summary</Card.Title>
		<Card.Description class="mt-1">
			<span class="text-grey-50">- {usdFormatter.format(totalMonthlyExpenses)} Expenses</span>
		</Card.Description>
	</Card.Header>
	<Card.Footer class="px-4! sm:px-5!">
		<div
			class="text-preset-3-medium sm:text-preset-5-medium flex w-full items-center rounded-2xl bg-grey-600 p-1"
		>
			<span class="flex flex-1 items-center justify-center">
				{usdFormatter.format(totalMonthlyIncome)}
			</span>
			<Separator orientation="vertical" class="h-11.5" />
			<span
				class={[
					'flex flex-1 items-center justify-center',
					remainingIncome > 0 ? 'text-green-200' : 'text-red-400'
				]}
			>
				{usdFormatter.format(remainingIncome)}
			</span>
		</div>
	</Card.Footer>
</Card.Root>
