<script>
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	let { content, buttonContent, class: className } = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root disableCloseOnTriggerClick={true}>
		<Tooltip.Trigger
			class={[
				'flex h-full flex-1 cursor-pointer items-center justify-center py-1 md:transition-colors md:hover:bg-white-0/15 dark:md:hover:bg-gray-200',
				className
			]}
		>
			{@render buttonContent?.()}
		</Tooltip.Trigger>
		<Tooltip.Content>
			{@render content?.()}
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
