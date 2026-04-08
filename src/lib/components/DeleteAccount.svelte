<script>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import DeleteUser from '$lib/components/DeleteUser.svelte';

	let deleteDialogOpen = $state(false);
</script>

<div
	class="lg:min-h-none grid min-h-50 flex-1 gap-10 overflow-hidden rounded-2xl border border-grey-300 bg-grey-1000 p-4 sm:grid-cols-[4fr_3fr] sm:rounded-20 sm:p-5 dark:border-grey-300 dark:bg-white-0"
>
	<div>
		<h3 class="font-semibold sm:text-lg lg:text-xl dark:text-grey-600">Delete Account</h3>
		<p class="mt-2 text-grey-50">
			No longer want to use our service? You can delete your account here.
		</p>
	</div>
	<div class="flex items-start justify-end">
		<Button
			onclick={() => (deleteDialogOpen = true)}
			type="button"
			class="h-13 w-full bg-red-200 px-6 font-medium sm:w-auto md:hover:bg-red-100 dark:bg-red-500 dark:text-white md:dark:hover:bg-red-400"
		>
			Yes, delete my account
		</Button>
	</div>
</div>

<AlertDialog.Root bind:open={deleteDialogOpen}>
	<DeleteUser bind:deleteDialogOpen />
</AlertDialog.Root>
