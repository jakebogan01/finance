<script>
	import { Switch } from '$lib/components/ui/switch/index.js';

	let { checked = $bindable() } = $props();
</script>

<div class="col-span-full flex items-center justify-between">
	<span class="flex grow flex-col text-grey-50 dark:text-grey-500">Active</span>
	<Switch bind:checked />
</div>
