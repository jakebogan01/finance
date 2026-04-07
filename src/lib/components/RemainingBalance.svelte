<script>
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { expenseStore } from '$lib/stores/expenseStore.svelte.js';
	import { incomeStore } from '$lib/stores/incomeStore.svelte.js';
	import CardLayout from '$lib/components/CardLayout.svelte';
	import { usdFormatter } from '$lib/utils/functions.js';
	import Tooltip from '$lib/components/Tooltip.svelte';

	let remainingBalance = $derived(incomeStore.userTotal - expenseStore.userTotal);
</script>

<CardLayout title="Remaining Balance">
	{#snippet footer()}
		<div
			class="text-preset-4-semibold sm:text-preset-5-medium flex h-13.5 w-full items-center overflow-hidden rounded-full bg-grey-600 dark:bg-grey-100"
		>
			<Tooltip class="pl-1">
				{#snippet buttonContent()}
					{usdFormatter.format(incomeStore.userTotal)}
				{/snippet}
				{#snippet content()}
					Before expenses
				{/snippet}
			</Tooltip>
			<Separator orientation="vertical" class="h-11.5 bg-grey-500" />
			<Tooltip
				class={[
					'pr-1',
					remainingBalance > 0
						? 'text-green-200 dark:text-green-600'
						: 'text-red-400 dark:text-red-500'
				]}
			>
				{#snippet buttonContent()}
					{usdFormatter.format(remainingBalance)}
				{/snippet}
				{#snippet content()}
					After expenses
				{/snippet}
			</Tooltip>
		</div>
	{/snippet}
</CardLayout>
