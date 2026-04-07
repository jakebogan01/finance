<script>
	import { budgetStore } from '$lib/stores/budgetStore.svelte.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import CardLayout from '$lib/components/CardLayout.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { usdFormatter } from '$lib/utils/functions.js';
	import Tooltip from '$lib/components/Tooltip.svelte';

	let value = $derived(budgetStore.amount || 0);

	const handleBudget = async () => budgetStore.update(value);
</script>

<CardLayout title="Monthly Budget">
	<Card.Content class="px-0">
		<Slider onValueCommit={handleBudget} type="single" bind:value max={5000} step={50} />
	</Card.Content>
	{#snippet footer()}
		<Tooltip>
			{#snippet buttonContent()}
				<span class="flex flex-1 items-center justify-center">
					{usdFormatter.format(value)}
				</span>
			{/snippet}
		</Tooltip>
	{/snippet}
</CardLayout>
