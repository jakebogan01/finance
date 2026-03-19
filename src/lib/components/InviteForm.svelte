<script>
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { inputField } from '$lib/snippets/InputField.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import { inviteSchema } from '$lib/utils/schemas.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { validator } from '@felte/validator-zod';
	import { invalidateAll } from '$app/navigation';
	import reporterDom from '@felte/reporter-dom';
	import { toast } from 'svelte-sonner';
	import pb from '$lib/pocketbase.js';
	import { createForm } from 'felte';

	let { open = $bindable() } = $props();

	const { form, reset, isSubmitting } = createForm({
		initialValues: { invite_code: '' },
		extend: [validator({ schema: inviteSchema }), reporterDom()],
		onSubmit: async (values) => {
			try {
				const currentUser = pb.authStore.record.id;

				const user = await pb
					.collection('users')
					.getFirstListItem(`invite_code="${values.invite_code}"`, { fields: 'id, name' });

				const existing = await pb.collection('shared_invites').getFullList({
					filter: `from_user="${currentUser}" && to_user="${user.id}"`
				});

				if (existing.length) {
					toast.error('Invite already sent');
					return;
				}

				if (!user) {
					toast.error('Invalid invite code');
					return;
				}

				if (user.id === currentUser) {
					toast.error('You cannot invite yourself');
					return;
				}

				await pb.collection('shared_invites').create({
					from_user: currentUser,
					from_name: pb.authStore.record.name,
					to_name: user.name,
					to_user: user.id,
					status: 'pending'
				});

				toast.success('Successfully sent invite!');
				await invalidateAll();
				reset();
				open = false;
			} catch (error) {
				console.dir(error?.response, { depth: null });
				toast.error(error?.message ?? 'Could not connect to the server');
			}
		}
	});
</script>

<Dialog.Content>
	<Dialog.Header>
		<Dialog.Title class="text-preset-5-semibold">Share Account</Dialog.Title>
	</Dialog.Header>
	<form class="space-y-6.5" use:form>
		{@render inputField('Invite Code', 'invite_code')}
		<Dialog.Footer>
			<Dialog.Close
				type="button"
				class="h-13 flex-1 cursor-pointer rounded-lg border border-grey-300 bg-transparent px-6 font-medium text-white-0 md:hover:bg-grey-900"
			>
				Cancel
			</Dialog.Close>
			<FormButton disableButton={$isSubmitting} class="flex-1">
				{#if $isSubmitting}
					<Spinner />
					Validating...
				{:else}
					Send
				{/if}
			</FormButton>
		</Dialog.Footer>
	</form>
</Dialog.Content>
