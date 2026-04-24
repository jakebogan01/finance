<script>
	import { accountHistoryStore } from '$lib/stores/accountHistoryStore.svelte.js';
	import HistoryIcon from '@lucide/svelte/icons/history';
	import { formatDate } from '$lib/utils/functions.js';

	let lastDate = $derived(accountHistoryStore.records[0].created);
</script>

<div
	class="hidden h-13 touch-none items-center gap-2 rounded-full border border-grey-100 bg-grey-900 px-5 text-white-0 select-none sm:flex lg:hidden 1400:flex dark:border-grey-300 dark:bg-transparent dark:text-grey-900"
>
	<HistoryIcon class="size-6" strokeWidth="1.5" />
	{formatDate(lastDate)}
</div>
