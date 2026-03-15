<script>
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { getEmblaContext } from './context.js';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'outline',
		size = 'icon',
		...restProps
	} = $props();

	const emblaCtx = getEmblaContext('<Carousel.Next/>');
</script>

<Button
	data-slot="carousel-next"
	{variant}
	{size}
	aria-disabled={!emblaCtx.canScrollNext}
	class={cn(
		'size-13 rounded-full border border-grey-100 bg-grey-900 text-white-0 md:transition-colors md:hover:border-yellow-200 md:hover:text-yellow-200',
		emblaCtx.orientation === 'horizontal' ? '' : '',
		className
	)}
	onclick={emblaCtx.scrollNext}
	onkeydown={emblaCtx.handleKeyDown}
	bind:ref
	{...restProps}
>
	<ArrowRightIcon class="size-6" strokeWidth="1.5" />
	<span class="sr-only">Next slide</span>
</Button>
