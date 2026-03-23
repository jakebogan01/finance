<script>
	import { darkMode } from '$lib/stores/darkMode.svelte.js';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';
	import { onMount } from 'svelte';

	let { tabItems, showIcons } = $props();
	let positions = $state([]);
	let active = $derived(tabItems?.[0] ?? null);
	let indicatorEl = null;
	let containerEl = null;

	const updatePositions = () => {
		if (!containerEl) return;
		const containerRect = containerEl.getBoundingClientRect();
		positions = Array.from(containerEl.querySelectorAll('[data-tab]')).map((btn) => {
			const rect = btn.getBoundingClientRect();
			return {
				left: rect.left - containerRect.left,
				width: rect.width
			};
		});
	};

	onMount(() => {
		setTimeout(updatePositions, 0);
		if (!containerEl) return;
		const observer = new ResizeObserver(() => updatePositions());
		observer.observe(containerEl);
		return () => observer.disconnect();
	});

	$effect(() => {
		if (!indicatorEl || positions.length === 0) return;
		const idx = tabItems.indexOf(active);
		if (idx === -1 || !positions[idx]) return;
		const { left, width } = positions[idx];
		indicatorEl.style.transform = `translateX(${left}px)`;
		indicatorEl.style.width = `${width}px`;
	});

	const changeTheme = () => {
		if (!document.startViewTransition) {
			updateTheme();
			return;
		}
		document.startViewTransition(() => updateTheme());
	};

	const updateTheme = () => {
		darkMode.status = !darkMode.status;
		document.documentElement.classList.toggle('dark', darkMode.status);
	};
</script>

<ul
	bind:this={containerEl}
	role="tablist"
	class="text-preset-2-medium relative flex h-10.5 w-full items-center justify-center overflow-hidden rounded-10 bg-grey-600 px-1 dark:bg-grey-200"
>
	<li
		role="presentation"
		bind:this={indicatorEl}
		class="transition-[width, transform] absolute top-1/2 left-0 list-item h-8.5 -translate-y-1/2 rounded-lg bg-yellow-200 duration-200 ease-[cubic-bezier(0.18,0.89,0.35,1.15)]"
	></li>
	{#each tabItems as item, i (i)}
		<li role="listitem" class="h-full flex-1">
			<button
				type="button"
				data-tab
				aria-label={item}
				onclick={() => {
					let preActive = active;
					active = item;
					setTimeout(() => {
						if (
							(preActive === 'Dark' && active === 'Light') ||
							(preActive === 'Light' && active === 'Dark')
						)
							changeTheme();
					}, 200);
				}}
				role="tab"
				aria-selected={active === item}
				class="disable relative z-10 flex h-full w-full cursor-pointer items-center justify-center gap-x-1.5 transition-colors duration-200 ease-in-out select-none {active ===
				item
					? 'text-grey-1100 dark:text-white-0'
					: 'text-grey-50 not-hover:duration-200 md:hover:text-white-0 dark:text-grey-500 dark:md:hover:text-grey-900'}"
			>
				{#if showIcons}
					{#if item === 'Dark'}
						<MoonIcon class="size-4" strokeWidth="1.5" fill="currentColor" />
					{:else}
						<SunIcon class="size-4" fill="currentColor" />
					{/if}
				{/if}
				{item}
			</button>
		</li>
	{/each}
</ul>
