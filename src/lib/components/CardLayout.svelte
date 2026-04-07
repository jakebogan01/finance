<script>
	import * as Card from '$lib/components/ui/card/index.js';

	let { content, title, footer } = $props();
</script>

<Card.Root
	class="flex h-50 flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-grey-300 bg-grey-1000 p-4 sm:rounded-3xl sm:p-5 dark:border-grey-300 dark:bg-white-0"
>
	<Card.Header class="px-0!">
		<Card.Title class="font-semibold sm:text-lg sm:font-semibold">{title}</Card.Title>
	</Card.Header>
	{@render content?.()}
	<Card.Footer class="px-0!">
		{@render footer?.()}
	</Card.Footer>
</Card.Root>
