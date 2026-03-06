<script>
	import { authSchema, nameSchema } from '$lib/utils/schemas.js';
	import FieldErrors from '$lib/components/FieldErrors.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Password from '$lib/components/ui/password';
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
		<div>
			<label for="name" class="sr-only">Your name</label>
			<Input
				type="text"
				id="name"
				name="name"
				placeholder="Name"
				autocomplete="name"
				minlength={1}
				maxlength={255}
				required
			/>
			<FieldErrors ref="name" />
		</div>
	{/snippet}
	{#snippet passwordConfirmField()}
		<div>
			<label for="passwordConfirm" class="sr-only">Confirm password</label>
			<Password.Root>
				<Password.Input
					id="passwordConfirm"
					name="passwordConfirm"
					placeholder="Confirm Password"
					autocomplete="current-password"
					minlength={1}
					maxlength={71}
					required
				>
					<Password.ToggleVisibility />
				</Password.Input>
			</Password.Root>
			<FieldErrors ref="passwordConfirm" />
		</div>
	{/snippet}
</AuthForm>
