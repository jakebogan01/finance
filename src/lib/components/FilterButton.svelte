<script>
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import SlidersVerticalIcon from '@lucide/svelte/icons/sliders-vertical';
	import CircleButton from '$lib/components/CircleButton.svelte';

	let { filters, sortType, onChange } = $props();
	let open = $state(false);
	let prev = $state(null);
	let initialized = false;

	$effect(() => {
		if (!onChange) return;

		const current = JSON.stringify(filters);

		if (!initialized) {
			initialized = true;
			prev = current;
			return;
		}

		if (current !== prev) {
			prev = current;
			onChange(filters);
		}
	});
</script>

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<CircleButton
				{...props}
				Icon={SlidersVerticalIcon}
				size="6"
				class={[
					'md:mr-5',
					open ? 'border-yellow-200 text-yellow-200 dark:bg-yellow-100 dark:text-white-0' : ''
				]}
			/>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Group>
			<DropdownMenu.RadioGroup bind:value={filters.status}>
				<DropdownMenu.RadioItem
					value="all"
					class={filters.status === 'all' ? 'bg-grey-1000 text-white-0 dark:bg-yellow-100' : ''}
					>Show all</DropdownMenu.RadioItem
				>
				<DropdownMenu.RadioItem
					value="active"
					class={filters.status === 'active' ? 'bg-grey-1000 text-white-0 dark:bg-yellow-100' : ''}
					>Active</DropdownMenu.RadioItem
				>
				<DropdownMenu.RadioItem
					value="inactive"
					class={filters.status === 'inactive'
						? 'bg-grey-1000 text-white-0 dark:bg-yellow-100'
						: ''}>Inactive</DropdownMenu.RadioItem
				>
			</DropdownMenu.RadioGroup>
			<DropdownMenu.Separator />
			<DropdownMenu.RadioGroup bind:value={filters.sort}>
				<DropdownMenu.RadioItem
					value="latest"
					class={filters.sort === 'latest' ? 'bg-grey-1000 text-white-0 dark:bg-yellow-100' : ''}
					>Latest</DropdownMenu.RadioItem
				>
				<DropdownMenu.RadioItem
					value={sortType}
					class={filters.sort === sortType ? 'bg-grey-1000 text-white-0 dark:bg-yellow-200' : ''}
					>Highest amount</DropdownMenu.RadioItem
				>
			</DropdownMenu.RadioGroup>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
