<script>
	import { cn } from '$lib/utils.js';

	let { ref = $bindable(null), class: className, children, ...rest } = $props();
</script>

<div
	{...rest}
	bind:this={ref}
	class={cn('flex w-full place-items-center justify-center gap-2', className)}
>
	{@render children?.()}
</div>
