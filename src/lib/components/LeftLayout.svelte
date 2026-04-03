<script>
	import * as Command from '$lib/components/ui/command/index.js';
	import CreateButton from '$lib/components/CreateButton.svelte';
	import SearchButton from '$lib/components/SearchButton.svelte';
	import FilterButton from '$lib/components/FilterButton.svelte';
	import IncomeForm from '$lib/components/IncomeForm.svelte';

	let {
		children,
		handleReset = $bindable(),
		open = $bindable(),
		handleEditRecord = $bindable(),
		resetForm,
		incomeRecord,
		store,
		sortBy
	} = $props();
</script>

<section>
	<Command.Root class="rounded-none bg-transparent dark:bg-transparent!">
		<div class="flex items-center justify-between gap-5">
			<CreateButton bind:handleReset bind:open>
				<IncomeForm
					bind:handleReset
					bind:handleEditRecord
					{resetForm}
					bind:open
					data={incomeRecord}
				/>
			</CreateButton>
			<div class="mr-0 flex items-center lg:mr-5">
				<FilterButton
					filters={store.filters}
					sortType={sortBy}
					onChange={(f) => store.setFilters(f)}
				/>
				<SearchButton class="hidden md:flex" onSearch={(value) => store.setSearch(value)} />
			</div>
		</div>
		{@render children?.()}
	</Command.Root>
</section>
