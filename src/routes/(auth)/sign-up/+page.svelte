<script>
	import { passwordField } from '$lib/snippets/PasswordField.svelte';
	import { authSchema, nameSchema } from '$lib/utils/schemas.js';
	import { inputField } from '$lib/snippets/InputField.svelte';
	import { DASHBOARD, SIGNIN } from '$lib/utils/constants.js';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import { validator } from '@felte/validator-zod';
	import reporterDom from '@felte/reporter-dom';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import pb from '$lib/pocketbase.js';
	import { createForm } from 'felte';
	import * as zod from 'zod';

	let props = {
		linkText: 'Sign in',
		link: SIGNIN,
		preLinkText: 'Already have an account?',
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

	const { form, reset, isSubmitting } = createForm({
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
				await goto(resolve(DASHBOARD));
				toast.success('Account successfully created!');
				reset();
			} catch (error) {
				console.dir(error?.response, { depth: null });
			}
		}
	});
</script>

<AuthForm {form} disableButton={$isSubmitting} {...props}>
	{#snippet nameField()}
		{@render inputField('Name', 'name', 'name')}
	{/snippet}
	{#snippet passwordConfirmField()}
		{@render passwordField('Confirm Password', 'passwordConfirm', false, 'current-password')}
	{/snippet}
</AuthForm>
