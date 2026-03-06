<script module>
	export { inputField };
</script>

<script>
	import FieldErrors from '$lib/components/FieldErrors.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
</script>

{#snippet inputField(placeholder, name, autocomplete = 'off', type = 'text')}
	<div>
		<label for={name} class="sr-only">{placeholder}</label>
		<Input {type} id={name} {name} {placeholder} {autocomplete} />
		<FieldErrors ref={name} />
	</div>
{/snippet}
