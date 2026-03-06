<script>
	import './layout.css';
	import '@tailwindplus/elements';
	import { Toaster } from 'svelte-sonner';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
<Toaster richColors toastOptions={{ classes: { title: 'font-poppins! text-base!' } }} />
