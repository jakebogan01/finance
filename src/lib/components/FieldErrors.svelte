<script>
	let { ref } = $props();
</script>

<div
	id="{ref}-validation"
	class="mt-1.5 text-sm text-red-400"
	data-felte-reporter-dom-for={ref}
	aria-live="polite"
	data-felte-reporter-dom-single-message
></div>
