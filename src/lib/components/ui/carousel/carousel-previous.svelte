<script>
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
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

	const emblaCtx = getEmblaContext('<Carousel.Previous/>');
</script>

<Button
	data-slot="carousel-previous"
	{variant}
	{size}
	aria-disabled={!emblaCtx.canScrollPrev}
	class={cn(
		'size-13 rounded-full border border-grey-100 bg-grey-900 text-white-0 md:transition-colors md:hover:border-yellow-200 md:hover:text-yellow-200',
		emblaCtx.orientation === 'horizontal' ? '' : '',
		className
	)}
	onclick={emblaCtx.scrollPrev}
	onkeydown={emblaCtx.handleKeyDown}
	{...restProps}
	bind:ref
>
	<ArrowLeftIcon class="size-6" strokeWidth="1.5" />
	<span class="sr-only">Previous slide</span>
</Button>
