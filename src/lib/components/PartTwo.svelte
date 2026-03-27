<script>
	import { PhoneInput } from '$lib/components/ui/phone-input';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import FormField from '$lib/components/FormField.svelte';
	import DropDown from '$lib/components/DropDown.svelte';
	import { formatCurrency, onlyNumbers, states, unformatCurrency } from '$lib/utils/functions.js';

	let {
		state,
		noValue,
		stateDropDown = $bindable(),
		phoneValue = $bindable(),
		dateValue = $bindable(),
		step
	} = $props();
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
	<div class="relative col-span-3">
		<DatePicker bind:value={dateValue} />
	</div>
	<FormField id="address" name="address" label="Street Address">
		<Input
			type="text"
			id="address"
			name="address"
			placeholder="Street Address"
			autoComplete="shipping street-address"
			maxLength="255"
			minLength="1"
		/>
	</FormField>
	<FormField id="city" name="city" label="City">
		<Input
			type="text"
			id="city"
			name="city"
			placeholder="City"
			autoComplete="shipping street-address"
			maxLength="255"
			minLength="1"
		/>
	</FormField>
	<div class="col-span-3">
		<DropDown
			list={states}
			bind:result={stateDropDown}
			{noValue}
			index={state}
			defaultText="State"
		/>
	</div>
	<FormField id="zip" name="zip" label="Zip Code" class="col-span-3">
		<Input
			type="text"
			id="zip"
			name="zip"
			placeholder="Zip Code"
			maxLength="5"
			minLength="1"
			autocomplete="postal-code"
			inputmode="numeric"
			pattern="[0-9]*"
			oninput={onlyNumbers}
		/>
	</FormField>
</div>
