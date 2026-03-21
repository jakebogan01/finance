<script>
	import MoveLeftIcon from '@lucide/svelte/icons/move-left';
	import img from '$lib/assets/images/radiant-swirl.webp';
	import { DASHBOARD } from '$lib/utils/constants.js';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	onMount(() => {
		document.body.classList.add('auth-bg');
		return () => document.body.classList.remove('auth-bg');
	});
</script>

<div class="flex min-h-full flex-1">
	<div class="flex flex-1 flex-col justify-center px-4 py-12 lg:flex-none lg:px-24">
		<div class="mx-auto w-full max-w-sm space-y-13.5 lg:w-96">
			<div class="space-y-2">
				<span class="text-grey-50">{page.status}</span>
				<h2 class="text-preset-8-bold">{page.error.message}</h2>
				{#if page.status === 404}
					<p>Sorry, couldn't find the page you're looking for.</p>
				{/if}
				<a
					href={resolve(DASHBOARD)}
					aria-label="Return home"
					class="flex items-center gap-2 pt-4 text-grey-50 md:transition-colors md:hover:text-white-0"
				>
					<MoveLeftIcon class="size-4" />
					Back to home
				</a>
			</div>
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
