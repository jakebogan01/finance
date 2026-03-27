<script>
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import * as Dialog from '$lib/components/ui/dialog';

	let { children, open = $bindable(), handleReset = () => {} } = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		type="button"
		onclick={handleReset}
		class="flex h-13 cursor-pointer items-center gap-2 rounded-full border border-grey-300 bg-grey-1000 px-5! whitespace-nowrap text-white-0 md:transition-colors md:hover:border-yellow-200 md:hover:text-yellow-200 dark:border-white-0 dark:bg-yellow-200 dark:md:hover:border-white-0 dark:md:hover:bg-yellow-100 dark:md:hover:text-white-0"
		asChild
	>
		<ArrowRightIcon class="size-6" strokeWidth="1.5" />
		Add new
	</Dialog.Trigger>
	{@render children?.()}
</Dialog.Root>
