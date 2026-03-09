<script>
	import { isEmpty, filterStatus, searchRecords, sortRecords } from '$lib/utils/misc.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import SlidersVerticalIcon from '@lucide/svelte/icons/sliders-vertical';
	import OpenFormButton from '$lib/components/OpenFormButton.svelte';
	import RecordDetails from '$lib/components/RecordDetails.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import CircleButton from '$lib/components/CircleButton.svelte';
	import { INCOMESLUG } from '$lib/stores/incomeSlug.svelte';
	import RecordList from '$lib/components/RecordList.svelte';
	import SearchIcon from '@lucide/svelte/icons/search';
	import { incomeSchema } from '$lib/utils/schemas.js';

	let { data } = $props();
	let filters = $state({
		status: 'all',
		sort: 'latest',
		search: ''
	});
	let dataList = $derived.by(() => {
		if (!data?.incomeRecords) return [];
		let list = [...data.incomeRecords];
		list = filterStatus(list, filters.status);
		list = searchRecords(list, filters.search);
		list = sortRecords(list, filters.sort);
		return list;
	});
	let hasData = $derived(dataList && dataList?.length > 0);
	let incomeRecord = $derived.by(() => {
		if (!INCOMESLUG.value) return null;
		if (!dataList || dataList.length === 0) return null;
		const slug = INCOMESLUG.value.replace(/#/g, '');
		return dataList.find((item) => item.slug === slug) ?? {};
	});
</script>

{#if hasData}
	<section class="flex flex-col space-y-5 lg:max-h-168">
		<div class="flex items-center justify-between gap-5">
			<OpenFormButton title="Add Income" schema={incomeSchema} />
			<div class="flex items-center">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<CircleButton {...props} Icon={SlidersVerticalIcon} size="6" class="md:mr-5" />
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56">
						<DropdownMenu.Group>
							<DropdownMenu.RadioGroup bind:value={filters.status}>
								<DropdownMenu.RadioItem
									value="all"
									class={filters.status === 'all' ? 'bg-grey-1000 text-white-0' : ''}
									>Show all</DropdownMenu.RadioItem
								>
								<DropdownMenu.RadioItem
									value="active"
									class={filters.status === 'active' ? 'bg-grey-1000 text-white-0' : ''}
									>Active</DropdownMenu.RadioItem
								>
								<DropdownMenu.RadioItem
									value="inactive"
									class={filters.status === 'inactive' ? 'bg-grey-1000 text-white-0' : ''}
									>Inactive</DropdownMenu.RadioItem
								>
							</DropdownMenu.RadioGroup>
							<DropdownMenu.Separator />
							<DropdownMenu.RadioGroup bind:value={filters.sort}>
								<DropdownMenu.RadioItem
									value="latest"
									class={filters.sort === 'latest' ? 'bg-grey-1000 text-white-0' : ''}
									>Latest</DropdownMenu.RadioItem
								>
								<DropdownMenu.RadioItem
									value="income"
									class={filters.sort === 'income' ? 'bg-grey-1000 text-white-0' : ''}
									>Highest income</DropdownMenu.RadioItem
								>
							</DropdownMenu.RadioGroup>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
				<CircleButton Icon={SearchIcon} size="6" class="hidden md:flex" />
			</div>
		</div>
		<RecordList data={dataList} />
	</section>
	{#if !isEmpty(incomeRecord) && incomeRecord !== null}
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
