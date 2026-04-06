<script>
	import { getEmblaContext } from './context.js';
	import { cn } from '$lib/utils.js';

	let { ref = $bindable(null), class: className, children, ...restProps } = $props();

	const emblaCtx = getEmblaContext('<ExpenseCarousel.Item/>');
</script>

<div
	bind:this={ref}
	data-slot="carousel-item"
	role="group"
	aria-roledescription="slide"
	class={cn('', emblaCtx.orientation === 'horizontal' ? '' : 'pt-4', className)}
	data-embla-slide=""
	{...restProps}
>
	{@render children?.()}
</div>
