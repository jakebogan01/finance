<script>
	import { cn } from '$lib/utils.js';

	let { ref = $bindable(null), class: className, children, ...restProps } = $props();
</script>

<div
	bind:this={ref}
	data-slot="card"
	class={cn('flex flex-col rounded-2xl py-4', className)}
	{...restProps}
>
	{@render children?.()}
</div>
