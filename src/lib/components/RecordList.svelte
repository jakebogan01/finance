<script>
	import { EXPENSESLUG } from '$lib/stores/expenseSlug.svelte.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { INCOMESLUG } from '$lib/stores/incomeSlug.svelte.js';
	import { usdFormatter } from '$lib/utils/misc.js';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let { data, handleURLSlug, title } = $props();

	onMount(() => {
		if ((page.url.hash && !INCOMESLUG.value) || (page.url.hash && !EXPENSESLUG.value))
			handleURLSlug(page.url.hash);
	});

	const handleSlug = (slug) => handleURLSlug(`#${slug}`);
</script>

<div
	class="flex max-h-182 flex-col space-y-4 overflow-hidden rounded-2xl border border-grey-300 bg-grey-1000 px-2.5 py-4 sm:px-4 lg:flex-1"
>
	<h3 class="text-preset-2">{title}</h3>
	<div class="flex flex-col overflow-y-auto lg:flex-1">
		<ul role="list" class="relative space-y-1.5 rounded-2xl bg-grey-400 p-1.5 sm:p-2.5 lg:flex-1">
			{#each data as item (item?.id)}
				<li>
					<Command.Item
						class="relative flex items-center justify-between overflow-hidden rounded-2xl border-2 bg-grey-900 px-4 py-4 sm:px-6 sm:py-5 md:transition-colors md:duration-300 {page
							.url.hash === `#${item?.slug}`
							? 'border-yellow-200'
							: 'border-grey-900 md:hover:border-yellow-100'}"
					>
						<div class="flex min-w-0 gap-x-4 sm:gap-x-7">
							<div
								class="relative flex size-12.5 flex-none items-center justify-center rounded-full bg-yellow-100"
							>
								<span class="text-preset-6-bold text-grey-600"
									>{item?.company_name?.[0] || item?.title?.[0]}</span
								>
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
										{item?.company_name || item?.title}
									</a>
								</p>
								<p>
									{usdFormatter.format(item?.income || item?.amount)}
									<span class="text-preset-1 text-grey-50 capitalize">{item?.recurring}</span>
								</p>
							</div>
						</div>
						<div
							class="flex size-3 flex-none shrink-0 flex-col items-end rounded-full {item?.status
								? 'bg-green-200'
								: 'bg-red-200'}"
						></div>
					</Command.Item>
				</li>
			{/each}
			<Command.Empty>No results found.</Command.Empty>
		</ul>
	</div>
</div>
