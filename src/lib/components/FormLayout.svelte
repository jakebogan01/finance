<script>
	import * as Dialog from '$lib/components/ui/dialog';
	import { Separator } from '$lib/components/ui/separator/index.js';

	let { children, isMultiStepForm = true, step } = $props();
</script>

<Dialog.Content showCloseButton={false}>
	<Dialog.Header class="text-center">
		<Dialog.Title class="text-preset-5-semibold">
			{step !== 2 ? 'Add Income' : 'Additional Information'}
			<br /><span class="text-preset-3 text-grey-50">{step === 2 ? '(optional)' : ''}</span>
		</Dialog.Title>
	</Dialog.Header>
	{#if isMultiStepForm}
		<div class="flex items-center justify-center space-x-4">
			{#each [1, 2] as s, i (i)}
				<div
					class="text-preset-3-medium flex size-10 items-center justify-center rounded-full border select-none"
					class:border-white-0={step >= s}
					class:dark:bg-yellow-100={step >= s}
					class:dark:dark:text-white-0={step >= s}
					class:border-grey-300={step < s}
				>
					{s}
				</div>
				{#if s === 1}
					<Separator class="max-w-13.5 bg-grey-300" />
				{/if}
			{/each}
		</div>
	{/if}
	{@render children?.()}
</Dialog.Content>
