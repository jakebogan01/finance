<script>
	import { Calendar as CalendarPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let { ref = $bindable(null), class: className, ...restProps } = $props();
</script>

<CalendarPrimitive.Cell
	bind:ref
	class={cn(
		'relative size-(--cell-size) rounded-md p-0 text-center text-sm transition-colors focus-within:z-20 hover:bg-yellow-200 dark:hover:bg-yellow-100 [&:first-child[data-selected]_[data-bits-day]]:rounded-s-md [&:last-child[data-selected]_[data-bits-day]]:rounded-e-md',
		className
	)}
	{...restProps}
/>
