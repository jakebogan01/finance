<script>
	import { authSchema, nameSchema } from '$lib/utils/schemas.js';
	import { SIGNIN, DASHBOARD } from '$lib/utils/constants.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import FormField from '$lib/components/FormField.svelte';
	import * as Password from '$lib/components/ui/password';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import { authCheck } from '$lib/utils/functions.js';
	import { validator } from '@felte/validator-zod';
	import Head from '$lib/components/Head.svelte';
	import reporterDom from '@felte/reporter-dom';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import pb from '$lib/pocketbase.js';
	import { createForm } from 'felte';
	import { onMount } from 'svelte';
	import * as zod from 'zod';

	onMount(() => authCheck());

	let props = {
		buttonText: 'Sign up',
		strongPassword: true
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
				await toast.success('Account successfully created!');
				reset();
			} catch (error) {
				console.dir(error?.response, { depth: null });
				toast.error(error?.message ?? 'Could not connect to the server');
			}
		}
	});
</script>

<Head
	page_title="Finance | Sign up"
	description="Create your Finance account to start tracking income, expenses, and budgets in a simple, collaborative dashboard built for full control over your finances."
/>

<div class="space-y-2">
	<h2 class="text-preset-8-bold">Sign up</h2>
	<p class="text-grey-50">Keeping track of your finances starts here.</p>
</div>

<AuthForm {form} disableButton={$isSubmitting} {...props}>
	{#snippet nameField()}
		<FormField id="name" name="name" label="Name">
			<Input type="text" id="name" name="name" placeholder="Name" autocomplete="name" />
		</FormField>
	{/snippet}
	{#snippet passwordConfirmField()}
		<FormField id="passwordConfirm" name="passwordConfirm" label="Confirm Password">
			<Password.Root>
				<Password.Input
					id="passwordConfirm"
					name="passwordConfirm"
					placeholder="Confirm Password"
					autocomplete="new-password"
				>
					<Password.ToggleVisibility />
				</Password.Input>
			</Password.Root>
		</FormField>
	{/snippet}
	{#snippet belowFormButton()}
		Already have an account?
		<a href={resolve(SIGNIN)} class="md:transition-colors md:hover:text-yellow-200"> Sign in </a>
	{/snippet}
</AuthForm>
