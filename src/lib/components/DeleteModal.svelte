<script>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	let { data, deleteDialogOpen = $bindable(), open = $bindable() } = $props();
</script>

<AlertDialog.Content>
	<AlertDialog.Header>
		<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
		<AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
	</AlertDialog.Header>
	<AlertDialog.Footer>
		<AlertDialog.Cancel
			class="h-13 cursor-pointer rounded-lg border border-grey-300 bg-transparent px-6 font-medium text-white-0 md:transition-colors md:hover:bg-grey-900 dark:text-grey-900 md:dark:hover:bg-gray-200"
			onclick={() => {
				deleteDialogOpen = false;
				open = false;
			}}
		>
			Cancel
		</AlertDialog.Cancel>
		<AlertDialog.Action class="h-13 bg-red-400 px-6 font-medium text-white-0 md:hover:bg-red-500">
			Delete
		</AlertDialog.Action>
	</AlertDialog.Footer>
</AlertDialog.Content>
