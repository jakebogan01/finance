<script>
	import { expenseStore } from '$lib/stores/expenseStore.svelte.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { budgetStore } from '$lib/stores/budgetStore.svelte.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import CardLayout from '$lib/components/CardLayout.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { usdFormatter } from '$lib/utils/functions.js';
	import Tooltip from '$lib/components/Tooltip.svelte';

	let value = $derived(budgetStore.amount || 0);
	let afterBudget = $derived(value - expenseStore.userTotal);

	const handleBudget = async () => budgetStore.update(value);
</script>

<CardLayout title="Monthly Budget">
	<Card.Content class="px-0">
		<Slider onValueCommit={handleBudget} type="single" bind:value max={5000} step={100} />
	</Card.Content>
	{#snippet footer()}
		<div
			class="text-preset-4-semibold sm:text-preset-5-medium flex h-13.5 w-full items-center overflow-hidden rounded-full bg-grey-600 dark:bg-grey-100"
		>
			{#if budgetStore.amount === 0}
				<p class="inline-block flex-1 text-center">{usdFormatter.format(value)}</p>
			{:else}
				<Tooltip class="pl-1">
					{#snippet buttonContent()}
						{usdFormatter.format(value)}
					{/snippet}
					{#snippet content()}
						Set budget
					{/snippet}
				</Tooltip>
				<Separator orientation="vertical" class="h-11.5 bg-grey-500" />
				<Tooltip
					class={[
						'pr-1',
						afterBudget > 0
							? 'text-green-200 dark:text-green-600'
							: 'text-red-400 dark:text-red-500'
					]}
				>
					{#snippet buttonContent()}
						{usdFormatter.format(afterBudget)}
					{/snippet}
					{#snippet content()}
						{#if afterBudget > 0}
							Over budget
						{:else}
							Under budget
						{/if}
					{/snippet}
				</Tooltip>
			{/if}
		</div>
	{/snippet}
</CardLayout>
