<script>
	import FormButton from '$lib/components/FormButton.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Password from '$lib/components/ui/password';
	import { resolve } from '$app/paths';
	import pb from '$lib/pocketbase.js';
	import { createForm } from 'felte';

	const { form, reset } = createForm({
		initialValues: {
			email: null,
			password: null
		},
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
	</div>

	<div>
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
	</div>

	<div class="space-y-5">
		<div>
			<FormButton class="w-full">Sign in</FormButton>
		</div>

		<p class="text-preset-2 text-center text-grey-50">
			Don't have an account?
			<a href={resolve('/sign-up')} class="md:transition-colors md:hover:text-yellow-200">Sign up</a
			>
		</p>
	</div>
</form>
