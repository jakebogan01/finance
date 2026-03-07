<script>
	import { cn } from '$lib/utils.js';

	let { ref = $bindable(null), class: className, children, ...restProps } = $props();
</script>

<div
	bind:this={ref}
	data-slot="dialog-footer"
	class={cn('flex justify-end gap-x-6.5', className)}
	{...restProps}
>
	{@render children?.()}
</div>
