<script>
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import { getEmblaContext } from './context.js';
	import { cn } from '$lib/utils.js';
	import { expenseStore } from '$lib/stores/expenseStore.svelte.js';

	let { ref = $bindable(null), class: className, children, ...restProps } = $props();

	const emblaCtx = getEmblaContext('<ExpenseCarousel.Content/>');

	let expenses = $derived(expenseStore.allExpenses);
</script>

<div
	data-slot="carousel-content"
	class="overflow-hidden {expenses?.length < 3 ? 'rounded-2xl bg-[#212121] p-2 sm:rounded-20' : ''}"
	use:emblaCarouselSvelte={{
		options: {
			container: '[data-embla-container]',
			slides: '[data-embla-slide]',
			...emblaCtx.options,
			axis: emblaCtx.orientation === 'horizontal' ? 'x' : 'y'
		},
		plugins: emblaCtx.plugins
	}}
	onemblaInit={emblaCtx.onInit}
>
	<div
		bind:this={ref}
		class={cn(
			'flex',
			emblaCtx.orientation === 'horizontal' ? '-ms-4' : '-mt-4 flex-col',
			className
		)}
		data-embla-container=""
		{...restProps}
	>
		{@render children?.()}
	</div>
</div>
