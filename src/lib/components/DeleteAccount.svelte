<script>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import DeleteUser from '$lib/components/DeleteUser.svelte';

	let deleteDialogOpen = $state(false);
</script>

<div
	class="flex flex-1 overflow-hidden rounded-2xl border border-grey-300 bg-grey-1000 p-4 sm:rounded-20 sm:p-5 dark:border-grey-300 dark:bg-white-0"
>
	<div
		class="flex max-h-fit w-full flex-col justify-between sm:flex-row sm:items-center sm:gap-9 2xl:gap-10"
	>
		<div class="max-h-fit">
			<h3 class="font-semibold sm:text-lg lg:text-xl dark:text-grey-600">Delete Account</h3>
			<p class="mt-2 text-grey-50">
				<span class="2xl:hidden">
					No longer want to use our service? Delete your account here.
				</span>
				<span class="hidden 2xl:inline">
					No longer want to use our service? You can delete your account here. This action is not
					reversible. All information related to this account will be deleted permanently.
				</span>
			</p>
		</div>
		<div class="mt-5 max-h-fit sm:mt-7">
			<Button
				onclick={() => (deleteDialogOpen = true)}
				type="button"
				class="h-13 w-full bg-red-200 px-6 font-medium sm:w-auto md:hover:bg-red-100 dark:bg-red-500 dark:text-white md:dark:hover:bg-red-400"
			>
				Yes, delete my account
			</Button>
		</div>
	</div>
</div>

<AlertDialog.Root bind:open={deleteDialogOpen}>
	<DeleteUser bind:deleteDialogOpen />
</AlertDialog.Root>
