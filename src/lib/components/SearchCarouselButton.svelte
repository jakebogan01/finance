<script>
	import CircleButton from '$lib/components/CircleButton.svelte';
	import { Command as CommandPrimitive } from 'bits-ui';
	import SearchIcon from '@lucide/svelte/icons/search';
	import XIcon from '@lucide/svelte/icons/x';
	import { cn } from '$lib/utils.js';
	import { tick } from 'svelte';

	let { ref = $bindable(null), class: className, value = $bindable(''), ...restProps } = $props();
	let open = $derived(value.length > 0);
	let container;

	const toggle = async (e) => {
		e.preventDefault();
		const next = !open;
		open = next;
		if (next) {
			await tick();
			container?.querySelector('input')?.focus();
		}
	};

	const close = () => {
		if (!value) open = false;
	};

	const clearSearch = (e) => {
		e?.preventDefault();
		value = '';
		open = false;
	};
</script>

<div bind:this={container} class="relative hidden w-full items-center md:flex">
	<div
		class={[
			'absolute right-full mr-5 overflow-hidden ease-[cubic-bezier(.34,1.56,.64,1)] md:transition-[width] md:duration-250',
			open ? 'w-[408%]' : 'w-[0%]'
		]}
	>
		<div class="relative flex items-center">
			<SearchIcon
				class="md:transition-[opacity, transform] absolute left-3 z-10 size-4 text-grey-200 md:duration-300 dark:text-grey-600"
			/>
			<CommandPrimitive.Input
				data-slot="command-input"
				placeholder="Search..."
				inputmode="search"
				onkeydown={(e) => e.key === 'Escape' && clearSearch()}
				onblur={close}
				class={cn(
					'pointer-events-auto mb-0 hidden h-13 w-full min-w-0 translate-x-0 rounded-full border border-grey-300 bg-grey-900 pr-4 pl-8 opacity-100 ring-offset-yellow-100 outline-none selection:bg-yellow-100 selection:text-grey-1100 placeholder:text-grey-200 focus-visible:border-yellow-100 focus-visible:ring-[3px] focus-visible:ring-yellow-200/500 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-200 aria-invalid:ring-red-100/20 md:flex md:transition-colors md:hover:border-yellow-200 dark:border-grey-400 dark:bg-white-0 dark:text-grey-900 dark:placeholder:text-grey-600',
					open
						? 'pointer-events-auto translate-x-0 opacity-100'
						: 'pointer-events-none translate-x-2 opacity-0',
					className
				)}
				bind:this={ref}
				{...restProps}
				bind:value
			/>
		</div>
	</div>

	{#if open}
		<CircleButton
			Icon={XIcon}
			size="6"
			onmousedown={clearSearch}
			class={open ? 'border-yellow-200 text-yellow-200 dark:bg-yellow-100 dark:text-white-0' : ''}
		/>
	{:else}
		<CircleButton
			Icon={SearchIcon}
			size="6"
			onmousedown={toggle}
			class={open ? 'border-yellow-200 text-yellow-200 dark:bg-yellow-100 dark:text-white-0' : ''}
		/>
	{/if}
</div>
