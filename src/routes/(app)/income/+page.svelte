<script>
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { inputField } from '$lib/snippets/InputField.svelte';
	import { PhoneInput } from '$lib/components/ui/phone-input';
	import FormButton from '$lib/components/FormButton.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import Combobox from '$lib/components/Combobox.svelte';
	import { incomeSchema } from '$lib/utils/schemas.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { validator } from '@felte/validator-zod';
	import reporterDom from '@felte/reporter-dom';
	import { createForm } from 'felte';

	let open = $state(false);
	let step = $state(1);
	let phoneValue = $state(null);
	let dateValue = $state(null);
	const payTypes = [
		{ value: 'per day', label: 'Per Day' },
		{ value: 'per week', label: 'Per Week' },
		{ value: 'bi weekly', label: 'Bi Weekly' },
		{ value: 'per month', label: 'Per Month' },
		{ value: 'semi monthly', label: 'Semi Monthly' },
		{ value: 'bi monthly', label: 'Bi Monthly' },
		{ value: 'quarterly', label: 'Quarterly' },
		{ value: 'semi annually', label: 'Semi annually' },
		{ value: 'annually', label: 'Annually' },
		{ value: 'on commission', label: 'On Commission' },
		{ value: 'on demand', label: 'On Demand' },
		{ value: 'irregularly', label: 'Irregularly' }
	];
	const states = [
		{ value: 'alabama', label: 'Alabama' },
		{ value: 'alaska', label: 'Alaska' },
		{ value: 'arizona', label: 'Arizona' },
		{ value: 'arkansas', label: 'Arkansas' },
		{ value: 'california', label: 'California' },
		{ value: 'colorado', label: 'Colorado' },
		{ value: 'connecticut', label: 'Connecticut' },
		{ value: 'delaware', label: 'Delaware' },
		{ value: 'florida', label: 'Florida' },
		{ value: 'georgia', label: 'Georgia' },
		{ value: 'hawaii', label: 'Hawaii' },
		{ value: 'idaho', label: 'Idaho' },
		{ value: 'illinois', label: 'Illinois' },
		{ value: 'indiana', label: 'Indiana' },
		{ value: 'iowa', label: 'Iowa' },
		{ value: 'kansas', label: 'Kansas' },
		{ value: 'kentucky', label: 'Kentucky' },
		{ value: 'louisiana', label: 'Louisiana' },
		{ value: 'maine', label: 'Maine' },
		{ value: 'maryland', label: 'Maryland' },
		{ value: 'massachusetts', label: 'Massachusetts' },
		{ value: 'michigan', label: 'Michigan' },
		{ value: 'minnesota', label: 'Minnesota' },
		{ value: 'mississippi', label: 'Mississippi' },
		{ value: 'missouri', label: 'Missouri' },
		{ value: 'montana', label: 'Montana' },
		{ value: 'nebraska', label: 'Nebraska' },
		{ value: 'nevada', label: 'Nevada' },
		{ value: 'new-hampshire', label: 'New Hampshire' },
		{ value: 'new-jersey', label: 'New Jersey' },
		{ value: 'new-mexico', label: 'New Mexico' },
		{ value: 'new-york', label: 'New York' },
		{ value: 'north-carolina', label: 'North Carolina' },
		{ value: 'north-dakota', label: 'North Dakota' },
		{ value: 'ohio', label: 'Ohio' },
		{ value: 'oklahoma', label: 'Oklahoma' },
		{ value: 'oregon', label: 'Oregon' },
		{ value: 'pennsylvania', label: 'Pennsylvania' },
		{ value: 'rhode-island', label: 'Rhode Island' },
		{ value: 'south-carolina', label: 'South Carolina' },
		{ value: 'south-dakota', label: 'South Dakota' },
		{ value: 'tennessee', label: 'Tennessee' },
		{ value: 'texas', label: 'Texas' },
		{ value: 'utah', label: 'Utah' },
		{ value: 'vermont', label: 'Vermont' },
		{ value: 'virginia', label: 'Virginia' },
		{ value: 'washington', label: 'Washington' },
		{ value: 'west-virginia', label: 'West Virginia' },
		{ value: 'wisconsin', label: 'Wisconsin' },
		{ value: 'wyoming', label: 'Wyoming' }
	];
	let payDropDown = $state(payTypes[0].value);
	let stateDropDown = $state(states[0].value);

	const { form, reset, isSubmitting, validate } = createForm({
		initialValues: {
			company_name: '',
			income: '',
			company_email: '',
			pay: '',
			position: '',
			manager_name: '',
			company_address: '',
			company_city: '',
			company_zip: ''
		},
		extend: [validator({ schema: incomeSchema }), reporterDom()],
		transform: (values) => {
			const cleanNumber = (v) => {
				const cleaned = String(v).replace(/\D/g, '');
				return cleaned ? Number(cleaned) : null;
			};

			return {
				...values,
				income: cleanNumber(values.income),
				pay: cleanNumber(values.pay)
			};
		},
		onSubmit: async (values) => {
			try {
				console.log(values);
				console.log(payDropDown);
				console.log(stateDropDown);
				console.log(phoneValue);
				console.log(dateValue);
				reset();
				phoneValue = null;
				dateValue = null;
				open = false;
				step = 1;
			} catch (error) {
				console.dir(error?.response, { depth: null });
			}
		}
	});

	const next = async () => {
		const result = await validate();
		if (
			(result.company_name === null && result.income === null) ||
			(result.company_name.length === 0 && result.income.length === 0)
		) {
			step += 1;
		}
	};
	const back = () => (step -= 1);
</script>

<div class="flex">
	<Dialog.Root bind:open>
		<Dialog.Trigger
			type="button"
			class="text-grey-0 flex h-13 cursor-pointer items-center gap-2 rounded-full border border-grey-300 bg-grey-1000 px-5! md:hover:border-yellow-200 md:hover:text-yellow-200"
			asChild
		>
			<ArrowRightIcon class="size-6" strokeWidth="1.5" />Add new
		</Dialog.Trigger>

		<Dialog.Content onOpenAutoFocus={(e) => e.preventDefault()}>
			<Dialog.Header class="text-center!">
				<Dialog.Title><span class="text-preset-5 text-grey-50">Add income</span></Dialog.Title>
			</Dialog.Header>

			<div class="flex items-center justify-center space-x-4">
				{#each [1, 2] as s, i (i)}
					<div
						class="text-preset-3-medium flex size-10 items-center justify-center rounded-full border select-none"
						class:border-white-0={step >= s}
						class:border-grey-300={step < s}
					>
						{s}
					</div>
					{#if s === 1}
						<Separator class="max-w-13.5 bg-grey-300" />
					{/if}
				{/each}
			</div>

			<form class="space-y-11.5" use:form>
				<div class:hidden={step !== 1} class="grid grid-cols-6 gap-6.5">
					<div class="col-span-full">
						{@render inputField('Company Name', 'company_name')}
					</div>
					<div class="col-span-2">
						{@render inputField('Income', 'income', 'off', 'text', true)}
					</div>
					<div class="relative col-span-4">
						<Combobox list={payTypes} bind:result={payDropDown} defaultText="Recurring" />
					</div>
				</div>

				<div class:hidden={step !== 2} class="grid grid-cols-6 gap-6.5">
					<div class="col-span-full">
						{@render inputField('Company Email', 'company_email', 'email', 'email', false, 'email')}
					</div>
					<div class="relative col-span-3">
						<PhoneInput country="US" placeholder="Phone" bind:value={phoneValue} />
					</div>
					<div class="relative col-span-3">
						<DatePicker bind:value={dateValue} />
					</div>
					<div class="col-span-3">
						{@render inputField('Pay', 'pay', 'off', 'text', true)}
					</div>
					<div class="col-span-3">
						{@render inputField('Position', 'position')}
					</div>
					<div class="col-span-full">
						{@render inputField('Managers Name', 'manager_name')}
					</div>
					<div class="col-span-full">
						{@render inputField('Street Address', 'company_address', 'address-line1')}
					</div>
					<div class="col-span-full">
						{@render inputField('City', 'company_city', 'address-level2')}
					</div>
					<div class="relative col-span-3">
						<Combobox
							list={states}
							bind:result={stateDropDown}
							defaultText="States"
							class="ml-18 w-[56%]"
						/>
					</div>
					<div class="col-span-3">
						{@render inputField(
							'Zip Code',
							'company_zip',
							'postal-code',
							'text',
							false,
							'numeric',
							true
						)}
					</div>
				</div>

				<Dialog.Footer>
					{#if step > 1}
						<Button
							type="button"
							onclick={back}
							class="h-13 flex-1 border border-grey-300 bg-transparent font-medium md:hover:bg-grey-900"
						>
							Back
						</Button>
					{/if}
					{#if step < 2}
						<Button
							type="button"
							onclick={next}
							class="h-13 flex-1 border border-grey-300 bg-transparent font-medium md:hover:bg-grey-900"
						>
							Continue
						</Button>
					{/if}
					<FormButton disableButton={$isSubmitting} class="flex-1">
						{#if $isSubmitting}
							<Spinner />
							Validating...
						{:else}
							Submit
						{/if}
					</FormButton>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
</div>
