<script>
	import { Button } from '$lib/components/ui/button';

	let { Icon, size = '5', content, class: className, ...props } = $props();
</script>

<Button
	{...props}
	class={[
		'size-13 rounded-full border border-grey-100 bg-grey-900 text-white-0 md:hover:border-yellow-200 md:hover:text-yellow-200 dark:border-white-0 dark:bg-yellow-200 dark:md:hover:border-white-0 dark:md:hover:bg-yellow-100 dark:md:hover:text-white-0',
		className
	]}
>
	{#if Icon}
		<Icon class="size-{size}" strokeWidth="1.5" />
	{:else}
		{content}
	{/if}
</Button>
