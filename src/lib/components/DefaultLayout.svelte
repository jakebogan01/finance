<script>
	import img from '$lib/assets/images/radiant-swirl.webp';
	import { onMount } from 'svelte';

	let { children, content } = $props();

	onMount(() => {
		document.body.classList.add('auth-bg');
		return () => document.body.classList.remove('auth-bg');
	});
</script>

<div class="flex min-h-full flex-1">
	<div class="flex flex-1 flex-col justify-center px-4 py-12 lg:flex-none lg:px-24">
		<div class="mx-auto w-full max-w-sm space-y-13.5 lg:w-96">
			<div class="space-y-2">
				{@render content?.()}
			</div>
			{@render children?.()}
		</div>
	</div>
	<div class="relative hidden w-0 flex-1 lg:block">
		<img
			src={img}
			alt="Inside a swirling cave"
			class="pointer-events-none absolute inset-0 size-full object-cover object-left"
		/>
	</div>
</div>
