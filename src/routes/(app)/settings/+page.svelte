<script>
	import { accountHistoryStore } from '$lib/stores/accountHistoryStore.svelte.js';
	import AccountHistory from '$lib/components/AccountHistory.svelte';
	import UpdatePassword from '$lib/components/UpdatePassword.svelte';
	import UpdateProfile from '$lib/components/UpdateProfile.svelte';
	import DeleteAccount from '$lib/components/DeleteAccount.svelte';
	import { authCheck } from '$lib/utils/functions.js';
	import { SIGNIN } from '$lib/utils/constants.js';
	import Head from '$lib/components/Head.svelte';
	import { onMount } from 'svelte';
	import AccountAccess from '$lib/components/AccountAccess.svelte';

	onMount(() => authCheck(303, SIGNIN, true));
</script>

<Head
	page_title="Finance | Settings"
	description="Manage your account, profile, and shared access. Invite others and control how your financial data is shared and updated."
/>

<section class="flex min-w-0 flex-col space-y-5">
	<UpdateProfile />
	<UpdatePassword />
	<DeleteAccount />
</section>

<section class="flex min-h-0 min-w-0 flex-col space-y-5">
	<AccountAccess />
	<AccountHistory accountHistory={accountHistoryStore.records} />
</section>
