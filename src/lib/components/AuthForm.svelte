<script>
	import FieldErrors from '$lib/components/FieldErrors.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Password from '$lib/components/ui/password';
	import { resolve } from '$app/paths';

	let { form, nameField, passwordConfirmField, ...props } = $props();
</script>

<form class="space-y-6" use:form>
	{@render nameField?.()}
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
			{#if props.useStrongPassword}
				<Password.Strength />
			{/if}
		</Password.Root>
		<FieldErrors ref="password" />
	</div>

	{@render passwordConfirmField?.()}

	<div class="space-y-5">
		<div>
			<FormButton class="w-full">{props.buttonText}</FormButton>
		</div>

		<p class="text-preset-2 text-center text-grey-50">
			Don't have an account?
			<a href={resolve(props.link)} class="md:transition-colors md:hover:text-yellow-200">
				{props.linkText}
			</a>
		</p>
	</div>
</form>
