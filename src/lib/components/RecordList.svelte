<script>
	import { INCOMESLUG } from '$lib/stores/incomeSlug.svelte';
	import { usdFormatter } from '$lib/utils/misc.js';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let { data } = $props();

	onMount(() => {
		if (page.url.hash && !INCOMESLUG.value) INCOMESLUG.value = page.url.hash;
	});

	const handleSlug = (slug) => (INCOMESLUG.value = `#${slug}`);
</script>

<div
	class="flex max-h-182 flex-col space-y-4 overflow-hidden rounded-2xl border border-grey-300 bg-grey-1000 px-2.5 py-4 sm:px-4 lg:flex-1"
>
	<h3 class="text-preset-2">Income</h3>
	<div class="flex flex-col overflow-y-auto lg:flex-1">
		<ul role="list" class="relative space-y-1.5 rounded-2xl bg-grey-400 p-1.5 sm:p-2.5 lg:flex-1">
			{#each data as item (item?.id)}
				<li
					class="relative flex items-center justify-between overflow-hidden rounded-2xl border-2 bg-grey-900 px-4 py-4 sm:px-6 sm:py-5 md:transition-colors md:duration-300 {page
						.url.hash === `#${item?.slug}`
						? 'border-yellow-200'
						: 'border-grey-900 md:hover:border-yellow-100'}"
				>
					<div class="flex min-w-0 gap-x-4 sm:gap-x-7">
						<div
							class="relative flex size-12.5 flex-none items-center justify-center rounded-full bg-yellow-100"
						>
							<span class="text-preset-6-bold text-grey-600">{item?.company_name[0]}</span>
							<div
								class="absolute top-7.5 -right-1.5 flex size-7.5 items-center justify-center rounded-full bg-grey-1100"
							>
								<span class="text-preset-1 text-white-0">JB</span>
							</div>
						</div>
						<div class="min-w-0 flex-auto">
							<p class="text-preset-3-medium truncate">
								<a href={`#${item?.slug}`} onclick={() => handleSlug(item?.slug)}>
									<span class="absolute inset-x-0 -top-px bottom-0"></span>
									{item?.company_name}
								</a>
							</p>
							<p>
								{usdFormatter.format(item?.income)}
								<span class="text-preset-1 text-grey-50 capitalize">{item?.recurring}</span>
							</p>
						</div>
					</div>
					<div
						class="flex size-3 flex-none shrink-0 flex-col items-end rounded-full {item?.status
							? 'bg-green-200'
							: 'bg-red-200'}"
					></div>
				</li>
			{/each}
		</ul>
	</div>
</div>
