<script>
	import { box } from 'svelte-toolbelt';
	import { usePassword } from './password.svelte.js';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		hidden = $bindable(true),
		minScore = 3,
		class: className,
		children
	} = $props();

	usePassword({
		hidden: box.with(
			() => hidden,
			(v) => (hidden = v)
		),
		minScore: box.with(() => minScore)
	});
</script>

<div bind:this={ref} class={cn('flex flex-col gap-2', className)}>
	{@render children?.()}
</div>
