<script module>
	export { inputField };
</script>

<script>
	import FieldErrors from '$lib/components/FieldErrors.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { onlyNumbers, unformatCurrency, formatCurrency } from '$lib/utils/misc.js';
</script>

{#snippet inputField(placeholder, name, autocomplete = 'off', type = 'text', isCurrency = false)}
	<div>
		<label for={name} class="sr-only">{placeholder}</label>
		{#if isCurrency}
			<Input
				{type}
				id={name}
				{name}
				{placeholder}
				{autocomplete}
				oninput={onlyNumbers}
				onfocus={unformatCurrency}
				onblur={formatCurrency}
			/>
		{:else}
			<Input {type} id={name} {name} {placeholder} {autocomplete} />
		{/if}
		<FieldErrors ref={name} />
	</div>
{/snippet}
