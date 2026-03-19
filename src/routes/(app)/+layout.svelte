<script>
	import MobileSidebar from '$lib/components/MobileSidebar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Topbar from '$lib/components/Topbar.svelte';

	let { children, data } = $props();
</script>

<MobileSidebar />

<div class="relative mx-auto flex w-full max-w-367.5 flex-1 flex-col px-4 py-5 sm:px-5">
	<div class="hidden xl:fixed xl:inset-y-5 xl:z-50 xl:flex xl:w-66 xl:flex-col">
		<Sidebar />
	</div>

	<div class="flex flex-1 flex-col space-y-5 xl:pl-71">
		<Topbar invites={data?.sharedInvites} />

		<main class="relative grid flex-1 gap-5 lg:grid-cols-[10fr_8fr]">
			{@render children?.()}
		</main>
	</div>
</div>
