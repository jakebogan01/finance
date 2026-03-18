<script>
	import { passwordField } from '$lib/snippets/PasswordField.svelte';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { authSchema, nameSchema } from '$lib/utils/schemas.js';
	import FormButton from '$lib/components/FormButton.svelte';
	import { DASHBOARD } from '$lib/utils/constants.js';
	import { validator } from '@felte/validator-zod';
	import reporterDom from '@felte/reporter-dom';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import pb from '$lib/pocketbase.js';
	import { createForm } from 'felte';
	import * as zod from 'zod';

	const schema = authSchema
		.merge(nameSchema)
		.extend({
			passwordConfirm: zod.string()
		})
		.refine((data) => data.password === data.passwordConfirm, {
			message: 'Passwords must match',
			path: ['passwordConfirm']
		});

	const { form, reset, isSubmitting } = createForm({
		initialValues: {
			email: '',
			password: ''
		},
		extend: [validator({ schema: authSchema }), reporterDom()],
		onSubmit: async (values) => {
			try {
				await pb.collection('users').authWithPassword(values.email, values.password);
				await goto(resolve(DASHBOARD));
				toast.success('Successfully signed in!');
				reset();
			} catch (error) {
				console.dir(error?.response, { depth: null });
				toast.error(error?.message ?? 'Could not connect to the server');
			}
		}
	});
</script>

<div
	class="grid flex-1 gap-10 rounded-30 border border-grey-300 bg-grey-1000 p-5 lg:grid-cols-[3fr_4fr]"
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
				<FormButton {$isSubmitting}>
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
