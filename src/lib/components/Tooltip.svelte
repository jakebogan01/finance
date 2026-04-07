<script>
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	let { children, buttonContent, ...props } = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger
			class="text-preset-5-semibold sm:text-preset-5-medium flex h-13.5 w-full cursor-pointer items-center rounded-full bg-grey-600 p-1 md:transition-colors md:hover:bg-white-0/15 dark:bg-grey-100 dark:md:hover:bg-gray-200"
			{...props}
		>
			{@render buttonContent?.()}
		</Tooltip.Trigger>
		<Tooltip.Content>
			{@render children?.()}
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
