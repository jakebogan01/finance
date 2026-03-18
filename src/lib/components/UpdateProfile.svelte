<script>
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { inputField } from '$lib/snippets/InputField.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import { USERNAME } from '$lib/stores/userName.svelte.js';
	import { profileSchema } from '$lib/utils/schemas.js';
	import { cleanObject } from '$lib/utils/misc.js';
	import { validator } from '@felte/validator-zod';
	import { SIGNIN } from '$lib/utils/constants.js';
	import reporterDom from '@felte/reporter-dom';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import pb from '$lib/pocketbase.js';
	import { createForm } from 'felte';

	const { form, isSubmitting } = createForm({
		initialValues: {
			name: pb.authStore.record.name,
			email: pb.authStore.record.email
		},
		extend: [validator({ schema: profileSchema }), reporterDom()],
		onSubmit: async (values) => {
			try {
				if (values.name.length === 0 && values.email.length === 0) {
					return;
				}
				const cleanValues = cleanObject(values);

				if (cleanValues?.name?.length > 0 && cleanValues?.name !== pb.authStore.record.name) {
					await pb.collection('users').update(pb.authStore.record.id, { name: cleanValues.name });
					USERNAME.value = values.name;
				}

				if (cleanValues?.email?.length > 0 && cleanValues?.email !== pb.authStore.record.email) {
					const res = await fetch('/api/account/update-email', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							userId: pb.authStore.record.id,
							newEmail: cleanValues.email
						})
					});
					const result = await res.json();
					if (res.ok) {
						pb.authStore.clear();
						await goto(resolve(SIGNIN));
						toast.success('Successfully updated email!');
					} else {
						console.error('Failed to update email:', result.error);
					}
				}
			} catch (error) {
				console.dir(error?.response, { depth: null });
				toast.error(error?.message ?? 'Could not connect to the server');
			}
		}
	});
</script>

<div
	class="grid flex-1 gap-10 rounded-30 border border-grey-300 bg-grey-1000 p-5 sm:grid-cols-[3fr_4fr]"
>
	<div>
		<h3 class="text-preset-5-semibold">Personal Information</h3>
		<p class="text-preset-2 mt-2 text-grey-50">
			Manage how information is displayed on your account.
		</p>
	</div>
	<div>
		<form class="space-y-5" use:form>
			{@render inputField('Update Name', 'name', 'name')}
			{@render inputField('Update Email Address', 'email', 'email', 'email', false, 'email')}
			<div class="flex justify-end">
				<FormButton disableButton={$isSubmitting} class="w-full sm:w-auto">
					{#if $isSubmitting}
						<Spinner />
						Validating...
					{:else}
						Update
					{/if}
				</FormButton>
			</div>
		</form>
	</div>
</div>
