<script>
	import FieldErrors from '$lib/components/FieldErrors.svelte';

	let { children, id, name, label } = $props();
</script>

<div>
	{#if label}
		<label for={id} class="sr-only">{label}</label>
	{/if}
	{@render children?.()}
	<FieldErrors ref={name} />
</div>
