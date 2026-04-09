<script>
	import { cleanObject, getChangedFields, logAccountHistory } from '$lib/utils/functions.js';
	import FormButton from '$lib/components/FormButton.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import FormField from '$lib/components/FormField.svelte';
	import { profileSchema } from '$lib/utils/schemas.js';
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
			name: pb.authStore.record?.name,
			email: pb.authStore.record?.email
		},
		extend: [validator({ schema: profileSchema }), reporterDom()],
		onSubmit: async (values) => {
			try {
				if (values.name.length === 0 && values.email.length === 0) {
					return;
				}
				const cleanValues = cleanObject(values);

				if (cleanValues?.name?.length > 0 && cleanValues?.name !== pb.authStore.record.name) {
					const updatedUser = await pb
						.collection('users')
						.update(pb.authStore.record.id, { name: cleanValues.name });
					pb.authStore.save(pb.authStore.token, updatedUser);
					const changes = getChangedFields(
						{ name: pb.authStore.record?.name },
						{ name: values?.name }
					);
					if (Object.keys(changes).length > 0) {
						await logAccountHistory({
							type: 'profile_update',
							title: `Updated account name`,
							meta: changes
						});
					}
				}

				if (cleanValues?.email?.length > 0 && cleanValues?.email !== pb.authStore.record?.email) {
					const res = await fetch('/api/account/update-email', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							userId: pb.authStore.record?.id,
							newEmail: cleanValues.email
						})
					});
					const result = await res.json();
					if (res.ok) {
						const changes = getChangedFields(
							{ email: pb.authStore.record?.email },
							{ email: values?.email }
						);
						if (Object.keys(changes).length > 0) {
							await logAccountHistory({
								type: 'profile_update',
								title: `Updated account email`,
								meta: changes
							});
						}
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
	class="grid gap-10 overflow-hidden rounded-2xl border border-grey-300 bg-grey-1000 p-4 sm:grid-cols-[3fr_4fr] sm:rounded-20 sm:p-5 dark:border-grey-300 dark:bg-white-0"
>
	<div>
		<h3 class="font-semibold sm:text-lg lg:text-xl dark:text-grey-600">Personal Information</h3>
		<p class="mt-2 text-grey-50">Manage how information is displayed on your account.</p>
	</div>
	<div>
		<form class="space-y-5" use:form>
			<FormField id="name" name="name" label="Name">
				<Input
					type="text"
					id="name"
					name="name"
					placeholder="Name"
					autocomplete="name"
					maxLength="255"
					minLength="1"
				/>
			</FormField>
			<FormField id="email" name="email" label="Email Address">
				<Input
					type="email"
					id="email"
					name="email"
					placeholder="Email Address"
					autocomplete="email"
					maxLength="255"
					minLength="1"
					inputmode="email"
				/>
			</FormField>
			<div class="mt-0 flex justify-end 2xl:mt-10">
				<FormButton {$isSubmitting} text="Update" class="w-full sm:w-auto" />
			</div>
		</form>
	</div>
</div>
