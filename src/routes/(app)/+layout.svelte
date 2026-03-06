<script>
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();
</script>

<div class="relative mx-auto flex w-full max-w-367.5 flex-1 flex-col px-4 py-5 sm:px-5">
	<div class="hidden 1126:fixed 1126:inset-y-5 1126:z-50 1126:flex 1126:w-66 1126:flex-col">
		<Sidebar />
	</div>

	<div class="flex flex-1 flex-col space-y-5 1126:pl-71">
		<main class="relative grid gap-5 lg:flex-1 lg:grid-cols-[9fr_8fr]">
			{@render children?.()}
		</main>
	</div>
</div>
