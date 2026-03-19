<script>
	// import CountrySelector from './country-selector.svelte';
	// import { normalizedCountries } from 'svelte-tel-input';
	import { TelInput } from 'svelte-tel-input';
	import 'svelte-tel-input/styles/flags.css';
	import { defaultOptions } from './';
	import { cn } from '$lib/utils.js';

	// const countries = normalizedCountries;

	let {
		class: className = undefined,
		defaultCountry = null,
		country = $bindable(defaultCountry),
		options = defaultOptions,
		placeholder = $bindable(undefined),
		readonly = $bindable(false),
		disabled = $bindable(false),
		value = $bindable(null),
		valid = $bindable(false),
		detailedValue = $bindable(),
		// order = undefined,
		name = undefined,
		...rest
	} = $props();

	let el = $state();

	export const focus = () => {
		// sort of an after update kinda thing
		setTimeout(() => {
			el?.focus();
		}, 0);
	};
</script>

<div class="flex place-items-center">
	<!--	<CountrySelector {order} {countries} bind:selected={country} onselect={focus} />-->
	<TelInput
		{name}
		bind:country
		bind:detailedValue
		bind:value
		bind:valid
		bind:readonly
		bind:disabled
		bind:placeholder
		bind:el
		{options}
		class={cn(
			'mb-0 flex h-13 w-full min-w-0 rounded-lg border border-grey-300 bg-grey-900 px-4 ring-offset-yellow-100 outline-none selection:bg-yellow-100 selection:text-grey-1100 placeholder:text-grey-200 disabled:cursor-not-allowed disabled:opacity-50 md:transition-colors md:hover:border-yellow-200 dark:bg-gray-300',
			'focus-visible:border-yellow-100 focus-visible:ring-[3px] focus-visible:ring-yellow-200/500',
			'aria-invalid:border-red-200 aria-invalid:ring-red-100/20',
			className
		)}
		{...rest}
	/>
</div>
