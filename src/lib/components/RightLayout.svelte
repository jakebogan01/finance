<script>
	import RecordDetails from '$lib/components/RecordDetails.svelte';
	import { usdFormatter } from '$lib/utils/functions.js';

	let { data, handleEditRecord, collectionName, store } = $props();
</script>

<section>
	<h3 class="text-preset-4-semibold hidden h-13 items-center justify-end text-yellow-200 lg:flex">
		<span class="text-preset-5-semibold mr-2 text-grey-100/80 dark:text-grey-400">Total:</span
		>{usdFormatter.format(store.userTotal)}
	</h3>
	{#if data}
		<RecordDetails {data} {handleEditRecord} {collectionName} />
	{/if}
</section>
