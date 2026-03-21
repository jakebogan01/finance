<script>
	import { page } from '$app/state';

	let { page_title = 'Finance', description = '' } = $props();
</script>

<svelte:head>
	<title>{page_title}</title>
	<meta name="description" content={description} />
	<meta property="og:url" content={page.url.href} />
	<meta property="og:description" content={description} />
	<link rel="canonical" href={page.url.href} />
</svelte:head>
