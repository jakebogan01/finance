<script>
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils.js';
	import { tick } from 'svelte';

	let {
		list,
		result = $bindable(),
		defaultText,
		class: className,
		index = 0,
		noValue = false
	} = $props();
	let open = $state(false);
	let value = $derived(list.length > 0 && !noValue ? list[index].value : '');
	let triggerRef = $state(null);
	const selectedValue = $derived(list.find((f) => f.value === value)?.label);

	const closeAndFocusTrigger = () => {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	};
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				{...props}
				class={[
					'h-13 w-full justify-between rounded-lg border border-grey-300 bg-grey-900 px-2! sm:px-4! md:hover:border-yellow-200 dark:bg-gray-200',
					selectedValue ? 'text-white-0 dark:text-black' : 'text-grey-200'
				]}
				role="combobox"
				aria-expanded={open}
			>
				{selectedValue || defaultText}
				<ChevronsUpDownIcon class="text-grey-200" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class={['p-0', className]}>
		<Command.Root>
			<Command.Input placeholder="Search..." />
			<Command.List>
				<Command.Empty>No results found</Command.Empty>
				<Command.Group value="list">
					{#each list as item (item.value)}
						<Command.Item
							value={item.value}
							onSelect={() => {
								value = item.value;
								result = value;
								closeAndFocusTrigger();
							}}
							class="relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 outline-hidden select-none aria-selected:bg-grey-1000 aria-selected:text-white-0 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-yellow-100"
						>
							<CheckIcon class={cn(value !== item.value && 'text-transparent')} />
							{item.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
