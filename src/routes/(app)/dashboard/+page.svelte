<script>
	import { authCheck, filterStatus, sortRecords, usdFormatter } from '$lib/utils/misc';
	import OpenFormButton from '$lib/components/OpenFormButton.svelte';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import SearchExpand from '$lib/components/SearchExpand.svelte';
	import { EXPENSESLUG } from '$lib/stores/expenseSlug.svelte.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { EXPENSES, SIGNIN } from '$lib/utils/constants';
	import { expensesSchema } from '$lib/utils/schemas.js';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

	let { data } = $props();

	onMount(() => authCheck(303, SIGNIN, true));

	let filters = $state({
		status: 'all',
		sort: 'latest'
	});
	let dataList = $derived.by(() => {
		if (!data?.expenseRecords) return [];
		let list = [...data.expenseRecords];
		list = filterStatus(list, filters.status);
		list = sortRecords(list, filters.sort);
		return list;
	});

	let handleEditRecord;
	let expenseRecord = $derived.by(() => {
		if (!EXPENSESLUG.value) return null;
		if (!dataList || dataList.length === 0) return null;
		const slug = EXPENSESLUG.value.replace(/#/g, '');
		return dataList.find((item) => item.slug === slug) ?? {};
	});
</script>

<section class="min-w-0 space-y-5">
	<Carousel.Root class="space-y-5 ">
		<Command.Root class="space-y-5 bg-transparent text-white-0">
			<div class="flex items-center justify-between gap-5">
				<OpenFormButton
					title="Create Expenses"
					schema={expensesSchema}
					bind:handleEditRecord
					multiStepForm={false}
					data={expenseRecord}
				/>
				<div class="flex items-center">
					<Carousel.Previous class="mr-5" />
					<Carousel.Next class="md:mr-5" />
					<SearchExpand class="hidden md:flex" />
				</div>
			</div>
			<Carousel.Content class="ms-0 -mr-5">
				{#each dataList as item (item?.id)}
					<Carousel.Item class="min-100:basis-1/2 ps-0 pr-5 sm:basis-1/3 md:basis-1/3">
						<div>
							<Card.Root
								class="rounded-2xl border border-grey-300 bg-grey-1000 py-0! sm:rounded-30 md:transition-colors md:duration-300 md:hover:border-yellow-200"
							>
								<Card.Content class="px-0!">
									<a
										href={resolve(`${EXPENSES}#${item?.slug}`)}
										class="flex flex-col space-y-6 p-4 sm:p-5"
									>
										<div class="size-12.5 rounded-full bg-yellow-100"></div>
										<div>
											<p>{item?.title}</p>
											<p class="text-preset-2 text-grey-50">
												{usdFormatter.format(item?.expand?.current_history?.amount)}
											</p>
										</div>
									</a>
								</Card.Content>
							</Card.Root>
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
		</Command.Root>
	</Carousel.Root>
</section>
<section class="flex max-h-168.5 flex-col space-y-5"></section>
