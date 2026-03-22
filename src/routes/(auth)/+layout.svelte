<script>
	import DefaultLayout from '$lib/components/DefaultLayout.svelte';

	let { children } = $props();
</script>

<DefaultLayout>
	{@render children?.()}
</DefaultLayout>
