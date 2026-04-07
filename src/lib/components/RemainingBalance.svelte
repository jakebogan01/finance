<script>
	import { expenseStore } from '$lib/stores/expenseStore.svelte.js';
	import { incomeStore } from '$lib/stores/incomeStore.svelte.js';
	import CardLayout from '$lib/components/CardLayout.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { usdFormatter } from '$lib/utils/functions.js';
	import Tooltip from '$lib/components/Tooltip.svelte';

	let remainingBalance = $derived(incomeStore.userTotal - expenseStore.userTotal);
</script>

<CardLayout title="Remaining Balance">
	{#snippet description()}
		<Card.Description>
			<span class="text-preset-2 text-grey-50 dark:text-grey-500">
				{#if remainingBalance > 0}
					After expenses this month
				{:else}
					Over spent this month
				{/if}
			</span>
		</Card.Description>
	{/snippet}
	{#snippet footer()}
		<Tooltip aria-label={`Remaining balance is ${usdFormatter.format(remainingBalance)}`}>
			{#snippet buttonContent()}
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
			{/snippet}
			<span>{usdFormatter.format(incomeStore.userTotal)}</span>
			<span class="mx-1">−</span>
			<span>{usdFormatter.format(expenseStore.userTotal)}</span>
		</Tooltip>
	{/snippet}
</CardLayout>
