<script>
	import { updatePasswordSchema } from '$lib/utils/schemas.js';
	import FormButton from '$lib/components/FormButton.svelte';
	import FormField from '$lib/components/FormField.svelte';
	import * as Password from '$lib/components/ui/password';
	import { SIGNIN } from '$lib/utils/constants.js';
	import { validator } from '@felte/validator-zod';
	import reporterDom from '@felte/reporter-dom';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import pb from '$lib/pocketbase.js';
	import { createForm } from 'felte';
	import * as zod from 'zod';

	const schema = updatePasswordSchema
		.extend({
			passwordConfirm: zod.string()
		})
		.refine((data) => data.password === data.passwordConfirm, {
			message: 'Passwords must match',
			path: ['passwordConfirm']
		});

	const { form, isSubmitting } = createForm({
		initialValues: {
			password: '',
			passwordConfirm: ''
		},
		extend: [validator({ schema }), reporterDom()],
		onSubmit: async (values) => {
			try {
				const res = await fetch('/api/account/update-password', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						userId: pb.authStore.record.id,
						password: values.password,
						passwordConfirm: values.passwordConfirm
					})
				});

				const result = await res.json();
				if (res.ok) {
					pb.authStore.clear();
					await goto(resolve(SIGNIN));
					toast.success('Successfully updated password!');
				} else {
					console.error('Failed to update password:', result.error);
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
		<h3 class="font-semibold sm:text-lg lg:text-xl dark:text-grey-600">Change Password</h3>
		<p class="mt-2 text-grey-50">Update your password that is associated with your account.</p>
	</div>
	<div>
		<form class="space-y-5" use:form>
			<FormField id="password" name="password" label="Password">
				<Password.Root>
					<Password.Input
						id="password"
						name="password"
						placeholder="Password"
						autocomplete="new-password"
						maxLength="71"
						minLength="1"
					>
						<Password.ToggleVisibility />
					</Password.Input>
					<Password.Strength />
				</Password.Root>
			</FormField>
			<FormField id="passwordConfirm" name="passwordConfirm" label="Confirm Password">
				<Password.Root>
					<Password.Input
						id="passwordConfirm"
						name="passwordConfirm"
						placeholder="Confirm Password"
						autocomplete="new-password"
						maxLength="71"
						minLength="1"
					>
						<Password.ToggleVisibility />
					</Password.Input>
				</Password.Root>
			</FormField>
			<div class="mt-0 flex justify-end 2xl:mt-10">
				<FormButton {$isSubmitting} text="Update" class="w-full sm:w-auto" />
			</div>
		</form>
	</div>
</div>
