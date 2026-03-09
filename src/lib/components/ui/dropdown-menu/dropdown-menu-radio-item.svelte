<script>
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import CircleIcon from '@lucide/svelte/icons/circle';
	import { cn } from '$lib/utils.js';

	let { ref = $bindable(null), class: className, children: childrenProp, ...restProps } = $props();
</script>

<DropdownMenuPrimitive.RadioItem
	bind:ref
	data-slot="dropdown-menu-radio-item"
	class={cn(
		"text-preset-3 relative flex cursor-pointer items-center gap-2 rounded-10 py-1.5 ps-8 pe-2 outline-hidden select-none focus:bg-grey-1000 focus:text-white-0 data-disabled:pointer-events-none data-disabled:opacity-50 md:transition-all [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		className
	)}
	{...restProps}
>
	{#snippet children({ checked })}
		<span class="pointer-events-none absolute inset-s-2 flex size-3.5 items-center justify-center">
			{#if checked}
				<CircleIcon class="size-2.5 fill-yellow-100" />
			{/if}
		</span>
		{@render childrenProp?.({ checked })}
	{/snippet}
</DropdownMenuPrimitive.RadioItem>
