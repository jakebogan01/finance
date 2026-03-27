<script>
	import { cn } from '$lib/utils.js';
	import { Command as CommandPrimitive } from 'bits-ui';

	let {
		api = $bindable(null),
		ref = $bindable(null),
		value = $bindable(''),
		class: className,
		...restProps
	} = $props();
</script>

<CommandPrimitive.Root
	bind:this={api}
	bind:value
	bind:ref
	data-slot="command"
	class={cn(
		'flex h-[-webkit-fill-available] flex-col overflow-hidden rounded-lg bg-grey-900 text-grey-50 dark:bg-gray-300',
		className
	)}
	{...restProps}
/>
