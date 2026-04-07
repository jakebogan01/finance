<script>
	import { expenseStore } from '$lib/stores/expenseStore.svelte.js';
	import MobileSidebar from '$lib/components/MobileSidebar.svelte';
	import { incomeStore } from '$lib/stores/incomeStore.svelte.js';
	import { budgetStore } from '$lib/stores/budgetStore.svelte.js';
	import { EXPENSES, INCOME } from '$lib/utils/constants.js';
	import { darkMode } from '$lib/stores/darkMode.svelte.js';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Topbar from '$lib/components/Topbar.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/state';

	let { children } = $props();

	onMount(() => {
		incomeStore.init();
		expenseStore.init();
		budgetStore.init();
	});
	onDestroy(() => {
		incomeStore.cleanup();
		expenseStore.cleanup();
		budgetStore.cleanup();
	});
</script>

<MobileSidebar />

<div class="flex flex-1 flex-col 3xl-tall:items-center 3xl-tall:justify-center 3xl-tall:p-10">
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

			{#if page.url.pathname === EXPENSES || page.url.pathname === INCOME}
				<main
					class="relative grid gap-5 overflow-hidden rounded-2xl border border-grey-300 bg-grey-1000 p-4 sm:rounded-30 sm:p-5 lg:flex-1 lg:grid-cols-[10fr_8fr] dark:bg-white-0"
				>
					{@render children?.()}
				</main>
			{:else}
				<main class="relative grid gap-5 lg:flex-1 lg:grid-cols-[10fr_8fr]">
					{@render children?.()}
				</main>
			{/if}
		</div>
	</div>
</div>
