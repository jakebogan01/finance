<script module>
	export { passwordField };
</script>

<script>
	import FieldErrors from '$lib/components/FieldErrors.svelte';
	import * as Password from '$lib/components/ui/password';
</script>

{#snippet passwordField(placeholder, name, useStrongPassword = false, autocomplete = 'off')}
	<div>
		<label for={name} class="sr-only">{placeholder}</label>
		<Password.Root>
			<Password.Input id={name} {name} {placeholder} {autocomplete}>
				<Password.ToggleVisibility />
			</Password.Input>
			{#if useStrongPassword}
				<Password.Strength />
			{/if}
		</Password.Root>
		<FieldErrors ref={name} />
	</div>
{/snippet}
