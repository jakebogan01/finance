<script>
	import { page } from '$app/state';

	let { page_title = null, description } = $props();
</script>

<svelte:head>
	<title>{page_title}</title>
	<meta name="description" content={description} />
	<meta property="og:url" content={page.url} />
	<meta property="og:description" content={description} />
</svelte:head>
