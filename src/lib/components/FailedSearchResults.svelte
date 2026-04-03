<script>
	import { incomeStore } from '$lib/stores/incomeStore.svelte.js';
</script>

<div class="flex flex-col space-y-5.5 overflow-hidden pt-5.5 pb-4 lg:flex-1">
	<div
		class="flex flex-col items-center justify-center lg:flex-1 lg:border-r lg:border-grey-800 lg:pr-5 lg:dark:border-grey-200"
	>
		<p class="text-center text-grey-200 dark:text-grey-500">
			No results found for "{incomeStore.filters.search}"
		</p>
	</div>
</div>
