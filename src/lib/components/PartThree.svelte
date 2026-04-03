<script>
	import {
		onlyNumbers,
		unformatCurrency,
		formatCurrency,
		payTypes,
		categoryTypes
	} from '$lib/utils/functions.js';
	import ToggleStatus from '$lib/components/ToggleStatus.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import FormField from '$lib/components/FormField.svelte';
	import DropDown from '$lib/components/DropDown.svelte';

	let {
		pay,
		category,
		payDropDown = $bindable(),
		categoryDropDown = $bindable(),
		checked = $bindable()
	} = $props();
</script>

<div class="grid grid-cols-6 gap-4">
	<FormField id="title" name="title" label="Title">
		<Input
			type="text"
			id="title"
			name="title"
			placeholder="Title"
			maxLength="255"
			minLength="1"
			autoComplete="off"
		/>
	</FormField>
	<div class="col-span-full">
		<DropDown
			list={categoryTypes}
			bind:result={categoryDropDown}
			index={category}
			defaultText="Category"
		/>
	</div>
	<div class="col-span-3">
		<DropDown list={payTypes} bind:result={payDropDown} index={pay} defaultText="Pay Frequency" />
	</div>
	<FormField id="amount" name="amount" label="Amount" class="col-span-3">
		<Input
			type="text"
			id="amount"
			name="amount"
			placeholder="Amount"
			autoComplete="off"
			maxLength="255"
			minLength="1"
			inputmode="numeric"
			pattern="[0-9]*"
			oninput={onlyNumbers}
			onfocus={unformatCurrency}
			onblur={formatCurrency}
		/>
	</FormField>
	<ToggleStatus bind:checked />
</div>
