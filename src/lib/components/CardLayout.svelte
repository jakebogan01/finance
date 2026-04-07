<script>
	import * as Card from '$lib/components/ui/card/index.js';

	let { children, title, footer } = $props();
</script>

<Card.Root
	class="flex h-50 flex-1 flex-col justify-between overflow-hidden rounded-3xl border border-grey-300 bg-grey-1000 p-5 dark:border-grey-300 dark:bg-white-0"
>
	<Card.Header class="px-0!">
		<Card.Title class="text-preset-4-semibold">{title}</Card.Title>
	</Card.Header>
	{@render children?.()}
	<Card.Footer class="px-0!">
		{@render footer?.()}
	</Card.Footer>
</Card.Root>
