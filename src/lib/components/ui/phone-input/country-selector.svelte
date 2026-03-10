<script>
	import * as Popover from '../popover';
	import { Button } from '../button';
	import * as Command from '../command';
	import { ScrollArea } from '../scroll-area/index.js';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { cn } from '$lib/utils.js';
	import Flag from './flag.svelte';

	let {
		countries,
		disabled = false,
		selected = $bindable(null),
		onselect = undefined,
		order = (a, b) => {
			return a.name.localeCompare(b.name);
		}
	} = $props();

	let selectedCountry = $derived(countries.find((a) => a.iso2 === selected));

	let open = $state(false);
	let selectedValue = $state(false);

	const selectCountry = (country) => {
		selected = country.iso2;
		selectedValue = true;
		open = false;
		onselect?.(selected);
	};
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				type="button"
				variant="outline"
				class={cn(
					'flex h-13 shrink-0 gap-1 rounded-l-lg rounded-r-none border-t-grey-300! border-r-grey-775! border-b-grey-300! border-l-grey-300! bg-grey-900 px-3 md:hover:border-yellow-200!'
				)}
				{disabled}
			>
				<Flag country={selectedCountry} />
				<ChevronsUpDownIcon class={cn('-mr-2 h-4 w-4 text-grey-200', disabled ? 'hidden' : '')} />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content
		class="w-75 p-0"
		onCloseAutoFocus={(e) => {
			if (selectedValue) {
				selectedValue = false;
				e.preventDefault();
			}
		}}
	>
		<Command.Root class="max-h-50">
			<Command.Input placeholder="Search country..." />
			<Command.List>
				<ScrollArea class="h-72">
					<Command.Empty>No country found.</Command.Empty>
					<Command.Group>
						{#each countries.sort(order) as country (country.id)}
							<Command.Item
								value={country.name}
								onSelect={() => selectCountry(country)}
								class="relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 outline-hidden select-none aria-selected:bg-grey-1000 aria-selected:text-white-0 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-yellow-100"
							>
								<Flag {country} />
								<span class="flex-1 text-sm">{country.name}</span>
								<span class="text-foreground/50 text-sm">
									+{country.dialCode}
								</span>
								<div class="w-4">
									{#if country.iso2 === selected}
										<CheckIcon class="size-4" />
									{/if}
								</div>
							</Command.Item>
						{/each}
					</Command.Group>
				</ScrollArea>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
