<script>
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils.js';
	import { tick } from 'svelte';

	let { list, result = $bindable() } = $props();
	let open = $state(false);
	let value = $derived(list.length > 0 ? list[0].value : '');
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
				class="h-13 w-full justify-between rounded-lg border border-grey-300 bg-grey-900 px-5! text-grey-200 md:hover:border-yellow-200"
				role="combobox"
				aria-expanded={open}
			>
				{selectedValue || 'Recurring'}
				<ChevronsUpDownIcon />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="ml-1 w-[97%] p-0">
		<Command.Root class="max-h-50">
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
