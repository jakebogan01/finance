<script>
	import { isEmpty, authCheck, filterStatus, sortRecords } from '$lib/utils/functions.js';
	import RecordDetails from '$lib/components/RecordDetails.svelte';
	import EmptyTemplate from '$lib/components/EmptyTemplate.svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import CreateButton from '$lib/components/CreateButton.svelte';
	import { INCOMESLUG } from '$lib/stores/incomeSlug.svelte.js';
	import IncomeForm from '$lib/components/IncomeForm.svelte';
	import RecordList from '$lib/components/RecordList.svelte';
	import { data } from '$lib/stores/data.svelte.js';
	import { SIGNIN } from '$lib/utils/constants.js';
	import Head from '$lib/components/Head.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	onMount(() => authCheck(303, SIGNIN, true));

	let hasData = $derived(data.incomes?.length > 0);
	let open = $state(false);
	let resetForm = $state(false);
	let handleReset = $state(null);
	let filters = $state({
		status: 'all',
		sort: 'latest'
	});
	$effect(() => {
		if (!data?.incomes || data.incomes.length === 0) return;
		if (INCOMESLUG.value === null && !page.url.hash) {
			const targetHash = `#${data.incomes[0]?.slug}`;
			if (page.url.hash !== targetHash) {
				goto(resolve(`${page.url.pathname}${targetHash}`), { replaceState: true });
			}
		}
	});
	$effect(() => {
		const hash = page.url.hash;
		if (!hash) return;
		if (INCOMESLUG.value !== hash) {
			INCOMESLUG.value = hash;
		}
	});
	let dataList = $derived.by(() => {
		if (!data.incomes) return [];
		let list = [...data.incomes];
		list = filterStatus(list, filters.status);
		list = sortRecords(list, filters.sort);
		return list;
	});
	let cleanSlug = $derived(INCOMESLUG.value ? INCOMESLUG.value.replace(/#/g, '') : null);
	let incomeRecord = $derived.by(() => {
		if (!dataList.length || !cleanSlug) return null;
		return dataList.find((item) => item.slug === cleanSlug) ?? {};
	});

	const handleURLSlug = (slug) => (INCOMESLUG.value = slug);
</script>

<Head
	page_title="Finance | Income"
	description="Track and manage all your income sources in one place. Add, update, and monitor earnings over time with ease."
/>

{#if hasData}
	<section>
		<Command.Root class="rounded-none bg-transparent dark:bg-transparent!">
			<div class="flex items-center justify-between gap-5">
				<CreateButton bind:handleReset bind:open>
					<IncomeForm bind:handleReset {resetForm} bind:open />
				</CreateButton>
			</div>
			<RecordList data={dataList} {handleURLSlug} />
		</Command.Root>
	</section>
	{#if !isEmpty(incomeRecord) && incomeRecord !== null}
		<section>
			<h3
				class="text-preset-4-semibold flex h-13 items-center justify-end text-white-0 dark:text-grey-900"
			>
				<span class="mr-2 text-grey-100 dark:text-grey-400">Total:</span>$4,385
			</h3>
			<RecordDetails data={incomeRecord} />
		</section>
	{/if}
{:else}
	<EmptyTemplate>
		<CreateButton bind:handleReset bind:open>
			<IncomeForm bind:handleReset {resetForm} bind:open />
		</CreateButton>
	</EmptyTemplate>
{/if}
