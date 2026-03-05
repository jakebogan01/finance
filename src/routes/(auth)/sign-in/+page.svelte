<script>
	import FormButton from '$lib/components/FormButton.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Password from '$lib/components/ui/password';
	import { resolve } from '$app/paths';
</script>

<form class="space-y-6">
	<div>
		<label for="email" class="sr-only">Email address</label>
		<Input
			type="email"
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
				value=""
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
