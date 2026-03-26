<script>
	import * as Command from '$lib/components/ui/command/index.js';
	import CreateButton from '$lib/components/CreateButton.svelte';
	import IncomeForm from '$lib/components/IncomeForm.svelte';
	import { authCheck } from '$lib/utils/functions.js';
	import { SIGNIN } from '$lib/utils/constants.js';
	import Head from '$lib/components/Head.svelte';
	import { onMount } from 'svelte';

	onMount(() => authCheck(303, SIGNIN, true));
</script>

<Head
	page_title="Finance | Income"
	description="Track and manage all your income sources in one place. Add, update, and monitor earnings over time with ease."
/>

<section class="bg-purple-500 dark:bg-transparent">
	<Command.Root>
		<div class="flex items-center justify-between gap-5 bg-yellow-500 dark:bg-transparent">
			<CreateButton>
				<IncomeForm />
			</CreateButton>
		</div>
	</Command.Root>
</section>
