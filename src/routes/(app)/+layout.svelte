<script>
	import {
		initSharedAccessRealtime,
		cleanupSharedAccessRealtime
	} from '$lib/stores/sharedAccessRealtime.js';
	import { initAuthListener, registerAuthReset } from '$lib/utils/authListener.js';
	import { accountHistoryStore } from '$lib/stores/accountHistoryStore.svelte.js';
	import { sharedAccessStore } from '$lib/stores/sharedAccessStore.svelte.js';
	import { resetAccessibleUserIdsCache } from '$lib/utils/functions.js';
	import { expenseStore } from '$lib/stores/expenseStore.svelte.js';
	import MobileSidebar from '$lib/components/MobileSidebar.svelte';
	import { incomeStore } from '$lib/stores/incomeStore.svelte.js';
	import { budgetStore } from '$lib/stores/budgetStore.svelte.js';
	import { EXPENSES, INCOME } from '$lib/utils/constants.js';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Topbar from '$lib/components/Topbar.svelte';
	import { onDestroy, onMount } from 'svelte';
	import pb from '$lib/pocketbase.js';
	import { page } from '$app/state';

	let { children } = $props();
	let user = $state(pb.authStore.record);

	onMount(async () => {
		await initSharedAccessRealtime();
		initAuthListener();
		registerAuthReset(() => {
			resetAccessibleUserIdsCache();

			incomeStore.cleanup();
			expenseStore.cleanup();
			accountHistoryStore.cleanup();
			budgetStore.cleanup();
			sharedAccessStore.cleanup();

			incomeStore.init();
			expenseStore.init();
			accountHistoryStore.init();
			budgetStore.init();
			sharedAccessStore.init();
		});
		if (pb.authStore.record?.dark_mode) {
			document.documentElement.classList.add('dark');
		}
		pb.authStore.onChange(() => {
			user = pb.authStore.record;
			document.documentElement.classList.toggle('dark', user?.dark_mode);
		});
		await Promise.all([
			incomeStore.init(),
			expenseStore.init(),
			budgetStore.init(),
			accountHistoryStore.init(),
			sharedAccessStore.init()
		]);
	});
	onDestroy(async () => {
		await cleanupSharedAccessRealtime();
		await incomeStore.cleanup();
		await expenseStore.cleanup();
		budgetStore.cleanup();
		await accountHistoryStore.cleanup();
		await sharedAccessStore.cleanup();
	});
</script>

<MobileSidebar />

<div
	class="flex min-h-0 flex-1 flex-col 3xl-tall:items-center 3xl-tall:justify-center 3xl-tall:p-10"
>
	<div
		class={[
			'wrapper relative mx-auto flex min-h-0 w-full max-w-400 flex-1 flex-col px-4 py-5 sm:px-5 3xl-tall:ultra-screen',
			user?.dark_mode ? 'dark' : ''
		]}
	>
		<div class="hidden xl:fixed xl:inset-y-5 xl:z-50 xl:flex xl:w-66 xl:flex-col 3xl-tall:absolute">
			<Sidebar />
		</div>

		<div class="flex min-h-0 flex-1 flex-col space-y-5 xl:pl-71">
			<Topbar />

			{#if page.url.pathname === EXPENSES || page.url.pathname === INCOME}
				<main
					class="relative grid gap-5 overflow-hidden rounded-2xl border border-grey-300 bg-grey-1000 p-4 sm:rounded-30 sm:p-5 lg:flex-1 lg:grid-cols-[10fr_8fr] dark:bg-white-0"
				>
					{@render children?.()}
				</main>
			{:else}
				<main class="relative grid min-h-0 gap-5 lg:flex-1 lg:grid-cols-[10fr_8fr]">
					{@render children?.()}
				</main>
			{/if}
		</div>
	</div>
</div>
