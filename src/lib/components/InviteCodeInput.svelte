<script>
	import { resetAccessibleUserIdsCache, logAccountHistory } from '$lib/utils/functions.js';
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import FormButton from '$lib/components/FormButton.svelte';
	import * as Field from '$lib/components/ui/field/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { toast } from 'svelte-sonner';
	import pb from '$lib/pocketbase';

	let { open = $bindable() } = $props();

	let code = $state('');

	const submitInvite = async (e) => {
		e.preventDefault();
		try {
			if (code.length !== 6) {
				toast.error('Enter a valid 6-digit code');
				return;
			}

			const currentUserId = pb.authStore.record?.id;

			// create invite
			const sharedInvite = await pb.collection('shared_invites').create({
				from_user: currentUserId,
				from_name: pb.authStore.record.name,
				status: 'pending',
				code: code,
				$autoCancel: false
			});

			// find user by invite code
			const target = await pb.collection('users').getFirstListItem('', {
				filter: `invite_code="${code}"`,
				requestKey: null, // optional
				$autoCancel: false,
				query: {
					invite_code: code
				}
			});

			if (!target) {
				toast.error('Invalid invite code');
				return;
			}

			if (target.id === currentUserId) {
				toast.error('You cannot invite yourself');
				return;
			}

			// prevent duplicates
			const existing = await pb.collection('shared_invites').getFullList({
				filter: `from_user="${currentUserId}" && to_user="${target.id}"`,
				$autoCancel: false
			});

			if (existing.length > 0) {
				toast.error('Already connected');
				return;
			}

			// update invite
			await pb.collection('shared_invites').update(sharedInvite.id, {
				to_name: target.name,
				to_user: target.id,
				$autoCancel: false
			});

			await logAccountHistory({
				type: 'invite_sent',
				title: `Sent invite to ${target.name}`,
				meta: {
					to_user: target.id
				}
			});

			resetAccessibleUserIdsCache();

			toast.success('Invite sent!');

			open = false;
			code = '';
		} catch (err) {
			console.error(err);
			toast.error('Failed to send invite');
		}
	};
</script>

<Dialog.Content bind:open showCloseButton={false} class="p-5">
	<form onsubmit={submitInvite}>
		<Dialog.Header class="text-center">
			<Dialog.Title class="text-preset-5-semibold">Enter Account Code</Dialog.Title>
		</Dialog.Header>
		<Field.Group>
			<Field.Field class="mb-12">
				<Field.Label for="invite_code" class="sr-only">Account Code</Field.Label>
				<InputOTP.Root
					maxlength={6}
					bind:value={code}
					id="invite_code"
					class="mt-10 mb-3 items-center justify-center"
					required
				>
					{#snippet children({ cells })}
						<InputOTP.Group
							class="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border"
						>
							{#each cells as cell (cell)}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
					{/snippet}
				</InputOTP.Root>
				<Field.Description class="text-center">Enter the 6-digit code to invite.</Field.Description>
			</Field.Field>
		</Field.Group>
		<Dialog.Footer>
			<Dialog.Close
				type="button"
				class="h-13 flex-1 cursor-pointer rounded-lg border border-grey-300 bg-transparent px-6 font-medium md:hover:bg-grey-900 md:dark:hover:bg-gray-200"
			>
				Cancel
			</Dialog.Close>
			<FormButton disableButton={false} text="Send" class="flex-1" />
		</Dialog.Footer>
	</form>
</Dialog.Content>
