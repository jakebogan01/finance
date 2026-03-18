<script>
	import { passwordField } from '$lib/snippets/PasswordField.svelte';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { updatePasswordSchema } from '$lib/utils/schemas.js';
	import FormButton from '$lib/components/FormButton.svelte';
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
	class="grid flex-1 gap-10 rounded-30 border border-grey-300 bg-grey-1000 p-5 sm:grid-cols-[3fr_4fr]"
>
	<div>
		<h3 class="text-preset-5-semibold">Change Password</h3>
		<p class="text-preset-2 mt-2 text-grey-50">
			Update your password associated with your account.
		</p>
	</div>
	<div>
		<form class="space-y-5" use:form>
			{@render passwordField('Password', 'password', true, 'current-password')}
			{@render passwordField('Confirm Password', 'passwordConfirm', false, 'current-password')}
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
