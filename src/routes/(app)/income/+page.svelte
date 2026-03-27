<script>
	import * as Command from '$lib/components/ui/command/index.js';
	import CreateButton from '$lib/components/CreateButton.svelte';
	import IncomeForm from '$lib/components/IncomeForm.svelte';
	import { authCheck } from '$lib/utils/functions.js';
	import { SIGNIN } from '$lib/utils/constants.js';
	import Head from '$lib/components/Head.svelte';
	import { onMount } from 'svelte';

	onMount(() => authCheck(303, SIGNIN, true));

	let open = $state(false);
	let resetForm = $state(false);
	let handleReset = $state(null);
</script>

<Head
	page_title="Finance | Income"
	description="Track and manage all your income sources in one place. Add, update, and monitor earnings over time with ease."
/>

<section class="bg-purple-500 dark:bg-transparent">
	<Command.Root>
		<div class="flex items-center justify-between gap-5 bg-yellow-500 dark:bg-transparent">
			<CreateButton bind:handleReset bind:open>
				<IncomeForm bind:handleReset {resetForm} bind:open />
			</CreateButton>
		</div>
	</Command.Root>
</section>
