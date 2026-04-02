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
		'flex flex-col overflow-hidden rounded-lg bg-grey-900 text-grey-50 md:h-[-webkit-fill-available] dark:bg-white-0',
		className
	)}
	{...restProps}
/>
