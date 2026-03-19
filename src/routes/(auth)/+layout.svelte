<script>
	import img from '$lib/assets/images/radiant-swirl.webp';
	import { SIGNUP } from '$lib/utils/constants';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	let { children } = $props();

	onMount(() => {
		document.body.classList.add('auth-bg');
		return () => document.body.classList.remove('auth-bg');
	});
</script>

<div class="flex min-h-full flex-1">
	<div class="flex flex-1 flex-col justify-center px-4 py-12 lg:flex-none lg:px-24">
		<div class="mx-auto w-full max-w-sm space-y-13.5 lg:w-96">
			<div class="space-y-2">
				{#if page.url.pathname === SIGNUP}
					{@render layoutHeading('Sign up', 'Keeping track of your finances starts here.')}
				{:else}
					{@render layoutHeading('Sign in', 'Manage your finances with confidence!')}
				{/if}
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

{#snippet layoutHeading(title, description)}
	<h2 class="text-preset-8-bold">{title}</h2>
	<p class="text-grey-50">{description}</p>
{/snippet}
