<script>
	import { Command as CommandPrimitive } from 'bits-ui';
	import SearchIcon from '@lucide/svelte/icons/search';
	import { cn } from '$lib/utils.js';

	let { ref = $bindable(null), class: className, value = $bindable(''), ...restProps } = $props();
</script>

<div
	class="flex h-11 items-center gap-2 border-b border-grey-500 ps-3 pe-8"
	data-slot="command-input-wrapper"
>
	<SearchIcon class="size-4 shrink-0 text-grey-200 dark:text-grey-500" />
	<CommandPrimitive.Input
		data-slot="command-input"
		class={cn(
			'flex h-10 w-full rounded-md border-none bg-transparent py-3  outline-hidden placeholder:text-grey-200 focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-grey-500',
			className
		)}
		bind:ref
		{...restProps}
		bind:value
	/>
</div>
