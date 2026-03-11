<script>
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import SlidersVerticalIcon from '@lucide/svelte/icons/sliders-vertical';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import CircleButton from '$lib/components/CircleButton.svelte';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import SquarePenIcon from '@lucide/svelte/icons/square-pen';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';

	let { data, handleEditRecord } = $props();
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
					class={['md:mr-5', open ? 'border-yellow-200 text-yellow-200' : '']}
				/>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-56" align="start">
			<DropdownMenu.Item onSelect={() => handleEditRecord(data)}>
				<SquarePenIcon size="6" strokeWidth="1.5" class="text-current" />
				Edit
			</DropdownMenu.Item>
			<DropdownMenu.Item onSelect={handleDeleteSelect}>
				<Trash2Icon size="6" strokeWidth="1.5" class="text-current" />
				Delete
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<DeleteModal {data} bind:deleteDialogOpen />
</AlertDialog.Root>
