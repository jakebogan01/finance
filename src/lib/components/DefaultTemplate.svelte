<script>
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';

	let { children, message = 'No records' } = $props();
</script>

<Skeleton class="absolute inset-0 z-0 animate-none! rounded-2xl bg-grey-700" />
<div
	class="absolute top-1/2 left-1/2 z-5 flex size-full -translate-1/2 items-center justify-center text-center"
>
	<div class="space-y-4">
		<span class="text-preset-3 block text-grey-50">{message}</span>
		{@render children?.()}
	</div>
</div>
