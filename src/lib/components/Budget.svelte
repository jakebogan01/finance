<script>
	import { Slider } from '$lib/components/ui/slider/index.js';
	import CardLayout from '$lib/components/CardLayout.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Tooltip from '$lib/components/Tooltip.svelte';

	let value = $state(0);

	const handleBudget = async () => {};
</script>

<CardLayout title="Monthly Budget">
	<Card.Content class="px-0">
		<Slider onValueCommit={handleBudget} type="single" bind:value max={100} step={1} />
	</Card.Content>
	{#snippet footer()}
		<Tooltip>
			{#snippet buttonContent()}
				<span class="flex flex-1 items-center justify-center">
					{value}
				</span>
			{/snippet}
		</Tooltip>
	{/snippet}
</CardLayout>
