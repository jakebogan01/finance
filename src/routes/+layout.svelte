<script>
	import './layout.css';
	import '@tailwindplus/elements';
	import { Toaster } from 'svelte-sonner';
	import favicon from '$lib/assets/favicon.svg';
	import { afterNavigate } from '$app/navigation';

	let { children } = $props();

	afterNavigate(() => {
		requestAnimationFrame(() => {
			window.scrollTo(0, 0);
		});
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
<Toaster richColors toastOptions={{ classes: { title: 'font-poppins! text-base!' } }} />
