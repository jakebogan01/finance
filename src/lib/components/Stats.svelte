<script>
	import BanknoteArrowDownIcon from '@lucide/svelte/icons/banknote-arrow-down';
	import BanknoteArrowUpIcon from '@lucide/svelte/icons/banknote-arrow-up';
	import { expenseStore } from '$lib/stores/expenseStore.svelte.js';
	import { incomeStore } from '$lib/stores/incomeStore.svelte.js';
	import { usdFormatter } from '$lib/utils/functions.js';

	const stats = $derived([
		{
			title: 'Total Income',
			icon: BanknoteArrowUpIcon,
			sum: incomeStore.userTotal
		},
		{
			title: 'Total Expenses',
			icon: BanknoteArrowDownIcon,
			sum: expenseStore.userTotal
		}
	]);
</script>

<div>
	<h3 class="sr-only">Stats</h3>
	<dl class="grid-cols-full mt-5 grid gap-5 sm:grid-cols-2">
		{#each stats as { title, icon: Icon, sum }, i (i)}
			<div
				class="relative overflow-hidden rounded-2xl border border-grey-300 bg-grey-1000 p-5 dark:border-grey-300 dark:bg-white-0"
			>
				<dt>
					<div class="absolute rounded-md bg-yellow-200 p-3">
						<Icon class="size-6 text-grey-600 dark:text-white-0" />
					</div>
					<p class="text-preset-2 ml-16 truncate font-medium text-grey-50 dark:text-grey-500">
						{title}
					</p>
					<p class="text-preset-5-semibold ml-16 dark:text-grey-900">{usdFormatter.format(sum)}</p>
				</dt>
			</div>
		{/each}
	</dl>
</div>
