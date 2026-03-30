<script>
	import MobileSidebar from '$lib/components/MobileSidebar.svelte';
	import { INCOMESLUG } from '$lib/stores/incomeSlug.svelte.js';
	import { darkMode } from '$lib/stores/darkMode.svelte.js';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Topbar from '$lib/components/Topbar.svelte';
	import { data } from '$lib/stores/data.svelte.js';
	import { onDestroy, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import pb from '$lib/pocketbase';

	let { children } = $props();

	onMount(async () => {
		try {
			data.incomes = await pb.collection('incomes').getFullList({
				filter: `user="${pb.authStore.record?.id}"`,
				sort: '-created'
			});

			await pb.collection('incomes').subscribe('*', (e) => {
				const record = e.record;
				if (record.user !== pb.authStore.record?.id) return;
				switch (e.action) {
					case 'create':
						if (!data.incomes.find((i) => i.id === record.id)) {
							data.incomes = [record, ...data.incomes];
						}
						break;
					case 'update':
						data.incomes = data.incomes.map((item) => (item.id === record.id ? record : item));
						break;
					case 'delete':
						data.incomes = data.incomes.filter((item) => item.id !== record.id);
						break;
				}
			});
		} catch (error) {
			console.dir(error?.response, { depth: null });
			toast.error(error?.message ?? 'Could not connect to the server');
		}
	});

	onDestroy(async () => {
		await pb.collection('incomes').unsubscribe('*');
	});
</script>

<MobileSidebar />

<div
	class={[
		'relative mx-auto flex w-full max-w-400 flex-1 flex-col px-4 py-5 sm:px-5 3xl-tall:ultra-screen',
		darkMode.status ? 'dark' : ''
	]}
>
	<div class="hidden xl:fixed xl:inset-y-5 xl:z-50 xl:flex xl:w-66 xl:flex-col 3xl-tall:absolute">
		<Sidebar />
	</div>

	<div class="flex flex-1 flex-col space-y-5 xl:pl-71">
		<Topbar />

		<main
			class="relative grid gap-5 overflow-hidden rounded-2xl border border-grey-300 bg-grey-1000 p-4 sm:rounded-30 sm:p-5 lg:flex-1 lg:grid-cols-[10fr_8fr] dark:bg-white-0"
		>
			{@render children?.()}
		</main>
	</div>
</div>
