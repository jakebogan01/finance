<script>
	import { PhoneInput } from '$lib/components/ui/phone-input';
	import { Input } from '$lib/components/ui/input/index.js';
	import FormField from '$lib/components/FormField.svelte';
	import DropDown from '$lib/components/DropDown.svelte';
	import { payTypes } from '$lib/utils/functions.js';

	let { pay, payDropDown = $bindable(), phoneValue = $bindable(), step } = $props();
</script>

<div class:hidden={step !== 2} class="grid grid-cols-6 gap-6.5">
	<FormField id="email" name="email" label="Email Address">
		<Input
			type="email"
			id="email"
			name="email"
			placeholder="Email Address"
			autocomplete="email"
			maxLength="255"
			minLength="1"
			inputmode="email"
		/>
	</FormField>
	<div class="relative col-span-3">
		<PhoneInput country="US" placeholder="Phone" bind:value={phoneValue} />
	</div>
	<!--	<div class="col-span-3">-->
	<!--		<DropDown list={payTypes} bind:result={payDropDown} index={pay} defaultText="Recurring" />-->
	<!--	</div>-->
</div>
