<script>
	import MobileSidebar from '$lib/components/MobileSidebar.svelte';
	import { darkMode } from '$lib/stores/darkMode.svelte.js';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Topbar from '$lib/components/Topbar.svelte';

	let { children } = $props();
</script>

<MobileSidebar />

<div
	class={[
		'relative mx-auto flex w-full max-w-367.5 flex-1 flex-col bg-green-500 px-4 py-5  sm:px-5 dark:bg-transparent',
		darkMode.status ? 'dark' : ''
	]}
>
	<div class="hidden xl:fixed xl:inset-y-5 xl:z-50 xl:flex xl:w-66 xl:flex-col">
		<Sidebar />
	</div>

	<div class="flex flex-1 flex-col space-y-5 bg-red-500 xl:pl-71 dark:bg-transparent">
		<Topbar />

		<main
			class="relative grid gap-5 bg-blue-500 lg:flex-1 lg:grid-cols-[10fr_8fr] dark:bg-transparent"
		>
			{@render children?.()}
		</main>
	</div>
</div>
