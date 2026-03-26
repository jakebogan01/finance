<script>
	import { darkMode } from '$lib/stores/darkMode.svelte.js';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';

	let { tabItems, showIcons } = $props();
	let active = $derived(tabItems?.[0] ?? null);
	let containerEl = null;
	let isSwitching = $state(false);

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

	const handleTabChange = (item) => {
		if (item === active || isSwitching) return;
		const prev = active;
		isSwitching = true;
		active = item;
		setTimeout(() => {
			if ((prev === 'Dark' && item === 'Light') || (prev === 'Light' && item === 'Dark'))
				changeTheme();
			isSwitching = false;
		}, 500);
	};
</script>

<ul
	bind:this={containerEl}
	role="tablist"
	class="text-preset-2-medium relative flex h-11 w-full items-center justify-center overflow-hidden rounded-10 bg-grey-600 dark:bg-grey-200"
>
	{#each tabItems as item, i (i)}
		<li role="listitem" class="h-full flex-1">
			<button
				type="button"
				data-tab
				disabled={isSwitching}
				onclick={() => handleTabChange(item)}
				aria-label={item}
				role="tab"
				aria-selected={active === item}
				class="btn disable after: relative z-10 flex h-full w-full transform cursor-pointer items-center justify-center gap-x-1.5 transition-colors delay-100 duration-200 select-none after:absolute after:z-0 after:h-full after:w-full after:rounded-lg after:content-[''] {active ===
				item
					? 'text-grey-1100 after:scale-x-92 after:scale-y-82 after:bg-yellow-200 dark:text-white-0'
					: 'text-grey-50 not-hover:delay-0 not-hover:duration-200 after:scale-x-0 after:scale-y-0 after:bg-transparent md:hover:text-white-0 dark:text-grey-500 dark:md:hover:text-grey-900'}"
			>
				{#if showIcons}
					{#if item === 'Dark'}
						<MoonIcon class="relative z-1 size-4" strokeWidth="1.5" fill="currentColor" />
					{:else}
						<SunIcon class="relative z-1 size-4" fill="currentColor" />
					{/if}
				{/if}
				<span class="relative z-1">{item}</span>
			</button>
		</li>
	{/each}
</ul>

<style>
	.btn::after {
		transition: scale 800ms 100ms;
		transition-timing-function: linear(
			0,
			0.01 0.8%,
			0.037 1.6%,
			0.16 3.5%,
			0.315 5.2%,
			0.797 9.9%,
			1.026 12.7%,
			1.11 14.1%,
			1.169 15.4%,
			1.211 16.8%,
			1.234 18.2%,
			1.238 19.9%,
			1.22 21.8%,
			1.182 23.8%,
			1.057 28.9%,
			1.003 31.5%,
			0.963 34.4%,
			0.945 37.3%,
			0.948 41.2%,
			0.998 50.7%,
			1.013 56.3%,
			0.997 75.2%,
			1
		);
	}
</style>
