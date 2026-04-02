<script>
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import SlidersVerticalIcon from '@lucide/svelte/icons/sliders-vertical';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import CircleButton from '$lib/components/CircleButton.svelte';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import SquarePenIcon from '@lucide/svelte/icons/square-pen';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';

	let { data, handleEditRecord, collectionName } = $props();
	let open = $state(false);
	let deleteDialogOpen = $state(false);

	const handleDeleteSelect = (e) => {
		e.preventDefault();
		deleteDialogOpen = true;
	};
</script>

<AlertDialog.Root bind:open={deleteDialogOpen}>
	<DropdownMenu.Root bind:open>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<CircleButton
					{...props}
					Icon={SlidersVerticalIcon}
					size="6"
					class={[
						'',
						open
							? 'border-yellow-200 text-yellow-200 dark:bg-yellow-200 dark:text-white-0'
							: 'dark:bg-yellow-100! dark:md:hover:bg-yellow-200!'
					]}
				/>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-56 dark:text-grey-900" align="end">
			<DropdownMenu.Item
				onSelect={() => handleEditRecord(data)}
				class="dark:md:hover:bg-yellow-100"
			>
				<SquarePenIcon size="6" strokeWidth="1.5" class="text-current" />
				Edit
			</DropdownMenu.Item>
			<DropdownMenu.Item onSelect={handleDeleteSelect} class="dark:md:hover:bg-yellow-100">
				<Trash2Icon size="6" strokeWidth="1.5" class="text-current" />
				Delete
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<DeleteModal {data} bind:deleteDialogOpen bind:open {collectionName} />
</AlertDialog.Root>
