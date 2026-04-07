<script>
	import { expenseStore } from '$lib/stores/expenseStore.svelte.js';
	import { incomeStore } from '$lib/stores/incomeStore.svelte.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { usdFormatter } from '$lib/utils/functions.js';

	let remainingBalance = $derived(incomeStore.userTotal - expenseStore.userTotal);
</script>

<Card.Root
	class="flex h-50 flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-grey-300 bg-grey-1000 p-5 dark:border-grey-300 dark:bg-white-0"
>
	<Card.Header class="px-0!">
		<Card.Title class="text-preset-4-semibold">Remaining Balance</Card.Title>
		<Card.Description>
			<span class="text-preset-2 text-grey-50 dark:text-grey-500">
				{#if remainingBalance > 0}
					After expenses this month
				{:else}
					Over spent this month
				{/if}
			</span>
		</Card.Description>
	</Card.Header>
	<Card.Footer class="px-0!">
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger
					class="text-preset-5-semibold sm:text-preset-5-medium flex h-13.5 w-full cursor-pointer items-center rounded-full bg-grey-600 p-1 dark:bg-grey-100"
					aria-label={`Remaining balance is ${usdFormatter.format(remainingBalance)}`}
				>
					<span
						class={[
							'flex flex-1 items-center justify-center',
							remainingBalance > 0
								? 'text-green-200 dark:text-green-600'
								: 'text-red-400 dark:text-red-500'
						]}
					>
						{usdFormatter.format(remainingBalance)}
					</span>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<span>{usdFormatter.format(incomeStore.userTotal)}</span>
					<span class="mx-1">−</span>
					<span>{usdFormatter.format(expenseStore.userTotal)}</span>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</Card.Footer>
</Card.Root>
