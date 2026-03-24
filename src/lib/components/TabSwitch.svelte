<script>
	import { darkMode } from '$lib/stores/darkMode.svelte.js';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';

	let { tabItems, showIcons } = $props();
	let active = $derived(tabItems?.[0] ?? null);

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
		const prev = active;
		active = item;
		setTimeout(() => {
			if ((prev === 'Dark' && item === 'Light') || (prev === 'Light' && item === 'Dark'))
				changeTheme();
		}, 700);
	};
</script>

<div class="relative z-1">
	<ul
		class="text-preset-2-medium after:-z-px flex h-10.5 w-full items-center justify-center overflow-hidden px-1 after:absolute after:rounded-10 after:bg-grey-600 after:content-[''] hover:after:bg-yellow-200 dark:after:bg-grey-200"
	>
		{#each tabItems as item, i (i)}
			<li role="listitem" class="h-full flex-1">
				<button
					type="button"
					onclick={() => handleTabChange(item)}
					data-tab
					aria-label={item}
					role="tab"
					aria-selected={active === item}
					class="relative z-10 flex h-full w-full cursor-pointer items-center justify-center gap-x-1.5 transition-colors delay-100 duration-200 ease-in-out select-none md:hover:text-grey-600 dark:md:hover:text-white-0 {active ===
					item
						? 'text-yellow-200'
						: 'text-grey-50 not-hover:delay-100 not-hover:duration-200 dark:text-grey-500'}"
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
</div>

<style>
	ul {
		anchor-name: --active-nav;
	}
	ul::after {
		corner-shape: squircle;
		position-anchor: --active-nav;
		left: anchor(left);
		right: anchor(right);
		top: anchor(top);
		bottom: anchor(bottom);
		transition: inset 700ms 100ms;
		transition-timing-function: linear(
			0,
			0.033 1.4%,
			0.136 3%,
			0.728 9%,
			0.944 11.7%,
			1.087 14.5%,
			1.128 15.9%,
			1.152 17.4%,
			1.159 19%,
			1.149 20.8%,
			1.014 30.1%,
			0.988 33%,
			0.976 36%,
			0.976 39.6%,
			1.004 54.5%,
			1
		);
	}
	ul button:is(:hover, :focus-visible) {
		anchor-name: --active-nav;
	}
</style>
