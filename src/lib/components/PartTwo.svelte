<script>
	import { Input } from '$lib/components/ui/input/index.js';
	import FormField from '$lib/components/FormField.svelte';
	import DropDown from '$lib/components/DropDown.svelte';
	import { payTypes } from '$lib/utils/functions.js';

	let { pay, payDropDown = $bindable(), step } = $props();
</script>

<div class:hidden={step !== 2} class="grid grid-cols-6 gap-6.5">
	<FormField id="name" name="name" label="Name" class="col-span-full">
		<Input type="text" id="name" name="name" placeholder="Name" maxLength="255" minLength="1" />
	</FormField>
	<div class="col-span-3">
		<DropDown list={payTypes} bind:result={payDropDown} index={pay} defaultText="Recurring" />
	</div>
</div>
