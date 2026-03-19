<script>
	import { Button } from '$lib/components/ui/button';

	let { Icon, size = '5', content, class: className, ...props } = $props();
</script>

<Button
	{...props}
	class={[
		'size-13 rounded-full border border-grey-100 bg-grey-900 text-white-0 md:hover:border-yellow-200 md:hover:text-yellow-200 dark:bg-grey-800',
		className
	]}
>
	{#if Icon}
		<Icon class="size-{size}" strokeWidth="1.5" />
	{:else}
		{@html content}
	{/if}
</Button>
