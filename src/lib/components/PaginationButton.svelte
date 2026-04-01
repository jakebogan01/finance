<script>
	import { Button } from '$lib/components/ui/button/index.js';

	let { children, isDisabled, loading, handlePagination } = $props();
</script>

<Button
	type="button"
	class="size-11 border border-grey-50 bg-transparent px-6 font-medium text-grey-50 disabled:border-grey-200 disabled:text-grey-200 md:hover:border-grey-100 md:hover:bg-grey-100/5 md:hover:text-grey-100 dark:border-none dark:bg-grey-200 dark:text-grey-400 dark:disabled:text-grey-400 dark:md:hover:bg-yellow-100"
	disabled={isDisabled || loading}
	onclick={handlePagination}
>
	{@render children?.()}
</Button>
