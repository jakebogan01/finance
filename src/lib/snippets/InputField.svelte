<script module>
	import FieldErrors from '$lib/components/FieldErrors.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { onlyNumbers, unformatCurrency, formatCurrency } from '$lib/utils/misc.js';
	export { inputField };
</script>

{#snippet inputField(
	placeholder,
	name,
	autocomplete = 'off',
	type = 'text',
	isCurrency = false,
	mode = 'text',
	zip = false
)}
	<div>
		<label for={name} class="sr-only">{placeholder}</label>
		{#if isCurrency}
			<Input
				{type}
				id={name}
				{name}
				{placeholder}
				{autocomplete}
				inputmode="numeric"
				pattern="[0-9]*"
				oninput={onlyNumbers}
				onfocus={unformatCurrency}
				onblur={formatCurrency}
			/>
		{:else if zip}
			<Input
				{type}
				id={name}
				{name}
				{placeholder}
				{autocomplete}
				inputmode={mode}
				oninput={onlyNumbers}
				pattern="[0-9]*"
			/>
		{:else}
			<Input {type} id={name} {name} {placeholder} {autocomplete} inputmode={mode} />
		{/if}
		<FieldErrors ref={name} />
	</div>
{/snippet}
