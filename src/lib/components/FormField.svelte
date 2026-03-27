<script>
	import FieldErrors from '$lib/components/FieldErrors.svelte';

	let { children, id, name, label, class: className = 'col-span-full' } = $props();
</script>

<div class={className}>
	{#if label}
		<label for={id} class="sr-only">{label}</label>
	{/if}
	{@render children?.()}
	<FieldErrors ref={name} />
</div>
