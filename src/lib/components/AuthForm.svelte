<script>
	import { passwordField } from '$lib/snippets/PasswordField.svelte';
	import { inputField } from '$lib/snippets/InputField.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import { resolve } from '$app/paths';

	let { form, nameField, passwordConfirmField, ...props } = $props();
</script>

<form class="space-y-6" use:form>
	{@render nameField?.()}
	{@render inputField('Email Address', 'email', 'email', 'email')}
	{@render passwordField('Password', 'password', props.useStrongPassword, 'current-password')}
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
