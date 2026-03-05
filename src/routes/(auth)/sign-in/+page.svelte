<script module>
	import * as zod from 'zod';

	const schema = zod.object({
		email: zod
			.string({ required_error: 'Email address is required' })
			.trim()
			.toLowerCase()
			.min(1, { message: 'Email is required' })
			.max(254, { message: 'Email must be less than 255 characters' })
			.email({ message: 'Please enter a valid email address' }),
		password: zod
			.string({ required_error: 'Password is required' })
			.min(8, { message: 'Password must be at least 8 characters long' })
			.max(71, { message: 'Password must be less than 71 characters' })
	});
</script>

<script>
	import FormButton from '$lib/components/FormButton.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Password from '$lib/components/ui/password';
	import { validator } from '@felte/validator-zod';
	import reporterDom from '@felte/reporter-dom';
	import { resolve } from '$app/paths';
	import pb from '$lib/pocketbase.js';
	import { createForm } from 'felte';
	import FieldErrors from '$lib/components/FieldErrors.svelte';

	const { form, reset } = createForm({
		initialValues: {
			email: null,
			password: null
		},
		extend: [validator({ schema }), reporterDom()],
		onSubmit: async (values) => {
			try {
				await pb.collection('users').authWithPassword(values.email, values.password);
				reset();
			} catch (error) {
				console.dir(error?.response, { depth: null });
			}
		}
	});
</script>

<form class="space-y-6" use:form>
	<div>
		<label for="email" class="sr-only">Email address</label>
		<Input
			type="email"
			id="email"
			name="email"
			placeholder="Email Address"
			autocomplete="email"
			minlength={1}
			maxlength={255}
			required
		/>
		<FieldErrors ref="email" />
	</div>

	<div>
		<label for="password" class="sr-only">Password</label>
		<Password.Root>
			<Password.Input
				id="password"
				name="password"
				placeholder="Password"
				autocomplete="current-password"
				minlength={1}
				maxlength={71}
				required
			>
				<Password.ToggleVisibility />
			</Password.Input>
		</Password.Root>
		<FieldErrors ref="password" />
	</div>

	<div class="space-y-5">
		<div>
			<FormButton class="w-full">Sign in</FormButton>
		</div>

		<p class="text-preset-2 text-center text-grey-50">
			Don't have an account?
			<a href={resolve('/sign-up')} class="md:transition-colors md:hover:text-yellow-200">
				Sign up
			</a>
		</p>
	</div>
</form>
