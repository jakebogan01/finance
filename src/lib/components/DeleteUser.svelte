<script>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { SIGNUP } from '$lib/utils/constants.js';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import pb from '$lib/pocketbase.js';

	let { deleteDialogOpen = $bindable() } = $props();

	const deleteUser = async () => {
		try {
			const res = await fetch('/api/account/delete-user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userId: pb.authStore.record.id
				})
			});

			const result = await res.json();
			if (res.ok) {
				pb.authStore.clear();
				await goto(resolve(SIGNUP));
				toast.success('Successfully deleted account!');
			} else {
				console.error('Failed to delete user:', result.error);
			}
		} catch (error) {
			console.dir(error, { depth: null });
			toast.error(error ?? 'Could not connect to the server');
		}
	};
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
			onclick={deleteUser}
		>
			Delete
		</AlertDialog.Action>
	</AlertDialog.Footer>
</AlertDialog.Content>
