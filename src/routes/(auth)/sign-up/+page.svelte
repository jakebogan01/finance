<script>
	import { passwordField } from '$lib/snippets/PasswordField.svelte';
	import { authSchema, nameSchema } from '$lib/utils/schemas.js';
	import { inputField } from '$lib/snippets/InputField.svelte';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import { validator } from '@felte/validator-zod';
	import { SIGNIN } from '$lib/utils/constants.js';
	import reporterDom from '@felte/reporter-dom';
	import pb from '$lib/pocketbase.js';
	import { createForm } from 'felte';
	import * as zod from 'zod';

	let props = {
		linkText: 'Sign in',
		link: SIGNIN,
		buttonText: 'Sign up',
		useStrongPassword: true
	};

	const schema = authSchema
		.merge(nameSchema)
		.extend({
			passwordConfirm: zod.string()
		})
		.refine((data) => data.password === data.passwordConfirm, {
			message: 'Passwords must match',
			path: ['passwordConfirm']
		});

	const { form, reset } = createForm({
		initialValues: {
			name: '',
			email: '',
			password: '',
			passwordConfirm: ''
		},
		extend: [validator({ schema }), reporterDom()],
		onSubmit: async (values) => {
			try {
				await pb.collection('users').create(values);
				await pb.collection('users').authWithPassword(values.email, values.password);
				reset();
			} catch (error) {
				console.dir(error?.response, { depth: null });
			}
		}
	});
</script>

<AuthForm {form} {...props}>
	{#snippet nameField()}
		{@render inputField('Name', 'name', 'name')}
	{/snippet}
	{#snippet passwordConfirmField()}
		{@render passwordField('Confirm Password', 'passwordConfirm', false, 'current-password')}
	{/snippet}
</AuthForm>
