<script>
	import SearchCarouselButton from '$lib/components/SearchCarouselButton.svelte';
	import RemainingBalance from '$lib/components/RemainingBalance.svelte';
	import ExpenseCarousel from '$lib/components/ExpenseCarousel.svelte';
	import { expenseStore } from '$lib/stores/expenseStore.svelte.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import CreateButton from '$lib/components/CreateButton.svelte';
	import ExpenseForm from '$lib/components/ExpenseForm.svelte';
	import DisplayDate from '$lib/components/DisplayDate.svelte';
	import { authCheck } from '$lib/utils/functions.js';
	import MonthlyBudget from '$lib/components/MonthlyBudget.svelte';
	import Stats from '$lib/components/Stats.svelte';
	import { SIGNIN } from '$lib/utils/constants.js';
	import Head from '$lib/components/Head.svelte';
	import { onMount } from 'svelte';

	let open = $state(false);
	let resetForm = $state(false);
	let handleReset = $state(null);
	let checkNumOfExpenses = $derived(expenseStore.allExpenses.length > 3 ? '' : 'sm:hidden');

	onMount(() => authCheck(303, SIGNIN, true));
</script>

<Head
	page_title="Finance | Dashboard"
	description="View a complete overview of your finances with a clean dashboard showing income, expenses, and budget insights to help you stay on track."
/>

<section class="min-w-0 space-y-5">
	<Carousel.Root opts={{ align: 'start' }}>
		<Command.Root class="space-y-5 rounded-none bg-transparent dark:bg-transparent!">
			<div class="flex items-center justify-between gap-5">
				<div class="flex items-center gap-x-5">
					<CreateButton class="dark:bg-white-0" bind:handleReset bind:open buttonText="Add expense">
						<ExpenseForm bind:handleReset {resetForm} bind:open />
					</CreateButton>
					<DisplayDate />
				</div>
				<div class="flex items-center">
					<Carousel.Previous class="mr-5 dark:border-transparent {checkNumOfExpenses}" />
					<Carousel.Next class="md:mr-5 dark:border-transparent {checkNumOfExpenses}" />
					{#if expenseStore.allExpenses.length > 3}
						<SearchCarouselButton class="hidden md:flex" />
					{/if}
				</div>
			</div>
			{#if expenseStore.allExpenses.length}
				<ExpenseCarousel />
			{/if}
		</Command.Root>
	</Carousel.Root>
	<Stats />
</section>

<section>
	<div class="flex items-center gap-5">
		<RemainingBalance />
		<MonthlyBudget />
	</div>
</section>
