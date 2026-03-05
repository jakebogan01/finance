<script>
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => document.body.classList.remove('auth-bg'));
</script>

{@render children()}
