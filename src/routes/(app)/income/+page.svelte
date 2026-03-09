<script>
	import OpenFormButton from '$lib/components/OpenFormButton.svelte';
	import RecordDetails from '$lib/components/RecordDetails.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { INCOMESLUG } from '$lib/stores/incomeSlug.svelte';
	import RecordList from '$lib/components/RecordList.svelte';
	import { incomeSchema } from '$lib/utils/schemas.js';
	import { isEmpty } from '$lib/utils/misc.js';

	let { data } = $props();
	let hasData = $derived(data?.incomeRecords && data?.incomeRecords.length > 0);
	let incomeRecord = $derived.by(() => {
		if (!INCOMESLUG.value) return null;
		if (!data?.incomeRecords || data?.incomeRecords.length === 0) return null;
		const slug = INCOMESLUG.value.replace(/#/g, '');
		return data.incomeRecords.find((item) => item.slug === slug) ?? {};
	});
</script>

{#if hasData}
	<section class="flex flex-col space-y-5 lg:max-h-168">
		<OpenFormButton title="Add Income" schema={incomeSchema} />
		<RecordList {data} />
	</section>
	{#if !isEmpty(incomeRecord)}
		<section>
			<RecordDetails data={incomeRecord} />
		</section>
	{/if}
{:else}
	<Skeleton class="absolute inset-0 z-0 animate-none! rounded-2xl bg-grey-700" />
	<div
		class="absolute top-1/2 left-1/2 z-5 flex size-full -translate-1/2 items-center justify-center text-center"
	>
		<div class="space-y-4">
			<span class="text-preset-3 block text-grey-50">No records</span>
			<OpenFormButton title="Add Income" schema={incomeSchema} />
		</div>
	</div>
{/if}
