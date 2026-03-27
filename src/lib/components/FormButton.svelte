<script>
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let { text, disableButton, class: className } = $props();
</script>

<Button
	type="submit"
	disabled={disableButton}
	class={[
		'h-13 bg-yellow-200 px-6 font-medium text-grey-800 md:hover:bg-yellow-100 dark:text-white-0',
		className
	]}
>
	{#if disableButton}
		<Spinner />
		Validating...
	{:else}
		{text}
	{/if}
</Button>
