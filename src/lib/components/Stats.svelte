<script>
	import BanknoteArrowDownIcon from '@lucide/svelte/icons/banknote-arrow-down';
	import BanknoteArrowUpIcon from '@lucide/svelte/icons/banknote-arrow-up';
	import { expenseStore } from '$lib/stores/expenseStore.svelte.js';
	import { EXPENSESLUG } from '$lib/stores/expenseSlug.svelte.js';
	import { incomeStore } from '$lib/stores/incomeStore.svelte.js';
	import { INCOMESLUG } from '$lib/stores/incomeSlug.svelte.js';
	import { EXPENSES, INCOME } from '$lib/utils/constants.js';
	import { usdFormatter } from '$lib/utils/functions.js';
	import { resolve } from '$app/paths';

	const stats = $derived([
		{
			title: 'Total Income',
			icon: BanknoteArrowUpIcon,
			sum: incomeStore.userTotal,
			link: INCOME + `${INCOMESLUG.value ?? ''}`
		},
		{
			title: 'Total Expenses',
			icon: BanknoteArrowDownIcon,
			sum: expenseStore.userTotal,
			link: EXPENSES + `${EXPENSESLUG.value ?? ''}`
		}
	]);
</script>

<div>
	<h3 class="sr-only">Stats</h3>
	<dl class="grid-cols-full grid gap-5 sm:grid-cols-2">
		{#each stats as { title, icon: Icon, sum, link }, i (i)}
			<div
				class="relative overflow-hidden rounded-2xl border border-grey-300 bg-grey-1000 p-4 sm:p-5 dark:border-grey-300 dark:bg-white-0"
			>
				<dt>
					<div class="absolute rounded-md p-3 {i % 2 === 0 ? 'bg-pink-200' : 'bg-blue-200'}">
						<Icon class="size-6 text-grey-600 dark:text-white-0" />
					</div>
					<p class="text-preset-2 ml-16 truncate font-medium text-grey-50 dark:text-grey-500">
						{title}
					</p>
					<p class="text-preset-5-semibold ml-16 dark:text-grey-900">{usdFormatter.format(sum)}</p>
				</dt>
				<dd class="pb-12 xl:hidden 2xl:block">
					<div
						class="absolute inset-x-0 bottom-0 bg-[#181818] md:transition-colors md:hover:bg-grey-600 dark:bg-gray-100 dark:md:hover:bg-gray-200"
					>
						<a
							href={resolve(link)}
							class="flex h-12 items-center justify-start px-4 text-sm text-grey-50 sm:h-12.5 sm:px-5 dark:text-grey-500"
							>View all<span class="sr-only"> Total Subscribers stats</span></a
						>
					</div>
				</dd>
			</div>
		{/each}
	</dl>
</div>
