<script>
	import FormButton from '$lib/components/FormButton.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import FormField from '$lib/components/FormField.svelte';
	import * as Password from '$lib/components/ui/password';

	let {
		form,
		disableButton,
		belowFormButton,
		buttonText,
		strongPassword,
		nameField,
		passwordConfirmField
	} = $props();
</script>

<form class="space-y-6" use:form>
	{@render nameField?.()}
	<FormField id="email" name="email" label="Email Address">
		<Input
			type="email"
			id="email"
			name="email"
			placeholder="Email Address"
			autocomplete="email"
			maxLength="255"
			minLength="1"
			inputmode="email"
		/>
	</FormField>
	<FormField id="password" name="password" label="Password">
		<Password.Root>
			<Password.Input
				id="password"
				name="password"
				placeholder="Password"
				autocomplete={strongPassword ? 'new-password' : 'current-password'}
				maxLength="71"
				minLength="1"
			>
				<Password.ToggleVisibility />
			</Password.Input>
			{#if strongPassword}
				<Password.Strength />
			{/if}
		</Password.Root>
	</FormField>
	{@render passwordConfirmField?.()}
	<div class="space-y-5">
		<FormButton {disableButton} text={buttonText} class="w-full" />
		<p class="text-preset-2 text-center text-grey-50">
			{@render belowFormButton?.()}
		</p>
	</div>
</form>
