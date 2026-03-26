<script>
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Dialog from '$lib/components/ui/dialog';

	let formState = $state({
		step: 1
	});
</script>

<Dialog.Content showCloseButton={false}>
	<Dialog.Header class="text-center">
		<Dialog.Title class="text-preset-5-semibold">Add Income</Dialog.Title>
		<Dialog.Description>This can be either a bill or a subscription</Dialog.Description>
	</Dialog.Header>
	<div class="flex items-center justify-center space-x-4">
		{#each [1, 2] as s, i (i)}
			<div
				class="text-preset-3-medium flex size-10 items-center justify-center rounded-full border select-none"
				class:border-white-0={formState.step >= s}
				class:border-grey-300={formState.step < s}
			>
				{s}
			</div>
			{#if s === 1}
				<Separator class="max-w-13.5 bg-grey-300" />
			{/if}
		{/each}
	</div>
</Dialog.Content>
