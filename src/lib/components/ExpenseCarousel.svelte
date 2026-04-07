<script>
	import { usdFormatter, getAvatarColor } from '$lib/utils/functions.js';
	import { expenseStore } from '$lib/stores/expenseStore.svelte.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { EXPENSES } from '$lib/utils/constants';
	import { resolve } from '$app/paths';

	let { ref = $bindable(null), ...restProps } = $props();
</script>

<Carousel.Content class="ms-0 -mr-5">
	{#each expenseStore.allExpenses as item, i (item?.id)}
		<Command.Item
			class="min-100:basis-1/2 imtess min-w-0 shrink-0 grow-0 basis-1/2 ps-0 pr-5 sm:basis-1/3 md:basis-1/3"
			bind:this={ref}
			data-slot="carousel-item"
			role="group"
			aria-roledescription="slide"
			data-embla-slide=""
			{...restProps}
		>
			<Card.Root
				class="rounded-2xl border border-grey-300 bg-grey-1000 py-0! sm:rounded-20 md:transition-colors md:duration-300 md:hover:border-yellow-200 dark:bg-white-0"
			>
				<Card.Content class="px-0!">
					<a href={resolve(`${EXPENSES}#${item?.slug}`)} class="flex flex-col space-y-5 p-4 sm:p-5">
						<div class="size-12.5 rounded-full {getAvatarColor(i)}"></div>
						<div>
							<p class="text-preset-4 truncate text-white-0 dark:text-gray-900">{item?.title}</p>
							<p class="text-grey-50 dark:text-gray-900">
								{usdFormatter.format(item?.expand?.current_history?.amount)}
							</p>
						</div>
					</a>
				</Card.Content>
			</Card.Root>
		</Command.Item>
	{/each}
	<Command.Empty class="flex-1 text-center">No results found.</Command.Empty>
</Carousel.Content>
