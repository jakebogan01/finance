<script>
	import ExpenseCarousel from '$lib/components/ExpenseCarousel.svelte';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import CreateButton from '$lib/components/CreateButton.svelte';
	import ExpenseForm from '$lib/components/ExpenseForm.svelte';
	import DisplayDate from '$lib/components/DisplayDate.svelte';
	import { authCheck } from '$lib/utils/functions.js';
	import { SIGNIN } from '$lib/utils/constants.js';
	import Head from '$lib/components/Head.svelte';
	import { onMount } from 'svelte';

	let open = $state(false);
	let resetForm = $state(false);
	let handleReset = $state(null);

	onMount(() => authCheck(303, SIGNIN, true));
</script>

<Head
	page_title="Finance | Dashboard"
	description="View a complete overview of your finances with a clean dashboard showing income, expenses, and budget insights to help you stay on track."
/>

<section>
	<Carousel.Root>
		<Command.Root class="space-y-5 rounded-none bg-transparent dark:bg-transparent!">
			<div class="flex items-center justify-between gap-5">
				<div class="flex items-center gap-x-5">
					<CreateButton bind:handleReset bind:open buttonText="Add expense">
						<ExpenseForm bind:handleReset {resetForm} bind:open />
					</CreateButton>
					<DisplayDate />
				</div>
				<div class="flex items-center">
					<Carousel.Previous class="mr-5" />
					<Carousel.Next class="md:mr-5" />
				</div>
			</div>
			<ExpenseCarousel />
		</Command.Root>
	</Carousel.Root>
</section>
