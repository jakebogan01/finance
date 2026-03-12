<script>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { deleteRecord } from '$lib/utils/misc';

	let { data, deleteDialogOpen = $bindable(), collectionName } = $props();
</script>

<AlertDialog.Content>
	<AlertDialog.Header>
		<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
		<AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
	</AlertDialog.Header>
	<AlertDialog.Footer>
		<AlertDialog.Cancel
			class="h-13 cursor-pointer rounded-lg border border-grey-300 bg-transparent px-6 font-medium text-white-0 md:transition-colors md:hover:bg-grey-900"
			onclick={() => (deleteDialogOpen = false)}
		>
			Cancel
		</AlertDialog.Cancel>
		<AlertDialog.Action
			class="h-13 bg-red-200 px-6 font-semibold text-white-0 md:hover:bg-red-400"
			onclick={() => deleteRecord(collectionName, data?.id)}
		>
			Delete
		</AlertDialog.Action>
	</AlertDialog.Footer>
</AlertDialog.Content>
