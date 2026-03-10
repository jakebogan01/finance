<script>
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import SlidersVerticalIcon from '@lucide/svelte/icons/sliders-vertical';
	import CircleButton from '$lib/components/CircleButton.svelte';

	let { filters } = $props();
	let open = $state(false);
</script>

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<CircleButton
				{...props}
				Icon={SlidersVerticalIcon}
				size="6"
				class={['md:mr-5', open ? 'border-yellow-200 text-yellow-200' : '']}
			/>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Group>
			<DropdownMenu.RadioGroup bind:value={filters.status}>
				<DropdownMenu.RadioItem
					value="all"
					class={filters.status === 'all' ? 'bg-grey-1000 text-white-0' : ''}
					>Show all</DropdownMenu.RadioItem
				>
				<DropdownMenu.RadioItem
					value="active"
					class={filters.status === 'active' ? 'bg-grey-1000 text-white-0' : ''}
					>Active</DropdownMenu.RadioItem
				>
				<DropdownMenu.RadioItem
					value="inactive"
					class={filters.status === 'inactive' ? 'bg-grey-1000 text-white-0' : ''}
					>Inactive</DropdownMenu.RadioItem
				>
			</DropdownMenu.RadioGroup>
			<DropdownMenu.Separator />
			<DropdownMenu.RadioGroup bind:value={filters.sort}>
				<DropdownMenu.RadioItem
					value="latest"
					class={filters.sort === 'latest' ? 'bg-grey-1000 text-white-0' : ''}
					>Latest</DropdownMenu.RadioItem
				>
				<DropdownMenu.RadioItem
					value="income"
					class={filters.sort === 'income' ? 'bg-grey-1000 text-white-0' : ''}
					>Highest amount</DropdownMenu.RadioItem
				>
			</DropdownMenu.RadioGroup>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
