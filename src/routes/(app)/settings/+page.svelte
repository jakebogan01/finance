<script>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import UpdatePassword from '$lib/components/UpdatePassword.svelte';
	import AccountHistory from '$lib/components/AccountHistory.svelte';
	import UpdateProfile from '$lib/components/UpdateProfile.svelte';
	import AccountAccess from '$lib/components/AccountAccess.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import DeleteUser from '$lib/components/DeleteUser.svelte';
	import { SIGNIN } from '$lib/utils/constants.js';
	import { authCheck } from '$lib/utils/misc.js';
	import { onMount } from 'svelte';

	let { data } = $props();

	let deleteDialogOpen = $state(false);

	onMount(() => authCheck(303, SIGNIN, true));
</script>

<section class="flex min-w-0 flex-col space-y-5 sm:max-h-168.5">
	<UpdateProfile />
	<UpdatePassword />
	<div
		class="grid flex-1 gap-10 rounded-2xl border border-grey-300 bg-grey-1000 p-4 sm:grid-cols-[4fr_3fr] sm:rounded-30 sm:p-5"
	>
		<div>
			<h3 class="text-preset-4-semibold sm:text-preset-5-semibold">Delete Account</h3>
			<p class="text-preset-2 mt-2 text-grey-50">
				No longer want to use our service? You can delete your account here.
			</p>
		</div>
		<div class="flex items-center justify-end">
			<Button
				onclick={() => (deleteDialogOpen = true)}
				type="button"
				class="h-13 w-full bg-red-200 px-6 font-medium sm:w-auto md:hover:bg-red-100 dark:bg-red-500 dark:text-white md:dark:hover:bg-red-400"
			>
				Yes, delete my account
			</Button>
		</div>
	</div>
</section>
<section class="flex flex-col space-y-5 sm:max-h-168.5">
	<AccountAccess invites={data?.sharedInvites} />
	<AccountHistory accountHistory={data?.accountHistory} />
</section>

<AlertDialog.Root bind:open={deleteDialogOpen}>
	<DeleteUser bind:deleteDialogOpen />
</AlertDialog.Root>
